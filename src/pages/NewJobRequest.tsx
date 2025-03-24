import { 
  FileText, 
  ArrowLeft, 
  Building2, 
  Calendar 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NewJobRequestProps {
  theme: 'dark' | 'light';
}

export function NewJobRequest({ theme }: NewJobRequestProps) {
  const navigate = useNavigate();
  
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className={textColor} size={28} />
          <h1 className={`text-2xl font-bold ${textColor}`}>New Job Request</h1>
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
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                <Building2 size={16} className="inline mr-2" />
                Property
              </label>
              <select
                className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                required
              >
                <option value="">Select a property</option>
                <option value="1">511 Queens</option>
                <option value="2">Affinity at Hudson</option>
                <option value="3">Alexan Research Park</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                Unit Number
              </label>
              <input
                type="text"
                placeholder="Enter unit number"
                className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                <Calendar size={16} className="inline mr-2" />
                Requested Date
              </label>
              <input
                type="date"
                className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                Job Type
              </label>
              <select
                className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                required
              >
                <option value="">Select job type</option>
                <option value="Paint">Paint</option>
                <option value="Callback">Callback</option>
                <option value="Repair">Repair</option>
              </select>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${textColor}`}>
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Enter job description"
              className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
              required
            ></textarea>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${textColor}`}>
              Special Instructions
            </label>
            <textarea
              rows={3}
              placeholder="Enter any special instructions"
              className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                Requested By
              </label>
              <input
                type="text"
                placeholder="Enter name"
                className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                Contact Email
              </label>
              <input
                type="email"
                placeholder="Enter email"
                className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit Job Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
