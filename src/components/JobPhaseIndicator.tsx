
import { JobPhase, JOB_PHASE_COLORS } from '../types/workOrder';

interface JobPhaseIndicatorProps {
  phase: JobPhase;
  size?: 'sm' | 'md' | 'lg';
}

export function JobPhaseIndicator({ phase, size = 'md' }: JobPhaseIndicatorProps) {
  // Format the phase for display by converting underscores to spaces and capitalizing
  const formatPhase = (phase: JobPhase): string => {
    // For phases with underscores, convert to proper format (e.g., "job_request" to "Job Request")
    if (phase.includes('_')) {
      return phase
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    
    // For phases already in proper format, return as is
    return phase;
  };
  
  // Safely get colors with fallback to prevent errors
  const getPhaseColors = (phase: JobPhase) => {
    if (JOB_PHASE_COLORS[phase]) {
      return JOB_PHASE_COLORS[phase];
    }
    
    // Fallback to a default color scheme
    return {
      bgOpacity: 'bg-gray-200/10',
      border: 'border-gray-200',
      text: 'text-gray-500'
    };
  };
  
  const phaseColors = getPhaseColors(phase);
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };

  return (
    <div className={`inline-flex items-center rounded-full ${phaseColors.bgOpacity} ${phaseColors.border} border ${phaseColors.text} ${sizeClasses[size]}`}>
      <span className="font-medium">{formatPhase(phase)}</span>
    </div>
  );
}
