
import { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchPopoverProps {
  theme: 'dark' | 'light';
}

export function SearchPopover({ theme }: SearchPopoverProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className="relative">
      {isOpen && (
        <div className="absolute z-10 top-10 right-0 w-64">
          <div className="shadow-lg ring-1 ring-black ring-opacity-5 rounded-md overflow-hidden">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${mutedTextColor}`} size={20} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-md border ${inputBg} ${borderColor} ${textColor}`}
              />
            </div>
            {searchQuery && (
              <div className="p-3">
                <p className={mutedTextColor}>
                  No results for "{searchQuery}"
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
