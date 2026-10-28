import { applyDecorators, createParamDecorator, ExecutionContext, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { TenantGuard } from './tenant.guard';
import { TenantRequest, TenantScope } from './tenant-scope';

/** Puts a controller (or route) behind sign-in and gives it a tenant scope. */
export const TenantProtected = () => applyDecorators(UseGuards(SupabaseAuthGuard, TenantGuard));

/** Injects the TenantScope of the signed-in company into a controller method. */
export const Tenant = createParamDecorator(
  (_data: unknown, context: ExecutionContext): TenantScope =>
    context.switchToHttp().getRequest<TenantRequest>().tenant,
);
