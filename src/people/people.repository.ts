import { Injectable } from '@nestjs/common';
import { definedOnly } from '../common/object.util';
import { PageRequest, Paginated } from '../common/pagination/paginated';
import { toSearchTerm } from '../common/search.util';
import { TenantScope } from '../tenancy/tenant-scope';
import { TenantRepository } from '../tenancy/tenant.repository';
import { ListPeopleQueryDto } from './dto/list-people-query.dto';
import { Person, PersonInput, PersonPatch, PersonRow } from './people.types';

/** The only place that talks to the `people` table. */
@Injectable()
export class PeopleRepository extends TenantRepository<PersonRow, Person, PersonInput, PersonPatch> {
  protected readonly table = 'people';

  constructor() {
    super(PeopleRepository.name);
  }

  async list(scope: TenantScope, query: ListPeopleQueryDto): Promise<Paginated<Person>> {
    const page = PageRequest.from(query);
    const term = toSearchTerm(query.search);

    let request = scope.db
      .from(this.table)
      .select('*', { count: 'exact' })
      .eq('company_id', scope.companyId);

    if (query.type) request = request.eq('type', query.type);
    if (term) request = request.or(`name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%`);

    const result = await request
      .order('name', { ascending: true })
      .order('id', { ascending: true })
      .range(page.firstIndex, page.lastIndex);

    return this.toPage(page, result);
  }

  protected toEntity(row: PersonRow): Person {
    return {
      id: row.id,
      type: row.type,
      name: row.name,
      email: row.email,
      phone: row.phone,
      address: row.address,
      details: row.details,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  protected toInsertRow(input: PersonInput): Partial<PersonRow> {
    return {
      type: input.type,
      name: input.name,
      email: input.email ?? null,
      phone: input.phone ?? null,
      address: input.address ?? null,
      details: input.details ?? null,
    };
  }

  protected toUpdateRow(patch: PersonPatch): Partial<PersonRow> {
    return definedOnly<PersonRow>({
      type: patch.type,
      name: patch.name,
      email: patch.email,
      phone: patch.phone,
      address: patch.address,
      details: patch.details,
    });
  }
}
