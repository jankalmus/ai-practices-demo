export const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Investments",
  "Other",
] as const;

export const EXPENSE_CATEGORIES = [
  "Housing",
  "Food",
  "Transport",
  "Entertainment",
  "Health",
  "Shopping",
  "Utilities",
  "Other",
] as const;

export type IncomeCategory = (typeof INCOME_CATEGORIES)[number];
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
export type Category = IncomeCategory | ExpenseCategory;

// Tailwind only generates classes it can see as literals, so these must stay
// full class names — never build them with string concatenation.
export const CATEGORY_COLORS: Record<Category, string> = {
  Salary: "bg-emerald-500",
  Freelance: "bg-teal-500",
  Investments: "bg-sky-500",
  Housing: "bg-amber-500",
  Food: "bg-orange-500",
  Transport: "bg-blue-500",
  Entertainment: "bg-violet-500",
  Health: "bg-rose-500",
  Shopping: "bg-pink-500",
  Utilities: "bg-cyan-500",
  Other: "bg-zinc-400",
};
