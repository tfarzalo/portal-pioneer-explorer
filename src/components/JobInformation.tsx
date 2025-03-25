
import { useState } from 'react';
import { GoogleMap } from './GoogleMap';
import { JobPhase, JobType } from '../types/workOrder';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import { JobPhaseSelector } from './job/JobPhaseSelector';
import { JobTypeSelector } from './job/JobTypeSelector';
import { ScheduledDatePicker } from './job/ScheduledDatePicker';
import { JobUpdateButton } from './job/JobUpdateButton';

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
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  
  const [selectedDate, setSelectedDate] = useState<string | null>(jobData.scheduled_date);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<JobPhase>(jobData.phase);
  const [selectedType, setSelectedType] = useState<JobType>(jobData.job_type);
  const [hasChanges, setHasChanges] = useState(false);
  
  const updateJobPhase = (phase: JobPhase) => {
    setSelectedPhase(phase);
    setHasChanges(true);
  };
  
  const updateJobType = (type: JobType) => {
    setSelectedType(type);
    setHasChanges(true);
  };
  
  const handleDateChange = (newDate: string | null) => {
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
      
      // Then update the job_type and scheduled_date fields
      const { error } = await supabase
        .from('jobs')
        .update({ 
          job_type: selectedType,
          scheduled_date: selectedDate
        })
        .eq('id', jobData.id);
        
      if (error) {
        console.error('Error updating job details:', error);
        toast.error('Failed to update job details');
        setIsLoading(false);
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
          
          <JobPhaseSelector 
            selectedPhase={selectedPhase} 
            onChange={updateJobPhase} 
            theme={theme} 
          />
          
          <JobTypeSelector 
            selectedType={selectedType} 
            onChange={updateJobType} 
            theme={theme} 
          />
          
          <ScheduledDatePicker 
            selectedDate={selectedDate} 
            onChange={handleDateChange} 
            theme={theme} 
          />
          
          {onSubmitUpdate && (
            <JobUpdateButton 
              onClick={handleSubmitChanges}
              isLoading={isLoading}
              hasChanges={hasChanges}
            />
          )}
        </div>
      </div>
    </div>
  );
};
