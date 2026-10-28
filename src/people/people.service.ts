import { Injectable, NotFoundException } from '@nestjs/common';
import { Paginated } from '../common/pagination/paginated';
import { TenantScope } from '../tenancy/tenant-scope';
import { CreatePersonDto } from './dto/create-person.dto';
import { ListPeopleQueryDto } from './dto/list-people-query.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { PeopleRepository } from './people.repository';
import { Person } from './people.types';

@Injectable()
export class PeopleService {
  constructor(private readonly people: PeopleRepository) {}

  list(scope: TenantScope, query: ListPeopleQueryDto): Promise<Paginated<Person>> {
    return this.people.list(scope, query);
  }

  create(scope: TenantScope, dto: CreatePersonDto): Promise<Person> {
    return this.people.create(scope, dto);
  }

  async update(scope: TenantScope, id: string, dto: UpdatePersonDto): Promise<Person> {
    const person = await this.people.update(scope, id, dto);
    if (!person) throw new NotFoundException('Person not found.');
    return person;
  }

  async remove(scope: TenantScope, id: string): Promise<void> {
    const wasDeleted = await this.people.delete(scope, id);
    if (!wasDeleted) throw new NotFoundException('Person not found.');
  }
}
