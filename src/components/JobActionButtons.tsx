
import { AlertTriangle, Download, Trash2, Edit, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import { useState } from 'react';

interface JobActionButtonsProps {
  jobId: string;
  theme: 'dark' | 'light';
  onExtraChargesClick: () => void;
  onExportOptionsClick: () => void;
}

export const JobActionButtons = ({ jobId, theme, onExtraChargesClick, onExportOptionsClick }: JobActionButtonsProps) => {
  const navigate = useNavigate();
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDeleteJob = async () => {
    if (confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      setIsDeleting(true);
      console.log('Attempting to delete job with ID:', jobId);
      
      try {
        // First check if the job exists
        const { data: jobExists, error: checkError } = await supabase
          .from('jobs')
          .select('id')
          .eq('id', jobId)
          .single();
          
        if (checkError) {
          console.error('Error checking job existence:', checkError);
          toast.error('Failed to verify job details.');
          setIsDeleting(false);
          return;
        }
        
        if (!jobExists) {
          console.error('Job not found:', jobId);
          toast.error('Job not found in the database.');
          setIsDeleting(false);
          return;
        }
        
        console.log('Job found, proceeding with deletion');
        
        // Now attempt to delete
        const { error } = await supabase
          .from('jobs')
          .delete()
          .eq('id', jobId);
        
        if (error) {
          console.error('Error deleting job:', error);
          toast.error(`Failed to delete job: ${error.message}`);
          return;
        }
        
        console.log('Job successfully deleted');
        toast.success('Job deleted successfully');
        navigate('/jobs');
      } catch (error) {
        console.error('Unexpected error deleting job:', error);
        toast.error('An unexpected error occurred while deleting the job.');
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  return (
    <div className="flex justify-end space-x-4">
      <button
        className={`px-4 py-2 rounded-lg border ${borderColor} ${mutedTextColor} hover:bg-gray-700 transition-colors flex items-center space-x-2`}
        onClick={onExtraChargesClick}
      >
        <AlertTriangle size={18} />
        <span>Extra Charges</span>
      </button>
      
      <button
        className={`px-4 py-2 rounded-lg border ${borderColor} ${mutedTextColor} hover:bg-gray-700 transition-colors flex items-center space-x-2`}
        onClick={onExportOptionsClick}
      >
        <Download size={18} />
        <span>Export</span>
      </button>
      
      <button
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
        onClick={handleDeleteJob}
        disabled={isDeleting}
      >
        <Trash2 size={18} />
        <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
      </button>
      
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        onClick={() => navigate(`/jobs/${jobId}/edit`)}
      >
        <Edit size={18} />
        <span>Edit</span>
      </button>
      
      <button
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        onClick={() => navigate(`/jobs/${jobId}/work-order/new`)}
      >
        <Send size={18} />
        <span>Create Work Order</span>
      </button>
    </div>
  );
};
