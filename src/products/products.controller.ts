import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Paginated } from '../common/pagination/paginated';
import { Tenant, TenantProtected } from '../tenancy/tenant.decorators';
import { TenantScope } from '../tenancy/tenant-scope';
import { CreateProductDto } from './dto/create-product.dto';
import { ListProductsQueryDto } from './dto/list-products-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { ProductResponse } from './products.types';
import { MAX_IMAGE_BYTES, UploadedImageFile } from './storage/image-inspector';

@Controller('products')
@TenantProtected()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  list(
    @Tenant() scope: TenantScope,
    @Query() query: ListProductsQueryDto,
  ): Promise<Paginated<ProductResponse>> {
    return this.productsService.list(scope, query);
  }

  @Post()
  create(@Tenant() scope: TenantScope, @Body() dto: CreateProductDto): Promise<ProductResponse> {
    return this.productsService.create(scope, dto);
  }

  @Patch(':id')
  update(
    @Tenant() scope: TenantScope,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<ProductResponse> {
    return this.productsService.update(scope, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Tenant() scope: TenantScope, @Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.productsService.remove(scope, id);
  }

  /** multipart/form-data with one file in the field named "image". */
  @Post(':id/image')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('image', { limits: { fileSize: MAX_IMAGE_BYTES, files: 1 } }))
  uploadImage(
    @Tenant() scope: TenantScope,
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: UploadedImageFile | undefined,
  ): Promise<ProductResponse> {
    return this.productsService.setImage(scope, id, file);
  }

  @Delete(':id/image')
  removeImage(@Tenant() scope: TenantScope, @Param('id', ParseUUIDPipe) id: string): Promise<ProductResponse> {
    return this.productsService.removeImage(scope, id);
  }
}
