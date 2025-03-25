
import { Calendar } from 'lucide-react';
import { formatDateForInput, formatScheduledDate } from '../../utils/formatters';

interface ScheduledDatePickerProps {
  selectedDate: string | null;
  onChange: (date: string | null) => void;
  theme: 'dark' | 'light';
}

export const ScheduledDatePicker = ({ 
  selectedDate, 
  onChange, 
  theme 
}: ScheduledDatePickerProps) => {
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-600/40' : 'border-gray-300/70';
  
  // Format date for the input field (YYYY-MM-DD)
  const formattedDate = formatDateForInput(selectedDate);
  
  // Display formatted date if available
  const displayDate = selectedDate ? formatScheduledDate(selectedDate) : 'No date selected';
  
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value ? event.target.value : null;
    console.log('Date changed to:', newDate);
    
    // Pass the selected date to parent component in ISO format for database storage
    // This format works with Supabase date columns (YYYY-MM-DD)
    onChange(newDate);
  };

  return (
    <div className="relative">
      <h3 className={`font-bold mb-2 ${textColor} text-base`}>SCHEDULED WORK DATE</h3>
      <div className={`p-2.5 border ${borderColor} rounded-md flex items-center ${inputBg} shadow-sm transition-all duration-200 hover:border-gray-400`}>
        <input
          type="date"
          value={formattedDate}
          onChange={handleDateChange}
          className={`w-full ${inputBg} ${textColor} focus:outline-none text-sm`}
          aria-label="Select scheduled work date"
        />
        <Calendar className={mutedTextColor} size={18} />
      </div>
      <div className="mt-1.5">
        <span className={`text-xs ${mutedTextColor}`}>{displayDate} (Eastern Time)</span>
      </div>
    </div>
  );
};
