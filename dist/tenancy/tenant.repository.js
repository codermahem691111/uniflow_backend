"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantRepository = void 0;
const common_1 = require("@nestjs/common");
const RANGE_NOT_SATISFIABLE = 'PGRST103';
class TenantRepository {
    logger;
    constructor(loggerContext) {
        this.logger = new common_1.Logger(loggerContext);
    }
    async findById(scope, id) {
        const { data, error } = await scope.db
            .from(this.table)
            .select('*')
            .eq('company_id', scope.companyId)
            .eq('id', id)
            .maybeSingle();
        if (error)
            throw this.fail('find', error);
        return data ? this.toEntity(data) : null;
    }
    async create(scope, input) {
        const { data, error } = await scope.db
            .from(this.table)
            .insert({ ...this.toInsertRow(input), company_id: scope.companyId })
            .select()
            .single();
        if (error)
            throw this.fail('create', error);
        return this.toEntity(data);
    }
    async update(scope, id, patch) {
        const row = this.toUpdateRow(patch);
        if (Object.keys(row).length === 0)
            return this.findById(scope, id);
        const { data, error } = await scope.db
            .from(this.table)
            .update(row)
            .eq('company_id', scope.companyId)
            .eq('id', id)
            .select()
            .maybeSingle();
        if (error)
            throw this.fail('update', error);
        return data ? this.toEntity(data) : null;
    }
    async delete(scope, id) {
        const { data, error } = await scope.db
            .from(this.table)
            .delete()
            .eq('company_id', scope.companyId)
            .eq('id', id)
            .select('id');
        if (error)
            throw this.fail('delete', error);
        return (data ?? []).length > 0;
    }
    toPage(page, result) {
        if (result.error) {
            if (result.error.code === RANGE_NOT_SATISFIABLE)
                return page.toResult([], 0);
            throw this.fail('list', result.error);
        }
        const items = (result.data ?? []).map((row) => this.toEntity(row));
        return page.toResult(items, result.count ?? items.length);
    }
    fail(action, error) {
        this.logger.error(`Failed to ${action} (${this.table}): ${error.message} (code ${error.code})`);
        return new common_1.InternalServerErrorException('Something went wrong. Please try again later.');
    }
}
exports.TenantRepository = TenantRepository;
//# sourceMappingURL=tenant.repository.js.map