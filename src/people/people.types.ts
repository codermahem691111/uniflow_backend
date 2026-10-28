export enum PersonType {
  Customer = 'customer',
  Staff = 'staff',
  Supplier = 'supplier',
}

/** A row exactly as it is stored in the `people` table. */
export interface PersonRow {
  id: string;
  company_id: string;
  type: PersonType;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  details: string | null;
  created_at: string;
  updated_at: string;
}

/** What the API returns. The company id is never sent to the browser. */
export interface Person {
  id: string;
  type: PersonType;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  details: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonInput {
  type: PersonType;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  details?: string | null;
}

export type PersonPatch = Partial<PersonInput>;
