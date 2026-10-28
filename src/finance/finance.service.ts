import { Injectable, NotFoundException } from '@nestjs/common';
import { Paginated } from '../common/pagination/paginated';
import { TenantScope } from '../tenancy/tenant-scope';
import { CreateFinanceEntryDto } from './dto/create-finance-entry.dto';
import { ListFinanceQueryDto } from './dto/list-finance-query.dto';
import { UpdateFinanceEntryDto } from './dto/update-finance-entry.dto';
import { FinanceRepository } from './finance.repository';
import { FinanceEntry, FinanceSummary, FinanceTotals, MonthlyFinance, MonthlyTotalsRow } from './finance.types';

/** Money is kept to 2 decimals so repeated additions never show floating point noise. */
const roundMoney = (value: number): number => Math.round((value + Number.EPSILON) * 100) / 100;

@Injectable()
export class FinanceService {
  constructor(private readonly finance: FinanceRepository) {}

  list(scope: TenantScope, query: ListFinanceQueryDto): Promise<Paginated<FinanceEntry>> {
    return this.finance.list(scope, query);
  }

  create(scope: TenantScope, dto: CreateFinanceEntryDto): Promise<FinanceEntry> {
    return this.finance.create(scope, dto);
  }

  async update(scope: TenantScope, id: string, dto: UpdateFinanceEntryDto): Promise<FinanceEntry> {
    const entry = await this.finance.update(scope, id, dto);
    if (!entry) throw new NotFoundException('Entry not found.');
    return entry;
  }

  async remove(scope: TenantScope, id: string): Promise<void> {
    const wasDeleted = await this.finance.delete(scope, id);
    if (!wasDeleted) throw new NotFoundException('Entry not found.');
  }

  /** Monthly income / expense / profit for the graph, plus totals for the whole period. */
  async summary(scope: TenantScope, months: number): Promise<FinanceSummary> {
    const rows = await this.finance.monthlyTotals(scope, months);
    const monthly = rows.map((row) => this.toMonthly(row));

    return { months: monthly, totals: this.sum(monthly) };
  }

  private toMonthly(row: MonthlyTotalsRow): MonthlyFinance {
    const income = roundMoney(Number(row.income));
    const staffSalary = roundMoney(Number(row.staff_salary));
    const productPurchase = roundMoney(Number(row.product_purchase));
    const storeMaintenance = roundMoney(Number(row.store_maintenance));
    const expense = roundMoney(staffSalary + productPurchase + storeMaintenance);

    return {
      month: row.month_start.slice(0, 7),
      income,
      expense,
      profit: roundMoney(income - expense),
      staffSalary,
      productPurchase,
      storeMaintenance,
    };
  }

  private sum(months: MonthlyFinance[]): FinanceTotals {
    const total = (pick: (month: MonthlyFinance) => number): number =>
      roundMoney(months.reduce((running, month) => running + pick(month), 0));

    const income = total((month) => month.income);
    const expense = total((month) => month.expense);

    return {
      income,
      expense,
      profit: roundMoney(income - expense),
      staffSalary: total((month) => month.staffSalary),
      productPurchase: total((month) => month.productPurchase),
      storeMaintenance: total((month) => month.storeMaintenance),
    };
  }
}
