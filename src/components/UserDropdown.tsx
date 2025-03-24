import { useNavigate } from 'react-router-dom';
import { Settings, LogOut } from 'lucide-react';

interface UserDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
  userName: string;
  userRole: string;
}

export function UserDropdown({ isOpen, onClose, theme, userName, userRole }: UserDropdownProps) {
  const navigate = useNavigate();
  const bgColor = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const hoverBg = theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50';

  if (!isOpen) return null;

  const menuItems = [
    {
      icon: Settings,
      label: 'User Settings',
      onClick: () => {
        navigate('/settings');
        onClose();
      }
    },
    {
      icon: LogOut,
      label: 'Logout',
      onClick: () => {
        // Handle logout
        onClose();
      },
      className: theme === 'dark' ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'
    }
  ];

  return (
    <div className={`absolute right-0 top-12 w-64 ${bgColor} rounded-lg shadow-lg border ${borderColor} z-50`}>
      <div className="p-4 border-b border-gray-700">
        <h2 className={`text-lg font-semibold ${textColor}`}>{userName}</h2>
        <p className={`text-sm ${mutedTextColor}`}>{userRole}</p>
      </div>
      
      <div className="py-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className={`w-full px-4 py-2 flex items-center space-x-3 ${hoverBg} transition-colors ${
              item.className || textColor
            }`}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
