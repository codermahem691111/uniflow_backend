import { Request } from 'express';
import { PublicCompany } from '../companies/company.types';
import { AuthUser, SessionTokens } from '../supabase/supabase-auth.types';

/** The signed-in user plus the access token they sent with the request. */
export interface AuthenticatedUser extends AuthUser {
  accessToken: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

export interface MessageResult {
  message: string;
}

export interface LoginResult extends SessionTokens {
  company: PublicCompany;
}
