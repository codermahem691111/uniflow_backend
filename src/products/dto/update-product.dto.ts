import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

/** Every field optional: only the fields that are sent are changed. */
export class UpdateProductDto extends PartialType(CreateProductDto) {}
