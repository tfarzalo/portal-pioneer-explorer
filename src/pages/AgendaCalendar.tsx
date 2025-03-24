import React from 'react';
import { useState } from 'react';
import { 
  Calendar, 
  ArrowLeft, 
  ArrowRight, 
  Search, 
  Filter,
  ChevronDown,
  ChevronUp,
  MapPin,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { JobPhase } from '../types/workOrder';
import { JOB_PHASE_COLORS } from '../types/workOrder';

interface AgendaCalendarProps {
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
  startTime?: string;
  endTime?: string;
}

export function AgendaCalendar({ theme }: AgendaCalendarProps) {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [phaseFilter, setPhaseFilter] = useState<string>('all');
  const [expandedDays, setExpandedDays] = useState<string[]>([]);

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
      phase: 'Job Request',
      scheduledDate: new Date().toISOString().split('T')[0],
      address: '6000 Fairview Rd',
      notes: 'Full unit paint',
      subcontractor: 'John Smith',
      startTime: '09:00',
      endTime: '17:00'
    },
    {
      id: '2',
      workOrderNumber: 'WO#47',
      property: 'Riverside Apartments',
      propertyId: '2',
      unit: '204',
      type: 'Paint',
      phase: 'Work Order',
      scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      address: '1234 River Rd',
      subcontractor: 'Sarah Johnson',
      startTime: '08:00',
      endTime: '16:00'
    },
    {
      id: '3',
      workOrderNumber: 'WO#48',
      property: 'Pine Valley',
      propertyId: '3',
      unit: '305',
      type: 'Paint',
      phase: 'Grading',
      scheduledDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
      address: '2000 Pine St',
      startTime: '10:00',
      endTime: '18:00'
    }
  ];

  const jobsByDate = jobs.reduce((acc, job) => {
    const date = job.scheduledDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(job);
    return acc;
  }, {} as Record<string, Job[]>);

  const findNextDateWithEvents = () => {
    const today = new Date().toISOString().split('T')[0];
    if (jobsByDate[today]) {
      return today;
    }

    const sortedDates = Object.keys(jobsByDate).sort();
    const nextDate = sortedDates.find(date => date > today);
    return nextDate || today;
  };

  useEffect(() => {
    const startDate = findNextDateWithEvents();
    setCurrentDate(new Date(startDate));
    setExpandedDays([startDate]);
  }, []);

  const handleDateChange = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const toggleDayExpanded = (date: string) => {
    setExpandedDays(prev => 
      prev.includes(date)
        ? prev.filter(d => d !== date)
        : [...prev, date]
    );
  };

  const getWeekDates = () => {
    const dates = [];
    const weekStart = new Date(currentDate);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }

    return dates;
  };

  const weekDates = getWeekDates();

  const filteredJobsByDate = Object.entries(jobsByDate).reduce((acc, [date, dateJobs]) => {
    const filteredJobs = dateJobs.filter(job => {
      const matchesSearch = 
        job.workOrderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.unit.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPhase = phaseFilter === 'all' || job.phase === phaseFilter;
      
      return matchesSearch && matchesPhase;
    });

    if (filteredJobs.length > 0) {
      acc[date] = filteredJobs;
    }
    return acc;
  }, {} as Record<string, Job[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Calendar className={textColor} size={28} />
          <h1 className={`text-2xl font-bold ${textColor}`}>Agenda View</h1>
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
            onClick={() => handleDateChange(-7)}
            className={`p-2 rounded-lg ${sectionBg} ${textColor}`}
          >
            <ArrowLeft size={20} />
          </button>
          <span className={`text-lg font-medium ${textColor}`}>
            Week of {formatDate(new Date(weekDates[0]))}
          </span>
          <button
            onClick={() => handleDateChange(7)}
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
              <option value="Pending Work Order">Pending Work Order</option>
              <option value="Grading">Grading</option>
              <option value="Invoicing">Invoicing</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className={`${cardBg} rounded-lg border ${borderColor}`}>
        <div className="divide-y divide-gray-700">
          {weekDates.map((date) => {
            const dayJobs = filteredJobsByDate[date] || [];
            const isExpanded = expandedDays.includes(date);
            const hasJobs = dayJobs.length > 0;
            const isToday = date === new Date().toISOString().split('T')[0];

            return (
              <div 
                key={date} 
                className={`${hasJobs ? 'cursor-pointer' : ''} ${
                  isToday ? `${theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'}` : ''
                }`}
              >
                <div
                  className={`p-4 flex items-center justify-between ${
                    hasJobs ? 'hover:bg-gray-800/50' : ''
                  }`}
                  onClick={() => hasJobs && toggleDayExpanded(date)}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`text-lg font-medium ${textColor}`}>
                      {new Date(date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                      })}
                      {isToday && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-blue-500 text-white rounded-full">
                          Today
                        </span>
                      )}
                    </div>
                    {hasJobs && (
                      <div className={`${mutedTextColor} text-sm`}>
                        {dayJobs.length} job{dayJobs.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                  {hasJobs && (
                    <button className={mutedTextColor}>
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  )}
                </div>

                {isExpanded && (
                  <div className="divide-y divide-gray-700">
                    {dayJobs.map((job) => (
                      <div
                        key={job.id}
                        className="p-4 hover:bg-gray-800/50 transition-colors"
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`w-32 text-sm ${mutedTextColor}`}>
                            {job.startTime} - {job.endTime}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <button
                                  onClick={() => navigate(`/jobs/${job.id}`)}
                                  className={`text-lg font-medium ${textColor} hover:underline`}
                                >
                                  {job.workOrderNumber && `${job.workOrderNumber} - `}{job.property}
                                </button>
                                <div className={`text-sm ${mutedTextColor}`}>Unit {job.unit}</div>
                              </div>
                              <div className={`px-3 py-1 rounded-full text-sm ${JOB_PHASE_COLORS[job.phase].bgOpacity} ${JOB_PHASE_COLORS[job.phase].text}`}>
                                {job.phase}
                              </div>
                            </div>
                            <div className="mt-2 space-y-2">
                              <div className="flex items-center space-x-2 text-sm">
                                <MapPin size={16} className={mutedTextColor} />
                                <span className={mutedTextColor}>{job.address}</span>
                              </div>
                              {job.subcontractor && (
                                <div className="flex items-center space-x-2 text-sm">
                                  <Users size={16} className={mutedTextColor} />
                                  <span className={mutedTextColor}>Assigned to: {job.subcontractor}</span>
                                </div>
                              )}
                              {job.notes && (
                                <div className={`text-sm ${mutedTextColor}`}>{job.notes}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
