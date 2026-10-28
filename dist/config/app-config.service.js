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
exports.AppConfigService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let AppConfigService = class AppConfigService {
    config;
    constructor(config) {
        this.config = config;
    }
    get port() {
        return this.config.get('PORT', { infer: true });
    }
    get frontendUrl() {
        return this.config.get('FRONTEND_URL', { infer: true }).replace(/\/+$/, '');
    }
    get emailVerifiedRedirectUrl() {
        return `${this.frontendUrl}/email-verified`;
    }
    get supabaseUrl() {
        return this.config.get('SUPABASE_URL', { infer: true });
    }
    get supabasePublishableKey() {
        return this.config.get('SUPABASE_PUBLISHABLE_KEY', { infer: true });
    }
    get supabaseServiceRoleKey() {
        return this.config.get('SUPABASE_SERVICE_ROLE_KEY', { infer: true });
    }
};
exports.AppConfigService = AppConfigService;
exports.AppConfigService = AppConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AppConfigService);
//# sourceMappingURL=app-config.service.js.map