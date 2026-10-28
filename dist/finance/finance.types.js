"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TYPE_OF_CATEGORY = exports.FinanceCategory = exports.FinanceType = void 0;
var FinanceType;
(function (FinanceType) {
    FinanceType["Income"] = "income";
    FinanceType["Expense"] = "expense";
})(FinanceType || (exports.FinanceType = FinanceType = {}));
var FinanceCategory;
(function (FinanceCategory) {
    FinanceCategory["ProductSale"] = "product_sale";
    FinanceCategory["StaffSalary"] = "staff_salary";
    FinanceCategory["ProductPurchase"] = "product_purchase";
    FinanceCategory["StoreMaintenance"] = "store_maintenance";
})(FinanceCategory || (exports.FinanceCategory = FinanceCategory = {}));
exports.TYPE_OF_CATEGORY = {
    [FinanceCategory.ProductSale]: FinanceType.Income,
    [FinanceCategory.StaffSalary]: FinanceType.Expense,
    [FinanceCategory.ProductPurchase]: FinanceType.Expense,
    [FinanceCategory.StoreMaintenance]: FinanceType.Expense,
};
//# sourceMappingURL=finance.types.js.map