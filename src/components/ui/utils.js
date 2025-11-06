import { clsx } from "clsx"; // Removed type import: type ClassValue
import { twMerge } from "tailwind-merge";

// Removed type annotation for parameter: : ClassValue[]
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}