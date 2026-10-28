import { Injectable, NotFoundException } from '@nestjs/common';
import { Paginated } from '../common/pagination/paginated';
import { TenantScope } from '../tenancy/tenant-scope';
import { CreateProductDto } from './dto/create-product.dto';
import { ListProductsQueryDto } from './dto/list-products-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from './products.repository';
import { Product, ProductResponse } from './products.types';
import { ImageInspector, UploadedImageFile } from './storage/image-inspector';
import { ProductImageStorage } from './storage/product-image.storage';

@Injectable()
export class ProductsService {
  constructor(
    private readonly products: ProductsRepository,
    private readonly images: ProductImageStorage,
    private readonly imageInspector: ImageInspector,
  ) {}

  async list(scope: TenantScope, query: ListProductsQueryDto): Promise<Paginated<ProductResponse>> {
    const page = await this.products.list(scope, query);
    const urls = await this.images.createSignedUrls(scope, this.imagePathsOf(page.items));

    return { ...page, items: page.items.map((product) => this.toResponse(product, urls)) };
  }

  async create(scope: TenantScope, dto: CreateProductDto): Promise<ProductResponse> {
    return this.present(scope, await this.products.create(scope, dto));
  }

  async update(scope: TenantScope, id: string, dto: UpdateProductDto): Promise<ProductResponse> {
    const product = await this.products.update(scope, id, dto);
    if (!product) throw new NotFoundException('Product not found.');
    return this.present(scope, product);
  }

  async remove(scope: TenantScope, id: string): Promise<void> {
    const product = await this.requireProduct(scope, id);

    const wasDeleted = await this.products.delete(scope, id);
    if (!wasDeleted) throw new NotFoundException('Product not found.');

    if (product.imagePath) await this.images.remove(scope, [product.imagePath]);
  }

  /** Replaces the product's image. The old file is deleted only after the new one is saved. */
  async setImage(scope: TenantScope, id: string, file: UploadedImageFile | undefined): Promise<ProductResponse> {
    const product = await this.requireProduct(scope, id);
    const image = this.imageInspector.inspect(file);
    const newPath = await this.images.upload(scope, id, image);

    let updated: Product | null;
    try {
      updated = await this.products.update(scope, id, { imagePath: newPath });
    } catch (error) {
      await this.images.remove(scope, [newPath]);
      throw error;
    }

    if (!updated) {
      await this.images.remove(scope, [newPath]);
      throw new NotFoundException('Product not found.');
    }

    if (product.imagePath) await this.images.remove(scope, [product.imagePath]);
    return this.present(scope, updated);
  }

  async removeImage(scope: TenantScope, id: string): Promise<ProductResponse> {
    const product = await this.requireProduct(scope, id);
    if (!product.imagePath) return this.present(scope, product);

    const updated = await this.products.update(scope, id, { imagePath: null });
    if (!updated) throw new NotFoundException('Product not found.');

    await this.images.remove(scope, [product.imagePath]);
    return this.present(scope, updated);
  }

  private async requireProduct(scope: TenantScope, id: string): Promise<Product> {
    const product = await this.products.findById(scope, id);
    if (!product) throw new NotFoundException('Product not found.');
    return product;
  }

  private async present(scope: TenantScope, product: Product): Promise<ProductResponse> {
    const urls = await this.images.createSignedUrls(scope, this.imagePathsOf([product]));
    return this.toResponse(product, urls);
  }

  private imagePathsOf(products: Product[]): string[] {
    return products.flatMap((product) => (product.imagePath ? [product.imagePath] : []));
  }

  private toResponse(product: Product, urls: Map<string, string>): ProductResponse {
    const { imagePath, ...rest } = product;
    return { ...rest, imageUrl: imagePath ? (urls.get(imagePath) ?? null) : null };
  }
}
