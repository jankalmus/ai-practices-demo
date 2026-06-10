import type { Category } from "./categories";
import type { Transaction } from "./schemas";

type SeedTemplate = {
  day: number;
  type: "income" | "expense";
  name: string;
  description?: string;
  amountCents: number;
  category: Category;
  /** Month offsets this entry appears in (0 = current month). Defaults to all three. */
  months?: number[];
};

const TEMPLATES: SeedTemplate[] = [
  { day: 1, type: "income", name: "Monthly salary", description: "Acme Oy payroll", amountCents: 385_000, category: "Salary" },
  { day: 15, type: "income", name: "Freelance invoice", description: "Website audit for Nordic Retail", amountCents: 92_000, category: "Freelance", months: [1, 2] },
  { day: 8, type: "income", name: "ETF dividend", description: "Quarterly distribution", amountCents: 4_530, category: "Investments", months: [0, 2] },
  { day: 3, type: "expense", name: "Rent", description: "Apartment, city centre", amountCents: 125_000, category: "Housing" },
  { day: 5, type: "expense", name: "Electricity", description: "Eesti Energia", amountCents: 8_640, category: "Utilities" },
  { day: 7, type: "expense", name: "Internet", description: "Telia 1 Gbit", amountCents: 3_999, category: "Utilities" },
  { day: 2, type: "expense", name: "Spotify", amountCents: 1_199, category: "Entertainment" },
  { day: 4, type: "expense", name: "Gym membership", description: "MyFitness", amountCents: 4_500, category: "Health" },
  { day: 6, type: "expense", name: "Groceries", description: "Rimi weekly shop", amountCents: 7_845, category: "Food" },
  { day: 13, type: "expense", name: "Groceries", description: "Coop weekly shop", amountCents: 6_920, category: "Food" },
  { day: 20, type: "expense", name: "Groceries", description: "Rimi weekly shop", amountCents: 8_310, category: "Food" },
  { day: 27, type: "expense", name: "Groceries", description: "Selver weekly shop", amountCents: 7_480, category: "Food" },
  { day: 10, type: "expense", name: "Fuel", description: "Circle K", amountCents: 6_500, category: "Transport" },
  { day: 18, type: "expense", name: "Bolt rides", amountCents: 1_840, category: "Transport" },
  { day: 21, type: "expense", name: "Cinema night", description: "Apollo Kino, two tickets", amountCents: 2_400, category: "Entertainment", months: [0, 1] },
  { day: 16, type: "expense", name: "Pharmacy", amountCents: 1_875, category: "Health", months: [1] },
  { day: 22, type: "expense", name: "New running shoes", amountCents: 8_990, category: "Shopping", months: [1] },
  { day: 24, type: "expense", name: "Birthday gift", description: "For Maria", amountCents: 3_500, category: "Shopping", months: [2] },
  { day: 26, type: "expense", name: "Train to Tartu", amountCents: 1_180, category: "Transport", months: [2] },
  { day: 9, type: "expense", name: "Team lunch", description: "Pizza with the dev team", amountCents: 1_650, category: "Food", months: [0] },
];

function toIsoDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * Builds demo data for the current and two previous months from fixed
 * day-of-month templates, skipping dates in the future so totals look real.
 */
export function createSeedData(now: Date = new Date()): Transaction[] {
  const today = toIsoDate(now);
  const transactions: Transaction[] = [];

  for (let offset = 0; offset < 3; offset++) {
    for (const template of TEMPLATES) {
      if (template.months && !template.months.includes(offset)) continue;

      const date = new Date(now.getFullYear(), now.getMonth() - offset, template.day);
      const isoDate = toIsoDate(date);
      if (isoDate > today) continue;

      transactions.push({
        id: crypto.randomUUID(),
        type: template.type,
        name: template.name,
        description: template.description,
        amountCents: template.amountCents,
        date: isoDate,
        category: template.category,
      });
    }
  }

  return transactions;
}
