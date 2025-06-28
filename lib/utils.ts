import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(date: number): string {
  if (date == null) return '-';
  const h = String(Math.floor(date / 3600) % 24).padStart(2, '0');
  const m = String(Math.floor((date % 3600) / 60)).padStart(2, '0');
  return `${h}:${m}`;
}