
import { useState, useEffect } from 'react';
import { Table, ArrowUpDown, Search, Filter, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { JobPhase } from '../types/workOrder';
import { JOB_PHASE_COLORS } from '../types/workOrder';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import { JobPhaseIndicator } from '../components/JobPhaseIndicator';

interface AllJobsProps {
  theme: 'dark' | 'light';
}

interface Job {
  id: string;
  job_number: string;
  property_id: string | null;
  unit_number: string;
  job_type: string; 
  phase: JobPhase;
  scheduled_date: string | null;
  submitted_by: string | null;
  property_name: string;
  property_address: string;
  created_at: string;
}

export function AllJobs({ theme }: AllJobsProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof Job | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [phaseFilter, setPhaseFilter] = useState<JobPhase | 'all'>('all');
  const navigate = useNavigate();

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const headerTextColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
  const sectionBg = theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50';
  const hoverBg = theme === 'dark' ? 'hover:bg-gray-700/30' : 'hover:bg-gray-100';

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          id,
          job_number,
          property_id,
          unit_number,
          job_type,
          phase,
          scheduled_date,
          submitted_by,
          properties (property_name, property_address),
          created_at
        `);

      if (error) {
        console.error('Error fetching jobs:', error);
        toast.error('Failed to load jobs.');
        return;
      }

      if (data) {
        const jobsWithPropertyInfo = data.map(job => ({
          ...job,
          property_name: job.properties ? job.properties.property_name : 'N/A',
          property_address: job.properties ? job.properties.property_address : 'N/A',
        })) as any;

        setJobs(jobsWithPropertyInfo);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (column: keyof Job) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedJobs = [...jobs].sort((a, b) => {
    if (!sortColumn) return 0;

    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (aValue === null || aValue === undefined) return sortDirection === 'asc' ? -1 : 1;
    if (bValue === null || bValue === undefined) return sortDirection === 'asc' ? 1 : -1;

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const filteredJobs = sortedJobs.filter(job => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      job.job_number.toLowerCase().includes(searchTermLower) ||
      (job.property_name && job.property_name.toLowerCase().includes(searchTermLower)) ||
      (job.unit_number && job.unit_number.toLowerCase().includes(searchTermLower)) ||
      (job.job_type && job.job_type.toLowerCase().includes(searchTermLower))
    );
  }).filter(job => {
    return phaseFilter === 'all' || job.phase === phaseFilter;
  });

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  const getPhaseColor = (phase: JobPhase) => {
    const colors = JOB_PHASE_COLORS[phase];
    return colors || {
      bgOpacity: 'bg-gray-200/10',
      border: 'border-gray-200',
      text: 'text-gray-500'
    };
  };

  const handleRowClick = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  const formatPhase = (phase: JobPhase): string => {
    if (phase.includes('_')) {
      return phase
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    return phase;
  };

  const formatJobType = (type: string): string => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const displayJobNumber = (job: Job) => {
    if (job.phase === 'job_request' || job.phase === 'Job Request') {
      return "-";
    }
    return job.job_number;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Table className={textColor} size={28} />
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

      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${mutedTextColor}`} size={20} />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-64 pl-10 pr-4 py-2 rounded-lg border ${inputBg} ${borderColor} ${textColor} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={20} className={mutedTextColor} />
            <select
              value={phaseFilter}
              onChange={(e) => setPhaseFilter(e.target.value as JobPhase | 'all')}
              className={`px-4 py-2 rounded-lg border ${inputBg} ${borderColor} ${textColor} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
            >
              <option value="all">All Phases</option>
              {Object.keys(JOB_PHASE_COLORS).map((phase) => (
                <option key={phase} value={phase}>{formatPhase(phase as JobPhase)}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className={`${cardBg} rounded-xl border ${borderColor} overflow-hidden shadow-sm`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className={`${sectionBg}`}>
              <tr>
                <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${headerTextColor}`}>
                  <button onClick={() => handleSort('job_number')} className="flex items-center space-x-2">
                    <span>Job #</span>
                    {sortColumn === 'job_number' && (
                      <ArrowUpDown className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${headerTextColor}`}>
                  <button onClick={() => handleSort('property_name')} className="flex items-center space-x-2">
                    <span>Property</span>
                    {sortColumn === 'property_name' && (
                      <ArrowUpDown className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${headerTextColor}`}>
                  <button onClick={() => handleSort('unit_number')} className="flex items-center space-x-2">
                    <span>Unit</span>
                    {sortColumn === 'unit_number' && (
                      <ArrowUpDown className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${headerTextColor}`}>
                  <button onClick={() => handleSort('job_type')} className="flex items-center space-x-2">
                    <span>Type</span>
                    {sortColumn === 'job_type' && (
                      <ArrowUpDown className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${headerTextColor}`}>
                  <button onClick={() => handleSort('phase')} className="flex items-center space-x-2">
                    <span>Phase</span>
                    {sortColumn === 'phase' && (
                      <ArrowUpDown className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${headerTextColor}`}>
                  <button onClick={() => handleSort('scheduled_date')} className="flex items-center space-x-2">
                    <span>Scheduled</span>
                    {sortColumn === 'scheduled_date' && (
                      <ArrowUpDown className="h-4 w-4" />
                    )}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className={`px-6 py-4 whitespace-nowrap text-center ${textColor}`}>
                    Loading jobs...
                  </td>
                </tr>
              ) : filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className={`px-6 py-4 whitespace-nowrap text-center ${textColor}`}>
                    No jobs found.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr 
                    key={job.id} 
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    className={`cursor-pointer ${hoverBg} transition-colors group`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`font-medium ${textColor}`}>{displayJobNumber(job)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`font-medium ${textColor}`}>{job.property_name}</div>
                      <div className={`${mutedTextColor} text-sm truncate max-w-md`}>{job.property_address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`font-medium ${textColor}`}>{job.unit_number || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`font-medium ${textColor}`}>{formatJobType(job.job_type)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <JobPhaseIndicator phase={job.phase} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`font-medium ${textColor}`}>{formatDate(job.scheduled_date)}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
