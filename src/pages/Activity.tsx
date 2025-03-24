import React, { useState } from 'react';
import { 
  Activity as ActivityIcon, 
  ArrowLeft,
  Search,
  Filter,
  Building2,
  FileText,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  Edit,
  Plus,
  Trash2,
  ArrowRight,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { JobPhase } from '../types/workOrder';
import { JOB_PHASE_COLORS } from '../types/workOrder';

interface ActivityProps {
  theme: 'dark' | 'light';
}

interface ActivityItem {
  id: string;
  type: 'job' | 'property' | 'user' | 'system';
  action: string;
  description: string;
  timestamp: string;
  user: {
    name: string;
    role: string;
  };
  details?: {
    jobId?: string;
    propertyId?: string;
    userId?: string;
    oldPhase?: JobPhase;
    newPhase?: JobPhase;
    scheduledDate?: string;
  };
}

export function Activity({ theme }: ActivityProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
  const sectionBg = theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50';

  // Mock activity data - replace with actual data fetching
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'job',
      action: 'phase_change',
      description: 'Changed job phase from Job Request to Work Order',
      timestamp: '2025-03-20T14:30:00Z',
      user: {
        name: 'John Smith',
        role: 'Administrator'
      },
      details: {
        jobId: 'WO#46',
        oldPhase: 'Job Request',
        newPhase: 'Work Order'
      }
    },
    {
      id: '2',
      type: 'property',
      action: 'update',
      description: 'Updated billing rates for La Vie SouthPark',
      timestamp: '2025-03-20T13:15:00Z',
      user: {
        name: 'Sarah Wilson',
        role: 'Manager'
      },
      details: {
        propertyId: '1'
      }
    },
    {
      id: '3',
      type: 'job',
      action: 'schedule_change',
      description: 'Rescheduled job from Mar 25 to Mar 28',
      timestamp: '2025-03-20T12:45:00Z',
      user: {
        name: 'Mike Johnson',
        role: 'Coordinator'
      },
      details: {
        jobId: 'WO#45',
        scheduledDate: '2025-03-28'
      }
    },
    {
      id: '4',
      type: 'job',
      action: 'create',
      description: 'Created new job request for Riverside Apartments',
      timestamp: '2025-03-20T11:30:00Z',
      user: {
        name: 'Emily Davis',
        role: 'Property Manager'
      },
      details: {
        jobId: 'WO#47',
        propertyId: '2'
      }
    },
    {
      id: '5',
      type: 'property',
      action: 'create',
      description: 'Added new property: Pine Valley Complex',
      timestamp: '2025-03-20T10:15:00Z',
      user: {
        name: 'John Smith',
        role: 'Administrator'
      },
      details: {
        propertyId: '3'
      }
    }
  ];

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'phase_change':
        return <ArrowRight size={20} />;
      case 'update':
        return <Edit size={20} />;
      case 'create':
        return <Plus size={20} />;
      case 'delete':
        return <Trash2 size={20} />;
      case 'schedule_change':
        return <Calendar size={20} />;
      default:
        return <ActivityIcon size={20} />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'job':
        return <FileText size={20} />;
      case 'property':
        return <Building2 size={20} />;
      case 'user':
        return <User size={20} />;
      default:
        return <ActivityIcon size={20} />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'phase_change':
        return 'text-purple-500';
      case 'update':
        return 'text-blue-500';
      case 'create':
        return 'text-green-500';
      case 'delete':
        return 'text-red-500';
      case 'schedule_change':
        return 'text-orange-500';
      default:
        return textColor;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || activity.type === typeFilter;
    
    // Add date filtering logic here based on dateFilter value
    
    return matchesSearch && matchesType;
  });

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

      <div className={`${cardBg} rounded-lg border ${borderColor}`}>
        <div className="p-4 border-b border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${mutedTextColor}`} size={20} />
              <input
                type="text"
                placeholder="Search activity..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter size={20} className={mutedTextColor} />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className={`px-4 py-2 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                >
                  <option value="all">All Types</option>
                  <option value="job">Jobs</option>
                  <option value="property">Properties</option>
                  <option value="user">Users</option>
                  <option value="system">System</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={20} className={mutedTextColor} />
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className={`px-4 py-2 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-700">
          {filteredActivities.map((activity) => (
            <div key={activity.id} className="p-4 hover:bg-gray-800/50 transition-colors">
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-lg ${sectionBg}`}>
                  {getTypeIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium ${textColor}`}>{activity.user.name}</span>
                      <span className={mutedTextColor}>•</span>
                      <span className={mutedTextColor}>{activity.user.role}</span>
                    </div>
                    <span className={`text-sm ${mutedTextColor}`}>
                      {formatTimestamp(activity.timestamp)}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center space-x-2">
                    <span className={getActionColor(activity.action)}>
                      {getActionIcon(activity.action)}
                    </span>
                    <p className={textColor}>{activity.description}</p>
                  </div>
                  {activity.details && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {activity.details.jobId && (
                        <button
                          onClick={() => navigate(`/jobs/${activity.details.jobId}`)}
                          className="px-2 py-1 rounded bg-blue-500/10 text-blue-500 text-sm hover:bg-blue-500/20"
                        >
                          {activity.details.jobId}
                        </button>
                      )}
                      {activity.details.propertyId && (
                        <button
                          onClick={() => navigate(`/properties/${activity.details.propertyId}`)}
                          className="px-2 py-1 rounded bg-green-500/10 text-green-500 text-sm hover:bg-green-500/20"
                        >
                          View Property
                        </button>
                      )}
                      {activity.details.oldPhase && activity.details.newPhase && (
                        <div className="flex items-center space-x-2 text-sm">
                          <span className={JOB_PHASE_COLORS[activity.details.oldPhase].text}>
                            {activity.details.oldPhase}
                          </span>
                          <ArrowRight size={16} className={mutedTextColor} />
                          <span className={JOB_PHASE_COLORS[activity.details.newPhase].text}>
                            {activity.details.newPhase}
                          </span>
                        </div>
                      )}
                      {activity.details.scheduledDate && (
                        <span className="px-2 py-1 rounded bg-orange-500/10 text-orange-500 text-sm">
                          {new Date(activity.details.scheduledDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}