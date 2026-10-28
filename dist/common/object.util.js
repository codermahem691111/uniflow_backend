"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definedOnly = definedOnly;
function definedOnly(source) {
    return Object.fromEntries(Object.entries(source).filter(([, value]) => value !== undefined));
}
//# sourceMappingURL=object.util.js.map