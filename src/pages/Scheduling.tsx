import { useState } from 'react';
import { Calendar, ArrowLeft, ArrowRight, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DroppableProvided, DraggableProvided, DropResult } from '@hello-pangea/dnd';
import type { JobPhase } from '../types/workOrder';

interface SchedulingProps {
  theme: 'dark' | 'light';
}

interface JobRequest {
  id: string;
  workOrderNumber: string;
  property: string;
  unit: string;
  type: 'Paint' | 'Callback' | 'Repair';
  phase: JobPhase;
  scheduledDate: string;
}

interface Subcontractor {
  id: string;
  name: string;
  jobsCompleted: number;
  assignedJobs: JobRequest[];
}

export function Scheduling({ theme }: SchedulingProps) {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [hasChanges, setHasChanges] = useState(false);

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
  const sectionBg = theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50';

  const [jobRequests, setJobRequests] = useState<JobRequest[]>([
    {
      id: '1',
      workOrderNumber: 'WO#46',
      property: 'La Vie SouthPark',
      unit: '122',
      type: 'Paint',
      phase: 'job_request',
      scheduledDate: '2024-02-27'
    },
    {
      id: '2',
      workOrderNumber: 'WO#45',
      property: 'Riverside Apartments',
      unit: '204',
      type: 'Callback',
      phase: 'job_request',
      scheduledDate: '2024-02-27'
    }
  ]);

  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([
    {
      id: '1',
      name: 'John Smith',
      jobsCompleted: 156,
      assignedJobs: []
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      jobsCompleted: 243,
      assignedJobs: []
    },
    {
      id: '3',
      name: 'Mike Wilson',
      jobsCompleted: 189,
      assignedJobs: []
    }
  ]);

  const formatPhaseForDisplay = (phase: JobPhase) => {
    return phase
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleDateChange = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPhaseColor = (phase: JobPhase) => {
    switch (phase) {
      case 'job_request':
        return 'bg-[#3B82F6]/20 border-l-4 border-[#3B82F6]';
      case 'work_order':
        return 'bg-[#F97316]/20 border-l-4 border-[#F97316]';
      case 'pending_work_order':
        return 'bg-[#F97316]/20 border-l-4 border-[#F97316]';
      case 'grading':
        return 'bg-[#A855F7]/20 border-l-4 border-[#A855F7]';
      case 'invoicing':
        return 'bg-[#10B981]/20 border-l-4 border-[#10B981]';
      case 'completed':
        return 'bg-[#10B981]/20 border-l-4 border-[#10B981]';
      case 'cancelled':
        return 'bg-red-500/20 border-l-4 border-red-500';
      default:
        return 'bg-gray-500/20 border-l-4 border-gray-500';
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    const updatedSubcontractors = [...subcontractors];

    if (source.droppableId === 'jobRequests') {
      const jobIndex = jobRequests.findIndex(job => job.id === result.draggableId);
      if (jobIndex === -1) return;

      const job = jobRequests[jobIndex];
      const destSubIndex = updatedSubcontractors.findIndex(sub => sub.id === destination.droppableId);
      if (destSubIndex === -1) return;

      const updatedJobRequests = [...jobRequests];
      updatedJobRequests.splice(jobIndex, 1);
      setJobRequests(updatedJobRequests);

      if (!updatedSubcontractors[destSubIndex].assignedJobs) {
        updatedSubcontractors[destSubIndex].assignedJobs = [];
      }
      updatedSubcontractors[destSubIndex].assignedJobs.splice(destination.index, 0, job);
      setSubcontractors(updatedSubcontractors);
      setHasChanges(true);
    } else if (source.droppableId !== destination.droppableId) {
      const sourceSubIndex = updatedSubcontractors.findIndex(sub => sub.id === source.droppableId);
      const destSubIndex = updatedSubcontractors.findIndex(sub => sub.id === destination.droppableId);
      if (sourceSubIndex === -1 || destSubIndex === -1) return;

      if (!updatedSubcontractors[sourceSubIndex].assignedJobs) {
        updatedSubcontractors[sourceSubIndex].assignedJobs = [];
      }
      if (!updatedSubcontractors[destSubIndex].assignedJobs) {
        updatedSubcontractors[destSubIndex].assignedJobs = [];
      }

      const job = updatedSubcontractors[sourceSubIndex].assignedJobs[source.index];
      if (!job) return;

      updatedSubcontractors[sourceSubIndex].assignedJobs.splice(source.index, 1);
      updatedSubcontractors[destSubIndex].assignedJobs.splice(destination.index, 0, job);
      setSubcontractors(updatedSubcontractors);
      setHasChanges(true);
    } else {
      const subIndex = updatedSubcontractors.findIndex(sub => sub.id === source.droppableId);
      if (subIndex === -1) return;

      if (!updatedSubcontractors[subIndex].assignedJobs) {
        updatedSubcontractors[subIndex].assignedJobs = [];
      }

      const job = updatedSubcontractors[subIndex].assignedJobs[source.index];
      if (!job) return;

      updatedSubcontractors[subIndex].assignedJobs.splice(source.index, 1);
      updatedSubcontractors[subIndex].assignedJobs.splice(destination.index, 0, job);
      setSubcontractors(updatedSubcontractors);
      setHasChanges(true);
    }
  };

  const handleSchedule = () => {
    if (window.confirm('Are you sure you want to schedule these jobs and notify the subcontractors?')) {
      console.log('Scheduling jobs:', subcontractors);
      setHasChanges(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Calendar className={textColor} size={28} />
          <h1 className={`text-2xl font-bold ${textColor}`}>Job Scheduling</h1>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <ArrowLeft size={20} />
            <span>Go Back</span>
          </button>
          {hasChanges && (
            <button
              onClick={handleSchedule}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Schedule and Notify
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleDateChange(-1)}
            className={`p-2 rounded-lg ${sectionBg} ${textColor}`}
          >
            <ArrowLeft size={20} />
          </button>
          <span className={`text-lg font-medium ${textColor}`}>
            {formatDate(selectedDate)}
          </span>
          <button
            onClick={() => handleDateChange(1)}
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
              placeholder="Search jobs or subcontractors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-64 pl-10 pr-4 py-2 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={20} className={mutedTextColor} />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
            >
              <option value="all">All Types</option>
              <option value="paint">Paint</option>
              <option value="callback">Callback</option>
              <option value="repair">Repair</option>
            </select>
          </div>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-4">
            <div className={`${cardBg} rounded-lg border ${borderColor} p-4`}>
              <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Job Requests</h2>
              <Droppable droppableId="jobRequests">
                {(provided: DroppableProvided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-2"
                  >
                    {jobRequests.map((job, index) => (
                      <Draggable key={job.id} draggableId={job.id} index={index}>
                        {(provided: DraggableProvided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 rounded-lg cursor-move ${getPhaseColor(job.phase)}`}
                          >
                            <div className={`font-medium ${textColor}`}>{job.workOrderNumber}</div>
                            <div className={mutedTextColor}>{job.property} - Unit {job.unit}</div>
                            <div className={`text-sm ${mutedTextColor}`}>{job.type}</div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>

          <div className="col-span-8">
            <div className="space-y-6">
              {subcontractors.map((sub) => (
                <div key={sub.id} className={`${cardBg} rounded-lg border ${borderColor} p-4`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className={`text-lg font-semibold ${textColor}`}>{sub.name}</h3>
                      <div className={`text-sm ${mutedTextColor}`}>
                        {sub.jobsCompleted} Jobs Completed
                      </div>
                    </div>
                  </div>
                  <Droppable droppableId={sub.id}>
                    {(provided: DroppableProvided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`${sectionBg} rounded-lg p-3 min-h-[100px]`}
                      >
                        <div className="space-y-2">
                          {(sub.assignedJobs || []).map((job, index) => (
                            <Draggable key={job.id} draggableId={job.id} index={index}>
                              {(provided: DraggableProvided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`${cardBg} p-3 rounded-lg cursor-move ${getPhaseColor(job.phase)}`}
                                >
                                  <div className={`font-medium ${textColor}`}>{job.workOrderNumber}</div>
                                  <div className={mutedTextColor}>{job.property} - Unit {job.unit}</div>
                                  <div className={`text-sm ${mutedTextColor}`}>{job.type}</div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        </div>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}
