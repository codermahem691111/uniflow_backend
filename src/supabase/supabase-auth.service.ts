import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthError, Session, User } from '@supabase/supabase-js';
import { ApiErrorCode } from '../common/api-error-code';
import { EmailAlreadyRegisteredException } from '../common/exceptions/email-already-registered.exception';
import { AuthUser, SessionTokens, SignInResult } from './supabase-auth.types';
import { SupabaseService } from './supabase.service';

/**
 * Everything that talks to Supabase Auth: sign-up (which also sends the verification
 * email), sign-in, token refresh and user lookup. Supabase errors are translated into
 * clear HTTP errors here so the rest of the app never deals with them.
 */
@Injectable()
export class SupabaseAuthService {
  private readonly logger = new Logger(SupabaseAuthService.name);

  constructor(private readonly supabase: SupabaseService) {}

  /** Creates the user and makes Supabase send the verification email. */
  async signUp(email: string, password: string, redirectTo: string): Promise<AuthUser> {
    const { data, error } = await this.supabase.createAuthClient().auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectTo },
    });

    if (error) throw this.toSignUpException(error);
    if (!data.user) throw this.unexpected('sign up', 'no user was returned');

    // For an already confirmed email, Supabase pretends the sign-up worked (so it does not
    // reveal which emails exist) but returns a user without any identities.
    if (!data.user.identities || data.user.identities.length === 0) {
      throw new EmailAlreadyRegisteredException();
    }

    return this.toAuthUser(data.user);
  }

  async signIn(email: string, password: string): Promise<SignInResult> {
    const { data, error } = await this.supabase.createAuthClient().auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw this.toSignInException(error);
    if (!data.user || !data.session) throw this.unexpected('sign in', 'no session was returned');

    return { user: this.toAuthUser(data.user), tokens: this.toTokens(data.session) };
  }

  async refresh(refreshToken: string): Promise<SessionTokens> {
    const { data, error } = await this.supabase
      .createAuthClient()
      .auth.refreshSession({ refresh_token: refreshToken });

    if (error || !data.session) {
      throw new UnauthorizedException('Your session has expired. Please sign in again.');
    }

    return this.toTokens(data.session);
  }

  /** Asks Supabase whether the access token is valid. Returns null when it is not. */
  async getUser(accessToken: string): Promise<AuthUser | null> {
    const { data, error } = await this.supabase.admin.auth.getUser(accessToken);
    return error || !data.user ? null : this.toAuthUser(data.user);
  }

  async getUserById(userId: string): Promise<AuthUser | null> {
    const { data, error } = await this.supabase.admin.auth.admin.getUserById(userId);
    return error || !data.user ? null : this.toAuthUser(data.user);
  }

  /** Sends a new verification email to an address that has not been verified yet. */
  async resendVerification(email: string, redirectTo: string): Promise<void> {
    const { error } = await this.supabase.createAuthClient().auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: redirectTo },
    });

    if (error) throw this.toEmailException(error, 'resend verification');
  }

  /** Ends the user's session on Supabase. Failure is logged but never blocks a logout. */
  async signOut(accessToken: string): Promise<void> {
    const { error } = await this.supabase.admin.auth.admin.signOut(accessToken);
    if (error) this.logger.warn(`Could not revoke session: ${error.message}`);
  }

  /** Used to undo a sign-up when saving the company details fails. */
  async deleteUser(userId: string): Promise<void> {
    const { error } = await this.supabase.admin.auth.admin.deleteUser(userId);
    if (error) this.logger.error(`Could not delete user ${userId} during rollback: ${error.message}`);
  }

  private toSignUpException(error: AuthError): HttpException {
    switch (error.code) {
      case 'email_exists':
      case 'user_already_exists':
        return new EmailAlreadyRegisteredException();
      case 'weak_password':
        return new BadRequestException(error.message);
      default:
        return this.toEmailException(error, 'sign up');
    }
  }

  private toSignInException(error: AuthError): HttpException {
    const message = error.message.toLowerCase();

    if (error.code === 'email_not_confirmed' || message.includes('email not confirmed')) {
      return new ForbiddenException({
        statusCode: 403,
        code: ApiErrorCode.EmailNotVerified,
        message: 'Please verify your email address before signing in.',
      });
    }

    if (error.code === 'invalid_credentials' || message.includes('invalid login credentials')) {
      return new UnauthorizedException('Invalid email or password.');
    }

    if (this.isRateLimited(error)) {
      return this.tooManyRequests('Too many sign-in attempts. Please wait a few minutes and try again.');
    }

    return this.unexpected('sign in', `${error.message} (${error.code ?? error.status})`);
  }

  /** Errors that can come from any call that makes Supabase send an email. */
  private toEmailException(error: AuthError, action: string): HttpException {
    if (this.isRateLimited(error)) {
      return this.tooManyRequests(
        'Too many emails have been requested. Please wait a few minutes and try again.',
      );
    }

    if (error.code === 'email_address_invalid') {
      return new BadRequestException('Please use a valid email address.');
    }

    if (error.code === 'email_address_not_authorized') {
      this.logger.error(
        'Supabase refused to send to this address: the built-in email service only sends to members of your Supabase organization. Set up custom SMTP in Authentication -> Emails -> SMTP Settings.',
      );
      return new ServiceUnavailableException(
        'Email delivery is not set up for this address yet. Configure custom SMTP in Supabase, or use an address that belongs to your Supabase organization while testing.',
      );
    }

    this.logger.error(`Supabase ${action} failed: ${error.message} (${error.code ?? error.status})`);
    return new ServiceUnavailableException('We could not complete this request right now. Please try again later.');
  }

  private isRateLimited(error: AuthError): boolean {
    return (
      error.status === 429 ||
      error.code === 'over_email_send_rate_limit' ||
      error.code === 'over_request_rate_limit'
    );
  }

  private tooManyRequests(message: string): HttpException {
    return new HttpException(message, HttpStatus.TOO_MANY_REQUESTS);
  }

  private unexpected(action: string, detail: string): InternalServerErrorException {
    this.logger.error(`Supabase ${action} failed: ${detail}`);
    return new InternalServerErrorException('Something went wrong. Please try again later.');
  }

  private toAuthUser(user: User): AuthUser {
    return {
      id: user.id,
      email: user.email ?? '',
      emailVerified: Boolean(user.email_confirmed_at),
    };
  }

  private toTokens(session: Session): SessionTokens {
    return { accessToken: session.access_token, refreshToken: session.refresh_token };
  }
}
