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
import { CreatePersonDto } from './dto/create-person.dto';
import { ListPeopleQueryDto } from './dto/list-people-query.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { PeopleService } from './people.service';
import { Person } from './people.types';

@Controller('people')
@TenantProtected()
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Get()
  list(@Tenant() scope: TenantScope, @Query() query: ListPeopleQueryDto): Promise<Paginated<Person>> {
    return this.peopleService.list(scope, query);
  }

  @Post()
  create(@Tenant() scope: TenantScope, @Body() dto: CreatePersonDto): Promise<Person> {
    return this.peopleService.create(scope, dto);
  }

  @Patch(':id')
  update(
    @Tenant() scope: TenantScope,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePersonDto,
  ): Promise<Person> {
    return this.peopleService.update(scope, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Tenant() scope: TenantScope, @Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.peopleService.remove(scope, id);
  }
}
