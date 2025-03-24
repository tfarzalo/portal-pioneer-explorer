import React, { useState, useMemo } from 'react';
import { ArrowUpDown, Building2, MapPin, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PropertyProps {
  theme: 'dark' | 'light';
}

interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  managementCompany: string;
}

export function Properties({ theme }: PropertyProps) {
  const [sortField, setSortField] = useState<'name' | 'managementCompany'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const navigate = useNavigate();

  const properties: Property[] = [
    {
      id: '1',
      name: '511 Queens',
      address: '511 Queens Rd',
      city: 'Charlotte',
      state: 'NC',
      zip: '28207',
      managementCompany: 'RKW Residential'
    },
    {
      id: '2',
      name: 'Affinity at Hudson',
      address: '2348 Layman Dr',
      city: 'Gastonia',
      state: 'NC',
      zip: '28054',
      managementCompany: 'Greystar'
    },
    {
      id: '3',
      name: 'Affinity at Kendrick',
      address: '3308 Glade Dr',
      city: 'Gastonia',
      state: 'NC',
      zip: '28056',
      managementCompany: 'Greystar'
    },
    {
      id: '4',
      name: 'Alexan Research Park',
      address: '9821 Research Dr',
      city: 'Charlotte',
      state: 'NC',
      zip: '28262',
      managementCompany: 'Greystar'
    }
  ];

  const handleSort = (field: 'name' | 'managementCompany') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedProperties = useMemo(() => {
    return [...properties].sort((a, b) => {
      const aValue = a[sortField].toLowerCase();
      const bValue = b[sortField].toLowerCase();
      
      if (sortDirection === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  }, [properties, sortField, sortDirection]);

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const headerBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-gray-50';
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const hoverBg = theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Building2 className={textColor} size={28} />
          <h1 className={`text-2xl font-bold ${textColor}`}>Properties</h1>
        </div>
        <button 
          onClick={() => navigate('/add-property')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <span>Add Property</span>
        </button>
      </div>

      <div className={`${cardBg} rounded-lg border ${borderColor} overflow-hidden`}>
        <div className={`${headerBg} border-b ${borderColor}`}>
          <div className="grid grid-cols-12 gap-4">
            <button
              onClick={() => handleSort('name')}
              className={`col-span-4 p-4 text-left font-medium flex items-center space-x-2 ${textColor}`}
            >
              <span>Property Name</span>
              <ArrowUpDown size={16} className={sortField === 'name' ? 'text-blue-500' : mutedTextColor} />
            </button>
            <div className={`col-span-4 p-4 font-medium ${textColor}`}>Address</div>
            <button
              onClick={() => handleSort('managementCompany')}
              className={`col-span-4 p-4 text-left font-medium flex items-center space-x-2 ${textColor}`}
            >
              <span>Property Management Company</span>
              <ArrowUpDown 
                size={16} 
                className={sortField === 'managementCompany' ? 'text-blue-500' : mutedTextColor}
              />
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-700">
          {sortedProperties.map((property) => (
            <div 
              key={property.id}
              onClick={() => navigate(`/properties/${property.id}`)}
              className={`grid grid-cols-12 gap-4 ${hoverBg} cursor-pointer group`}
            >
              <div className="col-span-4 p-4">
                <div className={`font-medium ${textColor} group-hover:text-blue-500`}>
                  {property.name}
                </div>
              </div>
              <div className="col-span-4 p-4">
                <div className={`flex items-start space-x-2 ${mutedTextColor}`}>
                  <MapPin size={16} className="mt-1 flex-shrink-0" />
                  <div>
                    <div>{property.address}</div>
                    <div>{property.city}, {property.state} {property.zip}</div>
                  </div>
                </div>
              </div>
              <div className="col-span-4 p-4">
                <div className={`flex items-center space-x-2 ${mutedTextColor}`}>
                  <Users size={16} className="flex-shrink-0" />
                  <span>{property.managementCompany}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}