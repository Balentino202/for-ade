import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// `cn` — shadcn/ui's canonical class merger.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Picks a random index in [0, length) that differs from `previous`, so a
// message generator never shows the same entry twice in a row.
export function randomIndexExcept(length: number, previous: number | null) {
  if (length <= 1) return 0;
  let next = Math.floor(Math.random() * (length - 1));
  if (previous !== null && next >= previous) next += 1;
  return next;
}
