import type { ListFilters, Transaction } from "./schemas";
import { createSeedData } from "./seed";

type LedgerStore = { transactions: Transaction[] };

// Stashed on globalThis so the data survives Turbopack HMR module reloads in
// dev. Pages, server actions and route handlers share one process, so they
// all see the same store.
const globalScope = globalThis as typeof globalThis & {
  __ledgerStore?: LedgerStore;
};

function getStore(): LedgerStore {
  return (globalScope.__ledgerStore ??= { transactions: createSeedData() });
}

export function listTransactions(filters: ListFilters = {}): Transaction[] {
  return getStore()
    .transactions.filter(
      (tx) =>
        (!filters.type || tx.type === filters.type) &&
        (!filters.category || tx.category === filters.category) &&
        (!filters.month || tx.date.startsWith(filters.month)),
    )
    .sort(
      (a, b) => b.date.localeCompare(a.date) || a.name.localeCompare(b.name),
    );
}

export function getTransaction(id: string): Transaction | undefined {
  return getStore().transactions.find((tx) => tx.id === id);
}

export function addTransaction(input: Omit<Transaction, "id">): Transaction {
  const transaction: Transaction = { id: crypto.randomUUID(), ...input };
  getStore().transactions.push(transaction);
  return transaction;
}

export function deleteTransaction(id: string): boolean {
  const { transactions } = getStore();
  const index = transactions.findIndex((tx) => tx.id === id);
  if (index === -1) return false;
  transactions.splice(index, 1);
  return true;
}

/** Test hook: replace the store contents wholesale. */
export function resetStore(transactions: Transaction[] = []): void {
  globalScope.__ledgerStore = { transactions };
}
