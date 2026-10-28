/** A row exactly as it is stored in the `companies` table. */
export interface CompanyRow {
  id: string;
  company_name: string;
  license_number: string;
  owner_name: string;
  business_description: string;
  created_at: string;
  updated_at: string;
}

/** The company details as the application works with them. `id` is the Supabase Auth user id. */
export interface Company {
  id: string;
  companyName: string;
  licenseNumber: string;
  ownerName: string;
  businessDescription: string;
  createdAt: Date;
}

/** What the API returns to the browser: company details plus the login email. */
export interface PublicCompany extends Company {
  email: string;
  emailVerified: boolean;
}

export interface CreateCompanyInput {
  id: string;
  companyName: string;
  licenseNumber: string;
  ownerName: string;
  businessDescription: string;
}
