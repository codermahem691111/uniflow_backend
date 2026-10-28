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
exports.RegisterDto = void 0;
const class_validator_1 = require("class-validator");
const normalize_decorators_1 = require("../../common/decorators/normalize.decorators");
class RegisterDto {
    companyName;
    licenseNumber;
    email;
    ownerName;
    businessDescription;
    password;
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, normalize_decorators_1.Trim)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Company name is required.' }),
    (0, class_validator_1.MaxLength)(150, { message: 'Company name must be at most 150 characters.' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "companyName", void 0);
__decorate([
    (0, normalize_decorators_1.Trim)(),
    (0, normalize_decorators_1.Uppercase)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'License number is required.' }),
    (0, class_validator_1.MaxLength)(50, { message: 'License number must be at most 50 characters.' }),
    (0, class_validator_1.Matches)(/^[A-Z0-9][A-Z0-9\-\/ ]*$/, {
        message: 'License number may only contain letters, numbers, spaces, hyphens and slashes.',
    }),
    __metadata("design:type", String)
], RegisterDto.prototype, "licenseNumber", void 0);
__decorate([
    (0, normalize_decorators_1.Trim)(),
    (0, normalize_decorators_1.Lowercase)(),
    (0, class_validator_1.IsEmail)({}, { message: 'Please provide a valid email address.' }),
    (0, class_validator_1.MaxLength)(254, { message: 'Email must be at most 254 characters.' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, normalize_decorators_1.Trim)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Owner name is required.' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Owner name must be at most 100 characters.' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "ownerName", void 0);
__decorate([
    (0, normalize_decorators_1.Trim)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10, { message: 'Business description must be at least 10 characters.' }),
    (0, class_validator_1.MaxLength)(1000, { message: 'Business description must be at most 1000 characters.' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "businessDescription", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8, { message: 'Password must be at least 8 characters.' }),
    (0, class_validator_1.MaxLength)(72, { message: 'Password must be at most 72 characters.' }),
    (0, class_validator_1.Matches)(/^(?=.*[A-Za-z])(?=.*\d)/, {
        message: 'Password must contain at least one letter and one number.',
    }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
//# sourceMappingURL=register.dto.js.map