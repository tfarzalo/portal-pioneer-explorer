
import { useState } from 'react';
import { Calendar, Check, ChevronDown } from 'lucide-react';
import { GoogleMap } from './GoogleMap';
import { JOB_PHASE_COLORS, JobPhase, JobType } from '../types/workOrder';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

interface JobInformationProps {
  jobData: {
    id: string;
    property_name?: string;
    property_address?: string;
    scheduled_date: string | null;
    unit_number: string;
    job_type: JobType;
    phase: JobPhase;
  };
  theme: 'dark' | 'light';
  onSubmitUpdate?: () => void;
  refetchJobData: () => void;
}

export const JobInformation = ({ 
  jobData, 
  theme, 
  onSubmitUpdate,
  refetchJobData 
}: JobInformationProps) => {
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
  
  const [isPhaseDropdownOpen, setIsPhaseDropdownOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(jobData.scheduled_date);
  const [isLoading, setIsLoading] = useState(false);
  
  // Define job phases - use only the snake_case versions to match what's expected in the database
  const jobPhases: JobPhase[] = [
    'job_request',
    'work_order',
    'pending_work_order',
    'grading',
    'invoicing',
    'completed',
    'cancelled'
  ];
  
  // Common job types that match our JobType definition
  const jobTypes: JobType[] = [
    'full_paint',
    'touch_up',
    'wall_repair',
    'ceiling_repair',
    'cabinet_refinish',
    'exterior_paint',
    'paint',
    'callback',
    'repair'
  ];

  // Format job type to be capitalized
  const formatJobType = (type: string): string => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get current status based on phase
  const getStatusText = (phase: JobPhase): string => {
    // Format the phase for display
    const formattedPhase = phase
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return `Job ${formattedPhase}`;
  };

  // Update the job phase in the database
  const updateJobPhase = async (phase: JobPhase) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ phase })
        .eq('id', jobData.id);
        
      if (error) {
        console.error('Error updating job phase:', error);
        toast.error('Failed to update job phase');
        return;
      }
      
      toast.success('Job phase updated successfully');
      refetchJobData();
    } catch (error) {
      console.error('Error updating job phase:', error);
      toast.error('Failed to update job phase');
    } finally {
      setIsLoading(false);
      setIsPhaseDropdownOpen(false);
    }
  };
  
  // Update the job type in the database
  const updateJobType = async (type: JobType) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ job_type: type })
        .eq('id', jobData.id);
        
      if (error) {
        console.error('Error updating job type:', error);
        toast.error('Failed to update job type');
        return;
      }
      
      toast.success('Job type updated successfully');
      refetchJobData();
    } catch (error) {
      console.error('Error updating job type:', error);
      toast.error('Failed to update job type');
    } finally {
      setIsLoading(false);
      setIsTypeDropdownOpen(false);
    }
  };
  
  // Update the scheduled date in the database
  const updateScheduledDate = async (date: string | null) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ scheduled_date: date })
        .eq('id', jobData.id);
        
      if (error) {
        console.error('Error updating scheduled date:', error);
        toast.error('Failed to update scheduled date');
        return;
      }
      
      setSelectedDate(date);
      toast.success('Scheduled date updated successfully');
      refetchJobData();
    } catch (error) {
      console.error('Error updating scheduled date:', error);
      toast.error('Failed to update scheduled date');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle date change
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value ? event.target.value : null;
    updateScheduledDate(newDate);
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
          <h2 className={`text-lg font-bold mb-4 ${textColor}`}>CURRENT JOB STATUS</h2>
          
          <div className="mb-6 relative">
            <div 
              className={`p-2 border border-gray-300 rounded flex items-center justify-between cursor-pointer ${inputBg}`}
              onClick={() => setIsPhaseDropdownOpen(!isPhaseDropdownOpen)}
            >
              <span className={textColor}>{getStatusText(jobData.phase)}</span>
              <ChevronDown className={mutedTextColor} />
            </div>
            
            {isPhaseDropdownOpen && (
              <div className={`absolute z-10 w-full mt-1 py-1 ${inputBg} border ${borderColor} rounded-md shadow-lg`}>
                {jobPhases.map((phase) => {
                  // Cast phase to JobPhase for type safety - this is already correct since we defined jobPhases as JobPhase[]
                  const phaseColors = JOB_PHASE_COLORS[phase];
                  
                  return (
                    <div
                      key={phase}
                      className={`px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center justify-between ${
                        phase === jobData.phase ? 'bg-gray-700' : ''
                      }`}
                      onClick={() => updateJobPhase(phase)}
                    >
                      <span className={phaseColors.text}>{getStatusText(phase)}</span>
                      {phase === jobData.phase && <Check size={16} className={phaseColors.text} />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <h3 className={`font-bold mb-2 ${textColor}`}>JOB TYPE</h3>
            <div 
              className={`p-2 border border-gray-300 rounded flex items-center justify-between cursor-pointer ${inputBg}`}
              onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
            >
              <span className={textColor}>{formatJobType(jobData.job_type)}</span>
              <ChevronDown className={mutedTextColor} />
            </div>
            
            {isTypeDropdownOpen && (
              <div className={`absolute z-10 w-full max-w-[calc(50%-3rem)] mt-1 py-1 ${inputBg} border ${borderColor} rounded-md shadow-lg`}>
                {jobTypes.map((type) => (
                  <div
                    key={type}
                    className={`px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center justify-between ${
                      type === jobData.job_type ? 'bg-gray-700' : ''
                    }`}
                    onClick={() => updateJobType(type)}
                  >
                    <span className={textColor}>{formatJobType(type)}</span>
                    {type === jobData.job_type && <Check size={16} className={textColor} />}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <h3 className={`font-bold mb-2 ${textColor}`}>SCHEDULED WORK DATE</h3>
            <div className={`p-2 border border-gray-300 rounded flex items-center ${inputBg}`}>
              <input
                type="date"
                value={selectedDate || ''}
                onChange={handleDateChange}
                className={`w-full ${inputBg} ${textColor} focus:outline-none`}
              />
              <Calendar className={mutedTextColor} size={18} />
            </div>
          </div>
          
          {onSubmitUpdate && (
            <button 
              onClick={onSubmitUpdate}
              disabled={isLoading}
              className={`w-full p-3 bg-red-500 hover:bg-red-600 text-white rounded flex items-center justify-center ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Updating...' : 'Submit Update'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
