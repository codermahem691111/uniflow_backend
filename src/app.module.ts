import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { AppConfigModule } from './config/app-config.module';
import { FinanceModule } from './finance/finance.module';
import { PeopleModule } from './people/people.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    AppConfigModule,
    // Default limit for every route: 60 requests per minute per IP.
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }]),
    AuthModule,
    PeopleModule,
    ProductsModule,
    FinanceModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
