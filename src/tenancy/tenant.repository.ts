import { InternalServerErrorException, Logger } from '@nestjs/common';
import { PostgrestError } from '@supabase/supabase-js';
import { Paginated, PageRequest } from '../common/pagination/paginated';
import { TenantScope } from './tenant-scope';

/** Every tenant table has these two columns. */
export interface TenantRow {
  id: string;
  company_id: string;
}

/** PostgREST error code for "the requested page is past the last row". */
const RANGE_NOT_SATISFIABLE = 'PGRST103';

/**
 * Base class for repositories of tenant-owned tables.
 *
 * Isolation is enforced twice:
 *  1. In the database, by Row Level Security (the client in the scope acts as the user).
 *  2. Here, by always filtering on `company_id` and always writing the scope's `company_id`
 *     (a client can never choose it).
 *
 * Subclasses provide the table name and the row <-> entity mapping, plus their own `list`.
 */
export abstract class TenantRepository<Row extends TenantRow, Entity, CreateInput, UpdateInput extends object> {
  protected abstract readonly table: string;
  protected readonly logger: Logger;

  protected constructor(loggerContext: string) {
    this.logger = new Logger(loggerContext);
  }

  protected abstract toEntity(row: Row): Entity;
  protected abstract toInsertRow(input: CreateInput): Partial<Row>;
  protected abstract toUpdateRow(patch: UpdateInput): Partial<Row>;

  async findById(scope: TenantScope, id: string): Promise<Entity | null> {
    const { data, error } = await scope.db
      .from(this.table)
      .select('*')
      .eq('company_id', scope.companyId)
      .eq('id', id)
      .maybeSingle();

    if (error) throw this.fail('find', error);
    return data ? this.toEntity(data as Row) : null;
  }

  async create(scope: TenantScope, input: CreateInput): Promise<Entity> {
    const { data, error } = await scope.db
      .from(this.table)
      .insert({ ...this.toInsertRow(input), company_id: scope.companyId })
      .select()
      .single();

    if (error) throw this.fail('create', error);
    return this.toEntity(data as Row);
  }

  /** Returns null when the row does not exist (or belongs to another company). */
  async update(scope: TenantScope, id: string, patch: UpdateInput): Promise<Entity | null> {
    const row = this.toUpdateRow(patch);
    if (Object.keys(row).length === 0) return this.findById(scope, id);

    const { data, error } = await scope.db
      .from(this.table)
      // Type-only cast: the Supabase client is untyped, and TypeScript cannot match it to a generic Row.
      .update(row as unknown as Record<string, unknown>)
      .eq('company_id', scope.companyId)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw this.fail('update', error);
    return data ? this.toEntity(data as Row) : null;
  }

  /** Returns false when nothing was deleted (the row does not exist or is not yours). */
  async delete(scope: TenantScope, id: string): Promise<boolean> {
    const { data, error } = await scope.db
      .from(this.table)
      .delete()
      .eq('company_id', scope.companyId)
      .eq('id', id)
      .select('id');

    if (error) throw this.fail('delete', error);
    return (data ?? []).length > 0;
  }

  /** Turns the result of a ranged, counted query into a page. Used by every `list`. */
  protected toPage(
    page: PageRequest,
    result: { data: unknown[] | null; error: PostgrestError | null; count: number | null },
  ): Paginated<Entity> {
    if (result.error) {
      // Asking for a page past the end (for example after deleting the last row of the last
      // page) is not a failure: return an empty page and let the client step back.
      if (result.error.code === RANGE_NOT_SATISFIABLE) return page.toResult<Entity>([], 0);
      throw this.fail('list', result.error);
    }

    const items = ((result.data ?? []) as Row[]).map((row) => this.toEntity(row));
    return page.toResult(items, result.count ?? items.length);
  }

  protected fail(action: string, error: PostgrestError): InternalServerErrorException {
    this.logger.error(`Failed to ${action} (${this.table}): ${error.message} (code ${error.code})`);
    return new InternalServerErrorException('Something went wrong. Please try again later.');
  }
}
