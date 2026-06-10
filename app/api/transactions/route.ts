import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import { z } from "zod";

import { summarize } from "@/lib/aggregate";
import {
  listFiltersSchema,
  toNewTransaction,
  transactionInputSchema,
} from "@/lib/schemas";
import { addTransaction, listTransactions } from "@/lib/store";

export async function GET(request: NextRequest) {
  const parsed = listFiltersSchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams),
  );

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid filters", details: z.flattenError(parsed.error).fieldErrors },
      { status: 400 },
    );
  }

  const transactions = listTransactions(parsed.data);
  return Response.json({ transactions, summary: summarize(transactions) });
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Malformed JSON body" }, { status: 400 });
  }

  const parsed = transactionInputSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", details: z.flattenError(parsed.error).fieldErrors },
      { status: 400 },
    );
  }

  const created = addTransaction(toNewTransaction(parsed.data));
  revalidatePath("/");
  return Response.json(created, { status: 201 });
}
