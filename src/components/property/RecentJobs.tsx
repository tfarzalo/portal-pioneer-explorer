
import { useNavigate } from 'react-router-dom';
import { PropertyDetails } from '../../types';

interface RecentJobsProps {
  propertyDetails: PropertyDetails;
  propertyId: string;
  theme: 'dark' | 'light';
}

export function RecentJobs({ propertyDetails, propertyId, theme }: RecentJobsProps) {
  const navigate = useNavigate();
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const sectionBg = theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50';

  return (
    <div className={`${cardBg} rounded-lg border ${borderColor} p-6`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-lg font-semibold ${textColor}`}>Recent Jobs</h2>
        <button 
          onClick={() => navigate(`/properties/${propertyId}/jobs`)}
          className="text-blue-500 hover:text-blue-600"
        >
          View All
        </button>
      </div>
      <div className={`${sectionBg} rounded-lg overflow-hidden`}>
        <table className="w-full">
          <thead>
            <tr className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <th className={`px-4 py-2 text-left text-sm ${textColor}`}>WO#</th>
              <th className={`px-4 py-2 text-left text-sm ${textColor}`}>Unit</th>
              <th className={`px-4 py-2 text-left text-sm ${textColor}`}>Type</th>
              <th className={`px-4 py-2 text-left text-sm ${textColor}`}>Status</th>
              <th className={`px-4 py-2 text-left text-sm ${textColor}`}>Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {propertyDetails.recentJobs.map((job) => (
              <tr key={job.id}>
                <td className={`px-4 py-2 ${textColor}`}>{job.id}</td>
                <td className={`px-4 py-2 ${textColor}`}>{job.unit}</td>
                <td className={`px-4 py-2 ${textColor}`}>{job.type}</td>
                <td className={`px-4 py-2`}>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    job.status === 'Completed' 
                      ? 'bg-green-500/20 text-green-500' 
                      : 'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {job.status}
                  </span>
                </td>
                <td className={`px-4 py-2 ${textColor}`}>{job.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
