import { Module } from '@nestjs/common';
import { TenancyModule } from '../tenancy/tenancy.module';
import { FinanceController } from './finance.controller';
import { FinanceRepository } from './finance.repository';
import { FinanceService } from './finance.service';

@Module({
  imports: [TenancyModule],
  controllers: [FinanceController],
  providers: [FinanceService, FinanceRepository],
})
export class FinanceModule {}
