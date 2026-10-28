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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const email_already_registered_exception_1 = require("../common/exceptions/email-already-registered.exception");
const license_already_registered_exception_1 = require("../common/exceptions/license-already-registered.exception");
const app_config_service_1 = require("../config/app-config.service");
const companies_repository_1 = require("../companies/companies.repository");
const company_mapper_1 = require("../companies/company.mapper");
const supabase_auth_service_1 = require("../supabase/supabase-auth.service");
const REGISTERED_MESSAGE = 'Registration successful. Please check your email to verify your account.';
const RESEND_MESSAGE = 'If an unverified account exists for this email, a new verification link has been sent.';
let AuthService = class AuthService {
    supabaseAuth;
    companiesRepository;
    config;
    constructor(supabaseAuth, companiesRepository, config) {
        this.supabaseAuth = supabaseAuth;
        this.companiesRepository = companiesRepository;
        this.config = config;
    }
    async register(dto) {
        const companyWithSameLicense = await this.companiesRepository.findByLicenseNumber(dto.licenseNumber);
        if (companyWithSameLicense) {
            return this.handleKnownLicense(companyWithSameLicense, dto.email);
        }
        const user = await this.supabaseAuth.signUp(dto.email, dto.password, this.config.emailVerifiedRedirectUrl);
        await this.createCompanyProfile(user, dto);
        return { message: REGISTERED_MESSAGE };
    }
    async resendVerification(email) {
        await this.supabaseAuth.resendVerification(email, this.config.emailVerifiedRedirectUrl);
        return { message: RESEND_MESSAGE };
    }
    async login(dto) {
        const { user, tokens } = await this.supabaseAuth.signIn(dto.email, dto.password);
        const company = await this.requireCompany(user.id);
        return { ...tokens, company: company_mapper_1.CompanyMapper.toPublic(company, user) };
    }
    refresh(refreshToken) {
        return this.supabaseAuth.refresh(refreshToken);
    }
    async getProfile(user) {
        const company = await this.requireCompany(user.id);
        return company_mapper_1.CompanyMapper.toPublic(company, user);
    }
    async logout(accessToken) {
        await this.supabaseAuth.signOut(accessToken);
        return { message: 'Signed out.' };
    }
    async handleKnownLicense(company, email) {
        const owner = await this.supabaseAuth.getUserById(company.id);
        if (!owner || owner.email !== email) {
            throw new license_already_registered_exception_1.LicenseAlreadyRegisteredException();
        }
        if (owner.emailVerified) {
            throw new email_already_registered_exception_1.EmailAlreadyRegisteredException();
        }
        await this.supabaseAuth.resendVerification(email, this.config.emailVerifiedRedirectUrl);
        return { message: REGISTERED_MESSAGE };
    }
    async createCompanyProfile(user, dto) {
        try {
            await this.companiesRepository.create({
                id: user.id,
                companyName: dto.companyName,
                licenseNumber: dto.licenseNumber,
                ownerName: dto.ownerName,
                businessDescription: dto.businessDescription,
            });
        }
        catch (error) {
            if (error instanceof email_already_registered_exception_1.EmailAlreadyRegisteredException)
                throw error;
            await this.supabaseAuth.deleteUser(user.id);
            throw error;
        }
    }
    async requireCompany(userId) {
        const company = await this.companiesRepository.findById(userId);
        if (!company) {
            throw new common_1.UnauthorizedException('No company profile was found for this account.');
        }
        return company;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_auth_service_1.SupabaseAuthService,
        companies_repository_1.CompaniesRepository,
        app_config_service_1.AppConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map