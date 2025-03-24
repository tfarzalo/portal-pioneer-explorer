
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
