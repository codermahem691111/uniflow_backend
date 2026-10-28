import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EmailAlreadyRegisteredException } from '../common/exceptions/email-already-registered.exception';
import { LicenseAlreadyRegisteredException } from '../common/exceptions/license-already-registered.exception';
import { AppConfigService } from '../config/app-config.service';
import { CompaniesRepository } from '../companies/companies.repository';
import { CompanyMapper } from '../companies/company.mapper';
import { Company, PublicCompany } from '../companies/company.types';
import { SupabaseAuthService } from '../supabase/supabase-auth.service';
import { AuthUser, SessionTokens } from '../supabase/supabase-auth.types';
import { LoginResult, MessageResult } from './auth.types';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

const REGISTERED_MESSAGE = 'Registration successful. Please check your email to verify your account.';
const RESEND_MESSAGE = 'If an unverified account exists for this email, a new verification link has been sent.';

@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseAuth: SupabaseAuthService,
    private readonly companiesRepository: CompaniesRepository,
    private readonly config: AppConfigService,
  ) {}

  /**
   * Creates the Supabase Auth user (Supabase emails the verification link) and then
   * saves the company details linked to that user.
   */
  async register(dto: RegisterDto): Promise<MessageResult> {
    const companyWithSameLicense = await this.companiesRepository.findByLicenseNumber(dto.licenseNumber);
    if (companyWithSameLicense) {
      return this.handleKnownLicense(companyWithSameLicense, dto.email);
    }

    const user = await this.supabaseAuth.signUp(dto.email, dto.password, this.config.emailVerifiedRedirectUrl);
    await this.createCompanyProfile(user, dto);

    return { message: REGISTERED_MESSAGE };
  }

  async resendVerification(email: string): Promise<MessageResult> {
    await this.supabaseAuth.resendVerification(email, this.config.emailVerifiedRedirectUrl);

    // Same answer whether or not the account exists, so emails cannot be probed.
    return { message: RESEND_MESSAGE };
  }

  async login(dto: LoginDto): Promise<LoginResult> {
    const { user, tokens } = await this.supabaseAuth.signIn(dto.email, dto.password);
    const company = await this.requireCompany(user.id);

    return { ...tokens, company: CompanyMapper.toPublic(company, user) };
  }

  refresh(refreshToken: string): Promise<SessionTokens> {
    return this.supabaseAuth.refresh(refreshToken);
  }

  async getProfile(user: AuthUser): Promise<PublicCompany> {
    const company = await this.requireCompany(user.id);
    return CompanyMapper.toPublic(company, user);
  }

  async logout(accessToken: string): Promise<MessageResult> {
    await this.supabaseAuth.signOut(accessToken);
    return { message: 'Signed out.' };
  }

  /**
   * The license is already in use. If it belongs to this same email and the email is not
   * verified yet, the person is simply trying again: send a fresh verification email.
   */
  private async handleKnownLicense(company: Company, email: string): Promise<MessageResult> {
    const owner = await this.supabaseAuth.getUserById(company.id);

    if (!owner || owner.email !== email) {
      throw new LicenseAlreadyRegisteredException();
    }
    if (owner.emailVerified) {
      throw new EmailAlreadyRegisteredException();
    }

    await this.supabaseAuth.resendVerification(email, this.config.emailVerifiedRedirectUrl);
    return { message: REGISTERED_MESSAGE };
  }

  private async createCompanyProfile(user: AuthUser, dto: RegisterDto): Promise<void> {
    try {
      await this.companiesRepository.create({
        id: user.id,
        companyName: dto.companyName,
        licenseNumber: dto.licenseNumber,
        ownerName: dto.ownerName,
        businessDescription: dto.businessDescription,
      });
    } catch (error) {
      // This email already had an account; leave that account untouched.
      if (error instanceof EmailAlreadyRegisteredException) throw error;

      // Otherwise undo the sign-up so no login exists without a company profile.
      await this.supabaseAuth.deleteUser(user.id);
      throw error;
    }
  }

  private async requireCompany(userId: string): Promise<Company> {
    const company = await this.companiesRepository.findById(userId);

    if (!company) {
      throw new UnauthorizedException('No company profile was found for this account.');
    }

    return company;
  }
}
