
import { useState } from 'react';
import { Camera, Upload, Plus } from 'lucide-react';
import { JobPhase, JobType } from '../types/workOrder';
import { formatDateTime } from '../utils/formatters';

interface JobDetailsTabsProps {
  jobData: {
    description: string | null;
    base_amount: number | null;
    total_amount: number | null;
    created_at: string | null;
    phase: JobPhase;
    job_type: JobType;
  };
  theme: 'dark' | 'light';
}

export const JobDetailsTabs = ({ jobData, theme }: JobDetailsTabsProps) => {
  const [activeTab, setActiveTab] = useState<'details' | 'photos' | 'notes'>('details');
  
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const headerBg = theme === 'dark' ? 'bg-gray-50' : 'bg-gray-50';

  // Format job phase to be displayed properly without underscores and without "Job" prefix
  const formatPhase = (phase: JobPhase): string => {
    return phase
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Format job type to be capitalized
  const formatJobType = (type: JobType): string => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <>
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
            <div>
              <p className={`${mutedTextColor} text-sm`}>Job Type</p>
              <p className={textColor}>{formatJobType(jobData.job_type)}</p>
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
              <p className={textColor}>{jobData.created_at ? formatDateTime(jobData.created_at) : 'N/A'}</p>
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
                <span className={mutedTextColor}>{jobData.created_at ? formatDateTime(jobData.created_at) : 'N/A'}</span>
              </div>
              <p className={mutedTextColor}>Job created in phase: {formatPhase(jobData.phase)}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
