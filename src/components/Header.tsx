import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sun, Moon, Bell, Plus, User, Menu, X, Calendar, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NotificationsPopover } from './NotificationsPopover';
import { UserDropdown } from './UserDropdown';
import { SearchPopover } from './SearchPopover';

interface HeaderProps {
  theme: 'dark' | 'light';
  onThemeToggle: () => void;
  onToggleSidebar: () => void;
}

export function Header({ theme, onThemeToggle, onToggleSidebar }: HeaderProps) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [hasUnread] = useState(true);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const searchButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showSearch && searchButtonRef.current && !searchButtonRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSearch]);

  return (
    <div className={`sticky top-0 z-50 px-4 md:px-6 py-4 flex items-center justify-between border-b ${
      theme === 'dark' 
        ? 'bg-[#151823] border-gray-800' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className={`p-2 rounded-lg transition-colors md:hidden ${
            theme === 'dark'
              ? 'hover:bg-[#1F2230] text-gray-300 hover:text-white'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>

        <div className="flex items-center space-x-4">
          <div className="relative" ref={searchButtonRef}>
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`p-2 rounded-lg transition-colors bg-[#FDA49A]/20 hover:bg-[#FDA49A]/30 text-[#FDA49A]`}
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <SearchPopover 
              isOpen={showSearch}
              onClose={() => setShowSearch(false)}
              theme={theme}
            />
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={() => navigate('/scheduling')}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700 transition-colors"
              aria-label="Schedule jobs"
            >
              <Calendar size={18} />
              <span>Schedule</span>
            </button>
            <button 
              onClick={() => navigate('/new-job-request')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
              aria-label="Create new job request"
            >
              <Plus size={18} />
              <span>Job Request</span>
            </button>
            <button 
              onClick={() => navigate('/add-property')}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg flex items-center space-x-2 hover:bg-yellow-600 transition-colors"
              aria-label="Add new property"
            >
              <Plus size={18} />
              <span>New Property</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserDropdown(false);
              setShowSearch(false);
            }}
            className={`p-2 rounded-lg transition-colors relative ${
              theme === 'dark'
                ? 'hover:bg-[#1F2230] text-gray-300 hover:text-white'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
            aria-label="View notifications"
          >
            <Bell size={20} />
            {hasUnread && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
          <NotificationsPopover 
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
            theme={theme}
          />
        </div>
        <button 
          onClick={onThemeToggle}
          className={`hidden md:block p-2 rounded-lg transition-colors ${
            theme === 'dark'
              ? 'hover:bg-[#1F2230] text-gray-300 hover:text-white'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <div className="flex items-center space-x-3 pl-2">
          <button
            onClick={() => {
              setShowUserDropdown(!showUserDropdown);
              setShowNotifications(false);
              setShowSearch(false);
            }}
            className="flex items-center space-x-3"
          >
            <div className="hidden md:flex flex-col items-end">
              <div className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>{currentDate}</div>
              <div className={`text-sm font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>John Doe</div>
            </div>
            <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center">
              <User size={18} className="text-white" />
            </div>
          </button>
          <UserDropdown
            isOpen={showUserDropdown}
            onClose={() => setShowUserDropdown(false)}
            theme={theme}
            userName="John Doe"
            userRole="Administrator"
          />
        </div>

        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className={`md:hidden p-2 rounded-lg transition-colors ${
            theme === 'dark'
              ? 'hover:bg-[#1F2230] text-gray-300 hover:text-white'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}
          aria-label="Toggle mobile menu"
        >
          {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className={`absolute top-full left-0 right-0 ${
          theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white'
        } border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} md:hidden`}>
          <div className="p-4 space-y-4">
            <button 
              onClick={() => {
                navigate('/scheduling');
                setShowMobileMenu(false);
              }}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-purple-700 transition-colors"
            >
              <Calendar size={18} />
              <span>Schedule</span>
            </button>
            <button 
              onClick={() => {
                navigate('/new-job-request');
                setShowMobileMenu(false);
              }}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} />
              <span>Job Request</span>
            </button>
            <button 
              onClick={() => {
                navigate('/add-property');
                setShowMobileMenu(false);
              }}
              className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-yellow-600 transition-colors"
            >
              <Plus size={18} />
              <span>New Property</span>
            </button>
            <button 
              onClick={onThemeToggle}
              className="w-full px-4 py-2 flex items-center justify-center space-x-2 rounded-lg"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

