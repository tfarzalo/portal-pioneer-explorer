
import { AlertTriangle, Download, Trash2, Edit, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
        onClick={() => navigate('/jobs')}
      >
        <Trash2 size={18} />
        <span>Delete</span>
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
