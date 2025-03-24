import React from 'react';
import type { JobPhase } from '../types/workOrder';
import { JOB_PHASE_COLORS } from '../types/workOrder';

interface JobPhaseIndicatorProps {
  theme: 'dark' | 'light';
  currentPhase: JobPhase;
}

export function JobPhaseIndicator({ theme, currentPhase }: JobPhaseIndicatorProps) {
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';

  const phases: JobPhase[] = [
    'Job Request',
    'Work Order',
    'Pending Work Order',
    'Grading',
    'Invoicing',
    'Completed',
    'Cancelled'
  ];

  const currentPhaseIndex = phases.indexOf(currentPhase);

  return (
    <div className="flex items-center space-x-4">
      {phases.map((phase, index) => (
        <React.Fragment key={phase}>
          <div className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index <= currentPhaseIndex
                  ? `${JOB_PHASE_COLORS[phase].bgOpacity} ${JOB_PHASE_COLORS[phase].text}`
                  : `${mutedTextColor} bg-gray-800/50`
              }`}
            >
              {index + 1}
            </div>
            <span
              className={
                index <= currentPhaseIndex 
                  ? JOB_PHASE_COLORS[phase].text 
                  : mutedTextColor
              }
            >
              {phase}
            </span>
          </div>
          {index < phases.length - 1 && (
            <div
              className={`h-0.5 w-8 ${
                index < currentPhaseIndex
                  ? JOB_PHASE_COLORS[phases[index + 1]].bgOpacity
                  : 'bg-gray-700'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}