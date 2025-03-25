
import { PropertyDetails } from '../../types';

interface PaintDetailsPanelProps {
  propertyDetails: PropertyDetails;
  theme: 'dark' | 'light';
}

export function PaintDetailsPanel({ propertyDetails, theme }: PaintDetailsPanelProps) {
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const sectionBg = theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50';

  return (
    <div className={`${cardBg} rounded-lg border ${borderColor} p-6`}>
      <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Paint Details</h2>
      <div className="space-y-4">
        <div>
          <h3 className={`text-sm font-medium ${mutedTextColor} mb-2`}>Paint Locations</h3>
          <div className="flex flex-wrap gap-2">
            {propertyDetails.paintDetails.locations.map((location) => (
              <span 
                key={location}
                className={`px-3 py-1 rounded-full text-xs ${sectionBg} ${textColor}`}
              >
                {location}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className={`text-sm font-medium ${mutedTextColor} mb-2`}>Paint Selections</h3>
          <div className="space-y-2">
            {Object.entries(propertyDetails.paintDetails.selections).map(([surface, color]) => (
              <div key={surface} className="flex items-center justify-between">
                <span className={`capitalize ${mutedTextColor}`}>{surface}</span>
                <span className={textColor}>{String(color)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
