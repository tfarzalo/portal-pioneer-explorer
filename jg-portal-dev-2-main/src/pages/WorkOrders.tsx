import React, { useState } from 'react';
import { Briefcase, ArrowLeft, Search, Filter, FileDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { JobPhase } from '../types/workOrder';
import { JOB_PHASE_COLORS } from '../types/workOrder';
import { ExportOptions } from '../components/ExportOptions';

interface WorkOrdersProps {
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
  submittedBy: string;
}

export function WorkOrders({ theme }: WorkOrdersProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [phaseFilter, setPhaseFilter] = useState<string>('all');
  const [showExport, setShowExport] = useState(false);

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
      phase: 'Work Order',
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
      phase: 'Pending Work Order',
      scheduledDate: '2024-02-26',
      submittedBy: 'Sarah Wilson'
    }
  ];

  const columns = [
    { header: 'Work Order #', accessor: 'workOrderNumber' },
    { header: 'Property', accessor: 'property' },
    { header: 'Unit', accessor: 'unit' },
    { header: 'Type', accessor: 'type' },
    { header: 'Phase', accessor: 'phase' },
    { header: 'Scheduled Date', accessor: 'scheduledDate' },
    { header: 'Submitted By', accessor: 'submittedBy' }
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.workOrderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.unit.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPhase = phaseFilter === 'all' || job.phase === phaseFilter;
    
    return matchesSearch && matchesPhase;
  });

  const getPhaseColor = (phase: JobPhase) => {
    return `${JOB_PHASE_COLORS[phase].bgOpacity} ${JOB_PHASE_COLORS[phase].text}`;
  };

  const toggleExport = () => {
    setShowExport(!showExport);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Briefcase className={textColor} size={28} />
          <h1 className={`text-2xl font-bold ${textColor}`}>Work Orders</h1>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <ArrowLeft size={20} />
            <span>Go Back</span>
          </button>
          <button
            onClick={() => navigate('/new-job-request')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            New Job Request
          </button>
        </div>
      </div>

      <div className={`${cardBg} rounded-lg border ${borderColor}`}>
        <div className="p-4 border-b border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${mutedTextColor}`} size={20} />
              <input
                type="text"
                placeholder="Search work orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter size={20} className={mutedTextColor} />
                <select
                  value={phaseFilter}
                  onChange={(e) => setPhaseFilter(e.target.value)}
                  className={`px-4 py-2 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                >
                  <option value="all">All Phases</option>
                  <option value="Work Order">Work Order</option>
                  <option value="Pending Work Order">Pending Work Order</option>
                </select>
              </div>
              <button
                onClick={toggleExport}
                className={`px-4 py-2 ${showExport ? 'bg-blue-700' : 'bg-blue-600'} text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2`}
              >
                <FileDown size={20} />
                <span>Export</span>
              </button>
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
                <th className={`px-4 py-3 text-left text-sm font-medium ${textColor}`}>Phase</th>
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
                    <span className={`px-2 py-1 rounded-full text-xs ${getPhaseColor(job.phase)}`}>
                      {job.phase}
                    </span>
                  </td>
                  <td className={`px-4 py-3 ${textColor}`}>{job.scheduledDate}</td>
                  <td className={`px-4 py-3 ${textColor}`}>{job.submittedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ExportOptions
          theme={theme}
          data={filteredJobs}
          columns={columns}
          filename="work_orders"
          isVisible={showExport}
        />
      </div>
    </div>
  );
}