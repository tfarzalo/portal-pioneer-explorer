
import React from 'react';
import { cn } from '../../../lib/utils';
import { Home } from 'lucide-react';

interface RootDirectoryButtonProps {
  onClick: () => void;
  theme: 'dark' | 'light';
}

export const RootDirectoryButton: React.FC<RootDirectoryButtonProps> = ({ onClick, theme }) => {
  return (
    <div 
      className={cn(
        "flex items-center py-1 px-2 rounded-md cursor-pointer mb-2",
        theme === 'dark' ? 'hover:bg-gray-700 bg-gray-900' : 'hover:bg-gray-200 bg-gray-100',
        "transition-colors"
      )}
      onClick={onClick}
    >
      <Home className="h-4 w-4 mr-2 text-blue-500" />
      <span className="text-sm font-medium">Root Directory</span>
    </div>
  );
};
