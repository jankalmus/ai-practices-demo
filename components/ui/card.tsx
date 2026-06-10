type CardProps = React.HTMLAttributes<HTMLElement> & {
  /** Rendered element — use "section" together with aria-label for landmark regions. */
  as?: "div" | "section";
};

export function Card({ as: Tag = "div", className = "", ...props }: CardProps) {
  return (
    <Tag
      className={`rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 ${className}`}
      {...props}
    />
  );
}
