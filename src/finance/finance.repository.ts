import { Injectable } from '@nestjs/common';
import { definedOnly } from '../common/object.util';
import { PageRequest, Paginated } from '../common/pagination/paginated';
import { toSearchTerm } from '../common/search.util';
import { TenantScope } from '../tenancy/tenant-scope';
import { TenantRepository } from '../tenancy/tenant.repository';
import { ListFinanceQueryDto } from './dto/list-finance-query.dto';
import {
  FinanceEntry,
  FinanceEntryInput,
  FinanceEntryPatch,
  FinanceRow,
  MonthlyTotalsRow,
  TYPE_OF_CATEGORY,
} from './finance.types';

/** The only place that talks to the `finance_entries` table. */
@Injectable()
export class FinanceRepository extends TenantRepository<
  FinanceRow,
  FinanceEntry,
  FinanceEntryInput,
  FinanceEntryPatch
> {
  protected readonly table = 'finance_entries';

  constructor() {
    super(FinanceRepository.name);
  }

  async list(scope: TenantScope, query: ListFinanceQueryDto): Promise<Paginated<FinanceEntry>> {
    const page = PageRequest.from(query);
    const term = toSearchTerm(query.search);

    let request = scope.db
      .from(this.table)
      .select('*', { count: 'exact' })
      .eq('company_id', scope.companyId);

    if (query.type) request = request.eq('type', query.type);
    if (query.category) request = request.eq('category', query.category);
    if (query.from) request = request.gte('entry_date', query.from);
    if (query.to) request = request.lte('entry_date', query.to);
    if (term) request = request.ilike('description', `%${term}%`);

    const result = await request
      .order('entry_date', { ascending: false })
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
      .range(page.firstIndex, page.lastIndex);

    return this.toPage(page, result);
  }

  /** Per-month totals computed by the database (see finance_monthly_summary in 02_business_tables.sql). */
  async monthlyTotals(scope: TenantScope, months: number): Promise<MonthlyTotalsRow[]> {
    const { data, error } = await scope.db.rpc('finance_monthly_summary', { p_months: months });

    if (error) throw this.fail('summarise', error);
    return (data ?? []) as MonthlyTotalsRow[];
  }

  protected toEntity(row: FinanceRow): FinanceEntry {
    return {
      id: row.id,
      type: row.type,
      category: row.category,
      amount: Number(row.amount),
      entryDate: row.entry_date,
      description: row.description,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  protected toInsertRow(input: FinanceEntryInput): Partial<FinanceRow> {
    return {
      category: input.category,
      type: TYPE_OF_CATEGORY[input.category],
      amount: input.amount,
      entry_date: input.entryDate,
      description: input.description ?? null,
    };
  }

  protected toUpdateRow(patch: FinanceEntryPatch): Partial<FinanceRow> {
    return definedOnly<FinanceRow>({
      category: patch.category,
      // Changing the category changes the type with it, so the two can never disagree.
      type: patch.category ? TYPE_OF_CATEGORY[patch.category] : undefined,
      amount: patch.amount,
      entry_date: patch.entryDate,
      description: patch.description,
    });
  }
}
