import { Module } from '@nestjs/common';
import { TenancyModule } from '../tenancy/tenancy.module';
import { ProductsController } from './products.controller';
import { ProductsRepository } from './products.repository';
import { ProductsService } from './products.service';
import { ImageInspector } from './storage/image-inspector';
import { ProductImageStorage } from './storage/product-image.storage';

@Module({
  imports: [TenancyModule],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository, ProductImageStorage, ImageInspector],
})
export class ProductsModule {}
