
import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { JobType } from '../../types/workOrder';

interface JobTypeSelectorProps {
  selectedType: JobType;
  onChange: (type: JobType) => void;
  theme: 'dark' | 'light';
}

export const JobTypeSelector = ({ 
  selectedType, 
  onChange, 
  theme 
}: JobTypeSelectorProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  
  const jobTypes: JobType[] = [
    'paint',
    'callback',
    'repair'
  ];

  const formatJobType = (type: string): string => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleTypeChange = (type: JobType) => {
    onChange(type);
    setIsDropdownOpen(false);
  };

  return (
    <div className="mb-6">
      <h3 className={`font-bold mb-2 ${textColor}`}>JOB TYPE</h3>
      <div 
        className={`p-2 border border-gray-300 rounded flex items-center justify-between cursor-pointer ${inputBg}`}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <span className={textColor}>{formatJobType(selectedType)}</span>
        <ChevronDown className={mutedTextColor} />
      </div>
      
      {isDropdownOpen && (
        <div className={`absolute z-10 w-full max-w-[calc(50%-3rem)] mt-1 py-1 ${inputBg} border ${borderColor} rounded-md shadow-lg`}>
          {jobTypes.map((type) => (
            <div
              key={type}
              className={`px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center justify-between ${
                type === selectedType ? 'bg-gray-700' : ''
              }`}
              onClick={() => handleTypeChange(type)}
            >
              <span className={textColor}>{formatJobType(type)}</span>
              {type === selectedType && <Check size={16} className={textColor} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
