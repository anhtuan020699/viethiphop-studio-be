import { format, addSeconds, isAfter } from 'date-fns';

/**
 * Format date to a readable string
 */
export function formatDate(date: Date, pattern = 'dd/MM/yyyy HH:mm:ss'): string {
  return format(date, pattern);
}

/**
 * Add seconds to a date (useful for token expiry calculation)
 */
export function addSecondsToDate(date: Date, seconds: number): Date {
  return addSeconds(date, seconds);
}

/**
 * Check if a date is expired (in the past)
 */
export function isExpired(date: Date): boolean {
  return !isAfter(date, new Date());
}

/**
 * Get current UTC timestamp as ISO string
 */
export function nowISO(): string {
  return new Date().toISOString();
}
