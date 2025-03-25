
import {
  HelpCircle,
  Calendar,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingBag,
  Users,
  Building,
  FileIcon,
  Wrench
} from "lucide-react";
import React, { ReactNode, useState } from "react";
import { useLocation, Link, useNavigate } from 'react-router-dom';

type SidebarItem = {
  title: string;
  href: string;
  icon: ReactNode;
  submenu?: SidebarSubItem[];
  badge?: string;
  badgeColor?: string;
};

type SidebarSubItem = {
  title: string;
  href: string;
};

type SidebarProps = {
  isCollapsed: boolean;
  onCollapse: (isCollapsed: boolean) => void;
};

export function Sidebar({ isCollapsed, onCollapse }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  const isActive = (href: string) => {
    if (href === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(href);
  }

  const sidebarItems: SidebarItem[] = [
    { title: "Dashboard", href: "/", icon: <LayoutDashboard className="h-5 w-5" /> },
    { 
      title: "Jobs", 
      href: "/jobs", 
      icon: <ShoppingBag className="h-5 w-5" />,
      submenu: [
        { title: "All Jobs", href: "/jobs" },
        { title: "Completed", href: "/completed" },
        { title: "Cancelled", href: "/cancelled" },
        { title: "Grading", href: "/grading" },
        { title: "Invoicing", href: "/invoicing" },
      ],
      badge: "45",
      badgeColor: "bg-blue-500"
    },
    { 
      title: "Job Requests", 
      href: "/job-requests", 
      icon: <Package className="h-5 w-5" />,
      badge: "12",
      badgeColor: "bg-red-500"
    },
    { 
      title: "Properties", 
      href: "/properties", 
      icon: <Building className="h-5 w-5" />,
      submenu: [
        { title: "Properties", href: "/properties" },
        { title: "Add Property", href: "/properties/add" },
        { title: "Property Groups", href: "/property-groups" },
        { title: "Add Property Group", href: "/property-groups/add" }
      ]
    },
    { 
      title: "Work Orders", 
      href: "/work-orders", 
      icon: <Wrench className="h-5 w-5" /> 
    },
    { 
      title: "Calendar", 
      href: "/calendar", 
      icon: <Calendar className="h-5 w-5" />,
      submenu: [
        { title: "Full Calendar", href: "/calendar/full" },
        { title: "Agenda", href: "/calendar/agenda" }
      ]
    },
    { 
      title: "Scheduling", 
      href: "/scheduling", 
      icon: <Calendar className="h-5 w-5" /> 
    },
    { 
      title: "JG Management", 
      href: "/jg-management", 
      icon: <Building className="h-5 w-5" /> 
    },
    { 
      title: "File Management", 
      href: "/files", 
      icon: <FileIcon className="h-5 w-5" />,
      submenu: [
        { title: "File Manager", href: "/file-manager" },
        { title: "Add File", href: "/add-file" }
      ]
    },
    { title: "Subcontractors", href: "/subcontractors", icon: <Users className="h-5 w-5" /> },
    { title: "Administrators", href: "/administrators", icon: <Settings className="h-5 w-5" /> },
  ];

  const toggleSubmenu = (title: string) => {
    if (activeSubmenu === title) {
      setActiveSubmenu(null);
    } else {
      setActiveSubmenu(title);
    }
  };

  const handleNavigate = (href: string, hasSubmenu: boolean, title: string) => {
    if (hasSubmenu) {
      toggleSubmenu(title);
    } else {
      navigate(href);
    }
  };

  return (
    <aside className={`sticky top-0 h-screen ${isCollapsed ? 'w-20' : 'w-64'} border-r bg-[#1A1F2C] dark:border-slate-800 text-gray-100 transition-all duration-300`}>
      <div className="flex flex-col gap-4 p-4">
        {/* Company Logo Only */}
        <div className="flex items-center justify-center pt-6 pb-8">
          <img src="/logo.png" alt="JG logo" className="h-12 w-auto" />
        </div>

        {/* Collapse Button */}
        <button 
          onClick={() => onCollapse(!isCollapsed)}
          className="mb-2 p-2 flex justify-center items-center bg-[#151823] hover:bg-[#222938] rounded-md transition-colors"
        >
          {isCollapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <polyline points="15 6 9 12 15 18" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          )}
        </button>

        {/* Main Navigation - Grouped by category */}
        <nav className="flex-1 space-y-6">
          {/* Dashboard Group */}
          <div className="space-y-1">
            <div 
              onClick={() => handleNavigate("/", false, "Dashboard")}
              className={`
                flex cursor-pointer items-center justify-between rounded-md px-3 py-2
                ${isActive("/") ? 'bg-blue-700 text-white' : 'hover:bg-[#222938] text-gray-300 hover:text-white'}
                transition-colors
              `}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="h-5 w-5" />
                {!isCollapsed && <span className="text-sm font-medium">Dashboard</span>}
              </div>
            </div>
          </div>

          {/* Jobs Group */}
          <div className="space-y-1">
            <div className={`${!isCollapsed ? 'px-3 py-2 text-xs font-semibold uppercase text-gray-400' : 'hidden'}`}>
              Jobs
            </div>
            {sidebarItems.slice(1, 5).map((item, index) => (
              <React.Fragment key={index}>
                <div 
                  onClick={() => handleNavigate(item.href, Boolean(item.submenu), item.title)}
                  className={`
                    flex cursor-pointer items-center justify-between rounded-md px-3 py-2
                    ${isActive(item.href) ? 'bg-blue-700 text-white' : 'hover:bg-[#222938] text-gray-300 hover:text-white'}
                    transition-colors
                  `}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    {!isCollapsed && <span className="text-sm font-medium">{item.title}</span>}
                  </div>
                  {!isCollapsed && (
                    <div className="flex items-center">
                      {item.badge && (
                        <span className={`flex items-center justify-center rounded-full ${item.badgeColor} w-5 h-5 text-xs font-semibold text-white mr-2`}>
                          {item.badge}
                        </span>
                      )}
                      {item.submenu && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`h-4 w-4 transition-transform ${activeSubmenu === item.title ? 'rotate-90' : ''}`}
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      )}
                    </div>
                  )}
                </div>

                {/* Submenu items - only show if not collapsed */}
                {!isCollapsed && item.submenu && activeSubmenu === item.title && (
                  <div className="ml-4 space-y-1 pt-1">
                    {item.submenu.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        to={subItem.href}
                        className={`
                          flex cursor-pointer items-center gap-3 rounded-md px-3 py-2
                          ${currentPath === subItem.href ? 'bg-[#222938] text-white' : 'text-gray-400 hover:bg-[#222938] hover:text-white'}
                          transition-colors
                        `}
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-current" />
                        <span className="text-sm">{subItem.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Calendar & Management Group */}
          <div className="space-y-1">
            <div className={`${!isCollapsed ? 'px-3 py-2 text-xs font-semibold uppercase text-gray-400' : 'hidden'}`}>
              Management
            </div>
            {sidebarItems.slice(5, 8).map((item, index) => (
              <React.Fragment key={index}>
                <div 
                  onClick={() => handleNavigate(item.href, Boolean(item.submenu), item.title)}
                  className={`
                    flex cursor-pointer items-center justify-between rounded-md px-3 py-2
                    ${isActive(item.href) ? 'bg-blue-700 text-white' : 'hover:bg-[#222938] text-gray-300 hover:text-white'}
                    transition-colors
                  `}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    {!isCollapsed && <span className="text-sm font-medium">{item.title}</span>}
                  </div>
                  {!isCollapsed && item.submenu && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`h-4 w-4 transition-transform ${activeSubmenu === item.title ? 'rotate-90' : ''}`}
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  )}
                </div>

                {/* Submenu items - only show if not collapsed */}
                {!isCollapsed && item.submenu && activeSubmenu === item.title && (
                  <div className="ml-4 space-y-1 pt-1">
                    {item.submenu.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        to={subItem.href}
                        className={`
                          flex cursor-pointer items-center gap-3 rounded-md px-3 py-2
                          ${currentPath === subItem.href ? 'bg-[#222938] text-white' : 'text-gray-400 hover:bg-[#222938] hover:text-white'}
                          transition-colors
                        `}
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-current" />
                        <span className="text-sm">{subItem.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Files & User Management Group */}
          <div className="space-y-1">
            <div className={`${!isCollapsed ? 'px-3 py-2 text-xs font-semibold uppercase text-gray-400' : 'hidden'}`}>
              Files & Users
            </div>
            {sidebarItems.slice(8).map((item, index) => (
              <React.Fragment key={index}>
                <div 
                  onClick={() => handleNavigate(item.href, Boolean(item.submenu), item.title)}
                  className={`
                    flex cursor-pointer items-center justify-between rounded-md px-3 py-2
                    ${isActive(item.href) ? 'bg-blue-700 text-white' : 'hover:bg-[#222938] text-gray-300 hover:text-white'}
                    transition-colors
                  `}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    {!isCollapsed && <span className="text-sm font-medium">{item.title}</span>}
                  </div>
                  {!isCollapsed && item.submenu && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`h-4 w-4 transition-transform ${activeSubmenu === item.title ? 'rotate-90' : ''}`}
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  )}
                </div>

                {/* Submenu items - only show if not collapsed */}
                {!isCollapsed && item.submenu && activeSubmenu === item.title && (
                  <div className="ml-4 space-y-1 pt-1">
                    {item.submenu.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        to={subItem.href}
                        className={`
                          flex cursor-pointer items-center gap-3 rounded-md px-3 py-2
                          ${currentPath === subItem.href ? 'bg-[#222938] text-white' : 'text-gray-400 hover:bg-[#222938] hover:text-white'}
                          transition-colors
                        `}
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-current" />
                        <span className="text-sm">{subItem.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </nav>

        {/* Help Button */}
        <div className="mt-auto">
          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-gray-400 hover:bg-[#222938] hover:text-white">
            <HelpCircle className="h-5 w-5" />
            {!isCollapsed && <span className="text-sm font-medium">Help</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
