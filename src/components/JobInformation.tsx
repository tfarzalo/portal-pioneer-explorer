
import { MapPin, Calendar, Users, Clock, Home } from 'lucide-react';
import { GoogleMap } from './GoogleMap';

interface JobInformationProps {
  jobData: {
    property_name?: string;
    property_address?: string;
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
  const headerBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50';

  // Format job type to be capitalized
  const formatJobType = (type: string): string => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-semibold ${textColor}`}>Job Information</h2>
      
      <div className="flex flex-wrap gap-4">
        <div className={`p-4 rounded-lg ${headerBg} flex items-center space-x-2`}>
          <MapPin className={mutedTextColor} size={18} />
          <div>
            <p className={`text-xs ${mutedTextColor}`}>Property</p>
            <p className={`font-medium ${textColor}`}>{jobData.property_name || 'N/A'}</p>
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
            <p className={`font-medium ${textColor}`}>{formatJobType(jobData.job_type)}</p>
          </div>
        </div>

        {jobData.property_address && (
          <div className={`p-4 rounded-lg ${headerBg} flex items-center space-x-2`}>
            <Home className={mutedTextColor} size={18} />
            <div>
              <p className={`text-xs ${mutedTextColor}`}>Address</p>
              <p className={`font-medium ${textColor}`}>{jobData.property_address}</p>
            </div>
          </div>
        )}
      </div>
      
      {jobData.property_address && (
        <div className="mt-6">
          <h3 className={`text-lg font-medium ${textColor} mb-3`}>Property Location</h3>
          <GoogleMap address={jobData.property_address} theme={theme} />
        </div>
      )}
    </div>
  );
};
