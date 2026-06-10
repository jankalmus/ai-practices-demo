"use client";

import { useActionState, useState } from "react";

import { addTransaction, type AddTransactionState } from "@/app/actions";
import { Card, Field, Input, Select, Textarea } from "@/components/ui";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/categories";

const initialState: AddTransactionState = { status: "idle" };

export function TransactionForm({ defaultDate }: { defaultDate: string }) {
  const [state, formAction, pending] = useActionState(
    addTransaction,
    initialState,
  );
  const [type, setType] = useState<"income" | "expense">("expense");

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const fieldErrors = state.status === "error" ? state.fieldErrors : undefined;

  return (
    <Card as="section" aria-label="Add transaction">
      <h2 className="text-sm font-semibold">Add transaction</h2>

      <form action={formAction} className="mt-4 space-y-4">
        <input type="hidden" name="type" value={type} />

        <div
          role="group"
          aria-label="Transaction type"
          className="grid grid-cols-2 gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800"
        >
          {(["expense", "income"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setType(option)}
              aria-pressed={type === option}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                type === option
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-50"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              {option === "expense" ? "Expense" : "Income"}
            </button>
          ))}
        </div>

        <Field label="Name" htmlFor="tx-name" error={fieldErrors?.name?.[0]}>
          <Input
            id="tx-name"
            name="name"
            placeholder="e.g. Groceries"
            maxLength={60}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Amount"
            htmlFor="tx-amount"
            error={fieldErrors?.amount?.[0]}
          >
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-zinc-400">
                €
              </span>
              <Input
                id="tx-amount"
                name="amount"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                className="pl-7 font-mono tabular-nums"
              />
            </div>
          </Field>

          <Field label="Date" htmlFor="tx-date" error={fieldErrors?.date?.[0]}>
            <Input id="tx-date" name="date" type="date" defaultValue={defaultDate} />
          </Field>
        </div>

        <Field
          label="Category"
          htmlFor="tx-category"
          error={fieldErrors?.category?.[0]}
        >
          {/* key={type} remounts the select so the default resets when the type flips */}
          <Select id="tx-category" name="category" key={type}>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label="Description (optional)"
          htmlFor="tx-description"
          error={fieldErrors?.description?.[0]}
        >
          <Textarea
            id="tx-description"
            name="description"
            rows={2}
            maxLength={200}
            placeholder="Anything worth remembering"
          />
        </Field>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-700 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {pending ? "Adding…" : "Add transaction"}
        </button>

        <p aria-live="polite" className="min-h-4 text-xs">
          {state.status === "success" && (
            <span className="text-emerald-600 dark:text-emerald-400">
              Transaction added.
            </span>
          )}
          {state.status === "error" && (
            <span className="text-rose-600 dark:text-rose-400">
              {state.message ?? "Please fix the highlighted fields."}
            </span>
          )}
        </p>
      </form>
    </Card>
  );
}
