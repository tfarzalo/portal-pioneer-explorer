import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Calendar, 
  Bell, 
  Palette, 
  Shield, 
  ArrowLeft,
  Camera,
  MapPin,
  Phone,
  Mail,
  Clock,
  Globe,
  BellRing,
  MessageSquare,
  FileText,
  Lock,
  Key,
  Smartphone,
  Copy,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserSettingsProps {
  theme: 'dark' | 'light';
}

interface TabProps {
  icon: typeof Settings;
  label: string;
  id: string;
}

export function UserSettings({ theme }: UserSettingsProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const cardBorder = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-600' : 'border-gray-300';
  const labelColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-700';
  const sectionBg = theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50';

  const tabs: TabProps[] = [
    { icon: User, label: 'Profile', id: 'profile' },
    { icon: Calendar, label: 'Work Schedule', id: 'schedule' },
    { icon: Bell, label: 'Notifications', id: 'notifications' },
    { icon: Palette, label: 'Appearance', id: 'appearance' },
    { icon: Shield, label: 'Security', id: 'security' }
  ];

  // Mock ICS URL - In production, this would be generated uniquely for each user
  const icsUrl = 'https://api.jgportal.com/calendar/jobs/user123.ics';

  const handleCopyIcsUrl = async () => {
    try {
      await navigator.clipboard.writeText(icsUrl);
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Settings className={textColor} size={28} />
          <h1 className={`text-2xl font-bold ${textColor}`}>User Settings</h1>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
        >
          <ArrowLeft size={20} />
          <span>Go Back</span>
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-12 md:col-span-3">
          <div className={`${cardBg} rounded-lg border ${cardBorder} overflow-hidden`}>
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                    <User size={32} className="text-white" />
                  </div>
                  <button className="absolute bottom-0 right-0 w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center border-2 border-gray-900">
                    <Camera size={12} className="text-white" />
                  </button>
                </div>
                <div>
                  <h3 className={`font-semibold ${textColor}`}>John Doe</h3>
                  <p className={`text-sm ${mutedTextColor}`}>Administrator</p>
                </div>
              </div>
            </div>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : `${textColor} hover:bg-gray-800`
                }`}
              >
                <tab.icon size={20} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-12 md:col-span-9">
          <div className={`${cardBg} rounded-lg border ${cardBorder} p-6`}>
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div>
                  <h2 className={`text-xl font-semibold ${textColor} mb-6`}>Profile Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${labelColor}`}>
                        <User size={16} className="inline mr-2" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                        defaultValue="John Doe"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${labelColor}`}>
                        <Mail size={16} className="inline mr-2" />
                        Email
                      </label>
                      <input
                        type="email"
                        className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                        defaultValue="john@example.com"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${labelColor}`}>
                        <Phone size={16} className="inline mr-2" />
                        Phone
                      </label>
                      <input
                        type="tel"
                        className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                        defaultValue="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${labelColor}`}>
                        <MapPin size={16} className="inline mr-2" />
                        Location
                      </label>
                      <input
                        type="text"
                        className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                        defaultValue="Charlotte, NC"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className={`text-xl font-semibold ${textColor} mb-6`}>Work Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${labelColor}`}>Role</label>
                      <input
                        type="text"
                        className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                        defaultValue="Administrator"
                        disabled
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${labelColor}`}>Department</label>
                      <input
                        type="text"
                        className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                        defaultValue="Management"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="space-y-8">
                <div>
                  <h2 className={`text-xl font-semibold ${textColor} mb-6`}>Work Schedule</h2>
                  <div className="space-y-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${labelColor}`}>
                        <Clock size={16} className="inline mr-2" />
                        Working Hours
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-xs ${mutedTextColor} mb-1`}>Start Time</label>
                          <input
                            type="time"
                            className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                            defaultValue="09:00"
                          />
                        </div>
                        <div>
                          <label className={`block text-xs ${mutedTextColor} mb-1`}>End Time</label>
                          <input
                            type="time"
                            className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                            defaultValue="17:00"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${labelColor}`}>
                        <Globe size={16} className="inline mr-2" />
                        Time Zone
                      </label>
                      <select
                        className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                      >
                        <option>Eastern Time (ET)</option>
                        <option>Central Time (CT)</option>
                        <option>Mountain Time (MT)</option>
                        <option>Pacific Time (PT)</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${labelColor}`}>Working Days</label>
                      <div className="grid grid-cols-7 gap-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                          <button
                            key={day}
                            className={`p-2 rounded-lg text-center text-sm ${
                              index > 0 && index < 6
                                ? 'bg-blue-600 text-white'
                                : `${sectionBg} ${mutedTextColor}`
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className={`text-xl font-semibold ${textColor} mb-6`}>Calendar Integration</h2>
                  <div className={`${sectionBg} p-6 rounded-lg space-y-4`}>
                    <div>
                      <h3 className={`font-medium ${textColor} mb-2`}>Calendar Subscription (ICS)</h3>
                      <p className={`text-sm ${mutedTextColor} mb-4`}>
                        Subscribe to your job calendar to see Job Requests, Work Orders, and Pending Work Orders in your preferred calendar app.
                        This URL will automatically update as jobs are added or modified.
                      </p>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={icsUrl}
                          readOnly
                          className={`flex-1 p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                        />
                        <button
                          onClick={handleCopyIcsUrl}
                          className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                        >
                          {showCopiedMessage ? (
                            <>
                              <CheckCircle size={20} />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={20} />
                              <span>Copy URL</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className={`mt-4 text-sm ${mutedTextColor}`}>
                        <p className="mb-2">Instructions:</p>
                        <ol className="list-decimal list-inside space-y-1">
                          <li>Copy the URL above</li>
                          <li>Open your calendar application</li>
                          <li>Add a new calendar subscription</li>
                          <li>Paste the URL when prompted</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className={`text-xl font-semibold ${textColor} mb-6`}>Availability</h2>
                  <div className={`${sectionBg} p-4 rounded-lg space-y-4`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className={`font-medium ${textColor}`}>Out of Office</h3>
                        <p className={`text-sm ${mutedTextColor}`}>Set your vacation dates</p>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Schedule
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-8">
                <div>
                  <h2 className={`text-xl font-semibold ${textColor} mb-6`}>Notification Preferences</h2>
                  <div className="space-y-6">
                    <div className={`${sectionBg} p-4 rounded-lg space-y-4`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Mail size={20} className={textColor} />
                          <div>
                            <h3 className={textColor}>Email Notifications</h3>
                            <p className={`text-sm ${mutedTextColor}`}>Receive notifications via email</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className={`${sectionBg} p-4 rounded-lg space-y-4`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <BellRing size={20} className={textColor} />
                          <div>
                            <h3 className={textColor}>Push Notifications</h3>
                            <p className={`text-sm ${mutedTextColor}`}>Receive browser notifications</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className={`${sectionBg} p-4 rounded-lg space-y-4`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <MessageSquare size={20} className={textColor} />
                          <div>
                            <h3 className={textColor}>In-App Messages</h3>
                            <p className={`text-sm ${mutedTextColor}`}>Receive messages in the app</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className={`text-lg font-medium ${textColor} mb-4`}>Notification Types</h3>
                      <div className="space-y-4">
                        {[
                          { icon: FileText, label: 'New Job Requests' },
                          { icon: Calendar, label: 'Schedule Changes' },
                          { icon: MessageSquare, label: 'Comments & Mentions' },
                          { icon: Bell, label: 'Status Updates' }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <item.icon size={20} className={mutedTextColor} />
                              <span className={textColor}>{item.label}</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-8">
                <div>
                  <h2 className={`text-xl font-semibold ${textColor} mb-6`}>Appearance Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${labelColor}`}>Theme</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {['System Default', 'Light', 'Dark'].map((option) => (
                          <button
                            key={option}
                            className={`p-4 rounded-lg border ${borderColor} ${
                              option === 'Dark' ? 'bg-blue-600 text-white' : `${cardBg} ${textColor}`
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${labelColor}`}>Density</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {['Comfortable', 'Compact', 'Cozy'].map((option) => (
                          <button
                            key={option}
                            className={`p-4 rounded-lg border ${borderColor} ${
                              option === 'Comfortable' ? 'bg-blue-600 text-white' : `${cardBg} ${textColor}`
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${labelColor}`}>Font Size</label>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {['Small', 'Medium', 'Large', 'Extra Large'].map((option) => (
                          <button
                            key={option}
                            className={`p-4 rounded-lg border ${borderColor} ${
                              option === 'Medium' ? 'bg-blue-600 text-white' : `${cardBg} ${textColor}`
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8">
                <div>
                  <h2 className={`text-xl font-semibold ${textColor} mb-6`}>Security Settings</h2>
                  <div className="space-y-6">
                    <div className={`${sectionBg} p-4 rounded-lg space-y-4`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Lock size={20} className={textColor} />
                          <div>
                            <h3 className={textColor}>Two-Factor Authentication</h3>
                            <p className={`text-sm ${mutedTextColor}`}>Add an extra layer of security</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Enable
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className={`text-lg font-medium ${textColor} mb-4`}>Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${labelColor}`}>
                            <Key size={16} className="inline mr-2" />
                            Current Password
                          </label>
                          <input
                            type="password"
                            className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                            placeholder="Enter current password"
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${labelColor}`}>
                            <Key size={16} className="inline mr-2" />
                            New Password
                          </label>
                          <input
                            type="password"
                            className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                            placeholder="Enter new password"
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${labelColor}`}>
                            <Key size={16} className="inline mr-2" />
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className={`text-lg font-medium ${textColor} mb-4`}>Device Management</h3>
                      <div className={`${sectionBg} p-4 rounded-lg space-y-4`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Smartphone size={20} className={textColor} />
                            <div>
                              <h3 className={textColor}>Connected Devices</h3>
                              <p className={`text-sm ${mutedTextColor}`}>Manage your active sessions</p>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Manage
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}