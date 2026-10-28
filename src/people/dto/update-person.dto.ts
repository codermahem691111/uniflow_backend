import { PartialType } from '@nestjs/mapped-types';
import { CreatePersonDto } from './create-person.dto';

/** Every field optional: only the fields that are sent are changed. */
export class UpdatePersonDto extends PartialType(CreatePersonDto) {}
