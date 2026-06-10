const baseClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-400 dark:focus:ring-zinc-700";

export function Input({
  className = "",
  ...props
}: React.ComponentProps<"input">) {
  return <input className={`${baseClass} ${className}`} {...props} />;
}

export function Select({
  className = "",
  ...props
}: React.ComponentProps<"select">) {
  return <select className={`${baseClass} ${className}`} {...props} />;
}

export function Textarea({
  className = "",
  ...props
}: React.ComponentProps<"textarea">) {
  return <textarea className={`${baseClass} resize-none ${className}`} {...props} />;
}
