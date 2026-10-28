import { AuthUser } from '../supabase/supabase-auth.types';
import { Company, CompanyRow, CreateCompanyInput, PublicCompany } from './company.types';

/** Converts between database rows (snake_case) and application objects (camelCase). */
export class CompanyMapper {
  static toEntity(row: CompanyRow): Company {
    return {
      id: row.id,
      companyName: row.company_name,
      licenseNumber: row.license_number,
      ownerName: row.owner_name,
      businessDescription: row.business_description,
      createdAt: new Date(row.created_at),
    };
  }

  static toInsertRow(input: CreateCompanyInput): Partial<CompanyRow> {
    return {
      id: input.id,
      company_name: input.companyName,
      license_number: input.licenseNumber,
      owner_name: input.ownerName,
      business_description: input.businessDescription,
    };
  }

  static toPublic(company: Company, user: AuthUser): PublicCompany {
    return { ...company, email: user.email, emailVerified: user.emailVerified };
  }
}
