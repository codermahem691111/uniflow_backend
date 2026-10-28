"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LicenseAlreadyRegisteredException = void 0;
const common_1 = require("@nestjs/common");
class LicenseAlreadyRegisteredException extends common_1.ConflictException {
    constructor() {
        super('A company with this license number is already registered.');
    }
}
exports.LicenseAlreadyRegisteredException = LicenseAlreadyRegisteredException;
//# sourceMappingURL=license-already-registered.exception.js.map