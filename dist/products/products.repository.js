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
var ProductsRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsRepository = void 0;
const common_1 = require("@nestjs/common");
const object_util_1 = require("../common/object.util");
const paginated_1 = require("../common/pagination/paginated");
const search_util_1 = require("../common/search.util");
const tenant_repository_1 = require("../tenancy/tenant.repository");
let ProductsRepository = ProductsRepository_1 = class ProductsRepository extends tenant_repository_1.TenantRepository {
    table = 'products';
    constructor() {
        super(ProductsRepository_1.name);
    }
    async list(scope, query) {
        const page = paginated_1.PageRequest.from(query);
        const term = (0, search_util_1.toSearchTerm)(query.search);
        let request = scope.db
            .from(this.table)
            .select('*', { count: 'exact' })
            .eq('company_id', scope.companyId);
        if (term)
            request = request.ilike('name', `%${term}%`);
        const result = await request
            .order('name', { ascending: true })
            .order('id', { ascending: true })
            .range(page.firstIndex, page.lastIndex);
        return this.toPage(page, result);
    }
    toEntity(row) {
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
    toInsertRow(input) {
        return {
            name: input.name,
            details: input.details ?? null,
            selling_price: input.sellingPrice,
            buying_price: input.buyingPrice,
        };
    }
    toUpdateRow(patch) {
        return (0, object_util_1.definedOnly)({
            name: patch.name,
            details: patch.details,
            selling_price: patch.sellingPrice,
            buying_price: patch.buyingPrice,
            image_path: patch.imagePath,
        });
    }
};
exports.ProductsRepository = ProductsRepository;
exports.ProductsRepository = ProductsRepository = ProductsRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ProductsRepository);
//# sourceMappingURL=products.repository.js.map