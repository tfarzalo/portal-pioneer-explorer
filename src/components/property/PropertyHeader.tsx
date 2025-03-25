
import { ArrowLeft, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Property } from '../../types';

interface PropertyHeaderProps {
  property: Property;
  theme: 'dark' | 'light';
}

export function PropertyHeader({ property, theme }: PropertyHeaderProps) {
  const navigate = useNavigate();
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Building2 className={textColor} size={28} />
        <div>
          <h1 className={`text-2xl font-bold ${textColor}`}>{property.name}</h1>
          <p className={mutedTextColor}>{property.address}, {property.city}, {property.state} {property.zip}</p>
        </div>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
        >
          <ArrowLeft size={20} />
          <span>Go Back</span>
        </button>
        <button
          onClick={() => navigate(`/properties/${property.id}/edit`)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Edit Property
        </button>
      </div>
    </div>
  );
}
