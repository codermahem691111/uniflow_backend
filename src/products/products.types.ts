/** A row exactly as it is stored in the `products` table. */
export interface ProductRow {
  id: string;
  company_id: string;
  name: string;
  details: string | null;
  selling_price: number;
  buying_price: number;
  image_path: string | null;
  created_at: string;
  updated_at: string;
}

/** The product as the application works with it. `imagePath` stays on the server. */
export interface Product {
  id: string;
  name: string;
  details: string | null;
  sellingPrice: number;
  buyingPrice: number;
  imagePath: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/** What the API returns: a temporary signed link instead of the storage path. */
export type ProductResponse = Omit<Product, 'imagePath'> & { imageUrl: string | null };

export interface ProductInput {
  name: string;
  details?: string | null;
  sellingPrice: number;
  buyingPrice: number;
}

/** `imagePath` can only be set by the server (after a successful upload), never by a request body. */
export type ProductPatch = Partial<ProductInput> & { imagePath?: string | null };
