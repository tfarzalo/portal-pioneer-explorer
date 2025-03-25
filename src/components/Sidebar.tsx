
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  Building2,
  Calendar,
  Briefcase,
  BarChart3,
  HelpCircle,
  LogOut,
  Plus,
  FileText,
  CheckCircle,
  XCircle,
  Activity as ActivityIcon,
  Settings,
  FolderKanban,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Shield,
  UserCog,
  Users2,
  CalendarDays,
  Files,
  FolderPlus,
  FileUp
} from 'lucide-react';

interface SidebarProps {
  theme: 'dark' | 'light';
  isCollapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

export function Sidebar({ theme, isCollapsed, onCollapse }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>(['DASHBOARD']);

  const toggleSection = (title: string) => {
    setExpandedSections(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const menuSections = [
    {
      title: 'DASHBOARD',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' }
      ]
    },
    {
      title: 'JOB MANAGEMENT',
      items: [
        { icon: Briefcase, label: 'All Jobs', path: '/jobs' },
        { icon: Plus, label: 'Job Request', path: '/new-job-request' },
        { icon: FileText, label: 'Job Requests', path: '/job-requests' },
        { icon: Briefcase, label: 'Work Orders', path: '/work-orders' },
        { icon: BarChart3, label: 'Grading', path: '/grading' },
        { icon: FileText, label: 'Invoicing', path: '/invoicing' },
        { icon: CheckCircle, label: 'Completed', path: '/completed' },
        { icon: XCircle, label: 'Cancelled', path: '/cancelled' }
      ]
    },
    {
      title: 'PROPERTIES',
      items: [
        { icon: Building2, label: 'Properties', path: '/properties' },
        { icon: Plus, label: 'Add New Property', path: '/add-property' },
        { icon: FolderKanban, label: 'Property Groups', path: '/property-groups' }
      ]
    },
    {
      title: 'FILE MANAGEMENT',
      items: [
        { icon: Files, label: 'File Manager', path: '/file-manager' },
        { icon: FileUp, label: 'Add File', path: '/add-file' }
      ]
    },
    {
      title: 'JG USERS',
      items: [
        { icon: Shield, label: 'Administrators', path: '/administrators' },
        { icon: UserCog, label: 'JG Management', path: '/jg-management' },
        { icon: Users2, label: 'Subcontractors', path: '/subcontractors' }
      ]
    },
    {
      title: 'CALENDAR',
      items: [
        { icon: Calendar, label: 'Full Calendar', path: '/calendar' },
        { icon: Calendar, label: 'Agenda View', path: '/agenda' },
        { icon: CalendarDays, label: 'Scheduling', path: '/scheduling' }
      ]
    },
    {
      title: 'ACTIVITY',
      items: [
        { icon: ActivityIcon, label: 'Activity', path: '/activity' }
      ]
    },
    {
      title: 'SETTINGS',
      items: [
        { icon: Settings, label: 'User Settings', path: '/settings' },
        { icon: HelpCircle, label: 'Support', path: '/support' }
      ]
    }
  ];

  const bgColor = theme === 'dark' ? 'bg-[#0d1117]' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textMutedColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const hoverBgColor = theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100';

  return (
    <div 
      className={`fixed md:sticky top-0 h-screen ${bgColor} flex flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-0 md:w-20 -translate-x-full md:translate-x-0' : 'w-64'
      } border-r ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} z-50`}
    >
      <button
        onClick={() => onCollapse(!isCollapsed)}
        className={`absolute -right-3 top-[72px] z-[999] w-6 h-6 hidden md:flex items-center justify-center ${bgColor} rounded-full ${textMutedColor} hover:${textColor} transition-colors`}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      <div className={`sticky top-0 ${bgColor} z-50 pt-4 px-4 mb-8`}>
        <button 
          onClick={() => navigate('/')}
          className={`flex items-center justify-center hover:opacity-80 transition-opacity ${
            isCollapsed ? 'w-12 h-12' : 'w-16 h-16'
          }`}
        >
          <img 
            src="https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2Fe52523afc5dd39e739b2c71ba64e1c0c.cdn.bubble.io%2Ff1729543691364x706868809103183400%2Fjg-logo-1%2520%25281%2529.png?w=96&h=96&auto=compress&dpr=2&fit=max" 
            alt="JG Painting Pros Inc." 
            className="w-full h-full"
          />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 space-y-2">
        {menuSections.map((section) => (
          <div key={section.title} className="relative">
            {!isCollapsed && (
              <button
                onClick={() => toggleSection(section.title)}
                className={`w-full flex items-center justify-between px-4 py-2 text-xs font-semibold ${textMutedColor} hover:${textColor} transition-colors text-left`}
              >
                <span>{section.title}</span>
                {expandedSections.includes(section.title) ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
              </button>
            )}
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
              !isCollapsed && !expandedSections.includes(section.title) ? 'max-h-0' : 'max-h-[500px]'
            }`}>
              {section.items.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    if (window.innerWidth < 768) {
                      onCollapse(true);
                    }
                  }}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center px-2' : 'justify-start px-6'
                  } py-2 rounded-lg mb-1 transition-all ${
                    location.pathname === item.path
                      ? 'bg-blue-600 text-white'
                      : `${textMutedColor} ${hoverBgColor}`
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon size={20} />
                  {!isCollapsed && <span className="ml-3">{item.label}</span>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className={`sticky bottom-0 ${bgColor} pt-2 pb-4 flex flex-col`}>
        <button 
          className={`flex items-center mx-2 ${
            isCollapsed ? 'justify-center px-2' : 'space-x-3 px-6'
          } py-2 ${textMutedColor} ${hoverBgColor} rounded-lg transition-colors`}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut size={20} />
          {!isCollapsed && <span>Logout</span>}
        </button>
        {!isCollapsed && (
          <div className={`text-center mt-2 text-xs ${textMutedColor}`}>
            Copyright 2025 JG Portal V2.0
          </div>
        )}
      </div>
    </div>
  );
}
