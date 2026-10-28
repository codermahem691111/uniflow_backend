import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Paginated } from '../common/pagination/paginated';
import { Tenant, TenantProtected } from '../tenancy/tenant.decorators';
import { TenantScope } from '../tenancy/tenant-scope';
import { CreateFinanceEntryDto } from './dto/create-finance-entry.dto';
import { ListFinanceQueryDto } from './dto/list-finance-query.dto';
import { SummaryQueryDto } from './dto/summary-query.dto';
import { UpdateFinanceEntryDto } from './dto/update-finance-entry.dto';
import { FinanceService } from './finance.service';
import { FinanceEntry, FinanceSummary } from './finance.types';

@Controller('finance')
@TenantProtected()
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get()
  list(@Tenant() scope: TenantScope, @Query() query: ListFinanceQueryDto): Promise<Paginated<FinanceEntry>> {
    return this.financeService.list(scope, query);
  }

  // Declared before the ':id' routes so "summary" is never mistaken for an id.
  @Get('summary')
  summary(@Tenant() scope: TenantScope, @Query() query: SummaryQueryDto): Promise<FinanceSummary> {
    return this.financeService.summary(scope, query.months);
  }

  @Post()
  create(@Tenant() scope: TenantScope, @Body() dto: CreateFinanceEntryDto): Promise<FinanceEntry> {
    return this.financeService.create(scope, dto);
  }

  @Patch(':id')
  update(
    @Tenant() scope: TenantScope,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFinanceEntryDto,
  ): Promise<FinanceEntry> {
    return this.financeService.update(scope, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Tenant() scope: TenantScope, @Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.financeService.remove(scope, id);
  }
}
