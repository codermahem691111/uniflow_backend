"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const products_repository_1 = require("./products.repository");
const image_inspector_1 = require("./storage/image-inspector");
const product_image_storage_1 = require("./storage/product-image.storage");
let ProductsService = class ProductsService {
    products;
    images;
    imageInspector;
    constructor(products, images, imageInspector) {
        this.products = products;
        this.images = images;
        this.imageInspector = imageInspector;
    }
    async list(scope, query) {
        const page = await this.products.list(scope, query);
        const urls = await this.images.createSignedUrls(scope, this.imagePathsOf(page.items));
        return { ...page, items: page.items.map((product) => this.toResponse(product, urls)) };
    }
    async create(scope, dto) {
        return this.present(scope, await this.products.create(scope, dto));
    }
    async update(scope, id, dto) {
        const product = await this.products.update(scope, id, dto);
        if (!product)
            throw new common_1.NotFoundException('Product not found.');
        return this.present(scope, product);
    }
    async remove(scope, id) {
        const product = await this.requireProduct(scope, id);
        const wasDeleted = await this.products.delete(scope, id);
        if (!wasDeleted)
            throw new common_1.NotFoundException('Product not found.');
        if (product.imagePath)
            await this.images.remove(scope, [product.imagePath]);
    }
    async setImage(scope, id, file) {
        const product = await this.requireProduct(scope, id);
        const image = this.imageInspector.inspect(file);
        const newPath = await this.images.upload(scope, id, image);
        let updated;
        try {
            updated = await this.products.update(scope, id, { imagePath: newPath });
        }
        catch (error) {
            await this.images.remove(scope, [newPath]);
            throw error;
        }
        if (!updated) {
            await this.images.remove(scope, [newPath]);
            throw new common_1.NotFoundException('Product not found.');
        }
        if (product.imagePath)
            await this.images.remove(scope, [product.imagePath]);
        return this.present(scope, updated);
    }
    async removeImage(scope, id) {
        const product = await this.requireProduct(scope, id);
        if (!product.imagePath)
            return this.present(scope, product);
        const updated = await this.products.update(scope, id, { imagePath: null });
        if (!updated)
            throw new common_1.NotFoundException('Product not found.');
        await this.images.remove(scope, [product.imagePath]);
        return this.present(scope, updated);
    }
    async requireProduct(scope, id) {
        const product = await this.products.findById(scope, id);
        if (!product)
            throw new common_1.NotFoundException('Product not found.');
        return product;
    }
    async present(scope, product) {
        const urls = await this.images.createSignedUrls(scope, this.imagePathsOf([product]));
        return this.toResponse(product, urls);
    }
    imagePathsOf(products) {
        return products.flatMap((product) => (product.imagePath ? [product.imagePath] : []));
    }
    toResponse(product, urls) {
        const { imagePath, ...rest } = product;
        return { ...rest, imageUrl: imagePath ? (urls.get(imagePath) ?? null) : null };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [products_repository_1.ProductsRepository,
        product_image_storage_1.ProductImageStorage,
        image_inspector_1.ImageInspector])
], ProductsService);
//# sourceMappingURL=products.service.js.map