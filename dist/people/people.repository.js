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
var PeopleRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeopleRepository = void 0;
const common_1 = require("@nestjs/common");
const object_util_1 = require("../common/object.util");
const paginated_1 = require("../common/pagination/paginated");
const search_util_1 = require("../common/search.util");
const tenant_repository_1 = require("../tenancy/tenant.repository");
let PeopleRepository = PeopleRepository_1 = class PeopleRepository extends tenant_repository_1.TenantRepository {
    table = 'people';
    constructor() {
        super(PeopleRepository_1.name);
    }
    async list(scope, query) {
        const page = paginated_1.PageRequest.from(query);
        const term = (0, search_util_1.toSearchTerm)(query.search);
        let request = scope.db
            .from(this.table)
            .select('*', { count: 'exact' })
            .eq('company_id', scope.companyId);
        if (query.type)
            request = request.eq('type', query.type);
        if (term)
            request = request.or(`name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%`);
        const result = await request
            .order('name', { ascending: true })
            .order('id', { ascending: true })
            .range(page.firstIndex, page.lastIndex);
        return this.toPage(page, result);
    }
    toEntity(row) {
        return {
            id: row.id,
            type: row.type,
            name: row.name,
            email: row.email,
            phone: row.phone,
            address: row.address,
            details: row.details,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at),
        };
    }
    toInsertRow(input) {
        return {
            type: input.type,
            name: input.name,
            email: input.email ?? null,
            phone: input.phone ?? null,
            address: input.address ?? null,
            details: input.details ?? null,
        };
    }
    toUpdateRow(patch) {
        return (0, object_util_1.definedOnly)({
            type: patch.type,
            name: patch.name,
            email: patch.email,
            phone: patch.phone,
            address: patch.address,
            details: patch.details,
        });
    }
};
exports.PeopleRepository = PeopleRepository;
exports.PeopleRepository = PeopleRepository = PeopleRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PeopleRepository);
//# sourceMappingURL=people.repository.js.map