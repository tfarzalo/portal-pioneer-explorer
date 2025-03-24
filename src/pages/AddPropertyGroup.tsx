import { useState } from 'react';
import { 
  FolderKanban, 
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AddPropertyGroupProps {
  theme: 'dark' | 'light';
}

export function AddPropertyGroup({ theme }: AddPropertyGroupProps) {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState('');
  const [region, setRegion] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactRole, setContactRole] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [managerName, setManagerName] = useState('');
  const [managerRole, setManagerRole] = useState('');
  const [managerEmail, setManagerEmail] = useState('');

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', {
      groupName,
      region,
      contactName,
      contactRole,
      contactEmail,
      contactPhone,
      managerName,
      managerRole,
      managerEmail
    });
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className={`${cardBg} rounded-lg border ${borderColor} p-6`}>
          <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Group Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>Group Name</label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>Region</label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                required
              />
            </div>
          </div>
        </div>

        <div className={`${cardBg} rounded-lg border ${borderColor} p-6`}>
          <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Primary Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>Contact Name</label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>Contact Role</label>
              <input
                type="text"
                value={contactRole}
                onChange={(e) => setContactRole(e.target.value)}
                className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>Contact Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>Contact Phone</label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                required
              />
            </div>
          </div>
        </div>

        <div className={`${cardBg} rounded-lg border ${borderColor} p-6`}>
          <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Add Manager</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>Manager Name</label>
              <input
                type="text"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>Manager Role</label>
              <input
                type="text"
                value={managerRole}
                onChange={(e) => setManagerRole(e.target.value)}
                className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>Manager Email</label>
              <input
                type="email"
                value={managerEmail}
                onChange={(e) => setManagerEmail(e.target.value)}
                className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/property-groups')}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Group
          </button>
        </div>
      </form>
    </div>
  );
}
