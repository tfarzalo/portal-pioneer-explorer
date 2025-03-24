import React, { useState } from 'react';
import { 
  Building2, 
  ArrowLeft, 
  Edit, 
  Map, 
  Phone, 
  Mail,
  Users,
  Plus,
  Trash2,
  Loader2
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

interface PropertyGroupDetailsProps {
  theme: 'dark' | 'light';
}

interface PropertyGroup {
  id: string;
  name: string;
  region: string;
  status: 'active' | 'inactive';
  description: string;
  contact: {
    name: string;
    role: string;
    email: string;
    phone: string;
  };
  managers: {
    id: string;
    name: string;
    role: string;
    email: string;
  }[];
  properties: {
    id: string;
    name: string;
    address: string;
    units: number;
  }[];
}

export function PropertyGroupDetails({ theme }: PropertyGroupDetailsProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
  const sectionBg = theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50';

  const [group, setGroup] = useState<PropertyGroup>({
    id: '1',
    name: 'RKW Residential',
    region: 'Southeast',
    status: 'active',
    description: 'Leading property management company specializing in luxury residential properties.',
    contact: {
      name: 'John Smith',
      role: 'Regional Director',
      email: 'john.smith@rkw.com',
      phone: '(555) 123-4567'
    },
    managers: [
      {
        id: '1',
        name: 'Sarah Wilson',
        role: 'Property Manager',
        email: 'sarah.wilson@rkw.com'
      },
      {
        id: '2',
        name: 'Mike Johnson',
        role: 'Assistant Manager',
        email: 'mike.johnson@rkw.com'
      }
    ],
    properties: [
      {
        id: '1',
        name: 'The Edison',
        address: '555 Edison Way, Charlotte, NC',
        units: 245
      },
      {
        id: '2',
        name: 'Riverside Apartments',
        address: '123 River Road, Charlotte, NC',
        units: 180
      },
      {
        id: '3',
        name: 'Pine Valley Complex',
        address: '789 Pine Street, Charlotte, NC',
        units: 320
      }
    ]
  });

  useEffect(() => {
    // Fetch group data using id
    // For now using mock data set in initial state
  }, [id]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save group data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API call
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving group:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Building2 className={textColor} size={28} />
          <div>
            <h1 className={`text-2xl font-bold ${textColor}`}>{group.name}</h1>
            <p className={mutedTextColor}>{group.region} Region</p>
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
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Group
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              {isSaving ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className={`${cardBg} rounded-lg border ${borderColor} p-6`}>
            <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Properties</h2>
            <div className="space-y-4">
              {group.properties.map((property) => (
                <div
                  key={property.id}
                  className={`${sectionBg} p-4 rounded-lg`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <button
                        onClick={() => navigate(`/properties/${property.id}`)}
                        className={`text-lg font-medium ${textColor} hover:text-blue-500`}
                      >
                        {property.name}
                      </button>
                      <div className="flex items-center space-x-2 mt-1">
                        <Map size={16} className={mutedTextColor} />
                        <span className={mutedTextColor}>{property.address}</span>
                      </div>
                    </div>
                    <div className={`text-right ${mutedTextColor}`}>
                      <div className="font-medium">{property.units}</div>
                      <div className="text-sm">Units</div>
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => navigate('/add-property')}
                className={`w-full p-4 rounded-lg border ${borderColor} ${mutedTextColor} hover:border-blue-500 hover:text-blue-500 flex items-center justify-center space-x-2`}
              >
                <Plus size={20} />
                <span>Add Property</span>
              </button>
            </div>
          </div>

          <div className={`${cardBg} rounded-lg border ${borderColor} p-6`}>
            <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Property Managers</h2>
            <div className="space-y-4">
              {group.managers.map((manager) => (
                <div
                  key={manager.id}
                  className={`${sectionBg} p-4 rounded-lg`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`font-medium ${textColor}`}>{manager.name}</div>
                      <div className={mutedTextColor}>{manager.role}</div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <a
                        href={`mailto:${manager.email}`}
                        className={`${mutedTextColor} hover:text-blue-500`}
                      >
                        <Mail size={20} />
                      </a>
                      {isEditing && (
                        <button className="text-red-500 hover:text-red-600">
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <button
                className={`w-full p-4 rounded-lg border ${borderColor} ${mutedTextColor} hover:border-blue-500 hover:text-blue-500 flex items-center justify-center space-x-2`}
              >
                <Plus size={20} />
                <span>Add Manager</span>
              </button>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className={`${cardBg} rounded-lg border ${borderColor} p-6`}>
            <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Group Information</h2>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${textColor}`}>Status</label>
                {isEditing ? (
                  <select
                    value={group.status}
                    onChange={(e) => setGroup({ ...group, status: e.target.value as 'active' | 'inactive' })}
                    className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                ) : (
                  <div className={`inline-flex px-2 py-1 rounded-full text-sm ${
                    group.status === 'active'
                      ? 'bg-green-500/10 text-green-500'
                      : 'bg-red-500/10 text-red-500'
                  }`}>
                    {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
                  </div>
                )}
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${textColor}`}>Description</label>
                {isEditing ? (
                  <textarea
                    value={group.description}
                    onChange={(e) => setGroup({ ...group, description: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor} min-h-[100px]`}
                  />
                ) : (
                  <p className={mutedTextColor}>{group.description}</p>
                )}
              </div>
            </div>
          </div>

          <div className={`${cardBg} rounded-lg border ${borderColor} p-6`}>
            <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Primary Contact</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Users size={20} className={mutedTextColor} />
                <div>
                  <div className={`font-medium ${textColor}`}>{group.contact.name}</div>
                  <div className={mutedTextColor}>{group.contact.role}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={20} className={mutedTextColor} />
                <div className={mutedTextColor}>{group.contact.phone}</div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={20} className={mutedTextColor} />
                <div className={mutedTextColor}>{group.contact.email}</div>
              </div>
            </div>
          </div>

          <div className={`${cardBg} rounded-lg border ${borderColor} p-6`}>
            <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className={`${sectionBg} p-4 rounded-lg`}>
                <div className={`text-2xl font-bold ${textColor}`}>
                  {group.properties.length}
                </div>
                <div className={mutedTextColor}>Properties</div>
              </div>
              <div className={`${sectionBg} p-4 rounded-lg`}>
                <div className={`text-2xl font-bold ${textColor}`}>
                  {group.properties.reduce((sum, p) => sum + p.units, 0)}
                </div>
                <div className={mutedTextColor}>Total Units</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

