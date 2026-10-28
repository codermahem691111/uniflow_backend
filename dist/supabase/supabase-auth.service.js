"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SupabaseAuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseAuthService = void 0;
const common_1 = require("@nestjs/common");
const api_error_code_1 = require("../common/api-error-code");
const email_already_registered_exception_1 = require("../common/exceptions/email-already-registered.exception");
const supabase_service_1 = require("./supabase.service");
let SupabaseAuthService = SupabaseAuthService_1 = class SupabaseAuthService {
    supabase;
    logger = new common_1.Logger(SupabaseAuthService_1.name);
    constructor(supabase) {
        this.supabase = supabase;
    }
    async signUp(email, password, redirectTo) {
        const { data, error } = await this.supabase.createAuthClient().auth.signUp({
            email,
            password,
            options: { emailRedirectTo: redirectTo },
        });
        if (error)
            throw this.toSignUpException(error);
        if (!data.user)
            throw this.unexpected('sign up', 'no user was returned');
        if (!data.user.identities || data.user.identities.length === 0) {
            throw new email_already_registered_exception_1.EmailAlreadyRegisteredException();
        }
        return this.toAuthUser(data.user);
    }
    async signIn(email, password) {
        const { data, error } = await this.supabase.createAuthClient().auth.signInWithPassword({
            email,
            password,
        });
        if (error)
            throw this.toSignInException(error);
        if (!data.user || !data.session)
            throw this.unexpected('sign in', 'no session was returned');
        return { user: this.toAuthUser(data.user), tokens: this.toTokens(data.session) };
    }
    async refresh(refreshToken) {
        const { data, error } = await this.supabase
            .createAuthClient()
            .auth.refreshSession({ refresh_token: refreshToken });
        if (error || !data.session) {
            throw new common_1.UnauthorizedException('Your session has expired. Please sign in again.');
        }
        return this.toTokens(data.session);
    }
    async getUser(accessToken) {
        const { data, error } = await this.supabase.admin.auth.getUser(accessToken);
        return error || !data.user ? null : this.toAuthUser(data.user);
    }
    async getUserById(userId) {
        const { data, error } = await this.supabase.admin.auth.admin.getUserById(userId);
        return error || !data.user ? null : this.toAuthUser(data.user);
    }
    async resendVerification(email, redirectTo) {
        const { error } = await this.supabase.createAuthClient().auth.resend({
            type: 'signup',
            email,
            options: { emailRedirectTo: redirectTo },
        });
        if (error)
            throw this.toEmailException(error, 'resend verification');
    }
    async signOut(accessToken) {
        const { error } = await this.supabase.admin.auth.admin.signOut(accessToken);
        if (error)
            this.logger.warn(`Could not revoke session: ${error.message}`);
    }
    async deleteUser(userId) {
        const { error } = await this.supabase.admin.auth.admin.deleteUser(userId);
        if (error)
            this.logger.error(`Could not delete user ${userId} during rollback: ${error.message}`);
    }
    toSignUpException(error) {
        switch (error.code) {
            case 'email_exists':
            case 'user_already_exists':
                return new email_already_registered_exception_1.EmailAlreadyRegisteredException();
            case 'weak_password':
                return new common_1.BadRequestException(error.message);
            default:
                return this.toEmailException(error, 'sign up');
        }
    }
    toSignInException(error) {
        const message = error.message.toLowerCase();
        if (error.code === 'email_not_confirmed' || message.includes('email not confirmed')) {
            return new common_1.ForbiddenException({
                statusCode: 403,
                code: api_error_code_1.ApiErrorCode.EmailNotVerified,
                message: 'Please verify your email address before signing in.',
            });
        }
        if (error.code === 'invalid_credentials' || message.includes('invalid login credentials')) {
            return new common_1.UnauthorizedException('Invalid email or password.');
        }
        if (this.isRateLimited(error)) {
            return this.tooManyRequests('Too many sign-in attempts. Please wait a few minutes and try again.');
        }
        return this.unexpected('sign in', `${error.message} (${error.code ?? error.status})`);
    }
    toEmailException(error, action) {
        if (this.isRateLimited(error)) {
            return this.tooManyRequests('Too many emails have been requested. Please wait a few minutes and try again.');
        }
        if (error.code === 'email_address_invalid') {
            return new common_1.BadRequestException('Please use a valid email address.');
        }
        if (error.code === 'email_address_not_authorized') {
            this.logger.error('Supabase refused to send to this address: the built-in email service only sends to members of your Supabase organization. Set up custom SMTP in Authentication -> Emails -> SMTP Settings.');
            return new common_1.ServiceUnavailableException('Email delivery is not set up for this address yet. Configure custom SMTP in Supabase, or use an address that belongs to your Supabase organization while testing.');
        }
        this.logger.error(`Supabase ${action} failed: ${error.message} (${error.code ?? error.status})`);
        return new common_1.ServiceUnavailableException('We could not complete this request right now. Please try again later.');
    }
    isRateLimited(error) {
        return (error.status === 429 ||
            error.code === 'over_email_send_rate_limit' ||
            error.code === 'over_request_rate_limit');
    }
    tooManyRequests(message) {
        return new common_1.HttpException(message, common_1.HttpStatus.TOO_MANY_REQUESTS);
    }
    unexpected(action, detail) {
        this.logger.error(`Supabase ${action} failed: ${detail}`);
        return new common_1.InternalServerErrorException('Something went wrong. Please try again later.');
    }
    toAuthUser(user) {
        return {
            id: user.id,
            email: user.email ?? '',
            emailVerified: Boolean(user.email_confirmed_at),
        };
    }
    toTokens(session) {
        return { accessToken: session.access_token, refreshToken: session.refresh_token };
    }
};
exports.SupabaseAuthService = SupabaseAuthService;
exports.SupabaseAuthService = SupabaseAuthService = SupabaseAuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], SupabaseAuthService);
//# sourceMappingURL=supabase-auth.service.js.map