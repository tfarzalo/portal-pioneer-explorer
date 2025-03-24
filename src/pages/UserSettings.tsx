import { useState } from 'react';
import { 
  Settings, 
  ArrowLeft, 
  UserCircle, 
  Lock, 
  Bell, 
  Moon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserSettingsProps {
  theme: 'dark' | 'light';
}

export function UserSettings({ theme }: UserSettingsProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'appearance'>('profile');
  
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
  
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
        <div className="col-span-3">
          <div className={`${cardBg} rounded-lg border ${borderColor}`}>
            <div className="p-4 border-b border-gray-700">
              <h2 className={`font-medium ${textColor}`}>Settings</h2>
            </div>
            <div className="p-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${
                  activeTab === 'profile' 
                    ? 'bg-blue-600 text-white' 
                    : `hover:bg-gray-700 ${textColor}`
                }`}
              >
                <UserCircle size={20} />
                <span>Profile</span>
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${
                  activeTab === 'security' 
                    ? 'bg-blue-600 text-white' 
                    : `hover:bg-gray-700 ${textColor}`
                }`}
              >
                <Lock size={20} />
                <span>Security</span>
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${
                  activeTab === 'notifications' 
                    ? 'bg-blue-600 text-white' 
                    : `hover:bg-gray-700 ${textColor}`
                }`}
              >
                <Bell size={20} />
                <span>Notifications</span>
              </button>
              <button
                onClick={() => setActiveTab('appearance')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${
                  activeTab === 'appearance' 
                    ? 'bg-blue-600 text-white' 
                    : `hover:bg-gray-700 ${textColor}`
                }`}
              >
                <Moon size={20} />
                <span>Appearance</span>
              </button>
            </div>
          </div>
        </div>

        <div className="col-span-9">
          <div className={`${cardBg} rounded-lg border ${borderColor} p-6`}>
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className={`text-xl font-semibold ${textColor} mb-4`}>Profile Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                      First Name
                    </label>
                    <input
                      type="text"
                      defaultValue="John"
                      className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Doe"
                      className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue="john.doe@example.com"
                    className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    defaultValue="(555) 123-4567"
                    className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                    Role
                  </label>
                  <select
                    defaultValue="admin"
                    className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                  >
                    <option value="admin">Administrator</option>
                    <option value="manager">Manager</option>
                    <option value="user">User</option>
                  </select>
                </div>

                <div className="flex justify-end">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className={`text-xl font-semibold ${textColor} mb-4`}>Security Settings</h2>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                    Current Password
                  </label>
                  <input
                    type="password"
                    className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                    New Password
                  </label>
                  <input
                    type="password"
                    className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className={`text-xl font-semibold ${textColor} mb-4`}>Notification Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`font-medium ${textColor}`}>Email Notifications</h3>
                      <p className={`text-sm ${mutedTextColor}`}>Receive email notifications for important updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`font-medium ${textColor}`}>Job Assignments</h3>
                      <p className={`text-sm ${mutedTextColor}`}>Get notified when you're assigned to a new job</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`font-medium ${textColor}`}>Schedule Changes</h3>
                      <p className={`text-sm ${mutedTextColor}`}>Get notified when your schedule changes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`font-medium ${textColor}`}>System Updates</h3>
                      <p className={`text-sm ${mutedTextColor}`}>Get notified about system updates and maintenance</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h2 className={`text-xl font-semibold ${textColor} mb-4`}>Appearance Settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className={`font-medium ${textColor} mb-2`}>Theme</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`p-4 rounded-lg border ${borderColor} ${
                        theme === 'dark' ? 'bg-gray-800 border-blue-500' : 'bg-gray-100'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={textColor}>Dark</span>
                          {theme === 'dark' && (
                            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                          )}
                        </div>
                        <div className="h-20 bg-gray-900 rounded"></div>
                      </div>
                      <div className={`p-4 rounded-lg border ${borderColor} ${
                        theme === 'light' ? 'bg-white border-blue-500' : 'bg-white'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-900">Light</span>
                          {theme === 'light' && (
                            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                          )}
                        </div>
                        <div className="h-20 bg-gray-100 rounded"></div>
                      </div>
                      <div className={`p-4 rounded-lg border ${borderColor} opacity-50`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={textColor}>System (Coming Soon)</span>
                        </div>
                        <div className="h-20 bg-gradient-to-r from-gray-900 to-gray-100 rounded"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className={`font-medium ${textColor} mb-2`}>Font Size</h3>
                    <div className="flex items-center space-x-4">
                      <span className={`text-sm ${mutedTextColor}`}>Small</span>
                      <input
                        type="range"
                        min="1"
                        max="3"
                        defaultValue="2"
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className={`text-sm ${mutedTextColor}`}>Large</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
