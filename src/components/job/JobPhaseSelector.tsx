
import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { JobPhase, JOB_PHASE_COLORS } from '../../types/workOrder';

interface JobPhaseSelectorProps {
  selectedPhase: JobPhase;
  onChange: (phase: JobPhase) => void;
  theme: 'dark' | 'light';
}

export const JobPhaseSelector = ({ 
  selectedPhase, 
  onChange, 
  theme 
}: JobPhaseSelectorProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-600/40' : 'border-gray-300/70';
  
  const jobPhases: JobPhase[] = [
    'job_request',
    'work_order',
    'pending_work_order',
    'grading',
    'invoicing',
    'completed',
    'cancelled'
  ];

  const getStatusText = (phase: JobPhase): string => {
    const formattedPhase = phase
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return formattedPhase;
  };

  const handlePhaseChange = (phase: JobPhase) => {
    onChange(phase);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      <h3 className={`font-bold mb-2 ${textColor} text-base`}>JOB STATUS</h3>
      <div 
        className={`p-2.5 border ${borderColor} rounded-md flex items-center justify-between cursor-pointer ${inputBg} shadow-sm transition-all duration-200 hover:border-gray-400`}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <span className={`${textColor} text-sm`}>{getStatusText(selectedPhase)}</span>
        <ChevronDown className={mutedTextColor} size={18} />
      </div>
      
      {isDropdownOpen && (
        <div className={`absolute z-10 w-full mt-1 py-1 ${inputBg} border ${borderColor} rounded-md shadow-lg`}>
          {jobPhases.map((phase) => {
            const phaseColors = JOB_PHASE_COLORS[phase];
            
            return (
              <div
                key={phase}
                className={`px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center justify-between ${
                  phase === selectedPhase ? 'bg-gray-700' : ''
                }`}
                onClick={() => handlePhaseChange(phase)}
              >
                <span className={`${phaseColors.text} text-sm`}>{getStatusText(phase)}</span>
                {phase === selectedPhase && <Check size={16} className={phaseColors.text} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
