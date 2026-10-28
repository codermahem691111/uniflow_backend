import { PartialType } from '@nestjs/mapped-types';
import { CreateFinanceEntryDto } from './create-finance-entry.dto';

/** Every field optional: only the fields that are sent are changed. */
export class UpdateFinanceEntryDto extends PartialType(CreateFinanceEntryDto) {}
