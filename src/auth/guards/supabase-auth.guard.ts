import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseAuthService } from '../../supabase/supabase-auth.service';
import { AuthenticatedRequest } from '../auth.types';

/** Protects a route: the request must carry a valid Supabase access token. */
@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly supabaseAuth: SupabaseAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const accessToken = this.extractBearerToken(request);

    if (!accessToken) {
      throw new UnauthorizedException('Missing access token.');
    }

    const user = await this.supabaseAuth.getUser(accessToken);

    if (!user) {
      throw new UnauthorizedException('Invalid or expired access token.');
    }

    request.user = { ...user, accessToken };
    return true;
  }

  private extractBearerToken(request: AuthenticatedRequest): string | null {
    const [scheme, token] = request.headers.authorization?.split(' ') ?? [];
    return scheme === 'Bearer' && token ? token : null;
  }
}
