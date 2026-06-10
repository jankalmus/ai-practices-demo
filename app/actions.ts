"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { toNewTransaction, transactionInputSchema } from "@/lib/schemas";
import * as store from "@/lib/store";

export type AddTransactionState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error";
      message?: string;
      fieldErrors?: Partial<Record<string, string[]>>;
    };

export async function addTransaction(
  _previous: AddTransactionState,
  formData: FormData,
): Promise<AddTransactionState> {
  const parsed = transactionInputSchema.safeParse(
    Object.fromEntries(formData),
  );

  if (!parsed.success) {
    const { fieldErrors, formErrors } = z.flattenError(parsed.error);
    return { status: "error", message: formErrors[0], fieldErrors };
  }

  store.addTransaction(toNewTransaction(parsed.data));
  revalidatePath("/");
  return { status: "success" };
}

export async function deleteTransaction(id: string): Promise<void> {
  store.deleteTransaction(id);
  revalidatePath("/");
}
