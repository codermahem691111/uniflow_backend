import { Module } from '@nestjs/common';
import { TenancyModule } from '../tenancy/tenancy.module';
import { PeopleController } from './people.controller';
import { PeopleRepository } from './people.repository';
import { PeopleService } from './people.service';

@Module({
  imports: [TenancyModule],
  controllers: [PeopleController],
  providers: [PeopleService, PeopleRepository],
})
export class PeopleModule {}
