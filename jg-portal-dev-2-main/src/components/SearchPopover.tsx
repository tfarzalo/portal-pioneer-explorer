import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Building2, FileText, User } from 'lucide-react';

interface SearchPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
}

interface SearchResult {
  id: string;
  type: 'property' | 'job' | 'user';
  title: string;
  subtitle: string;
}

export function SearchPopover({ isOpen, theme }: SearchPopoverProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const bgColor = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const inputBg = theme === 'dark' ? 'bg-[#151823]' : 'bg-gray-50';
  const hoverBg = theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50';

  // Mock search results - replace with actual search logic
  const results: SearchResult[] = searchTerm ? [
    {
      id: '1',
      type: 'property',
      title: '511 Queens',
      subtitle: 'Charlotte, NC'
    },
    {
      id: '2',
      type: 'job',
      title: 'WO#46',
      subtitle: 'La Vie SouthPark - Unit 122'
    },
    {
      id: '3',
      type: 'user',
      title: 'John Smith',
      subtitle: 'Subcontractor'
    }
  ] : [];

  const getIcon = (type: string) => {
    switch (type) {
      case 'property':
        return <Building2 size={20} />;
      case 'job':
        return <FileText size={20} />;
      case 'user':
        return <User size={20} />;
      default:
        return null;
    }
  };

  const handleResultClick = (result: SearchResult) => {
    switch (result.type) {
      case 'property':
        navigate(`/properties/${result.id}`);
        break;
      case 'job':
        navigate(`/jobs/${result.id}`);
        break;
      case 'user':
        navigate(`/users/${result.id}`);
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`absolute left-0 top-12 w-[600px] ${bgColor} rounded-lg shadow-lg border ${borderColor} z-50`}>
      <div className="p-4">
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${mutedTextColor}`} size={20} />
          <input
            type="text"
            placeholder="Search for properties, jobs, users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
            autoFocus
          />
        </div>
      </div>

      {searchTerm && (
        <div className="border-t border-gray-700">
          <div className="max-h-[400px] overflow-y-auto">
            {results.map((result) => (
              <button
                key={result.id}
                onClick={() => handleResultClick(result)}
                className={`w-full p-4 flex items-center space-x-4 ${hoverBg} transition-colors`}
              >
                <div className={mutedTextColor}>
                  {getIcon(result.type)}
                </div>
                <div className="flex-1 text-left">
                  <div className={textColor}>{result.title}</div>
                  <div className={`text-sm ${mutedTextColor}`}>{result.subtitle}</div>
                </div>
              </button>
            ))}
            {results.length === 0 && (
              <div className={`p-4 text-center ${mutedTextColor}`}>
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}