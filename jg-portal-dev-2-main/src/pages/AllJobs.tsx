import React, { useState } from 'react';
import { FileText, ArrowLeft, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { JobPhase } from '../types/workOrder';
import { JOB_PHASE_COLORS } from '../types/workOrder';

interface AllJobsProps {
  theme: 'dark' | 'light';
}

interface Job {
  id: string;
  workOrderNumber: string;
  property: string;
  propertyId: string;
  unit: string;
  type: 'Paint' | 'Callback' | 'Repair';
  status: JobPhase;
  scheduledDate: string;
  submittedBy: string;
}

export function AllJobs({ theme }: AllJobsProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
  const headerBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50';

  // Mock data - replace with actual data fetching
  const jobs: Job[] = [
    {
      id: '1',
      workOrderNumber: 'WO#46',
      property: 'La Vie SouthPark',
      propertyId: '1',
      unit: '122',
      type: 'Callback',
      status: 'Job Request',
      scheduledDate: '2024-02-27',
      submittedBy: 'John Doe'
    },
    {
      id: '2',
      workOrderNumber: 'WO#45',
      property: 'Riverside Apartments',
      propertyId: '2',
      unit: '204',
      type: 'Paint',
      status: 'Work Order',
      scheduledDate: '2024-02-26',
      submittedBy: 'Sarah Wilson'
    }
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.workOrderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.unit.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: JobPhase) => {
    return `${JOB_PHASE_COLORS[status].bgOpacity} ${JOB_PHASE_COLORS[status].text}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className={textColor} size={28} />
          <h1 className={`text-2xl font-bold ${textColor}`}>All Jobs</h1>
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
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter size={20} className={mutedTextColor} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`px-4 py-2 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                >
                  <option value="all">All Status</option>
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
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={headerBg}>
              <tr>
                <th className={`px-4 py-3 text-left text-sm font-medium ${textColor}`}>WO#</th>
                <th className={`px-4 py-3 text-left text-sm font-medium ${textColor}`}>Property</th>
                <th className={`px-4 py-3 text-left text-sm font-medium ${textColor}`}>Unit</th>
                <th className={`px-4 py-3 text-left text-sm font-medium ${textColor}`}>Type</th>
                <th className={`px-4 py-3 text-left text-sm font-medium ${textColor}`}>Status</th>
                <th className={`px-4 py-3 text-left text-sm font-medium ${textColor}`}>Scheduled Date</th>
                <th className={`px-4 py-3 text-left text-sm font-medium ${textColor}`}>Submitted By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredJobs.map((job) => (
                <tr
                  key={job.id}
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  className="cursor-pointer hover:bg-gray-800/50 transition-colors"
                >
                  <td className={`px-4 py-3 ${textColor}`}>{job.workOrderNumber}</td>
                  <td className={`px-4 py-3 ${textColor}`}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/properties/${job.propertyId}`);
                      }}
                      className={`${textColor} hover:opacity-80`}
                    >
                      {job.property}
                    </button>
                  </td>
                  <td className={`px-4 py-3 ${textColor}`}>{job.unit}</td>
                  <td className={`px-4 py-3 ${textColor}`}>{job.type}</td>
                  <td className={`px-4 py-3`}>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className={`px-4 py-3 ${textColor}`}>{job.scheduledDate}</td>
                  <td className={`px-4 py-3 ${textColor}`}>{job.submittedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}