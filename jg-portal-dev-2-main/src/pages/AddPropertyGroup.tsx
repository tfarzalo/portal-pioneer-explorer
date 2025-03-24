import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderKanban, 
  ArrowLeft, 
  Users, 
  Mail, 
  Phone, 
  MapPin,
  Plus,
  Trash2
} from 'lucide-react';

interface AddPropertyGroupProps {
  theme: 'dark' | 'light';
}

interface Manager {
  name: string;
  role: string;
  email: string;
}

export function AddPropertyGroup({ theme }: AddPropertyGroupProps) {
  const navigate = useNavigate();
  const [managers, setManagers] = useState<Manager[]>([]);
  const [newManager, setNewManager] = useState<Manager>({ name: '', role: '', email: '' });
  const [showManagerForm, setShowManagerForm] = useState(false);

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
  const sectionBg = theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50';

  const regions = [
    'Northeast',
    'Southeast',
    'Midwest',
    'Southwest',
    'West',
    'Northwest'
  ];

  const handleAddManager = () => {
    if (newManager.name && newManager.role && newManager.email) {
      setManagers([...managers, newManager]);
      setNewManager({ name: '', role: '', email: '' });
      setShowManagerForm(false);
    }
  };

  const handleRemoveManager = (index: number) => {
    setManagers(managers.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    navigate('/property-groups');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FolderKanban className={textColor} size={28} />
          <h1 className={`text-2xl font-bold ${textColor}`}>Add Property Management Group</h1>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
        >
          <ArrowLeft size={20} />
          <span>Go Back</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={`${cardBg} p-6 rounded-lg border ${borderColor}`}>
          <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Group Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                Group Name
              </label>
              <input
                type="text"
                className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                placeholder="Enter group name"
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                Region
              </label>
              <select
                className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                required
              >
                <option value="">Select region...</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                Description
              </label>
              <textarea
                className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor} min-h-[100px]`}
                placeholder="Enter group description"
                required
              />
            </div>
          </div>
        </div>

        <div className={`${cardBg} p-6 rounded-lg border ${borderColor}`}>
          <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Primary Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                <Users size={16} className="inline mr-2" />
                Contact Name
              </label>
              <input
                type="text"
                className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                placeholder="Enter contact name"
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                Role
              </label>
              <input
                type="text"
                className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                placeholder="Enter contact role"
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                <Phone size={16} className="inline mr-2" />
                Phone
              </label>
              <input
                type="tel"
                className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                placeholder="Enter contact phone"
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                <Mail size={16} className="inline mr-2" />
                Email
              </label>
              <input
                type="email"
                className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                placeholder="Enter contact email"
                required
              />
            </div>
          </div>
        </div>

        <div className={`${cardBg} p-6 rounded-lg border ${borderColor}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-semibold ${textColor}`}>Property Managers</h2>
            <button
              type="button"
              onClick={() => setShowManagerForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add Manager</span>
            </button>
          </div>

          {showManagerForm && (
            <div className={`${sectionBg} p-4 rounded-lg mb-4`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${textColor}`}>Name</label>
                  <input
                    type="text"
                    value={newManager.name}
                    onChange={(e) => setNewManager({ ...newManager, name: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                    placeholder="Enter manager name"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${textColor}`}>Role</label>
                  <input
                    type="text"
                    value={newManager.role}
                    onChange={(e) => setNewManager({ ...newManager, role: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                    placeholder="Enter manager role"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${textColor}`}>Email</label>
                  <input
                    type="email"
                    value={newManager.email}
                    onChange={(e) => setNewManager({ ...newManager, email: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                    placeholder="Enter manager email"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  type="button"
                  onClick={() => setShowManagerForm(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddManager}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Manager
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {managers.map((manager, index) => (
              <div
                key={index}
                className={`${sectionBg} p-4 rounded-lg`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`font-medium ${textColor}`}>{manager.name}</div>
                    <div className={mutedTextColor}>{manager.role}</div>
                    <div className={`text-sm ${mutedTextColor}`}>{manager.email}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveManager(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`${cardBg} p-6 rounded-lg border ${borderColor}`}>
          <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Additional Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className={`ml-3 text-sm font-medium ${textColor}`}>Active Status</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Group
          </button>
        </div>
      </form>
    </div>
  );
}