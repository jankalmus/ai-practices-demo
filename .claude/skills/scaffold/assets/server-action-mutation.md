# Recipe: mutations (server action + leaf client form)

**Use this when** the page lets the user create, edit, or delete data. App-internal mutations go through **server actions**, never client-side `fetch` to our own API. Read alongside [nextjs.md](../../../../docs/nextjs.md), [react-components.md](../../../../docs/react-components.md), and [security.md](../../../../docs/security.md).

Two files: the action (server) and a leaf client component that submits to it. The page stays a server component.

## 1. The action in `app/actions.ts`

Actions live in `app/actions.ts` under `'use server'`. They validate input with a `lib/schemas.ts` schema, call `lib/store.ts`, and `revalidatePath` the affected route. Return a serializable state object — model it as a discriminated union so the UI can switch on `status`.

```ts
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { toNewTransaction, transactionInputSchema } from "@/lib/schemas";
import * as store from "@/lib/store";

export type AddTransactionState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message?: string; fieldErrors?: Partial<Record<string, string[]>> };

export async function addTransaction(
  _previous: AddTransactionState,
  formData: FormData,
): Promise<AddTransactionState> {
  const parsed = transactionInputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const { fieldErrors, formErrors } = z.flattenError(parsed.error);
    return { status: "error", message: formErrors[0], fieldErrors };
  }

  store.addTransaction(toNewTransaction(parsed.data));
  revalidatePath("/");
  return { status: "success" };
}
```

For a parameter-only mutation (e.g. delete), a plain `async (id: string) => void` action that calls the store and revalidates is enough — see `deleteTransaction` in `app/actions.ts`.

Rules:

- **Validate with `safeParse`** and return `z.flattenError(...).fieldErrors` — never throw raw Zod errors at the UI, never trust `FormData`.
- **`revalidatePath`** the route(s) whose rendered data changed, after the mutation.
- Don't put business logic in the action — it orchestrates validate → store → revalidate only.

## 2. The leaf client component

The form is a `'use client'` leaf wired with `useActionState`. The generated-file header comment goes **above** the directive.

```tsx
"use client";

import { useActionState } from "react";

import { addTransaction, type AddTransactionState } from "@/app/actions";
import { Card, Field, Input } from "@/components/ui";

const initialState: AddTransactionState = { status: "idle" };

export function ReportNoteForm() {
  const [state, formAction, pending] = useActionState(addTransaction, initialState);
  const fieldErrors = state.status === "error" ? state.fieldErrors : undefined;

  return (
    <Card as="section" aria-label="Add note">
      <form action={formAction} className="mt-4 space-y-4">
        <Field label="Name" htmlFor="note-name" error={fieldErrors?.name?.[0]}>
          <Input id="note-name" name="name" maxLength={60} />
        </Field>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-700 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {pending ? "Saving…" : "Save"}
        </button>

        <p aria-live="polite" className="min-h-4 text-xs">
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
```

Rules:

- **`'use client'` only here**, at the leaf. The page renders `<ReportNoteForm />` and stays a server component.
- **Submit via `action={formAction}`** — never an `onSubmit` doing `fetch`.
- Use `components/ui/` primitives (`Field`, `Input`, `Select`, `Textarea`, `Card`) — `Field` wires `htmlFor`/`error` for accessibility. Don't hand-roll labels.
- Surface validation feedback through `state.fieldErrors` and an `aria-live` region, mirroring `transaction-form.tsx`.
- Named export, kebab-case filename, props typed inline — no `any`.
