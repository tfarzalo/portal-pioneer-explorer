
import { Building2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AddPropertyProps {
  theme: 'dark' | 'light';
}

export function AddProperty({ theme }: AddPropertyProps) {
  const navigate = useNavigate();
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-600' : 'border-gray-300';
  const labelColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-700';
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const cardBorder = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Building2 className={textColor} size={28} />
          <h1 className={`text-2xl font-bold ${textColor}`}>Add New Property</h1>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
        >
          <ArrowLeft size={20} />
          <span>Go Back</span>
        </button>
      </div>
      
      <form className="space-y-6">
        <div className={`${cardBg} p-6 rounded-lg border ${cardBorder}`}>
          <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Property Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${labelColor}`}>Property Name</label>
              <input
                type="text"
                className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                placeholder="Enter property name"
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${labelColor}`}>Property Type</label>
              <select
                className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                required
              >
                <option value="">Select property type...</option>
                <option value="apartment">Apartment</option>
                <option value="commercial">Commercial</option>
                <option value="residential">Residential</option>
              </select>
            </div>
          </div>
        </div>

        <div className={`${cardBg} p-6 rounded-lg border ${cardBorder}`}>
          <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Location Details</h2>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${labelColor}`}>Street Address</label>
              <input
                type="text"
                className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                placeholder="Enter street address"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${labelColor}`}>City</label>
                <input
                  type="text"
                  className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                  placeholder="Enter city"
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${labelColor}`}>State</label>
                <input
                  type="text"
                  className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                  placeholder="Enter state"
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${labelColor}`}>ZIP Code</label>
                <input
                  type="text"
                  className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                  placeholder="Enter ZIP code"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className={`${cardBg} p-6 rounded-lg border ${cardBorder}`}>
          <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${labelColor}`}>Contact Name</label>
              <input
                type="text"
                className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                placeholder="Enter contact name"
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${labelColor}`}>Contact Phone</label>
              <input
                type="tel"
                className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                placeholder="Enter contact phone"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className={`block text-sm font-medium mb-2 ${labelColor}`}>Contact Email</label>
              <input
                type="email"
                className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                placeholder="Enter contact email"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Add Property
          </button>
        </div>
      </form>
    </div>
  );
}
