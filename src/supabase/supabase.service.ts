import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AppConfigService } from '../config/app-config.service';

/**
 * Creates the Supabase clients used by the app.
 *
 * - `admin` uses the secret (service role) key. It bypasses row level security and can
 *   manage users, so it must only ever be used on the server.
 * - `createAuthClient()` uses the publishable key and is used for sign-up and sign-in.
 */
@Injectable()
export class SupabaseService {
  private readonly adminClient: SupabaseClient;

  constructor(private readonly config: AppConfigService) {
    this.adminClient = this.buildClient(config.supabaseServiceRoleKey);
  }

  get admin(): SupabaseClient {
    return this.adminClient;
  }

  /** A fresh client per call, so one user's session can never leak into another request. */
  createAuthClient(): SupabaseClient {
    return this.buildClient(this.config.supabasePublishableKey);
  }

  /**
   * A client that acts AS the signed-in user: it sends the user's access token, so Postgres
   * Row Level Security sees `auth.uid()` and only returns/changes that user's own rows.
   */
  createUserClient(accessToken: string): SupabaseClient {
    return this.buildClient(this.config.supabasePublishableKey, {
      Authorization: `Bearer ${accessToken}`,
    });
  }

  private buildClient(key: string, headers: Record<string, string> = {}): SupabaseClient {
    return createClient(this.config.supabaseUrl, key, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      global: { headers },
    });
  }
}
