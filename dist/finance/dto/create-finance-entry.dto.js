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
exports.CreateFinanceEntryDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const normalize_decorators_1 = require("../../common/decorators/normalize.decorators");
const finance_types_1 = require("../finance.types");
const MAX_AMOUNT = 999_999_999_999.99;
class CreateFinanceEntryDto {
    category;
    amount;
    entryDate;
    description;
}
exports.CreateFinanceEntryDto = CreateFinanceEntryDto;
__decorate([
    (0, class_validator_1.IsEnum)(finance_types_1.FinanceCategory, {
        message: 'Category must be product_sale, staff_salary, product_purchase or store_maintenance.',
    }),
    __metadata("design:type", String)
], CreateFinanceEntryDto.prototype, "category", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 }, { message: 'Amount must be a number with at most 2 decimals.' }),
    (0, class_validator_1.Min)(0.01, { message: 'Amount must be greater than zero.' }),
    (0, class_validator_1.Max)(MAX_AMOUNT, { message: 'Amount is too large.' }),
    __metadata("design:type", Number)
], CreateFinanceEntryDto.prototype, "amount", void 0);
__decorate([
    (0, normalize_decorators_1.Trim)(),
    (0, class_validator_1.Matches)(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must look like 2026-10-22.' }),
    (0, class_validator_1.IsISO8601)({ strict: true }, { message: 'Please provide a real calendar date.' }),
    __metadata("design:type", String)
], CreateFinanceEntryDto.prototype, "entryDate", void 0);
__decorate([
    (0, normalize_decorators_1.EmptyToNull)(),
    (0, normalize_decorators_1.Trim)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500, { message: 'Description must be at most 500 characters.' }),
    __metadata("design:type", Object)
], CreateFinanceEntryDto.prototype, "description", void 0);
//# sourceMappingURL=create-finance-entry.dto.js.map