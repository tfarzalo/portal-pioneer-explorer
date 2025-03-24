import React, { useState, useMemo } from 'react';
import { 
  FolderKanban, 
  ArrowUpDown, 
  Building2, 
  Users, 
  Plus 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PropertyGroupsProps {
  theme: 'dark' | 'light';
}

interface PropertyGroup {
  id: string;
  name: string;
  properties: number;
  managers: string[];
  region: string;
  status: 'active' | 'inactive';
}

export function PropertyGroups({ theme }: PropertyGroupsProps) {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<'name' | 'region'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const headerBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-gray-50';
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const hoverBg = theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50';

  // Mock data - replace with actual data fetching
  const groups: PropertyGroup[] = [
    {
      id: '1',
      name: 'RKW Residential',
      properties: 12,
      managers: ['John Smith', 'Sarah Wilson'],
      region: 'Southeast',
      status: 'active'
    },
    {
      id: '2',
      name: 'Greystar',
      properties: 18,
      managers: ['Mike Johnson', 'Emily Davis'],
      region: 'Northeast',
      status: 'active'
    },
    {
      id: '3',
      name: 'Lincoln Property Company',
      properties: 15,
      managers: ['David Brown', 'Lisa Anderson'],
      region: 'Southwest',
      status: 'active'
    },
    {
      id: '4',
      name: 'Camden Property Trust',
      properties: 9,
      managers: ['Robert Wilson'],
      region: 'Southeast',
      status: 'inactive'
    }
  ];

  const handleSort = (field: 'name' | 'region') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedGroups = useMemo(() => {
    return [...groups].sort((a, b) => {
      const aValue = a[sortField].toLowerCase();
      const bValue = b[sortField].toLowerCase();
      
      if (sortDirection === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  }, [groups, sortField, sortDirection]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FolderKanban className={textColor} size={28} />
          <h1 className={`text-2xl font-bold ${textColor}`}>Property Management Groups</h1>
        </div>
        <button 
          onClick={() => navigate('/property-groups/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Group</span>
        </button>
      </div>

      <div className={`${cardBg} rounded-lg border ${borderColor} overflow-hidden`}>
        <div className={`${headerBg} border-b ${borderColor}`}>
          <div className="grid grid-cols-12 gap-4">
            <button
              onClick={() => handleSort('name')}
              className={`col-span-4 p-4 text-left font-medium flex items-center space-x-2 ${textColor}`}
            >
              <span>Group Name</span>
              <ArrowUpDown size={16} className={sortField === 'name' ? 'text-blue-500' : mutedTextColor} />
            </button>
            <div className={`col-span-3 p-4 font-medium ${textColor}`}>Properties</div>
            <div className={`col-span-3 p-4 font-medium ${textColor}`}>Managers</div>
            <button
              onClick={() => handleSort('region')}
              className={`col-span-2 p-4 text-left font-medium flex items-center space-x-2 ${textColor}`}
            >
              <span>Region</span>
              <ArrowUpDown 
                size={16} 
                className={sortField === 'region' ? 'text-blue-500' : mutedTextColor}
              />
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-700">
          {sortedGroups.map((group) => (
            <div 
              key={group.id}
              onClick={() => navigate(`/property-groups/${group.id}`)}
              className={`grid grid-cols-12 gap-4 ${hoverBg} cursor-pointer group`}
            >
              <div className="col-span-4 p-4">
                <div className={`font-medium ${textColor} group-hover:text-blue-500 flex items-center space-x-2`}>
                  <span>{group.name}</span>
                  {group.status === 'inactive' && (
                    <span className="px-2 py-0.5 text-xs bg-red-500/10 text-red-500 rounded-full">
                      Inactive
                    </span>
                  )}
                </div>
              </div>
              <div className="col-span-3 p-4">
                <div className={`flex items-center space-x-2 ${mutedTextColor}`}>
                  <Building2 size={16} className="flex-shrink-0" />
                  <span>{group.properties} Properties</span>
                </div>
              </div>
              <div className="col-span-3 p-4">
                <div className={`flex items-center space-x-2 ${mutedTextColor}`}>
                  <Users size={16} className="flex-shrink-0" />
                  <div className="truncate">
                    {group.managers.join(', ')}
                  </div>
                </div>
              </div>
              <div className="col-span-2 p-4">
                <div className={mutedTextColor}>{group.region}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
