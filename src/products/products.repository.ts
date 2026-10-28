import { Injectable } from '@nestjs/common';
import { definedOnly } from '../common/object.util';
import { PageRequest, Paginated } from '../common/pagination/paginated';
import { toSearchTerm } from '../common/search.util';
import { TenantScope } from '../tenancy/tenant-scope';
import { TenantRepository } from '../tenancy/tenant.repository';
import { ListProductsQueryDto } from './dto/list-products-query.dto';
import { Product, ProductInput, ProductPatch, ProductRow } from './products.types';

/** The only place that talks to the `products` table. */
@Injectable()
export class ProductsRepository extends TenantRepository<ProductRow, Product, ProductInput, ProductPatch> {
  protected readonly table = 'products';

  constructor() {
    super(ProductsRepository.name);
  }

  async list(scope: TenantScope, query: ListProductsQueryDto): Promise<Paginated<Product>> {
    const page = PageRequest.from(query);
    const term = toSearchTerm(query.search);

    let request = scope.db
      .from(this.table)
      .select('*', { count: 'exact' })
      .eq('company_id', scope.companyId);

    if (term) request = request.ilike('name', `%${term}%`);

    const result = await request
      .order('name', { ascending: true })
      .order('id', { ascending: true })
      .range(page.firstIndex, page.lastIndex);

    return this.toPage(page, result);
  }

  protected toEntity(row: ProductRow): Product {
    return {
      id: row.id,
      name: row.name,
      details: row.details,
      sellingPrice: Number(row.selling_price),
      buyingPrice: Number(row.buying_price),
      imagePath: row.image_path,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  protected toInsertRow(input: ProductInput): Partial<ProductRow> {
    return {
      name: input.name,
      details: input.details ?? null,
      selling_price: input.sellingPrice,
      buying_price: input.buyingPrice,
    };
  }

  protected toUpdateRow(patch: ProductPatch): Partial<ProductRow> {
    return definedOnly<ProductRow>({
      name: patch.name,
      details: patch.details,
      selling_price: patch.sellingPrice,
      buying_price: patch.buyingPrice,
      image_path: patch.imagePath,
    });
  }
}
