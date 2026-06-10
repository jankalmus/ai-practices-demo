import { revalidatePath } from "next/cache";

import { deleteTransaction, getTransaction } from "@/lib/store";

// params is a Promise in Next 16. After `next dev`/`next typegen` has run,
// the generated RouteContext<'/api/transactions/[id]'> helper can replace
// this inline type.
type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Context) {
  const { id } = await context.params;
  const transaction = getTransaction(id);

  if (!transaction) {
    return Response.json({ error: "Transaction not found" }, { status: 404 });
  }
  return Response.json(transaction);
}

export async function DELETE(_request: Request, context: Context) {
  const { id } = await context.params;

  if (!deleteTransaction(id)) {
    return Response.json({ error: "Transaction not found" }, { status: 404 });
  }
  revalidatePath("/");
  return new Response(null, { status: 204 });
}
