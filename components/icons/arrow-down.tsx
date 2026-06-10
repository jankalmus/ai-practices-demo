export function ArrowDownIcon({
  className = "size-4",
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      aria-hidden
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25"
      />
    </svg>
  );
}
