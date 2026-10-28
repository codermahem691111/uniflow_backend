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
exports.FinanceService = void 0;
const common_1 = require("@nestjs/common");
const finance_repository_1 = require("./finance.repository");
const roundMoney = (value) => Math.round((value + Number.EPSILON) * 100) / 100;
let FinanceService = class FinanceService {
    finance;
    constructor(finance) {
        this.finance = finance;
    }
    list(scope, query) {
        return this.finance.list(scope, query);
    }
    create(scope, dto) {
        return this.finance.create(scope, dto);
    }
    async update(scope, id, dto) {
        const entry = await this.finance.update(scope, id, dto);
        if (!entry)
            throw new common_1.NotFoundException('Entry not found.');
        return entry;
    }
    async remove(scope, id) {
        const wasDeleted = await this.finance.delete(scope, id);
        if (!wasDeleted)
            throw new common_1.NotFoundException('Entry not found.');
    }
    async summary(scope, months) {
        const rows = await this.finance.monthlyTotals(scope, months);
        const monthly = rows.map((row) => this.toMonthly(row));
        return { months: monthly, totals: this.sum(monthly) };
    }
    toMonthly(row) {
        const income = roundMoney(Number(row.income));
        const staffSalary = roundMoney(Number(row.staff_salary));
        const productPurchase = roundMoney(Number(row.product_purchase));
        const storeMaintenance = roundMoney(Number(row.store_maintenance));
        const expense = roundMoney(staffSalary + productPurchase + storeMaintenance);
        return {
            month: row.month_start.slice(0, 7),
            income,
            expense,
            profit: roundMoney(income - expense),
            staffSalary,
            productPurchase,
            storeMaintenance,
        };
    }
    sum(months) {
        const total = (pick) => roundMoney(months.reduce((running, month) => running + pick(month), 0));
        const income = total((month) => month.income);
        const expense = total((month) => month.expense);
        return {
            income,
            expense,
            profit: roundMoney(income - expense),
            staffSalary: total((month) => month.staffSalary),
            productPurchase: total((month) => month.productPurchase),
            storeMaintenance: total((month) => month.storeMaintenance),
        };
    }
};
exports.FinanceService = FinanceService;
exports.FinanceService = FinanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [finance_repository_1.FinanceRepository])
], FinanceService);
//# sourceMappingURL=finance.service.js.map