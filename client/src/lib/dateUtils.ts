import { format, addDays, nextMonday } from "date-fns";

/**
 * Get the date of the next Monday
 * @returns Date object representing the next Monday
 */
export function getNextMonday(): Date {
  return nextMonday(new Date());
}

/**
 * Format a date in different styles
 * @param date The date to format
 * @param style The formatting style: 'short', 'medium', or 'full'
 * @returns Formatted date string
 */
export function formatDate(date: Date, style: 'short' | 'medium' | 'full'): string {
  if (style === 'short') {
    return format(date, 'EEE, MMM d, yyyy');
  } else if (style === 'medium') {
    return format(date, 'EEEE, MMMM d, yyyy');
  } else if (style === 'full') {
    return format(date, 'EEEE, MMMM d, yyyy');
  }
  
  return format(date, 'yyyy-MM-dd');
}

/**
 * Get a range of dates for the publishing schedule
 * @param startDate The starting date
 * @param count Number of dates to generate
 * @param daysOfWeek Array of days of the week (0 = Sunday, 1 = Monday, etc.)
 * @returns Array of dates
 */
export function getPublishingScheduleDates(startDate: Date, count: number, daysOfWeek: number[]): Date[] {
  const dates: Date[] = [];
  let currentDate = new Date(startDate);
  
  while (dates.length < count) {
    if (daysOfWeek.includes(currentDate.getDay())) {
      dates.push(new Date(currentDate));
    }
    currentDate = addDays(currentDate, 1);
  }
  
  return dates;
}
