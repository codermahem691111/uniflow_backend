import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { EmptyToNull, Lowercase, Trim } from '../../common/decorators/normalize.decorators';
import { PersonType } from '../people.types';

export class CreatePersonDto {
  @IsEnum(PersonType, { message: 'Type must be customer, staff or supplier.' })
  type!: PersonType;

  @Trim()
  @IsString()
  @IsNotEmpty({ message: 'Name is required.' })
  @MaxLength(150, { message: 'Name must be at most 150 characters.' })
  name!: string;

  @EmptyToNull()
  @Trim()
  @Lowercase()
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  @MaxLength(254)
  email?: string | null;

  @EmptyToNull()
  @Trim()
  @IsOptional()
  @IsString()
  @MaxLength(40, { message: 'Phone must be at most 40 characters.' })
  phone?: string | null;

  @EmptyToNull()
  @Trim()
  @IsOptional()
  @IsString()
  @MaxLength(300, { message: 'Address must be at most 300 characters.' })
  address?: string | null;

  @EmptyToNull()
  @Trim()
  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Details must be at most 1000 characters.' })
  details?: string | null;
}
