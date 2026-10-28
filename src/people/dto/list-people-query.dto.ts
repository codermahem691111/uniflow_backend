import { IsEnum, IsOptional } from 'class-validator';
import { PageQueryDto } from '../../common/pagination/page-query.dto';
import { PersonType } from '../people.types';

export class ListPeopleQueryDto extends PageQueryDto {
  @IsOptional()
  @IsEnum(PersonType, { message: 'Type must be customer, staff or supplier.' })
  type?: PersonType;
}
