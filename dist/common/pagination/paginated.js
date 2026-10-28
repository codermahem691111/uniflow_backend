"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageRequest = void 0;
class PageRequest {
    page;
    pageSize;
    constructor(page, pageSize) {
        this.page = page;
        this.pageSize = pageSize;
    }
    static from(query) {
        return new PageRequest(query.page, query.pageSize);
    }
    get firstIndex() {
        return (this.page - 1) * this.pageSize;
    }
    get lastIndex() {
        return this.firstIndex + this.pageSize - 1;
    }
    toResult(items, total) {
        return { items, total, page: this.page, pageSize: this.pageSize };
    }
}
exports.PageRequest = PageRequest;
//# sourceMappingURL=paginated.js.map