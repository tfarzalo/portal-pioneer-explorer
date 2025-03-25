
import { Briefcase, Calendar, CheckCircle, Clock } from 'lucide-react';

interface PropertyStatsProps {
  theme: 'dark' | 'light';
}

export function PropertyStats({ theme }: PropertyStatsProps) {
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  const stats = [
    {
      label: 'Total Jobs',
      value: '42',
      icon: Briefcase,
      color: 'bg-blue-600'
    },
    {
      label: 'Active Jobs',
      value: '3',
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      label: 'Scheduled Jobs',
      value: '5',
      icon: Calendar,
      color: 'bg-purple-500'
    },
    {
      label: 'Completed',
      value: '38',
      icon: CheckCircle,
      color: 'bg-green-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className={`${cardBg} p-4 rounded-lg border ${borderColor} flex items-center space-x-4`}
        >
          <div className={`${stat.color} p-3 rounded-lg`}>
            <stat.icon className="text-white" size={24} />
          </div>
          <div>
            <div className={`text-2xl font-bold ${textColor}`}>{stat.value}</div>
            <div className={mutedTextColor}>{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
