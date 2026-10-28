import { SupabaseClient } from '@supabase/supabase-js';
import { AuthenticatedRequest } from '../auth/auth.types';

/**
 * Everything a repository needs to work on ONE company's data:
 * - `companyId`: the tenant id, taken from the verified login token (never from the request body).
 * - `db`: a database client that acts as that user, so Row Level Security applies.
 */
export class TenantScope {
  constructor(
    readonly companyId: string,
    readonly db: SupabaseClient,
  ) {}
}

export interface TenantRequest extends AuthenticatedRequest {
  tenant: TenantScope;
}
