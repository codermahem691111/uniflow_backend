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
exports.CreateProductDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const normalize_decorators_1 = require("../../common/decorators/normalize.decorators");
const MAX_PRICE = 9_999_999_999.99;
const PRICE_OPTIONS = { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 };
class CreateProductDto {
    name;
    details;
    sellingPrice;
    buyingPrice;
}
exports.CreateProductDto = CreateProductDto;
__decorate([
    (0, normalize_decorators_1.Trim)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Product name is required.' }),
    (0, class_validator_1.MaxLength)(150, { message: 'Product name must be at most 150 characters.' }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "name", void 0);
__decorate([
    (0, normalize_decorators_1.EmptyToNull)(),
    (0, normalize_decorators_1.Trim)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000, { message: 'Details must be at most 2000 characters.' }),
    __metadata("design:type", Object)
], CreateProductDto.prototype, "details", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(PRICE_OPTIONS, { message: 'Selling price must be a number with at most 2 decimals.' }),
    (0, class_validator_1.Min)(0, { message: 'Selling price cannot be negative.' }),
    (0, class_validator_1.Max)(MAX_PRICE, { message: 'Selling price is too large.' }),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "sellingPrice", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(PRICE_OPTIONS, { message: 'Buying price must be a number with at most 2 decimals.' }),
    (0, class_validator_1.Min)(0, { message: 'Buying price cannot be negative.' }),
    (0, class_validator_1.Max)(MAX_PRICE, { message: 'Buying price is too large.' }),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "buyingPrice", void 0);
//# sourceMappingURL=create-product.dto.js.map