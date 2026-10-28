"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSearchTerm = toSearchTerm;
function toSearchTerm(raw) {
    return (raw ?? '').replace(/[%_\\,()"*]/g, ' ').replace(/\s+/g, ' ').trim();
}
//# sourceMappingURL=search.util.js.map