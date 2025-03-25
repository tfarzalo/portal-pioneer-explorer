
import { Calendar } from 'lucide-react';
import { formatDateForInput } from '../../utils/formatters';

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
  
  // Format date for the input field
  const formattedDate = formatDateForInput(selectedDate);
  
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value ? event.target.value : null;
    console.log('Date changed to:', newDate);
    onChange(newDate);
  };

  return (
    <div className="mb-6">
      <h3 className={`font-bold mb-2 ${textColor}`}>SCHEDULED WORK DATE</h3>
      <div className={`p-2 border border-gray-300 rounded flex items-center ${inputBg}`}>
        <input
          type="date"
          value={formattedDate}
          onChange={handleDateChange}
          className={`w-full ${inputBg} ${textColor} focus:outline-none`}
        />
        <Calendar className={mutedTextColor} size={18} />
      </div>
    </div>
  );
};
