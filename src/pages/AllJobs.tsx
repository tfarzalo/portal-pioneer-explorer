
import { useState, useEffect } from 'react';
import { FileText, ArrowLeft, Search, Filter, Loader2 } from 'lucide-react';
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
  job_type: string; // Changed from "Paint" | "Callback" | "Repair" to string to accept lowercase values
  phase: JobPhase;
  scheduled_date: string | null;
  submitted_by: string | null;
  property_name?: string;
}

export function AllJobs({ theme }: AllJobsProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
  const headerBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50';

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        
        // Fetch jobs with a join to properties to get property names
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
            properties:property_id (name)
          `)
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        // Transform the data to match our Job interface
        const formattedJobs: Job[] = data.map(job => ({
          id: job.id,
          job_number: job.job_number,
          property_id: job.property_id,
          unit_number: job.unit_number,
          job_type: job.job_type,
          phase: job.phase as JobPhase,
          scheduled_date: job.scheduled_date,
          submitted_by: job.submitted_by,
          property_name: job.properties?.name
        }));
        
        setJobs(formattedJobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setError('Failed to load jobs. Please try again later.');
        toast.error('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    }
    
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.job_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.property_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.unit_number?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || job.phase === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Helper function to safely get status color
  const getStatusColor = (status: JobPhase) => {
    // Check if the color exists in our mapping
    if (JOB_PHASE_COLORS[status]) {
      return `${JOB_PHASE_COLORS[status].bgOpacity} ${JOB_PHASE_COLORS[status].text}`;
    }
    
    // Fallback to a default color
    return 'bg-gray-100 text-gray-500';
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
                  <option value="job_request">Job Request</option>
                  <option value="work_order">Work Order</option>
                  <option value="pending_work_order">Pending Work Order</option>
                  <option value="grading">Grading</option>
                  <option value="invoicing">Invoicing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin mr-2" size={24} />
              <span className={textColor}>Loading jobs...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
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
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <tr
                      key={job.id}
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="cursor-pointer hover:bg-gray-800/50 transition-colors"
                    >
                      <td className={`px-4 py-3 ${textColor}`}>{job.job_number}</td>
                      <td className={`px-4 py-3 ${textColor}`}>
                        {job.property_id ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/properties/${job.property_id}`);
                            }}
                            className={`${textColor} hover:opacity-80`}
                          >
                            {job.property_name || 'Unknown Property'}
                          </button>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td className={`px-4 py-3 ${textColor}`}>{job.unit_number || 'N/A'}</td>
                      <td className={`px-4 py-3 ${textColor}`}>{job.job_type || 'N/A'}</td>
                      <td className={`px-4 py-3`}>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(job.phase)}`}>
                          {job.phase || 'Unknown'}
                        </span>
                      </td>
                      <td className={`px-4 py-3 ${textColor}`}>
                        {job.scheduled_date 
                          ? new Date(job.scheduled_date).toLocaleDateString() 
                          : 'Not scheduled'}
                      </td>
                      <td className={`px-4 py-3 ${textColor}`}>{job.submitted_by || 'Unknown'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className={`px-4 py-10 text-center ${mutedTextColor}`}>
                      No jobs found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
