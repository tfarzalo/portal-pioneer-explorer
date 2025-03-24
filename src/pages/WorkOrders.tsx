
import { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  ArrowLeft, 
  Plus,
  Calendar as CalendarIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WorkOrdersProps {
  theme: 'dark' | 'light';
}

export function WorkOrders({ theme }: WorkOrdersProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
  
  // Mock data - replace with actual data fetching
  const workOrders = [
    {
      id: '1',
      number: 'WO#123',
      property: 'La Vie SouthPark',
      unit: '122',
      status: 'In Progress',
      date: '2023-06-15',
      type: 'Paint'
    },
    {
      id: '2',
      number: 'WO#124',
      property: 'Riverside Apartments',
      unit: '204',
      status: 'Completed',
      date: '2023-06-10',
      type: 'Repair'
    },
    {
      id: '3',
      number: 'WO#125',
      property: 'Pine Valley',
      unit: '305',
      status: 'Pending',
      date: '2023-06-20',
      type: 'Paint'
    }
  ];
  
  const filteredWorkOrders = workOrders.filter(wo => {
    const matchesSearch = 
      wo.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.unit.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || wo.status === statusFilter;
    
    const matchesDate = dateFilter === 'all' || (() => {
      const today = new Date().toISOString().split('T')[0];
      
      if (dateFilter === 'today') {
        return wo.date === today;
      } else if (dateFilter === 'upcoming') {
        return wo.date > today;
      } else if (dateFilter === 'past') {
        return wo.date < today;
      }
      return true;
    })();
    
    return matchesSearch && matchesStatus && matchesDate;
  });
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'bg-blue-500/10 text-blue-500';
      case 'Completed':
        return 'bg-green-500/10 text-green-500';
      case 'Pending':
        return 'bg-yellow-500/10 text-yellow-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className={textColor} size={28} />
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
            onClick={() => navigate('/work-orders/new')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>New Work Order</span>
          </button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${mutedTextColor}`} size={20} />
          <input
            type="text"
            placeholder="Search work orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full md:w-80 pl-10 pr-4 py-2 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
          />
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Filter size={20} className={mutedTextColor} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
            >
              <option value="all">All Statuses</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <CalendarIcon size={20} className={mutedTextColor} />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className={`${cardBg} rounded-lg border ${borderColor} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${borderColor}`}>
                <th className={`px-6 py-3 text-left text-xs font-medium ${mutedTextColor} uppercase tracking-wider`}>
                  Work Order
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${mutedTextColor} uppercase tracking-wider`}>
                  Property
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${mutedTextColor} uppercase tracking-wider`}>
                  Unit
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${mutedTextColor} uppercase tracking-wider`}>
                  Type
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${mutedTextColor} uppercase tracking-wider`}>
                  Status
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${mutedTextColor} uppercase tracking-wider`}>
                  Date
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${mutedTextColor} uppercase tracking-wider`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${borderColor}`}>
              {filteredWorkOrders.map((wo) => (
                <tr 
                  key={wo.id}
                  className={`hover:bg-gray-800/50 cursor-pointer`}
                  onClick={() => navigate(`/work-orders/${wo.id}`)}
                >
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${textColor}`}>
                    {wo.number}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${mutedTextColor}`}>
                    {wo.property}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${mutedTextColor}`}>
                    {wo.unit}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${mutedTextColor}`}>
                    {wo.type}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm`}>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(wo.status)}`}>
                      {wo.status}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${mutedTextColor}`}>
                    {new Date(wo.date).toLocaleDateString()}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${textColor}`}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/work-orders/${wo.id}/edit`);
                      }}
                      className="text-blue-500 hover:text-blue-700 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Are you sure you want to delete this work order?')) {
                          // Handle delete
                          console.log('Delete work order', wo.id);
                        }
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredWorkOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className={`px-6 py-4 text-center ${mutedTextColor}`}>
                    No work orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
