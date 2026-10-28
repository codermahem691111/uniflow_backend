import { IsEnum, IsISO8601, IsOptional, Matches } from 'class-validator';
import { PageQueryDto } from '../../common/pagination/page-query.dto';
import { FinanceCategory, FinanceType } from '../finance.types';

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

export class ListFinanceQueryDto extends PageQueryDto {
  @IsOptional()
  @IsEnum(FinanceType, { message: 'Type must be income or expense.' })
  type?: FinanceType;

  @IsOptional()
  @IsEnum(FinanceCategory, { message: 'Unknown category.' })
  category?: FinanceCategory;

  /** Only entries on or after this date (YYYY-MM-DD). */
  @IsOptional()
  @Matches(DATE_ONLY, { message: 'from must look like 2026-10-22.' })
  @IsISO8601({ strict: true })
  from?: string;

  /** Only entries on or before this date (YYYY-MM-DD). */
  @IsOptional()
  @Matches(DATE_ONLY, { message: 'to must look like 2026-10-22.' })
  @IsISO8601({ strict: true })
  to?: string;
}
