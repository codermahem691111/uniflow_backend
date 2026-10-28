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
exports.CreatePersonDto = void 0;
const class_validator_1 = require("class-validator");
const normalize_decorators_1 = require("../../common/decorators/normalize.decorators");
const people_types_1 = require("../people.types");
class CreatePersonDto {
    type;
    name;
    email;
    phone;
    address;
    details;
}
exports.CreatePersonDto = CreatePersonDto;
__decorate([
    (0, class_validator_1.IsEnum)(people_types_1.PersonType, { message: 'Type must be customer, staff or supplier.' }),
    __metadata("design:type", String)
], CreatePersonDto.prototype, "type", void 0);
__decorate([
    (0, normalize_decorators_1.Trim)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Name is required.' }),
    (0, class_validator_1.MaxLength)(150, { message: 'Name must be at most 150 characters.' }),
    __metadata("design:type", String)
], CreatePersonDto.prototype, "name", void 0);
__decorate([
    (0, normalize_decorators_1.EmptyToNull)(),
    (0, normalize_decorators_1.Trim)(),
    (0, normalize_decorators_1.Lowercase)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'Please provide a valid email address.' }),
    (0, class_validator_1.MaxLength)(254),
    __metadata("design:type", Object)
], CreatePersonDto.prototype, "email", void 0);
__decorate([
    (0, normalize_decorators_1.EmptyToNull)(),
    (0, normalize_decorators_1.Trim)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(40, { message: 'Phone must be at most 40 characters.' }),
    __metadata("design:type", Object)
], CreatePersonDto.prototype, "phone", void 0);
__decorate([
    (0, normalize_decorators_1.EmptyToNull)(),
    (0, normalize_decorators_1.Trim)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(300, { message: 'Address must be at most 300 characters.' }),
    __metadata("design:type", Object)
], CreatePersonDto.prototype, "address", void 0);
__decorate([
    (0, normalize_decorators_1.EmptyToNull)(),
    (0, normalize_decorators_1.Trim)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000, { message: 'Details must be at most 1000 characters.' }),
    __metadata("design:type", Object)
], CreatePersonDto.prototype, "details", void 0);
//# sourceMappingURL=create-person.dto.js.map