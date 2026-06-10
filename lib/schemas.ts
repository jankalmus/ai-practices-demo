import { z } from "zod";

import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  type Category,
} from "./categories";

const commonFields = {
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(60, "Name must be 60 characters or fewer"),
  description: z
    .string()
    .trim()
    .max(200, "Description must be 200 characters or fewer")
    .optional()
    .transform((value) => (value ? value : undefined)),
  amount: z.coerce
    .number()
    .positive("Amount must be greater than zero")
    .multipleOf(0.01, "Amount can have at most two decimal places"),
  date: z.iso.date("Date must be a valid date"),
};

export const transactionInputSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("income"),
    category: z.enum(INCOME_CATEGORIES, "Pick a valid income category"),
    ...commonFields,
  }),
  z.object({
    type: z.literal("expense"),
    category: z.enum(EXPENSE_CATEGORIES, "Pick a valid expense category"),
    ...commonFields,
  }),
]);

export type TransactionInput = z.infer<typeof transactionInputSchema>;

export type Transaction = {
  id: string;
  type: "income" | "expense";
  name: string;
  description?: string;
  amountCents: number;
  date: string; // YYYY-MM-DD
  category: Category;
};

export function toNewTransaction(
  input: TransactionInput,
): Omit<Transaction, "id"> {
  const { amount, ...rest } = input;
  return { ...rest, amountCents: Math.round(amount * 100) };
}

export const listFiltersSchema = z.object({
  type: z.enum(["income", "expense"]).optional(),
  category: z
    .union([z.enum(INCOME_CATEGORIES), z.enum(EXPENSE_CATEGORIES)])
    .optional(),
  month: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Month must be in YYYY-MM format")
    .optional(),
});

export type ListFilters = z.infer<typeof listFiltersSchema>;
