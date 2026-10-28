import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { CompaniesRepository } from './companies.repository';

@Module({
  imports: [SupabaseModule],
  providers: [CompaniesRepository],
  exports: [CompaniesRepository],
})
export class CompaniesModule {}
