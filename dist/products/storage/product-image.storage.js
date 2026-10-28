"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ProductImageStorage_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductImageStorage = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const BUCKET = 'product-images';
const SIGNED_URL_LIFETIME_SECONDS = 60 * 60;
let ProductImageStorage = ProductImageStorage_1 = class ProductImageStorage {
    logger = new common_1.Logger(ProductImageStorage_1.name);
    async upload(scope, productId, image) {
        const path = `${scope.companyId}/${productId}/${(0, crypto_1.randomUUID)()}.${image.extension}`;
        const { error } = await scope.db.storage
            .from(BUCKET)
            .upload(path, image.buffer, { contentType: image.contentType, upsert: false });
        if (error) {
            this.logger.error(`Could not upload ${path}: ${error.message}`);
            throw new common_1.InternalServerErrorException('The image could not be saved. Please try again.');
        }
        return path;
    }
    async remove(scope, paths) {
        const ownPaths = this.onlyOwnPaths(scope, paths);
        if (ownPaths.length === 0)
            return;
        const { error } = await scope.db.storage.from(BUCKET).remove(ownPaths);
        if (error)
            this.logger.warn(`Could not delete ${ownPaths.join(', ')}: ${error.message}`);
    }
    async createSignedUrls(scope, paths) {
        const urls = new Map();
        const ownPaths = [...new Set(this.onlyOwnPaths(scope, paths))];
        if (ownPaths.length === 0)
            return urls;
        const { data, error } = await scope.db.storage
            .from(BUCKET)
            .createSignedUrls(ownPaths, SIGNED_URL_LIFETIME_SECONDS);
        if (error || !data) {
            this.logger.warn(`Could not sign image links: ${error?.message ?? 'no data returned'}`);
            return urls;
        }
        for (const item of data) {
            if (item.path && item.signedUrl)
                urls.set(item.path, item.signedUrl);
        }
        return urls;
    }
    onlyOwnPaths(scope, paths) {
        return paths.filter((path) => path.startsWith(`${scope.companyId}/`));
    }
};
exports.ProductImageStorage = ProductImageStorage;
exports.ProductImageStorage = ProductImageStorage = ProductImageStorage_1 = __decorate([
    (0, common_1.Injectable)()
], ProductImageStorage);
//# sourceMappingURL=product-image.storage.js.map