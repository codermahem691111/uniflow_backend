import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { PublicCompany } from '../companies/company.types';
import { SessionTokens } from '../supabase/supabase-auth.types';
import { AuthService } from './auth.service';
import { AuthenticatedUser, LoginResult, MessageResult } from './auth.types';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';

/** Stricter limit (5 requests per minute per IP) for endpoints that can be abused. */
const STRICT_LIMIT = { default: { limit: 5, ttl: 60_000 } };

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @Throttle(STRICT_LIMIT)
  register(@Body() dto: RegisterDto): Promise<MessageResult> {
    return this.authService.register(dto);
  }

  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  @Throttle(STRICT_LIMIT)
  resendVerification(@Body() dto: ResendVerificationDto): Promise<MessageResult> {
    return this.authService.resendVerification(dto.email);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle(STRICT_LIMIT)
  login(@Body() dto: LoginDto): Promise<LoginResult> {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() dto: RefreshTokenDto): Promise<SessionTokens> {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SupabaseAuthGuard)
  logout(@CurrentUser() user: AuthenticatedUser): Promise<MessageResult> {
    return this.authService.logout(user.accessToken);
  }

  @Get('me')
  @UseGuards(SupabaseAuthGuard)
  async me(@CurrentUser() user: AuthenticatedUser): Promise<{ company: PublicCompany }> {
    return { company: await this.authService.getProfile(user) };
  }
}
