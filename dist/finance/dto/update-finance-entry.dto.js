"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFinanceEntryDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_finance_entry_dto_1 = require("./create-finance-entry.dto");
class UpdateFinanceEntryDto extends (0, mapped_types_1.PartialType)(create_finance_entry_dto_1.CreateFinanceEntryDto) {
}
exports.UpdateFinanceEntryDto = UpdateFinanceEntryDto;
//# sourceMappingURL=update-finance-entry.dto.js.map