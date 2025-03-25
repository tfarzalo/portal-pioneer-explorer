
import { Plus } from 'lucide-react';
import { PropertyDetails } from '../../types';

interface PropertyNotesProps {
  propertyDetails: PropertyDetails;
  theme: 'dark' | 'light';
}

export function PropertyNotes({ propertyDetails, theme }: PropertyNotesProps) {
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const sectionBg = theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50';

  return (
    <div className={`${cardBg} rounded-lg border ${borderColor} p-6`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-lg font-semibold ${textColor}`}>Property Updates / Notes</h2>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Add Note</span>
        </button>
      </div>
      <div className={`${sectionBg} rounded-lg overflow-hidden`}>
        <table className="w-full">
          <thead>
            <tr className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <th className={`px-4 py-2 text-left text-sm ${textColor}`}>Date</th>
              <th className={`px-4 py-2 text-left text-sm ${textColor}`}>Update Type</th>
              <th className={`px-4 py-2 text-left text-sm ${textColor}`}>Note / Update</th>
              <th className={`px-4 py-2 text-left text-sm ${textColor}`}>Posted By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {propertyDetails.notes.map((note, index) => (
              <tr key={index}>
                <td className={`px-4 py-2 ${textColor}`}>{note.date}</td>
                <td className={`px-4 py-2 ${textColor}`}>{note.updateType}</td>
                <td className={`px-4 py-2 ${textColor}`}>{note.note}</td>
                <td className={`px-4 py-2 ${textColor}`}>{note.postedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
