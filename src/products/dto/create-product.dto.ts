import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { EmptyToNull, Trim } from '../../common/decorators/normalize.decorators';

// numeric(12,2) in the database: up to 10 digits before the decimal point.
const MAX_PRICE = 9_999_999_999.99;
const PRICE_OPTIONS = { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 };

export class CreateProductDto {
  @Trim()
  @IsString()
  @IsNotEmpty({ message: 'Product name is required.' })
  @MaxLength(150, { message: 'Product name must be at most 150 characters.' })
  name!: string;

  @EmptyToNull()
  @Trim()
  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Details must be at most 2000 characters.' })
  details?: string | null;

  @Type(() => Number)
  @IsNumber(PRICE_OPTIONS, { message: 'Selling price must be a number with at most 2 decimals.' })
  @Min(0, { message: 'Selling price cannot be negative.' })
  @Max(MAX_PRICE, { message: 'Selling price is too large.' })
  sellingPrice!: number;

  @Type(() => Number)
  @IsNumber(PRICE_OPTIONS, { message: 'Buying price must be a number with at most 2 decimals.' })
  @Min(0, { message: 'Buying price cannot be negative.' })
  @Max(MAX_PRICE, { message: 'Buying price is too large.' })
  buyingPrice!: number;
}
