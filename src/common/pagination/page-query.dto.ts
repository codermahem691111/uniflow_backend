import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { Trim } from '../decorators/normalize.decorators';

/** Query string shared by every list endpoint: ?page=1&pageSize=10&search=abc */
export class PageQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page must be a whole number.' })
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'pageSize must be a whole number.' })
  @Min(1)
  @Max(100)
  pageSize: number = 10;

  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(100)
  search?: string;
}
