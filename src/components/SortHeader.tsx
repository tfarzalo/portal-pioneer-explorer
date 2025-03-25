
import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { SortDirection, SortField } from '../utils/sortJobs';

interface SortHeaderProps {
  label: string;
  field: SortField;
  currentSortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  textColorClass: string;
}

export const SortHeader: React.FC<SortHeaderProps> = ({
  label,
  field,
  currentSortField,
  sortDirection,
  onSort,
  textColorClass
}) => {
  const isActive = currentSortField === field;
  
  return (
    <th 
      className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${textColorClass} cursor-pointer`}
      onClick={() => onSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        {isActive ? (
          sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
        ) : (
          <div className="w-3.5" /> // Empty space for alignment
        )}
      </div>
    </th>
  );
};
