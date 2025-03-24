import { X, FileText, CheckCircle, MessageSquare, AlertCircle } from 'lucide-react';

interface Notification {
  id: string;
  type: 'job_request' | 'status_change' | 'message' | 'urgent';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
}

export function NotificationsPopover({ isOpen, onClose, theme }: NotificationsPopoverProps) {
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'job_request',
      title: 'New Job Request',
      message: 'Unit 204 at Riverside Apartments requires painting',
      time: '5 minutes ago',
      read: false
    },
    {
      id: '2',
      type: 'status_change',
      title: 'Status Change',
      message: 'Work Order #WO-2024-001 marked as Completed',
      time: '10 minutes ago',
      read: false
    },
    {
      id: '3',
      type: 'message',
      title: 'New Message',
      message: 'John: Need additional supplies for Unit 308',
      time: '15 minutes ago',
      read: false
    },
    {
      id: '4',
      type: 'urgent',
      title: 'Urgent Request',
      message: 'Immediate attention needed at Oakwood Heights',
      time: '20 minutes ago',
      read: false
    }
  ];

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'job_request':
        return <FileText className="text-blue-500" size={20} />;
      case 'status_change':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'message':
        return <MessageSquare className="text-purple-500" size={20} />;
      case 'urgent':
        return <AlertCircle className="text-red-500" size={20} />;
    }
  };

  if (!isOpen) return null;

  const bgColor = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const hoverBg = theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50';

  return (
    <div className={`absolute right-0 top-12 w-96 ${bgColor} rounded-lg shadow-lg border ${borderColor} z-50`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className={`text-lg font-semibold ${textColor}`}>Notifications</h2>
        <div className="flex items-center space-x-4">
          <button 
            className={`text-sm ${mutedTextColor} hover:text-blue-500`}
            onClick={() => {/* Mark all as read */}}
          >
            Mark all as read
          </button>
          <button 
            onClick={onClose}
            className={`${mutedTextColor} hover:text-white`}
          >
            <X size={20} />
          </button>
        </div>
      </div>
      
      <div className="max-h-[480px] overflow-y-auto">
        {notifications.map((notification) => (
          <div 
            key={notification.id}
            className={`p-4 border-b ${borderColor} ${hoverBg} cursor-pointer relative`}
          >
            <div className="flex items-start space-x-3">
              {getIcon(notification.type)}
              <div className="flex-1 pr-8">
                <span className={`block text-xs ${mutedTextColor} mb-1`}>{notification.time}</span>
                <h3 className={`font-medium ${textColor}`}>{notification.title}</h3>
                <p className={`text-sm ${mutedTextColor} mt-1`}>{notification.message}</p>
              </div>
            </div>
            {!notification.read && (
              <div className="absolute top-4 right-3 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
