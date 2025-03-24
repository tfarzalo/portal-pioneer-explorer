import { Folder } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { JOB_PHASE_COLORS, JobPhase } from '../types/workOrder';

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
  
  // Get phase-specific color or default to yellow
  const getPhaseColor = (phase: JobPhase) => {
    if (JOB_PHASE_COLORS[phase]) {
      return JOB_PHASE_COLORS[phase].border.replace('border-', 'border-t-');
    }
    return 'border-t-yellow-300';
  };
  
  const phaseColor = getPhaseColor(jobData.phase);
  
  return (
    <div className={`w-full bg-yellow-300 py-4 px-6 flex items-center justify-between rounded-t-lg border-t-4 ${phaseColor}`}>
      <div className="flex items-center space-x-3">
        <Folder className={textColor} size={24} />
        <div>
          <h1 className={`text-xl font-bold ${textColor}`}>WO#{jobData.job_number} | {jobData.property_name || 'N/A'}</h1>
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
