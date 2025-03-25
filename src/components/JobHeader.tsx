
import { Folder } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { JobPhase } from '../types/workOrder';

interface JobHeaderProps {
  jobData: {
    job_number: string;
    phase: JobPhase;
    property_name?: string;
    property_address?: string;
  };
  theme: 'dark' | 'light';
}

export const JobHeader = ({ jobData, theme }: JobHeaderProps) => {
  const navigate = useNavigate();
  const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const headerBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  
  // Format job number - remove any existing "WO#" prefix
  const formattedJobNumber = jobData.job_number.replace(/^WO#/i, '');
  
  return (
    <div className={`w-full ${headerBg} py-4 px-6 flex items-center justify-between rounded-t-lg`}>
      <div className="flex items-center space-x-3">
        <Folder className={textColor} size={24} />
        <div>
          <h1 className={`text-xl font-bold ${textColor}`}>
            {jobData.phase !== 'job_request' ? `WO#${formattedJobNumber}` : ''} 
            {jobData.property_name && `| ${jobData.property_name}`}
          </h1>
          {jobData.property_address && (
            <p className="text-gray-700 text-sm">| {jobData.property_address}</p>
          )}
        </div>
      </div>
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
      >
        <span>GO BACK</span>
      </button>
    </div>
  );
};
