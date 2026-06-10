export function ScaleIcon({
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
        d="M12 3v18m-7.5-3h15M6 6.75L3.75 12h4.5L6 6.75zm12 0L15.75 12h4.5L18 6.75z"
      />
    </svg>
  );
}
