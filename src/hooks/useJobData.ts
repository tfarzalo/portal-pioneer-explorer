
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import { JobPhase, JobType } from '../types/workOrder';

export interface JobData {
  id: string;
  job_number: string;
  property_id: string | null;
  unit_number: string;
  job_type: JobType;
  phase: JobPhase;
  scheduled_date: string | null;
  submitted_by: string | null;
  base_amount: number | null;
  total_amount: number | null;
  description: string | null;
  created_at: string | null;
  property_name?: string;
  property_address?: string;
}

export const useJobData = (jobId: string | undefined) => {
  const [jobData, setJobData] = useState<JobData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (jobId) {
      fetchJobDetails(jobId);
    }
  }, [jobId]);

  const fetchJobDetails = async (jobId: string) => {
    setLoading(true);
    try {
      console.log('Fetching job details for ID:', jobId);
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          properties (property_name, property_address)
        `)
        .eq('id', jobId)
        .single();

      if (error) {
        console.error('Error fetching job details:', error);
        toast.error('Failed to load job details.');
        setLoading(false);
        return;
      }

      if (data) {
        console.log('Retrieved job data:', data);
        // Ensure job_type is one of the allowed types from the database
        const jobType = ['paint', 'callback', 'repair'].includes(data.job_type) 
          ? data.job_type as JobType 
          : 'paint' as JobType; // Default to 'paint' if type is not recognized

        setJobData({
          id: data.id,
          job_number: data.job_number,
          property_id: data.property_id,
          unit_number: data.unit_number,
          job_type: jobType,
          phase: data.phase as JobPhase,
          scheduled_date: data.scheduled_date,
          submitted_by: data.submitted_by,
          base_amount: data.base_amount,
          total_amount: data.total_amount,
          description: data.description,
          created_at: data.created_at,
          property_name: data.properties?.property_name || 'N/A',
          property_address: data.properties?.property_address || 'N/A'
        });
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
      toast.error('Failed to load job details.');
    } finally {
      setLoading(false);
    }
  };

  return { jobData, loading, fetchJobDetails };
};
