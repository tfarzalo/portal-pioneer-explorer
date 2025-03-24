import { XCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CancelledProps {
  theme: 'dark' | 'light';
}

export function Cancelled({ theme }: CancelledProps) {
  const navigate = useNavigate();
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const cardBorder = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <XCircle className={textColor} size={28} />
          <h1 className={`text-2xl font-bold ${textColor}`}>Cancelled Jobs</h1>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
        >
          <ArrowLeft size={20} />
          <span>Go Back</span>
        </button>
      </div>

      <div className={`${cardBg} p-6 rounded-lg border ${cardBorder}`}>
        {/* Content here */}
      </div>
    </div>
  );
}
