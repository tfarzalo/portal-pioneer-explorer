
import { format, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

/**
 * Eastern Time Zone identifier
 */
export const TIMEZONE = 'America/New_York';

/**
 * Formats a date string to a readable format (Month Day, Year)
 * @param dateString The date string to format
 * @returns Formatted date string or a fallback message
 */
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'Not scheduled';
  
  try {
    // Parse the date string to a Date object
    const date = parseISO(dateString);
    
    // Convert to Eastern Time
    const easternDate = toZonedTime(date, TIMEZONE);
    
    // Format the date
    return format(easternDate, 'MMMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

/**
 * Formats a date specifically for scheduled dates display 
 * with consistent "Month Day, Year" format
 * @param dateString The date string to format
 * @returns Formatted date string or 'Not scheduled'
 */
export const formatScheduledDate = (dateString: string | null): string => {
  return formatDate(dateString);
};

/**
 * Formats a date to YYYY-MM-DD format for date inputs
 * @param dateString The date string to format
 * @returns Formatted date string in YYYY-MM-DD format or empty string
 */
export const formatDateForInput = (dateString: string | null): string => {
  if (!dateString) return '';
  
  try {
    // Parse the date
    const date = parseISO(dateString);
    
    // Format as YYYY-MM-DD for HTML date input (without time component)
    return format(date, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Error formatting date for input:', error);
    return '';
  }
};

/**
 * Formats a datetime for display in Eastern Time
 * @param dateString The date string to format
 * @returns Formatted date and time string or 'N/A'
 */
export const formatDateTime = (dateString: string | null): string => {
  if (!dateString) return 'N/A';
  
  try {
    // Parse the date string to a Date object
    const date = parseISO(dateString);
    
    // Convert to Eastern Time
    const easternDate = toZonedTime(date, TIMEZONE);
    
    // Format the date and time
    return format(easternDate, 'MMMM d, yyyy h:mm a');
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return 'N/A';
  }
};
