export enum FinanceType {
  Income = 'income',
  Expense = 'expense',
}

/** Income comes only from product sales; there are exactly three kinds of expense. */
export enum FinanceCategory {
  ProductSale = 'product_sale',
  StaffSalary = 'staff_salary',
  ProductPurchase = 'product_purchase',
  StoreMaintenance = 'store_maintenance',
}

/** The type of an entry is always derived from its category, never chosen separately. */
export const TYPE_OF_CATEGORY: Record<FinanceCategory, FinanceType> = {
  [FinanceCategory.ProductSale]: FinanceType.Income,
  [FinanceCategory.StaffSalary]: FinanceType.Expense,
  [FinanceCategory.ProductPurchase]: FinanceType.Expense,
  [FinanceCategory.StoreMaintenance]: FinanceType.Expense,
};

/** A row exactly as it is stored in the `finance_entries` table. */
export interface FinanceRow {
  id: string;
  company_id: string;
  type: FinanceType;
  category: FinanceCategory;
  amount: number;
  entry_date: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface FinanceEntry {
  id: string;
  type: FinanceType;
  category: FinanceCategory;
  amount: number;
  /** Calendar date as YYYY-MM-DD. */
  entryDate: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface FinanceEntryInput {
  category: FinanceCategory;
  amount: number;
  entryDate: string;
  description?: string | null;
}

export type FinanceEntryPatch = Partial<FinanceEntryInput>;

/** One row returned by the `finance_monthly_summary` database function. */
export interface MonthlyTotalsRow {
  month_start: string;
  income: number;
  staff_salary: number;
  product_purchase: number;
  store_maintenance: number;
}

export interface MonthlyFinance {
  /** YYYY-MM */
  month: string;
  income: number;
  expense: number;
  profit: number;
  staffSalary: number;
  productPurchase: number;
  storeMaintenance: number;
}

export interface FinanceTotals {
  income: number;
  expense: number;
  profit: number;
  staffSalary: number;
  productPurchase: number;
  storeMaintenance: number;
}

export interface FinanceSummary {
  months: MonthlyFinance[];
  totals: FinanceTotals;
}
