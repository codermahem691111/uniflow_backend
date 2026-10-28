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
exports.EnvironmentVariables = void 0;
exports.validateEnv = validateEnv;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const URL_OPTIONS = { protocols: ['http', 'https'], require_protocol: true, require_tld: false };
const PUBLISHABLE_KEY_PATTERN = /^(sb_publishable_[A-Za-z0-9_-]+|eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)$/;
const SECRET_KEY_PATTERN = /^(sb_secret_[A-Za-z0-9_-]+|eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)$/;
class EnvironmentVariables {
    PORT = 3000;
    FRONTEND_URL;
    SUPABASE_URL;
    SUPABASE_PUBLISHABLE_KEY;
    SUPABASE_SERVICE_ROLE_KEY;
}
exports.EnvironmentVariables = EnvironmentVariables;
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], EnvironmentVariables.prototype, "PORT", void 0);
__decorate([
    (0, class_validator_1.IsUrl)(URL_OPTIONS, {
        message: 'FRONTEND_URL must be a full URL, for example http://localhost:5173',
    }),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "FRONTEND_URL", void 0);
__decorate([
    (0, class_validator_1.IsUrl)(URL_OPTIONS, {
        message: 'SUPABASE_URL must be the Project URL, for example https://your-project-ref.supabase.co (not the postgresql:// connection string)',
    }),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "SUPABASE_URL", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'SUPABASE_PUBLISHABLE_KEY is required (Project Settings -> API Keys)' }),
    (0, class_validator_1.Matches)(PUBLISHABLE_KEY_PATTERN, {
        message: 'SUPABASE_PUBLISHABLE_KEY must be a Supabase publishable key (sb_publishable_...) or legacy anon JWT from this project',
    }),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "SUPABASE_PUBLISHABLE_KEY", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'SUPABASE_SERVICE_ROLE_KEY is required (Project Settings -> API Keys)' }),
    (0, class_validator_1.Matches)(SECRET_KEY_PATTERN, {
        message: 'SUPABASE_SERVICE_ROLE_KEY must be a Supabase secret key (sb_secret_...) or legacy service_role JWT from this project',
    }),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "SUPABASE_SERVICE_ROLE_KEY", void 0);
function validateEnv(rawConfig) {
    const config = (0, class_transformer_1.plainToInstance)(EnvironmentVariables, rawConfig);
    const errors = (0, class_validator_1.validateSync)(config);
    if (errors.length > 0) {
        const details = errors
            .map((error) => `  - ${Object.values(error.constraints ?? {}).join(', ')}`)
            .join('\n');
        throw new Error(`Invalid environment configuration (check your .env file):\n${details}`);
    }
    return config;
}
//# sourceMappingURL=env.validation.js.map