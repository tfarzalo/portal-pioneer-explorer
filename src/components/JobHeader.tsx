
import { FileText, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { JobPhaseIndicator } from './JobPhaseIndicator';
import { JobPhase } from '../types/workOrder';

interface JobHeaderProps {
  jobData: {
    job_number: string;
    phase: string;
  };
  theme: 'dark' | 'light';
}

export const JobHeader = ({ jobData, theme }: JobHeaderProps) => {
  const navigate = useNavigate();
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <FileText className={textColor} size={28} />
        <h1 className={`text-2xl font-bold ${textColor}`}>{jobData.job_number}</h1>
        {jobData.phase && (
          <div className="ml-4">
            <JobPhaseIndicator phase={jobData.phase as JobPhase} />
          </div>
        )}
      </div>
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
      >
        <ArrowLeft size={20} />
        <span>Go Back</span>
      </button>
    </div>
  );
};
