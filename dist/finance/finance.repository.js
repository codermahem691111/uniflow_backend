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
var FinanceRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceRepository = void 0;
const common_1 = require("@nestjs/common");
const object_util_1 = require("../common/object.util");
const paginated_1 = require("../common/pagination/paginated");
const search_util_1 = require("../common/search.util");
const tenant_repository_1 = require("../tenancy/tenant.repository");
const finance_types_1 = require("./finance.types");
let FinanceRepository = FinanceRepository_1 = class FinanceRepository extends tenant_repository_1.TenantRepository {
    table = 'finance_entries';
    constructor() {
        super(FinanceRepository_1.name);
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
        if (query.category)
            request = request.eq('category', query.category);
        if (query.from)
            request = request.gte('entry_date', query.from);
        if (query.to)
            request = request.lte('entry_date', query.to);
        if (term)
            request = request.ilike('description', `%${term}%`);
        const result = await request
            .order('entry_date', { ascending: false })
            .order('created_at', { ascending: false })
            .order('id', { ascending: false })
            .range(page.firstIndex, page.lastIndex);
        return this.toPage(page, result);
    }
    async monthlyTotals(scope, months) {
        const { data, error } = await scope.db.rpc('finance_monthly_summary', { p_months: months });
        if (error)
            throw this.fail('summarise', error);
        return (data ?? []);
    }
    toEntity(row) {
        return {
            id: row.id,
            type: row.type,
            category: row.category,
            amount: Number(row.amount),
            entryDate: row.entry_date,
            description: row.description,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at),
        };
    }
    toInsertRow(input) {
        return {
            category: input.category,
            type: finance_types_1.TYPE_OF_CATEGORY[input.category],
            amount: input.amount,
            entry_date: input.entryDate,
            description: input.description ?? null,
        };
    }
    toUpdateRow(patch) {
        return (0, object_util_1.definedOnly)({
            category: patch.category,
            type: patch.category ? finance_types_1.TYPE_OF_CATEGORY[patch.category] : undefined,
            amount: patch.amount,
            entry_date: patch.entryDate,
            description: patch.description,
        });
    }
};
exports.FinanceRepository = FinanceRepository;
exports.FinanceRepository = FinanceRepository = FinanceRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], FinanceRepository);
//# sourceMappingURL=finance.repository.js.map