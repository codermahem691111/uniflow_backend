import { HttpException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PostgrestError } from '@supabase/supabase-js';
import { EmailAlreadyRegisteredException } from '../common/exceptions/email-already-registered.exception';
import { LicenseAlreadyRegisteredException } from '../common/exceptions/license-already-registered.exception';
import { SupabaseService } from '../supabase/supabase.service';
import { CompanyMapper } from './company.mapper';
import { Company, CompanyRow, CreateCompanyInput } from './company.types';

const TABLE = 'companies';
const UNIQUE_VIOLATION = '23505';

/**
 * The only place that talks to the `companies` table.
 */
@Injectable()
export class CompaniesRepository {
  private readonly logger = new Logger(CompaniesRepository.name);

  constructor(private readonly supabase: SupabaseService) {}

  async create(input: CreateCompanyInput): Promise<Company> {
    const { data, error } = await this.supabase.admin
      .from(TABLE)
      .insert(CompanyMapper.toInsertRow(input))
      .select()
      .single();

    if (error) {
      if (error.code === UNIQUE_VIOLATION) throw this.toDuplicateException(error.message);
      throw this.internalError('create company', error);
    }

    return CompanyMapper.toEntity(data as CompanyRow);
  }

  findById(id: string): Promise<Company | null> {
    return this.findOneBy('id', id);
  }

  findByLicenseNumber(licenseNumber: string): Promise<Company | null> {
    return this.findOneBy('license_number', licenseNumber);
  }

  private async findOneBy(column: keyof CompanyRow, value: string): Promise<Company | null> {
    const { data, error } = await this.supabase.admin
      .from(TABLE)
      .select('*')
      .eq(column, value)
      .maybeSingle();

    if (error) throw this.internalError(`find company by ${column}`, error);

    return data ? CompanyMapper.toEntity(data as CompanyRow) : null;
  }

  /** Postgres names the violated constraint in its message; the license has its own constraint. */
  private toDuplicateException(message: string): HttpException {
    return message.includes('license_number')
      ? new LicenseAlreadyRegisteredException()
      : new EmailAlreadyRegisteredException();
  }

  private internalError(action: string, error: PostgrestError): InternalServerErrorException {
    this.logger.error(`Failed to ${action}: ${error.message} (code ${error.code})`);
    return new InternalServerErrorException('Something went wrong. Please try again later.');
  }
}
