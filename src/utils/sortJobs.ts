
export type SortDirection = 'asc' | 'desc';
export type SortField = 'job_number' | 'property_name' | 'unit_number' | 'job_type' | 'phase' | 'scheduled_date';

// Function to sort job data by the specified field and direction
export const sortJobs = (jobs: any[], field: SortField, direction: SortDirection): any[] => {
  return [...jobs].sort((a, b) => {
    // Special handling for dates
    if (field === 'scheduled_date') {
      const dateA = a[field] ? new Date(a[field]).getTime() : 0;
      const dateB = b[field] ? new Date(b[field]).getTime() : 0;
      return direction === 'asc' ? dateA - dateB : dateB - dateA;
    }
    
    // Special handling for nested property names
    if (field === 'property_name') {
      const valueA = a[field] || '';
      const valueB = b[field] || '';
      return direction === 'asc' 
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
    
    // General case for strings
    if (typeof a[field] === 'string' && typeof b[field] === 'string') {
      return direction === 'asc' 
        ? a[field].localeCompare(b[field])
        : b[field].localeCompare(a[field]);
    }
    
    // General case for other types
    const valueA = a[field] || '';
    const valueB = b[field] || '';
    return direction === 'asc' ? valueA - valueB : valueB - valueA;
  });
};
