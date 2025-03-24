import { useState } from 'react';
import { 
  FolderKanban, 
  Plus, 
  Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PropertyGroupsProps {
  theme: 'dark' | 'light';
}

export function PropertyGroups({ theme }: PropertyGroupsProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';

  const propertyGroups = [
    {
      id: '1',
      name: 'Northwood Ravin',
      region: 'Southeast'
    },
    {
      id: '2',
      name: 'Lincoln Property Company',
      region: 'Southwest'
    },
    {
      id: '3',
      name: 'Greystar',
      region: 'Northeast'
    }
  ];

  const filteredPropertyGroups = propertyGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FolderKanban className={textColor} size={28} />
          <h1 className={`text-2xl font-bold ${textColor}`}>Property Management Groups</h1>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
        >
          <span>Go Back</span>
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${mutedTextColor}`} size={20} />
          <input
            type="text"
            placeholder="Search property groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-64 pl-10 pr-4 py-2 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
          />
        </div>
        <button
          onClick={() => navigate('/add-property-group')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add New</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredPropertyGroups.map(group => (
          <div
            key={group.id}
            className={`${cardBg} p-4 rounded-lg border ${borderColor} flex items-center justify-between`}
          >
            <div>
              <h2 className={`text-lg font-semibold ${textColor}`}>{group.name}</h2>
              <p className={`text-sm ${mutedTextColor}`}>Region: {group.region}</p>
            </div>
            <button
              onClick={() => navigate(`/property-groups/${group.id}`)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
