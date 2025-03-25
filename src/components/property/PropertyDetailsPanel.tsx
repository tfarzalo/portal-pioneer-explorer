
import { Mail, MapPin, Phone, Users } from 'lucide-react';
import { Property } from '../../types';

interface PropertyDetailsPanelProps {
  property: Property;
  theme: 'dark' | 'light';
}

export function PropertyDetailsPanel({ property, theme }: PropertyDetailsPanelProps) {
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  const contactInfo = {
    name: property.community_manager_name || property.maintenance_supervisor_name || 'Contact Name Not Available',
    role: property.maintenance_supervisor_name ? 'Maintenance Supervisor' : 'Community Manager',
    phone: property.community_manager_phone || property.maintenance_supervisor_phone || 'Phone Not Available',
    email: property.community_manager_email || property.maintenance_supervisor_email || 'Email Not Available'
  };

  return (
    <div className={`${cardBg} rounded-lg border ${borderColor} p-6`}>
      <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Property Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <MapPin className={mutedTextColor} size={20} />
            <div>
              <div className={`font-medium ${textColor}`}>Address</div>
              <div className={mutedTextColor}>{property.address}</div>
              <div className={mutedTextColor}>{property.city}, {property.state} {property.zip}</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Users className={mutedTextColor} size={20} />
            <div>
              <div className={`font-medium ${textColor}`}>Management Company</div>
              <div className={mutedTextColor}>{property.property_management_group || 'Not Specified'}</div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Phone className={mutedTextColor} size={20} />
            <div>
              <div className={`font-medium ${textColor}`}>Contact Phone</div>
              <div className={mutedTextColor}>{contactInfo.phone}</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Mail className={mutedTextColor} size={20} />
            <div>
              <div className={`font-medium ${textColor}`}>Contact Email</div>
              <div className={mutedTextColor}>{contactInfo.email}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
