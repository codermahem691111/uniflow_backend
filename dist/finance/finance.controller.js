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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceController = void 0;
const common_1 = require("@nestjs/common");
const tenant_decorators_1 = require("../tenancy/tenant.decorators");
const tenant_scope_1 = require("../tenancy/tenant-scope");
const create_finance_entry_dto_1 = require("./dto/create-finance-entry.dto");
const list_finance_query_dto_1 = require("./dto/list-finance-query.dto");
const summary_query_dto_1 = require("./dto/summary-query.dto");
const update_finance_entry_dto_1 = require("./dto/update-finance-entry.dto");
const finance_service_1 = require("./finance.service");
let FinanceController = class FinanceController {
    financeService;
    constructor(financeService) {
        this.financeService = financeService;
    }
    list(scope, query) {
        return this.financeService.list(scope, query);
    }
    summary(scope, query) {
        return this.financeService.summary(scope, query.months);
    }
    create(scope, dto) {
        return this.financeService.create(scope, dto);
    }
    update(scope, id, dto) {
        return this.financeService.update(scope, id, dto);
    }
    remove(scope, id) {
        return this.financeService.remove(scope, id);
    }
};
exports.FinanceController = FinanceController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, tenant_decorators_1.Tenant)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tenant_scope_1.TenantScope, list_finance_query_dto_1.ListFinanceQueryDto]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('summary'),
    __param(0, (0, tenant_decorators_1.Tenant)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tenant_scope_1.TenantScope, summary_query_dto_1.SummaryQueryDto]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "summary", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, tenant_decorators_1.Tenant)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tenant_scope_1.TenantScope, create_finance_entry_dto_1.CreateFinanceEntryDto]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, tenant_decorators_1.Tenant)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tenant_scope_1.TenantScope, String, update_finance_entry_dto_1.UpdateFinanceEntryDto]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, tenant_decorators_1.Tenant)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tenant_scope_1.TenantScope, String]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "remove", null);
exports.FinanceController = FinanceController = __decorate([
    (0, common_1.Controller)('finance'),
    (0, tenant_decorators_1.TenantProtected)(),
    __metadata("design:paramtypes", [finance_service_1.FinanceService])
], FinanceController);
//# sourceMappingURL=finance.controller.js.map