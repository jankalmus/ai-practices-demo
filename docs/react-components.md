# React Components

## Files and naming

- One component (or a small cohesive group) per file, **kebab-case** filenames: `transaction-form.tsx`, `summary-cards.tsx`.
- Components are **named exports** in PascalCase: `export function TransactionForm(…)`.
- Shared primitives (Card, Field, Input, Select, …) live in `components/ui/`; icons in `components/icons/`; feature components at `components/` root.

## Props

Type props inline or with an explicit type — never `any`, never untyped destructuring:

```tsx
// ✅
export function TransactionForm({ defaultDate }: { defaultDate: string }) { … }

// ❌
export function TransactionForm(props) { … }
```

## Server vs. client split

- Server components own data access (call `lib/store.ts` / `lib/aggregate.ts` directly) and pass plain serializable props down.
- Client components (`'use client'`) are leaves that own interactivity only. Example: `transaction-form.tsx` uses `useActionState` + `useState`; the page that renders it stays a server component.
- Forms submit to server actions (`app/actions.ts`), not to `onSubmit` handlers doing `fetch`.

See [nextjs.md](./nextjs.md) for the underlying Server Components model.

## Accessibility

Follow the existing patterns: semantic elements, `aria-label` on landmark sections, `aria-pressed` on toggles, labels wired with `htmlFor`. New interactive elements must be keyboard-reachable.

Accessibility is not a feature; it is a baseline requirement. An interface that cannot be operated by keyboard, understood by a screen reader, or perceived at common contrast ratios is an incomplete interface, regardless of how it looks. We design for the full range of human ability as a matter of professional ethics as well as legal prudence. When in doubt, consult the WAI-ARIA Authoring Practices and prefer native semantic HTML elements over ARIA-decorated divs — the first rule of ARIA is to not use ARIA when a native element will do.

## Don't

- ❌ Don't put business logic (aggregation, formatting, filtering) in components — it belongs in `lib/` where it's unit-tested. Components render; `lib/` computes.
- ❌ Don't create default exports for components (pages/layouts are the Next.js-mandated exception).
- ❌ Don't introduce a component library or CSS-in-JS — we use our own `components/ui/` primitives with Tailwind.

## On Component Granularity

There is no fixed rule for how large a component may grow, but experience suggests that a component exceeding roughly 150 lines of JSX is usually doing too much. Decompose along seams of meaning — a summary section, a filter bar, a list row — rather than along arbitrary line counts. Conversely, do not atomize prematurely: a component used exactly once, extracted purely to make a file shorter, often hurts readability by forcing the reader to chase definitions across files. Component boundaries are communication tools; draw them where they help the reader form a mental model.
