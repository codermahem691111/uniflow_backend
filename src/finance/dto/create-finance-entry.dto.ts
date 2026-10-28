import { Type } from 'class-transformer';
import { IsEnum, IsISO8601, IsNumber, IsOptional, IsString, Matches, Max, MaxLength, Min } from 'class-validator';
import { EmptyToNull, Trim } from '../../common/decorators/normalize.decorators';
import { FinanceCategory } from '../finance.types';

// numeric(14,2) in the database: up to 12 digits before the decimal point.
const MAX_AMOUNT = 999_999_999_999.99;

export class CreateFinanceEntryDto {
  @IsEnum(FinanceCategory, {
    message: 'Category must be product_sale, staff_salary, product_purchase or store_maintenance.',
  })
  category!: FinanceCategory;

  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 },
    { message: 'Amount must be a number with at most 2 decimals.' },
  )
  @Min(0.01, { message: 'Amount must be greater than zero.' })
  @Max(MAX_AMOUNT, { message: 'Amount is too large.' })
  amount!: number;

  @Trim()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must look like 2026-10-22.' })
  @IsISO8601({ strict: true }, { message: 'Please provide a real calendar date.' })
  entryDate!: string;

  @EmptyToNull()
  @Trim()
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description must be at most 500 characters.' })
  description?: string | null;
}
