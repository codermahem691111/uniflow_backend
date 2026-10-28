"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantScope = void 0;
class TenantScope {
    companyId;
    db;
    constructor(companyId, db) {
        this.companyId = companyId;
        this.db = db;
    }
}
exports.TenantScope = TenantScope;
//# sourceMappingURL=tenant-scope.js.map