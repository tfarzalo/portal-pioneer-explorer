
import { PropertyDetails } from '../../types';

interface CompliancePanelProps {
  propertyDetails: PropertyDetails;
  theme: 'dark' | 'light';
}

export function CompliancePanel({ propertyDetails, theme }: CompliancePanelProps) {
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`${cardBg} rounded-lg border ${borderColor} p-6`}>
      <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Compliance Status</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className={mutedTextColor}>Status</span>
          <span className={`px-2 py-1 rounded-full text-xs ${
            propertyDetails.compliance.status === 'Compliant'
              ? 'bg-green-500/20 text-green-500'
              : 'bg-red-500/20 text-red-500'
          }`}>
            {propertyDetails.compliance.status}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className={mutedTextColor}>Last Inspection</span>
          <span className={textColor}>{propertyDetails.compliance.lastInspection}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className={mutedTextColor}>COI Status</span>
          <span className={textColor}>{propertyDetails.compliance.coiAddress}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className={mutedTextColor}>W9 Status</span>
          <span className={textColor}>{propertyDetails.compliance.w9Status}</span>
        </div>
      </div>
    </div>
  );
}
