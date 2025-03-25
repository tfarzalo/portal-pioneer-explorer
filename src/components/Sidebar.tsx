
import {
  BarChart,
  CheckSquare,
  Clock,
  HelpCircle,
  Calendar,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingBag,
  Users,
  Building,
  BuildingIcon,
  Wrench,
  FileIcon,
  Folder
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

export function Sidebar() {
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
        { title: "Scheduling", href: "/scheduling" },
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
      title: "JG Management", 
      href: "/jg-management", 
      icon: <BuildingIcon className="h-5 w-5" /> 
    },
    { 
      title: "File Management", 
      href: "/files", 
      icon: <FileIcon className="h-5 w-5" />,
      submenu: [
        { title: "File Manager", href: "/files" },
        { title: "Add File", href: "/files/add" }
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
    <aside className="sticky top-0 h-screen w-64 border-r bg-background dark:border-slate-700 dark:bg-[#1F2230]">
      <div className="flex flex-col gap-4 p-4">
        {/* Company Logo and Name */}
        <div className="flex items-center gap-3 pt-6 pb-8">
          <img src="/logo.png" alt="JG logo" className="h-10 w-auto" />
          <span className="text-xl font-bold text-foreground">JG Painting</span>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-1">
          {sidebarItems.map((item, index) => (
            <React.Fragment key={index}>
              <div 
                onClick={() => handleNavigate(item.href, Boolean(item.submenu), item.title)}
                className={`
                  flex cursor-pointer items-center justify-between rounded-md px-3 py-2
                  ${isActive(item.href) ? 'bg-accent dark:bg-blue-700 text-white' : 'hover:bg-accent/50 hover:text-accent-foreground'}
                  transition-colors
                `}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-sm font-medium">{item.title}</span>
                </div>
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
              </div>

              {/* Submenu items */}
              {item.submenu && activeSubmenu === item.title && (
                <div className="ml-4 space-y-1 pt-1">
                  {item.submenu.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      to={subItem.href}
                      className={`
                        flex cursor-pointer items-center gap-3 rounded-md px-3 py-2
                        ${currentPath === subItem.href ? 'bg-accent/50 text-foreground' : 'hover:bg-accent/25 hover:text-accent-foreground'}
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
        </nav>

        {/* Help Button */}
        <div className="mt-auto">
          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground">
            <HelpCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Help</span>
          </button>
        </div>

      </div>
    </aside>
  );
}
