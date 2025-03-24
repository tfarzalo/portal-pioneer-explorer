
import { useState } from 'react';
import { Calendar, ArrowLeft, ArrowRight, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { JobPhase } from '../types/workOrder';

interface FullCalendarProps {
  theme: 'dark' | 'light';
}

interface Job {
  id: string;
  workOrderNumber: string;
  property: string;
  propertyId: string;
  unit: string;
  type: 'Paint' | 'Callback' | 'Repair';
  phase: JobPhase;
  scheduledDate: string;
  notes?: string;
  address: string;
  subcontractor?: string;
}

export function FullCalendar({ theme }: FullCalendarProps) {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [phaseFilter, setPhaseFilter] = useState<string>('all');

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
  const sectionBg = theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50';

  const jobs: Job[] = [
    {
      id: '1',
      workOrderNumber: 'WO#46',
      property: 'La Vie SouthPark',
      propertyId: '1',
      unit: '122',
      type: 'Paint',
      phase: 'job_request',
      scheduledDate: '2025-03-15',
      address: '6000 Fairview Rd',
      notes: 'Full unit paint',
      subcontractor: 'John Smith'
    },
    {
      id: '2',
      workOrderNumber: 'WO#47',
      property: 'Riverside Apartments',
      propertyId: '2',
      unit: '204',
      type: 'Paint',
      phase: 'work_order',
      scheduledDate: '2025-03-22',
      address: '1234 River Rd',
      subcontractor: 'Sarah Johnson'
    },
    {
      id: '3',
      workOrderNumber: 'WO#48',
      property: 'Pine Valley',
      propertyId: '3',
      unit: '305',
      type: 'Paint',
      phase: 'grading',
      scheduledDate: '2025-03-28',
      address: '2000 Pine St'
    },
    {
      id: '4',
      workOrderNumber: 'WO#49',
      property: 'The Edison',
      propertyId: '4',
      unit: '401',
      type: 'Paint',
      phase: 'invoicing',
      scheduledDate: '2025-04-05',
      address: '555 Edison Way'
    },
    {
      id: '5',
      workOrderNumber: 'WO#50',
      property: 'Oakwood Heights',
      propertyId: '5',
      unit: '102',
      type: 'Paint',
      phase: 'completed',
      scheduledDate: '2025-04-12',
      address: '789 Oak Ave'
    },
    {
      id: '6',
      workOrderNumber: 'WO#51',
      property: 'Metropolitan',
      propertyId: '6',
      unit: '1505',
      type: 'Paint',
      phase: 'cancelled',
      scheduledDate: '2025-04-18',
      address: '100 Metro Blvd'
    }
  ];

  // Helper function to format phase for display
  const formatPhase = (phase: JobPhase): string => {
    return phase
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getPhaseColor = (phase: JobPhase) => {
    switch (phase) {
      case 'job_request':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-l-4 border-blue-500';
      case 'work_order':
        return 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-l-4 border-orange-500';
      case 'pending_work_order':
        return 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-l-4 border-orange-500';
      case 'grading':
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-l-4 border-purple-500';
      case 'invoicing':
        return 'bg-green-500/10 text-green-700 dark:text-green-300 border-l-4 border-green-500';
      case 'completed':
        return 'bg-green-500/10 text-green-700 dark:text-green-300 border-l-4 border-green-500';
      case 'cancelled':
        return 'bg-red-500/10 text-red-700 dark:text-red-300 border-l-4 border-red-500';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-300 border-l-4 border-gray-500';
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getJobsForDate = (date: string) => {
    return jobs.filter(job => {
      const matchesPhase = phaseFilter === 'all' || formatPhase(job.phase) === phaseFilter;
      const matchesSearch = 
        job.workOrderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.unit.toLowerCase().includes(searchTerm.toLowerCase());
      
      return job.scheduledDate === date && matchesPhase && matchesSearch;
    });
  };

  const getTodaysJobs = () => {
    const today = new Date().toISOString().split('T')[0];
    return jobs.filter(job => job.scheduledDate === today && job.subcontractor);
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];
  
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Calendar className={textColor} size={28} />
          <h1 className={`text-2xl font-bold ${textColor}`}>Calendar</h1>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
        >
          <ArrowLeft size={20} />
          <span>Go Back</span>
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePrevMonth}
            className={`p-2 rounded-lg ${sectionBg} ${textColor}`}
          >
            <ArrowLeft size={20} />
          </button>
          <span className={`text-lg font-medium ${textColor}`}>
            {formatDate(currentDate)}
          </span>
          <button
            onClick={handleNextMonth}
            className={`p-2 rounded-lg ${sectionBg} ${textColor}`}
          >
            <ArrowRight size={20} />
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${mutedTextColor}`} size={20} />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-64 pl-10 pr-4 py-2 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={20} className={mutedTextColor} />
            <select
              value={phaseFilter}
              onChange={(e) => setPhaseFilter(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
            >
              <option value="all">All Phases</option>
              <option value="Job Request">Job Request</option>
              <option value="Work Order">Work Order</option>
              <option value="Grading">Grading</option>
              <option value="Invoicing">Invoicing</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-9">
          <div className={`${cardBg} rounded-lg border ${borderColor}`}>
            <div className="grid grid-cols-7 gap-px">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className={`p-2 text-center font-medium ${textColor} ${sectionBg}`}
                >
                  {day}
                </div>
              ))}
              {days.map((day, index) => (
                <div
                  key={index}
                  className={`min-h-[120px] p-2 ${borderColor} border-t relative ${
                    day ? cardBg : sectionBg
                  }`}
                >
                  {day && (
                    <>
                      <div className={`text-sm ${mutedTextColor}`}>{day}</div>
                      <div className="mt-1 space-y-1">
                        {getJobsForDate(
                          `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                        ).map((job) => (
                          <div
                            key={job.id}
                            className={`p-2 rounded text-xs cursor-pointer font-medium ${getPhaseColor(job.phase)}`}
                            onClick={() => navigate(`/jobs/${job.id}`)}
                          >
                            <div>{job.property}</div>
                            <div>Unit {job.unit}</div>
                            {job.notes && <div>{job.notes}</div>}
                            <div>{job.address}</div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-3">
          <div className={`${cardBg} rounded-lg border ${borderColor} p-4`}>
            <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Today's Schedule</h2>
            <div className="space-y-3">
              {getTodaysJobs().map((job) => (
                <div
                  key={job.id}
                  className={`p-3 rounded-lg ${getPhaseColor(job.phase)}`}
                  onClick={() => navigate(`/jobs/${job.id}`)}
                >
                  <div className="font-medium">{job.workOrderNumber}</div>
                  <div>{job.property}</div>
                  <div>Unit {job.unit}</div>
                  <div className="text-sm">{job.address}</div>
                  {job.subcontractor && (
                    <div className="text-sm font-medium mt-1">
                      Assigned to: {job.subcontractor}
                    </div>
                  )}
                </div>
              ))}
              {getTodaysJobs().length === 0 && (
                <div className={`text-center ${mutedTextColor}`}>
                  No jobs scheduled for today
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
