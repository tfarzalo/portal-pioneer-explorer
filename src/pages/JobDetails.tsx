
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ExportOptions } from '../components/ExportOptions';
import { ExtraChargesModal } from '../components/ExtraChargesModal';
import { JobHeader } from '../components/JobHeader';
import { JobInformation } from '../components/JobInformation';
import { JobDetailsTabs } from '../components/JobDetailsTabs';
import { JobActionButtons } from '../components/JobActionButtons';
import { useJobData } from '../hooks/useJobData';
import { formatDate } from '../utils/formatters';
import { toast } from 'sonner';

interface JobDetailsProps {
  theme: 'dark' | 'light';
}

const JobDetails = ({ theme }: JobDetailsProps) => {
  const { id } = useParams();
  const { jobData, loading } = useJobData(id);
  const [showExtraCharges, setShowExtraCharges] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';

  const mockWorkOrderData = {
    workOrderNumber: jobData?.job_number || '',
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

  const handleSubmitUpdate = () => {
    toast.success('Update submitted successfully');
    console.log('Submit update clicked');
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
      <div className={`rounded-lg overflow-hidden border ${borderColor}`}>
        <JobHeader jobData={jobData} theme={theme} />
        <div className="p-6 bg-white">
          <JobInformation 
            jobData={jobData} 
            theme={theme} 
            formatDate={formatDate} 
            onSubmitUpdate={handleSubmitUpdate}
          />
        </div>
      </div>
      
      <div className={`${cardBg} p-6 rounded-lg border ${borderColor}`}>
        <JobDetailsTabs jobData={jobData} theme={theme} formatDate={formatDate} />
      </div>
      
      <JobActionButtons 
        jobId={jobData.id} 
        theme={theme} 
        onExtraChargesClick={handleExtraChargesClick}
        onExportOptionsClick={handleExportOptionsClick}
      />
      
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
