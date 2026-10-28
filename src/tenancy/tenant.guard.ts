import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { TenantRequest, TenantScope } from './tenant-scope';

/**
 * Runs after SupabaseAuthGuard. Turns the verified user into a TenantScope and attaches it
 * to the request, so controllers receive it with @Tenant().
 */
@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private readonly supabase: SupabaseService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<TenantRequest>();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('You are not signed in.');
    }
    if (!user.emailVerified) {
      throw new ForbiddenException('Please verify your email address first.');
    }

    request.tenant = new TenantScope(user.id, this.supabase.createUserClient(user.accessToken));
    return true;
  }
}
