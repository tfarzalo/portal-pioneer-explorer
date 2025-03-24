
/**
 * Formats a date string to a readable format
 * @param dateString The date string to format
 * @returns Formatted date string or a fallback message
 */
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'Not scheduled';
  
  try {
    // Create a date object and handle timezone issues
    const date = new Date(dateString);
    
    // Apply timezone offset to ensure date is displayed correctly
    const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    
    return utcDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};
