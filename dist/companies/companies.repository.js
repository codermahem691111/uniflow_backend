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
var CompaniesRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompaniesRepository = void 0;
const common_1 = require("@nestjs/common");
const email_already_registered_exception_1 = require("../common/exceptions/email-already-registered.exception");
const license_already_registered_exception_1 = require("../common/exceptions/license-already-registered.exception");
const supabase_service_1 = require("../supabase/supabase.service");
const company_mapper_1 = require("./company.mapper");
const TABLE = 'companies';
const UNIQUE_VIOLATION = '23505';
let CompaniesRepository = CompaniesRepository_1 = class CompaniesRepository {
    supabase;
    logger = new common_1.Logger(CompaniesRepository_1.name);
    constructor(supabase) {
        this.supabase = supabase;
    }
    async create(input) {
        const { data, error } = await this.supabase.admin
            .from(TABLE)
            .insert(company_mapper_1.CompanyMapper.toInsertRow(input))
            .select()
            .single();
        if (error) {
            if (error.code === UNIQUE_VIOLATION)
                throw this.toDuplicateException(error.message);
            throw this.internalError('create company', error);
        }
        return company_mapper_1.CompanyMapper.toEntity(data);
    }
    findById(id) {
        return this.findOneBy('id', id);
    }
    findByLicenseNumber(licenseNumber) {
        return this.findOneBy('license_number', licenseNumber);
    }
    async findOneBy(column, value) {
        const { data, error } = await this.supabase.admin
            .from(TABLE)
            .select('*')
            .eq(column, value)
            .maybeSingle();
        if (error)
            throw this.internalError(`find company by ${column}`, error);
        return data ? company_mapper_1.CompanyMapper.toEntity(data) : null;
    }
    toDuplicateException(message) {
        return message.includes('license_number')
            ? new license_already_registered_exception_1.LicenseAlreadyRegisteredException()
            : new email_already_registered_exception_1.EmailAlreadyRegisteredException();
    }
    internalError(action, error) {
        this.logger.error(`Failed to ${action}: ${error.message} (code ${error.code})`);
        return new common_1.InternalServerErrorException('Something went wrong. Please try again later.');
    }
};
exports.CompaniesRepository = CompaniesRepository;
exports.CompaniesRepository = CompaniesRepository = CompaniesRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], CompaniesRepository);
//# sourceMappingURL=companies.repository.js.map