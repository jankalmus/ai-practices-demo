"use client";

import { useFormStatus } from "react-dom";

import { TrashIcon } from "@/components/icons";

export function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-label="Delete transaction"
      className={`rounded-md p-1.5 text-zinc-400 transition hover:bg-rose-50 hover:text-rose-600 focus-visible:opacity-100 dark:hover:bg-rose-950 dark:hover:text-rose-400 ${
        pending ? "animate-pulse opacity-100" : "sm:opacity-0 sm:group-hover:opacity-100"
      }`}
    >
      <TrashIcon />
    </button>
  );
}
