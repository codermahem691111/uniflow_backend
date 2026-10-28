import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './env.validation';

/**
 * Typed access to environment variables. Inject this instead of reading process.env.
 */
@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService<EnvironmentVariables, true>) {}

  get port(): number {
    return this.config.get('PORT', { infer: true });
  }

  get frontendUrl(): string {
    return this.config.get('FRONTEND_URL', { infer: true }).replace(/\/+$/, '');
  }

  /** The page Supabase sends people to after they click the link in the verification email. */
  get emailVerifiedRedirectUrl(): string {
    return `${this.frontendUrl}/email-verified`;
  }

  get supabaseUrl(): string {
    return this.config.get('SUPABASE_URL', { infer: true });
  }

  get supabasePublishableKey(): string {
    return this.config.get('SUPABASE_PUBLISHABLE_KEY', { infer: true });
  }

  get supabaseServiceRoleKey(): string {
    return this.config.get('SUPABASE_SERVICE_ROLE_KEY', { infer: true });
  }
}
