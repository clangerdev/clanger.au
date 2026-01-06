import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency for Australian dollars
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(amount);
}

// Format number with commas
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-AU").format(num);
}

// Format salary (e.g., 10000 -> "$10.0K")
export function formatSalary(salary: number): string {
  return `$${(salary / 1000).toFixed(1)}K`;
}
