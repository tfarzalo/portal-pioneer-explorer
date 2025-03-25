
import { Plus } from 'lucide-react';
import { GoogleMap } from '../GoogleMap';

interface PropertyMapsProps {
  address: string;
  theme: 'dark' | 'light';
}

export function PropertyMaps({ address, theme }: PropertyMapsProps) {
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className={`${cardBg} rounded-lg border ${borderColor} p-6`}>
        <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Location Map</h2>
        <div className="aspect-video w-full rounded-lg overflow-hidden">
          <GoogleMap address={address} theme={theme} />
        </div>
      </div>

      <div className={`${cardBg} rounded-lg border ${borderColor} p-6`}>
        <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Property Map</h2>
        <div className="aspect-video w-full bg-gray-800 rounded-lg flex items-center justify-center">
          <div className={`text-center ${mutedTextColor}`}>
            <p className="mb-2">No property map available</p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto">
              <Plus size={20} />
              <span>Upload Map</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
