import { useState } from 'react';
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

interface JobDetailsProps {
  theme: 'dark' | 'light';
}

const JobDetails = ({ theme }: JobDetailsProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'details' | 'photos' | 'notes'>('details');
  const [showExtraCharges, setShowExtraCharges] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const headerBg = theme === 'dark' ? 'bg-gray-50' : 'bg-gray-50';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';

  const handleExtraChargesClick = () => {
    setShowExtraCharges(true);
    console.log('Extra charges button clicked');
  };

  const handleExportOptionsClick = () => {
    setShowExportOptions(true);
    console.log('Export options button clicked');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className={textColor} size={28} />
          <h1 className={`text-2xl font-bold ${textColor}`}>Job #{id}</h1>
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
                <p className={`font-medium ${textColor}`}>511 Queens</p>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${headerBg} flex items-center space-x-2`}>
              <Calendar className={mutedTextColor} size={18} />
              <div>
                <p className={`text-xs ${mutedTextColor}`}>Scheduled</p>
                <p className={`font-medium ${textColor}`}>June 15, 2023</p>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${headerBg} flex items-center space-x-2`}>
              <Users className={mutedTextColor} size={18} />
              <div>
                <p className={`text-xs ${mutedTextColor}`}>Crew</p>
                <p className={`font-medium ${textColor}`}>Team Alpha</p>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${headerBg} flex items-center space-x-2`}>
              <Clock className={mutedTextColor} size={18} />
              <div>
                <p className={`text-xs ${mutedTextColor}`}>Status</p>
                <p className={`font-medium text-yellow-500`}>In Progress</p>
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
          <p className={mutedTextColor}>This is a detailed job description...</p>
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
                <span className={`font-medium ${textColor}`}>John Doe</span>
                <span className={mutedTextColor}>June 10, 2023</span>
              </div>
              <p className={mutedTextColor}>Initial assessment complete. Ready for scheduling.</p>
            </div>
            
            <div className={`p-4 rounded-lg ${headerBg}`}>
              <div className="flex justify-between">
                <span className={`font-medium ${textColor}`}>Jane Smith</span>
                <span className={mutedTextColor}>June 12, 2023</span>
              </div>
              <p className={mutedTextColor}>Customer requested blue paint instead of gray.</p>
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
    </div>
  );
};

export default JobDetails;
