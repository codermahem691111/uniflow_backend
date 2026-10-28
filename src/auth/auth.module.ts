import { Module } from '@nestjs/common';
import { CompaniesModule } from '../companies/companies.module';
import { SupabaseModule } from '../supabase/supabase.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';

@Module({
  imports: [SupabaseModule, CompaniesModule],
  controllers: [AuthController],
  providers: [AuthService, SupabaseAuthGuard],
  // Future modules (the admin panel) import AuthModule and protect routes with @UseGuards(SupabaseAuthGuard).
  exports: [SupabaseAuthGuard, SupabaseModule],
})
export class AuthModule {}
