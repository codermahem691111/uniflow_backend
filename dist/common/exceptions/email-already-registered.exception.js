"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailAlreadyRegisteredException = void 0;
const common_1 = require("@nestjs/common");
class EmailAlreadyRegisteredException extends common_1.ConflictException {
    constructor() {
        super('A company with this email address is already registered. If you have not verified it yet, sign in and choose "Resend verification email".');
    }
}
exports.EmailAlreadyRegisteredException = EmailAlreadyRegisteredException;
//# sourceMappingURL=email-already-registered.exception.js.map