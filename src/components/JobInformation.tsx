
import { useState } from 'react';
import { Calendar, Check, ChevronDown } from 'lucide-react';
import { GoogleMap } from './GoogleMap';
import { JOB_PHASE_COLORS, JobPhase, JobType } from '../types/workOrder';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import { formatDateForInput } from '../utils/formatters';

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
}

export const JobInformation = ({ 
  jobData, 
  theme, 
  onSubmitUpdate
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
  const [selectedPhase, setSelectedPhase] = useState<JobPhase>(jobData.phase);
  const [selectedType, setSelectedType] = useState<JobType>(jobData.job_type);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Format date for the input field
  const formattedDate = formatDateForInput(selectedDate);
  
  const jobPhases: JobPhase[] = [
    'job_request',
    'work_order',
    'pending_work_order',
    'grading',
    'invoicing',
    'completed',
    'cancelled'
  ];
  
  const jobTypes: JobType[] = [
    'paint',
    'callback',
    'repair'
  ];

  const formatJobType = (type: string): string => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getStatusText = (phase: JobPhase): string => {
    const formattedPhase = phase
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return formattedPhase;
  };

  const updateJobPhase = async (phase: JobPhase) => {
    setSelectedPhase(phase);
    setHasChanges(true);
    setIsPhaseDropdownOpen(false);
  };
  
  const updateJobType = async (type: JobType) => {
    setSelectedType(type);
    setHasChanges(true);
    setIsTypeDropdownOpen(false);
  };
  
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value ? event.target.value : null;
    console.log('Date changed to:', newDate);
    setSelectedDate(newDate);
    setHasChanges(true);
  };

  const handleSubmitChanges = async () => {
    setIsLoading(true);
    try {
      console.log('Submitting changes:', {
        job_id: jobData.id,
        new_phase: selectedPhase,
        job_type: selectedType,
        scheduled_date: selectedDate
      });
      
      // First, use the update_job_phase function to properly log phase changes if phase has changed
      if (jobData.phase !== selectedPhase) {
        const { error: phaseUpdateError } = await supabase.rpc('update_job_phase', {
          job_id: jobData.id,
          new_phase: selectedPhase,
          reason: 'Updated via job details form'
        });
        
        if (phaseUpdateError) {
          console.error('Error updating job phase:', phaseUpdateError);
          toast.error('Failed to update job phase');
          setIsLoading(false);
          return;
        }
      }
      
      // Then update the remaining job details (job_type and scheduled_date)
      const { error } = await supabase
        .from('jobs')
        .update({ 
          job_type: selectedType,
          scheduled_date: selectedDate
        })
        .eq('id', jobData.id);
        
      if (error) {
        console.error('Error updating job:', error);
        toast.error('Failed to update job');
        return;
      }
      
      setHasChanges(false);
      toast.success('Job updated successfully');
      if (onSubmitUpdate) {
        onSubmitUpdate();
      }
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error('Failed to update job');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-2/3 h-64">
        {jobData.property_address && (
          <GoogleMap address={jobData.property_address} theme={theme} />
        )}
      </div>
      
      <div className="w-full md:w-1/3">
        <div className={`p-6 rounded-lg ${cardBg} h-full border ${borderColor}`}>
          <h2 className={`text-lg font-bold mb-4 ${textColor}`}>CURRENT JOB STATUS</h2>
          
          <div className="mb-6 relative">
            <div 
              className={`p-2 border border-gray-300 rounded flex items-center justify-between cursor-pointer ${inputBg}`}
              onClick={() => setIsPhaseDropdownOpen(!isPhaseDropdownOpen)}
            >
              <span className={textColor}>{getStatusText(selectedPhase)}</span>
              <ChevronDown className={mutedTextColor} />
            </div>
            
            {isPhaseDropdownOpen && (
              <div className={`absolute z-10 w-full mt-1 py-1 ${inputBg} border ${borderColor} rounded-md shadow-lg`}>
                {jobPhases.map((phase) => {
                  const phaseColors = JOB_PHASE_COLORS[phase];
                  
                  return (
                    <div
                      key={phase}
                      className={`px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center justify-between ${
                        phase === selectedPhase ? 'bg-gray-700' : ''
                      }`}
                      onClick={() => updateJobPhase(phase)}
                    >
                      <span className={phaseColors.text}>{getStatusText(phase)}</span>
                      {phase === selectedPhase && <Check size={16} className={phaseColors.text} />}
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
              <span className={textColor}>{formatJobType(selectedType)}</span>
              <ChevronDown className={mutedTextColor} />
            </div>
            
            {isTypeDropdownOpen && (
              <div className={`absolute z-10 w-full max-w-[calc(50%-3rem)] mt-1 py-1 ${inputBg} border ${borderColor} rounded-md shadow-lg`}>
                {jobTypes.map((type) => (
                  <div
                    key={type}
                    className={`px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center justify-between ${
                      type === selectedType ? 'bg-gray-700' : ''
                    }`}
                    onClick={() => updateJobType(type)}
                  >
                    <span className={textColor}>{formatJobType(type)}</span>
                    {type === selectedType && <Check size={16} className={textColor} />}
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
                value={formattedDate}
                onChange={handleDateChange}
                className={`w-full ${inputBg} ${textColor} focus:outline-none`}
              />
              <Calendar className={mutedTextColor} size={18} />
            </div>
          </div>
          
          {onSubmitUpdate && (
            <button 
              onClick={handleSubmitChanges}
              disabled={isLoading || !hasChanges}
              className={`w-full p-3 bg-red-500 hover:bg-red-600 text-white rounded flex items-center justify-center ${
                (isLoading || !hasChanges) ? 'opacity-50 cursor-not-allowed' : ''
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
