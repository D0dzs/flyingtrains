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

export function getCurrentDelay(stops: any, now: number) {
  for (const stop of stops) {
    const arrivalTime = stop.ra; // realtimeArrival in seconds since midnight
    if (arrivalTime > now) {
      return stop.a || stop.d || 0; // Prefer arrival delay, fallback to departure
    }
  }
  // Fallback: use last known stop
  const lastStop = stops[stops.length - 1];
  return lastStop ? (lastStop.a || lastStop.d || 0) : 0;
}
