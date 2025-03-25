
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
  const borderColor = theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/70';
  
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
    console.log('Updating job type to:', type);
    setSelectedType(type);
    setHasChanges(true);
  };
  
  const handleDateChange = (newDate: string | null) => {
    console.log('Updating scheduled date to:', newDate);
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
      
      const { error, data } = await supabase
        .from('jobs')
        .update({ 
          phase: selectedPhase,
          job_type: selectedType,
          scheduled_date: selectedDate
        })
        .eq('id', jobData.id)
        .select();
          
      console.log('Update response:', { error, data });
      
      if (error) {
        console.error('Error updating job details:', error);
        toast.error('Failed to update job details');
        setIsLoading(false);
        return;
      }
      
      if (jobData.phase !== selectedPhase) {
        const { error: phaseUpdateError } = await supabase.rpc('update_job_phase', {
          job_id: jobData.id,
          new_phase: selectedPhase,
          reason: 'Updated via job details form'
        });
        
        if (phaseUpdateError) {
          console.error('Error updating job phase history:', phaseUpdateError);
          toast.warning('Job updated but failed to log phase change');
        }
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
    <div className="flex flex-col md:flex-row gap-4 h-[420px]">
      <div className="w-full md:w-2/3 h-full">
        {jobData.property_address && (
          <div className="h-full">
            <GoogleMap address={jobData.property_address} theme={theme} />
          </div>
        )}
      </div>
      
      <div className="w-full md:w-1/3 h-full">
        <div className={`p-6 rounded-lg ${cardBg} h-full border ${borderColor} shadow-sm`}>
          <h2 className={`text-lg font-bold mb-4 ${textColor}`}>CURRENT JOB STATUS</h2>
          
          <div className="space-y-4 flex flex-col h-[calc(100%-80px)] justify-between">
            <div className="space-y-4">
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
            </div>
            
            {onSubmitUpdate && (
              <div className="mt-2">
                <JobUpdateButton 
                  onClick={handleSubmitChanges}
                  isLoading={isLoading}
                  hasChanges={hasChanges}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
