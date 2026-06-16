# Styling

## Tailwind 4, utility-first

All styling is Tailwind utility classes in JSX. Global CSS lives only in `app/globals.css` (Tailwind setup + design tokens). No CSS modules, no styled-components, no inline `style` attributes (except truly dynamic values like computed bar widths).

## Class literals must be complete

Tailwind only generates classes it can see as full literals. Never build class names by concatenation — this is already a hard rule in `lib/categories.ts` (`CATEGORY_COLORS`):

```tsx
// ✅ full class names in a lookup table
const CATEGORY_COLORS: Record<Category, string> = { Salary: "bg-emerald-500", … };

// ❌ `bg-${color}-500`  — purged away, silently unstyled
```

## Conventions

- Conditional styling via template literals over complete class strings (see the type toggle in `components/transaction-form.tsx`).
- Dark mode is supported with `dark:` variants — every new surface needs both light and dark styles, matching neighbors (`bg-zinc-100 dark:bg-zinc-800` patterns).
- Reuse `components/ui/` primitives (Card, Field, Input, …) before writing new bare markup with repeated class stacks.
- Keep class lists in a consistent order: layout → spacing → typography → color → states/variants. Small, consistent scale: `text-xs`/`text-sm`, `rounded-md`/`rounded-lg`, zinc neutrals.

## Don't

- ❌ Don't add new colors for categories ad hoc — extend `CATEGORY_COLORS` so the legend, bars, and dots stay in sync.
- ❌ Don't introduce a UI kit (shadcn, MUI, …) — extend `components/ui/` instead.
- ❌ Don't add custom CSS files per component.