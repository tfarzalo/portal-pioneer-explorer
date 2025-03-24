
/**
 * Formats a date string to a readable format
 * @param dateString The date string to format
 * @returns Formatted date string or a fallback message
 */
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'Not scheduled';
  
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};
