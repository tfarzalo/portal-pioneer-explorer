
import { MapPin, Calendar, Users, Clock, Home } from 'lucide-react';
import { GoogleMap } from './GoogleMap';

interface JobInformationProps {
  jobData: {
    property_name?: string;
    property_address?: string;
    scheduled_date: string | null;
    unit_number: string;
    job_type: string;
    phase: string;
  };
  theme: 'dark' | 'light';
  formatDate: (dateString: string | null) => string;
  onSubmitUpdate?: () => void;
}

export const JobInformation = ({ jobData, theme, formatDate, onSubmitUpdate }: JobInformationProps) => {
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  // Format job type to be capitalized
  const formatJobType = (type: string): string => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get current status based on phase
  const getStatusText = (phase: string): string => {
    // Format the phase for display
    const formattedPhase = phase
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return `Job ${formattedPhase}`;
  };

  // Format date for display in the scheduled work date section
  const formatScheduledDate = (date: string | null): string => {
    if (!date) return 'Not Scheduled';
    
    const d = new Date(date);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    return d.toLocaleDateString('en-US', options);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-1/2 h-64">
        {jobData.property_address && (
          <GoogleMap address={jobData.property_address} theme={theme} />
        )}
      </div>
      
      <div className="w-full md:w-1/2">
        <div className={`p-6 rounded-lg ${cardBg} h-full border ${borderColor}`}>
          <h2 className="text-lg font-bold mb-4">CURRENT JOB STATUS</h2>
          
          <div className="mb-6">
            <div className="p-2 border border-gray-300 rounded flex items-center justify-between">
              <span>{getStatusText(jobData.phase)}</span>
              <span className="text-gray-400">▼</span>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-bold mb-2">JOB TYPE</h3>
            <div className="p-2 border border-gray-300 rounded">
              {formatJobType(jobData.job_type)}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-bold mb-2">SCHEDULED WORK DATE</h3>
            <div className="p-2 border border-gray-300 rounded">
              {formatScheduledDate(jobData.scheduled_date)}
            </div>
          </div>
          
          {onSubmitUpdate && (
            <button 
              onClick={onSubmitUpdate}
              className="w-full p-3 bg-red-500 hover:bg-red-600 text-white rounded"
            >
              Submit Update
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
