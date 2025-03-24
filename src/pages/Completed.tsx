import { CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import { JobPhaseIndicator } from '../components/JobPhaseIndicator';

interface CompletedProps {
  theme: 'dark' | 'light';
}

interface Job {
  id: string;
  job_number: string;
  property_id: string | null;
  unit_number: string;
  job_type: string;
  phase: string;
  scheduled_date: string | null;
  submitted_by: string | null;
  property_name: string;
  property_address: string;
  created_at: string;
  completed_at: string | null;
}

export function Completed({ theme }: CompletedProps) {
  const navigate = useNavigate();
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const headerTextColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const cardBorder = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
  const sectionBg = theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50';
  const hoverBg = theme === 'dark' ? 'hover:bg-gray-700/30' : 'hover:bg-gray-100';

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCompletedJobs();
  }, []);

  const fetchCompletedJobs = async () => {
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
          created_at,
          completed_at
        `)
        .in('phase', ['completed']);

      if (error) {
        console.error('Error fetching completed jobs:', error);
        toast.error('Failed to load completed jobs.');
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
      console.error('Error fetching completed jobs:', error);
      toast.error('Failed to load completed jobs.');
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      job.job_number.toLowerCase().includes(searchTermLower) ||
      job.property_name.toLowerCase().includes(searchTermLower) ||
      (job.unit_number && job.unit_number.toLowerCase().includes(searchTermLower)) ||
      (job.job_type && job.job_type.toLowerCase().includes(searchTermLower))
    );
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

  const formatJobType = (type: string): string => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleRowClick = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <CheckCircle className={textColor} size={28} />
          <h1 className={`text-2xl font-bold ${textColor}`}>Completed Jobs</h1>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
        >
          <ArrowLeft size={20} />
          <span>Go Back</span>
        </button>
      </div>

      <div className="flex items-center mb-6">
        <div className="relative">
          <CheckCircle className={`absolute left-3 top-1/2 -translate-y-1/2 ${mutedTextColor}`} size={20} />
          <input
            type="text"
            placeholder="Search completed jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-64 pl-10 pr-4 py-2 rounded-lg border ${inputBg} ${cardBorder} ${textColor} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
          />
        </div>
      </div>

      <div className={`${cardBg} rounded-xl border ${cardBorder} overflow-hidden shadow-sm`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className={`${sectionBg}`}>
              <tr>
                <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${headerTextColor}`}>Job #</th>
                <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${headerTextColor}`}>Property</th>
                <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${headerTextColor}`}>Unit</th>
                <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${headerTextColor}`}>Type</th>
                <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${headerTextColor}`}>Phase</th>
                <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${headerTextColor}`}>Completed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className={`px-6 py-4 whitespace-nowrap text-center ${textColor}`}>
                    Loading completed jobs...
                  </td>
                </tr>
              ) : filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className={`px-6 py-4 whitespace-nowrap text-center ${textColor}`}>
                    No completed jobs found.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr 
                    key={job.id} 
                    onClick={() => handleRowClick(job.id)}
                    className={`cursor-pointer ${hoverBg} transition-colors`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`font-medium ${textColor}`}>{job.job_number}</div>
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
                      <JobPhaseIndicator phase={job.phase as JobPhase} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`font-medium ${textColor}`}>{formatDate(job.completed_at)}</div>
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
