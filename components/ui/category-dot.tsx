import { CATEGORY_COLORS, type Category } from "@/lib/categories";

export function CategoryDot({
  category,
  className = "size-2.5",
}: {
  category: Category;
  className?: string;
}) {
  return (
    <span
      className={`shrink-0 rounded-full ${CATEGORY_COLORS[category]} ${className}`}
      aria-hidden
    />
  );
}
