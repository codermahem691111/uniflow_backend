import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';

/**
 * Import this module in every feature module that uses @TenantProtected(): the guards it
 * applies need the Supabase services that SupabaseModule provides.
 */
@Module({
  imports: [SupabaseModule],
  exports: [SupabaseModule],
})
export class TenancyModule {}
