import { useState, useEffect } from 'react';
import { Activity as ActivityIcon, ArrowLeft, Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ActivityProps {
  theme: 'dark' | 'light';
}

interface ActivityItem {
  id: string;
  type: 'job_request' | 'work_order' | 'invoice' | 'property' | 'user';
  action: 'created' | 'updated' | 'deleted' | 'completed' | 'approved' | 'rejected';
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: string;
  details?: {
    propertyName?: string;
    propertyId?: string;
    jobId?: string;
    workOrderId?: string;
    invoiceId?: string;
    amount?: number;
    status?: string;
    description?: string;
  };
}

export function Activity({ theme }: ActivityProps) {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    types: [] as string[],
    actions: [] as string[],
    dateRange: 'all' as 'today' | 'week' | 'month' | 'all',
  });

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const cardBorder = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const hoverBg = theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50';

  useEffect(() => {
    // Fetch activity data
    const fetchActivities = async () => {
      try {
        // In a real app, this would be an API call
        // For now, using mock data
        const mockActivities: ActivityItem[] = [
          {
            id: '1',
            type: 'job_request',
            action: 'created',
            user: {
              id: 'user1',
              name: 'John Doe',
              avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
            },
            timestamp: '2023-06-15T14:30:00Z',
            details: {
              propertyName: 'Sunset Apartments',
              propertyId: 'prop123',
              description: 'New job request for unit painting',
            },
          },
          {
            id: '2',
            type: 'work_order',
            action: 'completed',
            user: {
              id: 'user2',
              name: 'Jane Smith',
              avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
            },
            timestamp: '2023-06-14T10:15:00Z',
            details: {
              propertyName: 'Highland Towers',
              propertyId: 'prop456',
              workOrderId: 'wo789',
              description: 'Completed painting of unit 304',
            },
          },
          {
            id: '3',
            type: 'invoice',
            action: 'created',
            user: {
              id: 'user3',
              name: 'Robert Johnson',
              avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
            },
            timestamp: '2023-06-13T16:45:00Z',
            details: {
              propertyName: 'Oakwood Commons',
              propertyId: 'prop789',
              invoiceId: 'inv456',
              amount: 1250.00,
              description: 'Invoice for painting services',
            },
          },
          {
            id: '4',
            type: 'property',
            action: 'updated',
            user: {
              id: 'user4',
              name: 'Emily Davis',
              avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
            },
            timestamp: '2023-06-12T09:20:00Z',
            details: {
              propertyName: 'Riverside Apartments',
              propertyId: 'prop101',
              description: 'Updated property details and contact information',
            },
          },
          {
            id: '5',
            type: 'user',
            action: 'created',
            user: {
              id: 'user5',
              name: 'Michael Wilson',
              avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
            },
            timestamp: '2023-06-11T13:10:00Z',
            details: {
              description: 'Added new subcontractor account',
            },
          },
        ];

        setActivities(mockActivities);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching activities:', error);
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const handleFilterChange = (category: string, value: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (category === 'dateRange') {
        return { ...prev, dateRange: value as 'today' | 'week' | 'month' | 'all' };
      } else {
        const categoryArray = newFilters[category as 'types' | 'actions'] as string[];
        if (categoryArray.includes(value)) {
          return {
            ...prev,
            [category]: categoryArray.filter(item => item !== value),
          };
        } else {
          return {
            ...prev,
            [category]: [...categoryArray, value],
          };
        }
      }
    });
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'job_request':
        return <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">JR</div>;
      case 'work_order':
        return <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white">WO</div>;
      case 'invoice':
        return <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">IN</div>;
      case 'property':
        return <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white">PR</div>;
      case 'user':
        return <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white">US</div>;
      default:
        return <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white">?</div>;
    }
  };

  const getActivityTitle = (activity: ActivityItem) => {
    const { type, action, user } = activity;
    const typeName = type.replace('_', ' ');
    
    switch (action) {
      case 'created':
        return `${user.name} created a new ${typeName}`;
      case 'updated':
        return `${user.name} updated a ${typeName}`;
      case 'deleted':
        return `${user.name} deleted a ${typeName}`;
      case 'completed':
        return `${user.name} marked a ${typeName} as completed`;
      case 'approved':
        return `${user.name} approved a ${typeName}`;
      case 'rejected':
        return `${user.name} rejected a ${typeName}`;
      default:
        return `${user.name} performed an action on a ${typeName}`;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <ActivityIcon className={textColor} size={28} />
          <h1 className={`text-2xl font-bold ${textColor}`}>Activity Log</h1>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
        >
          <ArrowLeft size={20} />
          <span>Go Back</span>
        </button>
      </div>

      <div className={`${cardBg} p-6 rounded-lg border ${cardBorder}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className={mutedTextColor} size={18} />
            </div>
            <input
              type="text"
              className={`block w-full pl-10 pr-3 py-2 rounded-lg border ${cardBorder} ${textColor} ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
              placeholder="Search activities..."
            />
          </div>
          <button
            onClick={toggleFilter}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${cardBorder} ${textColor} ${hoverBg}`}
          >
            <Filter size={18} />
            <span>Filter</span>
            {filterOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        {filterOpen && (
          <div className={`p-4 mb-6 rounded-lg border ${cardBorder} ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className={`text-sm font-medium ${textColor} mb-3`}>Activity Type</h3>
                <div className="space-y-2">
                  {['job_request', 'work_order', 'invoice', 'property', 'user'].map(type => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.types.includes(type)}
                        onChange={() => handleFilterChange('types', type)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className={`ml-2 ${textColor}`}>
                        {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className={`text-sm font-medium ${textColor} mb-3`}>Action</h3>
                <div className="space-y-2">
                  {['created', 'updated', 'deleted', 'completed', 'approved', 'rejected'].map(action => (
                    <label key={action} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.actions.includes(action)}
                        onChange={() => handleFilterChange('actions', action)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className={`ml-2 ${textColor}`}>
                        {action.charAt(0).toUpperCase() + action.slice(1)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className={`text-sm font-medium ${textColor} mb-3`}>Date Range</h3>
                <div className="space-y-2">
                  {[
                    { value: 'today', label: 'Today' },
                    { value: 'week', label: 'This Week' },
                    { value: 'month', label: 'This Month' },
                    { value: 'all', label: 'All Time' },
                  ].map(option => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        checked={filters.dateRange === option.value}
                        onChange={() => handleFilterChange('dateRange', option.value)}
                        className="rounded-full border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className={`ml-2 ${textColor}`}>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.length === 0 ? (
              <p className={`text-center py-8 ${mutedTextColor}`}>No activity records found.</p>
            ) : (
              activities.map(activity => (
                <div
                  key={activity.id}
                  className={`p-4 rounded-lg border ${cardBorder} ${hoverBg} transition-colors cursor-pointer`}
                  onClick={() => {
                    // Navigate based on activity type
                    if (activity.type === 'job_request' && activity.details?.propertyId) {
                      navigate(`/jobs/${activity.details.propertyId}`);
                    } else if (activity.type === 'work_order' && activity.details?.workOrderId) {
                      navigate(`/work-orders/${activity.details.workOrderId}`);
                    }
                  }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${textColor}`}>
                        {getActivityTitle(activity)}
                      </p>
                      <p className={`text-sm ${mutedTextColor} mt-1`}>
                        {activity.details?.propertyName || 'System'} • {formatDate(activity.timestamp)}
                      </p>
                      {activity.details?.description && (
                        <p className={`text-sm ${textColor} mt-2`}>
                          {activity.details.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
