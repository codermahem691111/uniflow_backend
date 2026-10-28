import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class SummaryQueryDto {
  /** How many months to include, counting back from the current month. */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'months must be a whole number.' })
  @Min(1)
  @Max(24)
  months: number = 12;
}
