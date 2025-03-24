
import { useState, useEffect } from 'react';
import { 
  FileText, 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users, 
  Clock, 
  Edit, 
  Trash2, 
  Send, 
  Download, 
  Camera, 
  Upload, 
  Plus, 
  AlertTriangle 
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExportOptions } from '../components/ExportOptions';
import { ExtraChargesModal } from '../components/ExtraChargesModal';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import { JobPhaseIndicator } from '../components/JobPhaseIndicator';

interface JobDetailsProps {
  theme: 'dark' | 'light';
}

interface JobData {
  id: string;
  job_number: string;
  property_id: string | null;
  unit_number: string;
  job_type: string;
  phase: string;
  scheduled_date: string | null;
  submitted_by: string | null;
  base_amount: number | null;
  total_amount: number | null;
  description: string | null;
  created_at: string | null;
  property_name?: string;
  property_address?: string;
}

const JobDetails = ({ theme }: JobDetailsProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobData, setJobData] = useState<JobData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'photos' | 'notes'>('details');
  const [showExtraCharges, setShowExtraCharges] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const headerBg = theme === 'dark' ? 'bg-gray-50' : 'bg-gray-50';

  useEffect(() => {
    if (id) {
      fetchJobDetails(id);
    }
  }, [id]);

  const fetchJobDetails = async (jobId: string) => {
    setLoading(true);
    try {
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
        return;
      }

      if (data) {
        setJobData({
          id: data.id,
          job_number: data.job_number,
          property_id: data.property_id,
          unit_number: data.unit_number,
          job_type: data.job_type,
          phase: data.phase,
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

  const mockWorkOrderData = {
    workOrderNumber: jobData?.job_number ? `WO-${jobData.job_number}` : '',
    property: jobData?.property_name || '',
    unit: jobData?.unit_number || '',
    description: jobData?.description || '',
    baseAmount: jobData?.base_amount || 0,
    extraCharges: [
      {
        type: 'Additional Paint',
        location: 'Living Room',
        amount: 120.00,
        description: 'Extra coat required due to dark previous color'
      }
    ],
    totalAmount: jobData?.total_amount || 0
  };

  const handleExtraChargesClick = () => {
    setShowExtraCharges(true);
    console.log('Extra charges button clicked');
  };

  const handleExportOptionsClick = () => {
    setShowExportOptions(true);
    console.log('Export options button clicked');
  };

  const handleCloseExtraCharges = () => {
    setShowExtraCharges(false);
  };

  const handleSendExtraCharges = (data: any) => {
    console.log('Sending extra charges notification with data:', data);
    setShowExtraCharges(false);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not scheduled';
    
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className={`text-lg ${textColor}`}>Loading job details...</p>
      </div>
    );
  }

  if (!jobData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className={`text-lg ${textColor}`}>Job not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className={textColor} size={28} />
          <h1 className={`text-2xl font-bold ${textColor}`}>{jobData.job_number}</h1>
          {jobData.phase && (
            <div className="ml-4">
              <JobPhaseIndicator phase={jobData.phase as any} />
            </div>
          )}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
        >
          <ArrowLeft size={20} />
          <span>Go Back</span>
        </button>
      </div>

      <div className={`${cardBg} p-6 rounded-lg border ${borderColor}`}>
        <div className="space-y-4">
          <h2 className={`text-xl font-semibold ${textColor}`}>Job Information</h2>
          
          <div className="flex flex-wrap gap-4">
            <div className={`p-4 rounded-lg ${headerBg} flex items-center space-x-2`}>
              <MapPin className={mutedTextColor} size={18} />
              <div>
                <p className={`text-xs ${mutedTextColor}`}>Property</p>
                <p className={`font-medium ${textColor}`}>{jobData.property_name}</p>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${headerBg} flex items-center space-x-2`}>
              <Calendar className={mutedTextColor} size={18} />
              <div>
                <p className={`text-xs ${mutedTextColor}`}>Scheduled</p>
                <p className={`font-medium ${textColor}`}>{formatDate(jobData.scheduled_date)}</p>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${headerBg} flex items-center space-x-2`}>
              <Users className={mutedTextColor} size={18} />
              <div>
                <p className={`text-xs ${mutedTextColor}`}>Unit</p>
                <p className={`font-medium ${textColor}`}>{jobData.unit_number || 'N/A'}</p>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${headerBg} flex items-center space-x-2`}>
              <Clock className={mutedTextColor} size={18} />
              <div>
                <p className={`text-xs ${mutedTextColor}`}>Type</p>
                <p className={`font-medium ${textColor}`}>{jobData.job_type}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex border-b border-gray-700 mb-4">
        <button
          className={`px-4 py-2 border-b-2 ${
            activeTab === 'details' 
              ? 'border-blue-500 text-blue-500' 
              : `border-transparent ${mutedTextColor}`
          }`}
          onClick={() => setActiveTab('details')}
        >
          Details
        </button>
        <button
          className={`px-4 py-2 border-b-2 ${
            activeTab === 'photos' 
              ? 'border-blue-500 text-blue-500' 
              : `border-transparent ${mutedTextColor}`
          }`}
          onClick={() => setActiveTab('photos')}
        >
          Photos
        </button>
        <button
          className={`px-4 py-2 border-b-2 ${
            activeTab === 'notes' 
              ? 'border-blue-500 text-blue-500' 
              : `border-transparent ${mutedTextColor}`
          }`}
          onClick={() => setActiveTab('notes')}
        >
          Notes
        </button>
      </div>
      
      {activeTab === 'details' && (
        <div className={`${cardBg} p-6 rounded-lg border ${borderColor}`}>
          <h3 className={`text-lg font-semibold ${textColor} mb-4`}>Job Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className={`${mutedTextColor} text-sm`}>Description</p>
              <p className={textColor}>{jobData.description || 'No description provided'}</p>
            </div>
            {jobData.base_amount && (
              <div>
                <p className={`${mutedTextColor} text-sm`}>Base Amount</p>
                <p className={textColor}>${jobData.base_amount.toFixed(2)}</p>
              </div>
            )}
            {jobData.total_amount && (
              <div>
                <p className={`${mutedTextColor} text-sm`}>Total Amount</p>
                <p className={textColor}>${jobData.total_amount.toFixed(2)}</p>
              </div>
            )}
            <div>
              <p className={`${mutedTextColor} text-sm`}>Created</p>
              <p className={textColor}>{jobData.created_at ? new Date(jobData.created_at).toLocaleString() : 'N/A'}</p>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'photos' && (
        <div className={`${cardBg} p-6 rounded-lg border ${borderColor}`}>
          <h3 className={`text-lg font-semibold ${textColor} mb-4`}>Job Photos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
              <Camera size={24} className={mutedTextColor} />
            </div>
            <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
              <Upload size={24} className={mutedTextColor} />
            </div>
            <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-700">
              <Plus size={24} className={mutedTextColor} />
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'notes' && (
        <div className={`${cardBg} p-6 rounded-lg border ${borderColor}`}>
          <h3 className={`text-lg font-semibold ${textColor} mb-4`}>Job Notes</h3>
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${headerBg}`}>
              <div className="flex justify-between">
                <span className={`font-medium ${textColor}`}>System</span>
                <span className={mutedTextColor}>{jobData.created_at ? formatDate(jobData.created_at) : 'N/A'}</span>
              </div>
              <p className={mutedTextColor}>Job created in phase: {jobData.phase}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-end space-x-4">
        <button
          className={`px-4 py-2 rounded-lg border ${borderColor} ${mutedTextColor} hover:bg-gray-700 transition-colors flex items-center space-x-2`}
          onClick={handleExtraChargesClick}
        >
          <AlertTriangle size={18} />
          <span>Extra Charges</span>
        </button>
        
        <button
          className={`px-4 py-2 rounded-lg border ${borderColor} ${mutedTextColor} hover:bg-gray-700 transition-colors flex items-center space-x-2`}
          onClick={handleExportOptionsClick}
        >
          <Download size={18} />
          <span>Export</span>
        </button>
        
        <button
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          onClick={() => navigate('/jobs')}
        >
          <Trash2 size={18} />
          <span>Delete</span>
        </button>
        
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          onClick={() => navigate(`/jobs/${id}/edit`)}
        >
          <Edit size={18} />
          <span>Edit</span>
        </button>
        
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          onClick={() => navigate(`/jobs/${id}/work-order/new`)}
        >
          <Send size={18} />
          <span>Create Work Order</span>
        </button>
      </div>
      
      {showExportOptions && (
        <ExportOptions
          theme={theme}
          data={[{ id: jobData.id, scheduledDate: jobData.scheduled_date, date: jobData.created_at }]}
          columns={[{ header: 'ID', accessor: 'id' }]}
          filename={`job_${jobData.job_number}`}
          isVisible={showExportOptions}
        />
      )}
      
      {showExtraCharges && (
        <ExtraChargesModal
          theme={theme}
          isOpen={showExtraCharges}
          onClose={handleCloseExtraCharges}
          onSend={handleSendExtraCharges}
          workOrderData={mockWorkOrderData}
          recipientEmail="property.manager@example.com"
        />
      )}
    </div>
  );
};

export default JobDetails;
