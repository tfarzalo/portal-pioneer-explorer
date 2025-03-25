
/**
 * Formats a date string to a readable format
 * @param dateString The date string to format
 * @returns Formatted date string or a fallback message
 */
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'Not scheduled';
  
  try {
    // Parse the date without applying timezone conversion
    const date = new Date(dateString);
    
    // Format the date directly without timezone adjustments
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC' // Use UTC to prevent timezone shifts
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
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
    const date = new Date(dateString);
    
    // Get year, month, and day components
    const year = date.getUTCFullYear();
    // Month is 0-indexed in JS Date, so add 1
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    
    // Format as YYYY-MM-DD for HTML date input
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Error formatting date for input:', error);
    return '';
  }
};
