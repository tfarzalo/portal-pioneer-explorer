import { useNavigate } from 'react-router-dom';
import { 
  FileText,
  Wrench,
  Star,
  FileCheck,
  CheckCircle,
  Plus
} from 'lucide-react';

interface DashboardProps {
  theme: 'dark' | 'light';
}

export function Dashboard({ theme }: DashboardProps) {
  const navigate = useNavigate();
  const stats = [
    {
      title: 'Job Requests',
      value: '24',
      change: '+12% vs previous 30 days',
      icon: FileText,
      color: 'bg-[#3B82F6]'
    },
    {
      title: 'Work Orders',
      value: '18',
      change: '+5% vs previous 30 days',
      icon: Wrench,
      color: 'bg-[#F97316]'
    },
    {
      title: 'Jobs in Grading',
      value: '12',
      change: '-8% vs previous 30 days',
      icon: Star,
      color: 'bg-[#A855F7]'
    },
    {
      title: 'Jobs in Invoicing',
      value: '15',
      change: '+15% vs previous 30 days',
      icon: FileCheck,
      color: 'bg-[#10B981]'
    },
    {
      title: 'Completed Jobs',
      value: '42',
      change: '+20% vs previous 30 days',
      icon: CheckCircle,
      color: 'bg-red-500'
    }
  ];

  const jobRequests = [
    { id: '1', property: 'Riverside Apartments', unit: '204', date: '2024-03-20' },
    { id: '2', property: 'Oakwood Heights', unit: '103', date: '2024-03-19' },
    { id: '3', property: 'Pine Valley Complex', unit: '308', date: '2024-03-19' },
    { id: '4', property: 'Sunset Gardens', unit: '401', date: '2024-03-18' }
  ];

  const workOrders = [
    { 
      id: 'WO#123456',
      propertyId: '1',
      property: 'Riverside Apartments',
      unit: '204',
      date: '2024-03-20',
      status: 'work-order'
    },
    { 
      id: 'WO#123457',
      propertyId: '2',
      property: 'Oakwood Heights',
      unit: '103',
      date: '2024-03-19',
      status: 'pending'
    },
    { 
      id: 'WO#123458',
      propertyId: '3',
      property: 'Pine Valley Complex',
      unit: '308',
      date: '2024-03-19',
      status: 'work-order'
    }
  ];

  const todaysAgenda = [
    { propertyId: '1', property: 'Riverside Apartments', unit: '204', type: 'Paint', status: 'Work Order' },
    { propertyId: '2', property: 'Oakwood Heights', unit: '103', type: 'Callback', status: 'Pending Work Order' },
    { propertyId: '3', property: 'Pine Valley Complex', unit: '308', type: 'Paint', status: 'Job Request' }
  ];

  const jobCounts = {
    total: todaysAgenda.length,
    paint: todaysAgenda.filter(job => job.type === 'Paint').length,
    callback: todaysAgenda.filter(job => job.type === 'Callback').length,
    repair: todaysAgenda.filter(job => job.type === 'Repair').length
  };

  const messages = [
    { 
      sender: 'John Doe',
      message: 'Paint job completed for Unit 204',
      time: '10:30 AM'
    },
    {
      sender: 'Sarah Wilson',
      message: 'Inspection scheduled for tomorrow',
      time: '11:15 AM'
    },
    {
      sender: 'Mike Johnson',
      message: 'Need additional supplies for Unit 308',
      time: '12:45 PM'
    }
  ];

  const gradingJobs = [
    { id: 'WO#123459', propertyId: '1', property: 'Riverside Apartments', unit: '204', date: '2024-03-20' },
    { id: 'WO#123460', propertyId: '2', property: 'Oakwood Heights', unit: '103', date: '2024-03-19' }
  ];

  const invoicingJobs = [
    { id: 'WO#123461', propertyId: '3', property: 'Pine Valley Complex', unit: '308', amount: '$1,890' },
    { id: 'WO#123462', propertyId: '4', property: 'Sunset Gardens', unit: '401', amount: '$2,340' }
  ];

  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-[#1F2230]' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const mutedTextColor = isDark ? 'text-[#94A3B8]' : 'text-gray-500';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const inputBg = isDark ? 'bg-[#151823]' : 'bg-gray-50';
  const jobCountBg = isDark ? 'bg-[#151823]' : 'bg-gray-100';

  return (
    <div className={`space-y-8 ${textColor}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`${cardBg} p-3 rounded-lg shadow-sm min-h-[100px] flex flex-col justify-between`}
          >
            <div className={`${stat.color} w-8 h-8 rounded-lg flex items-center justify-center mb-2`}>
              <stat.icon className="text-white" size={16} />
            </div>
            <div>
              <div className="text-xl font-bold mb-0.5">{stat.value}</div>
              <div className={`text-xs ${mutedTextColor}`}>{stat.title}</div>
              <div className="text-[10px] text-green-500 mt-1">{stat.change}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={`${cardBg} p-4 rounded-lg shadow-sm relative before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-[#3B82F6] before:rounded-t-lg min-h-[400px] flex flex-col`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold text-[#3B82F6]">Job Requests</h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => navigate('/job-requests')}
                className="text-[#3B82F6] text-xs hover:underline"
              >
                View All
              </button>
              <button 
                onClick={() => navigate('/new-job-request')}
                className="bg-[#3B82F6] text-white px-2 py-1 rounded text-xs flex items-center space-x-1"
              >
                <Plus size={12} />
                <span>Job Request</span>
              </button>
            </div>
          </div>
          <div className="flex-1">
            <table className="w-full">
              <thead>
                <tr className={`text-left text-xs ${mutedTextColor}`}>
                  <th className="pb-2">Property Name</th>
                  <th className="pb-2">Unit #</th>
                  <th className="pb-2">Date</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {jobRequests.map((request, index) => (
                  <tr key={index} className={`border-t ${borderColor}`}>
                    <td className="py-2">
                      <button
                        onClick={() => navigate(`/properties/${request.id}`)}
                        className={`${textColor} hover:opacity-80`}
                      >
                        {request.property}
                      </button>
                    </td>
                    <td className="py-2">{request.unit}</td>
                    <td className="py-2">{request.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={`${cardBg} p-4 rounded-lg shadow-sm relative before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-[#F97316] before:rounded-t-lg min-h-[400px] flex flex-col`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold text-[#F97316]">Work Orders</h2>
            <button 
              onClick={() => navigate('/work-orders')}
              className="text-[#F97316] text-xs hover:underline"
            >
              View All
            </button>
          </div>
          <div className="flex-1">
            <table className="w-full">
              <thead>
                <tr className={`text-left text-xs ${mutedTextColor}`}>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Property Name</th>
                  <th className="pb-2">Unit #</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {workOrders.map((order, index) => (
                  <tr key={index} className={`border-t ${borderColor}`}>
                    <td className="py-2">
                      <div className="flex items-center space-x-2">
                        <span className={`relative flex h-2.5 w-2.5 ${
                          order.status === 'work-order' ? 'text-[#F97316]' : 'text-yellow-500'
                        }`}>
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-current"></span>
                        </span>
                        <span className={`text-xs ${mutedTextColor}`}>{order.id}</span>
                      </div>
                    </td>
                    <td className="py-2">
                      <button
                        onClick={() => navigate(`/properties/${order.propertyId}`)}
                        className={`${textColor} hover:opacity-80`}
                      >
                        {order.property}
                      </button>
                    </td>
                    <td className="py-2">{order.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={`${cardBg} p-4 rounded-lg shadow-sm min-h-[400px] flex flex-col`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold">Today's Agenda</h2>
            <button 
              onClick={() => navigate('/calendar')}
              className={`${mutedTextColor} text-xs hover:underline`}
            >
              View Calendar
            </button>
          </div>
          <div className={`${jobCountBg} rounded-lg p-3 mb-4`}>
            <div className="flex items-center space-x-4 text-sm">
              <span>Today's Jobs: {jobCounts.total}</span>
              <span className="text-[#F97316]">Paint: {jobCounts.paint}</span>
              <span className="text-yellow-500">Callback: {jobCounts.callback}</span>
              <span className="text-[#10B981]">Repair: {jobCounts.repair}</span>
            </div>
          </div>
          <div className="space-y-3 flex-1">
            {todaysAgenda.map((item, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg ${
                  item.type === 'Paint' ? 'bg-[#F97316]/10 border-l-4 border-[#F97316]' :
                  item.type === 'Callback' ? 'bg-yellow-500/10 border-l-4 border-yellow-500' :
                  item.type === 'Repair' ? 'bg-[#10B981]/10 border-l-4 border-[#10B981]' :
                  'bg-gray-500/10 border-l-4 border-gray-500'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <button
                      onClick={() => navigate(`/properties/${item.propertyId}`)}
                      className={`${textColor} hover:opacity-80 text-sm font-semibold`}
                    >
                      {item.property}
                    </button>
                    <p className={`text-xs ${mutedTextColor}`}>Unit {item.unit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium">{item.type}</p>
                    <p className={`text-[10px] ${mutedTextColor}`}>{item.status}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={`${cardBg} p-4 rounded-lg shadow-sm relative before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-[#A855F7] before:rounded-t-lg min-h-[300px] flex flex-col`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold text-[#A855F7]">Grading</h2>
            <button 
              onClick={() => navigate('/grading')}
              className="text-[#A855F7] text-xs hover:underline"
            >
              View All
            </button>
          </div>
          <div className="flex-1">
            <table className="w-full">
              <thead>
                <tr className={`text-left text-xs ${mutedTextColor}`}>
                  <th className="pb-2">WO#</th>
                  <th className="pb-2">Property</th>
                  <th className="pb-2">Unit #</th>
                  <th className="pb-2">Date</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {gradingJobs.map((job, index) => (
                  <tr key={index} className={`border-t ${borderColor}`}>
                    <td className="py-2">{job.id}</td>
                    <td className="py-2">
                      <button
                        onClick={() => navigate(`/properties/${job.propertyId}`)}
                        className={`${textColor} hover:opacity-80`}
                      >
                        {job.property}
                      </button>
                    </td>
                    <td className="py-2">{job.unit}</td>
                    <td className="py-2">{job.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={`${cardBg} p-4 rounded-lg shadow-sm relative before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-[#10B981] before:rounded-t-lg min-h-[300px] flex flex-col`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold text-[#10B981]">Invoicing</h2>
            <button 
              onClick={() => navigate('/invoicing')}
              className="text-[#10B981] text-xs hover:underline"
            >
              View All
            </button>
          </div>
          <div className="flex-1">
            <table className="w-full">
              <thead>
                <tr className={`text-left text-xs ${mutedTextColor}`}>
                  <th className="pb-2">WO#</th>
                  <th className="pb-2">Property</th>
                  <th className="pb-2">Unit #</th>
                  <th className="pb-2">Amount</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {invoicingJobs.map((job, index) => (
                  <tr key={index} className={`border-t ${borderColor}`}>
                    <td className="py-2">{job.id}</td>
                    <td className="py-2">
                      <button
                        onClick={() => navigate(`/properties/${job.propertyId}`)}
                        className={`${textColor} hover:opacity-80`}
                      >
                        {job.property}
                      </button>
                    </td>
                    <td className="py-2">{job.unit}</td>
                    <td className="py-2">{job.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={`${cardBg} p-4 rounded-lg shadow-sm min-h-[300px] flex flex-col`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold">On-Site Messaging</h2>
          </div>
          <div className="space-y-3 flex-1">
            {messages.map((message, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="text-sm font-semibold">{message.sender}</h3>
                    <span className={`text-xs ${mutedTextColor}`}>{message.time}</span>
                  </div>
                  <p className={`text-xs ${mutedTextColor}`}>{message.message}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <input
              type="text"
              placeholder="Type your message..."
              className={`w-full p-2 rounded text-xs border ${inputBg} ${borderColor} ${textColor} placeholder-${mutedTextColor}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
