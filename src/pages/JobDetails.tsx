import { useState } from 'react';
import { 
  FileText, 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users, 
  Clock, 
  CheckCircle, 
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

// Remove unused variables
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
  const headerBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50';

  return (
    <div>Job Details</div>
  );
}

export default JobDetails;
