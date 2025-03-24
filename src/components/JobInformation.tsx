
import { MapPin, Calendar, Users, Clock } from 'lucide-react';

interface JobInformationProps {
  jobData: {
    property_name?: string;
    scheduled_date: string | null;
    unit_number: string;
    job_type: string;
  };
  theme: 'dark' | 'light';
  formatDate: (dateString: string | null) => string;
}

export const JobInformation = ({ jobData, theme, formatDate }: JobInformationProps) => {
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const headerBg = theme === 'dark' ? 'bg-gray-50' : 'bg-gray-50';

  return (
    <div className="space-y-4">
      <h2 className={`text-xl font-semibold ${textColor}`}>Job Information</h2>
      
      <div className="flex flex-wrap gap-4">
        <div className={`p-4 rounded-lg ${headerBg} flex items-center space-x-2`}>
          <MapPin className={mutedTextColor} size={18} />
          <div>
            <p className={`text-xs ${mutedTextColor}`}>Property</p>
            <p className={`font-medium ${textColor}`}>{jobData.property_name}</p>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${headerBg} flex items-center space-x-2`}>
          <Calendar className={mutedTextColor} size={18} />
          <div>
            <p className={`text-xs ${mutedTextColor}`}>Scheduled</p>
            <p className={`font-medium ${textColor}`}>{formatDate(jobData.scheduled_date)}</p>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${headerBg} flex items-center space-x-2`}>
          <Users className={mutedTextColor} size={18} />
          <div>
            <p className={`text-xs ${mutedTextColor}`}>Unit</p>
            <p className={`font-medium ${textColor}`}>{jobData.unit_number || 'N/A'}</p>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${headerBg} flex items-center space-x-2`}>
          <Clock className={mutedTextColor} size={18} />
          <div>
            <p className={`text-xs ${mutedTextColor}`}>Type</p>
            <p className={`font-medium ${textColor}`}>{jobData.job_type}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
