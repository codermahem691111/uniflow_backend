"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tenant = exports.TenantProtected = void 0;
const common_1 = require("@nestjs/common");
const supabase_auth_guard_1 = require("../auth/guards/supabase-auth.guard");
const tenant_guard_1 = require("./tenant.guard");
const TenantProtected = () => (0, common_1.applyDecorators)((0, common_1.UseGuards)(supabase_auth_guard_1.SupabaseAuthGuard, tenant_guard_1.TenantGuard));
exports.TenantProtected = TenantProtected;
exports.Tenant = (0, common_1.createParamDecorator)((_data, context) => context.switchToHttp().getRequest().tenant);
//# sourceMappingURL=tenant.decorators.js.map