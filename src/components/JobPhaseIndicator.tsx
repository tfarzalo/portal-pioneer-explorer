
import { JobPhase, JOB_PHASE_COLORS } from '../types/workOrder';

interface JobPhaseIndicatorProps {
  phase: JobPhase;
  size?: 'sm' | 'md' | 'lg';
}

export function JobPhaseIndicator({ phase, size = 'md' }: JobPhaseIndicatorProps) {
  const phaseColors = JOB_PHASE_COLORS[phase];
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };

  return (
    <div className={`inline-flex items-center rounded-full ${phaseColors.bgOpacity} ${phaseColors.border} border ${phaseColors.text} ${sizeClasses[size]}`}>
      <span className="font-medium">{phase}</span>
    </div>
  );
}
