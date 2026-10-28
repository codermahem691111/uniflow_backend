import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { TenantScope } from '../../tenancy/tenant-scope';
import { ValidatedImage } from './image-inspector';

const BUCKET = 'product-images';
const SIGNED_URL_LIFETIME_SECONDS = 60 * 60;

/**
 * Stores product images in the PRIVATE `product-images` bucket. Files live under
 * `<company id>/<product id>/<random>.<ext>`, and the bucket's policies only let a company
 * touch its own folder. Images are shown through temporary signed links.
 */
@Injectable()
export class ProductImageStorage {
  private readonly logger = new Logger(ProductImageStorage.name);

  /** Returns the storage path of the saved file. */
  async upload(scope: TenantScope, productId: string, image: ValidatedImage): Promise<string> {
    const path = `${scope.companyId}/${productId}/${randomUUID()}.${image.extension}`;

    const { error } = await scope.db.storage
      .from(BUCKET)
      .upload(path, image.buffer, { contentType: image.contentType, upsert: false });

    if (error) {
      this.logger.error(`Could not upload ${path}: ${error.message}`);
      throw new InternalServerErrorException('The image could not be saved. Please try again.');
    }

    return path;
  }

  /** Best effort: a leftover file is logged, but never breaks the request. */
  async remove(scope: TenantScope, paths: string[]): Promise<void> {
    const ownPaths = this.onlyOwnPaths(scope, paths);
    if (ownPaths.length === 0) return;

    const { error } = await scope.db.storage.from(BUCKET).remove(ownPaths);
    if (error) this.logger.warn(`Could not delete ${ownPaths.join(', ')}: ${error.message}`);
  }

  /** Maps each storage path to a temporary link. Paths that cannot be signed are left out. */
  async createSignedUrls(scope: TenantScope, paths: string[]): Promise<Map<string, string>> {
    const urls = new Map<string, string>();
    const ownPaths = [...new Set(this.onlyOwnPaths(scope, paths))];
    if (ownPaths.length === 0) return urls;

    const { data, error } = await scope.db.storage
      .from(BUCKET)
      .createSignedUrls(ownPaths, SIGNED_URL_LIFETIME_SECONDS);

    if (error || !data) {
      this.logger.warn(`Could not sign image links: ${error?.message ?? 'no data returned'}`);
      return urls;
    }

    for (const item of data) {
      if (item.path && item.signedUrl) urls.set(item.path, item.signedUrl);
    }
    return urls;
  }

  /** Extra safety on top of the bucket policies: never touch another company's folder. */
  private onlyOwnPaths(scope: TenantScope, paths: string[]): string[] {
    return paths.filter((path) => path.startsWith(`${scope.companyId}/`));
  }
}
