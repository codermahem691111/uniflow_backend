import { Module } from '@nestjs/common';
import { SupabaseAuthService } from './supabase-auth.service';
import { SupabaseService } from './supabase.service';

@Module({
  providers: [SupabaseService, SupabaseAuthService],
  exports: [SupabaseService, SupabaseAuthService],
})
export class SupabaseModule {}
