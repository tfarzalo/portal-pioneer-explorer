
import React from 'react';
import { ChevronRight, ChevronDown, Folder, FolderPlus } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { TreeNode } from './types';

interface FolderNodeProps {
  node: TreeNode;
  depth?: number;
  isExpanded: boolean;
  onToggle: (folderId: string) => void;
  onFolderClick: (folderId: string) => void;
  onNewFolderClick: (parentId: string) => void;
  theme: 'dark' | 'light';
}

export const FolderNode: React.FC<FolderNodeProps> = ({
  node,
  depth = 0,
  isExpanded,
  onToggle,
  onFolderClick,
  onNewFolderClick,
  theme,
}) => {
  const hasChildren = node.children.length > 0;
  const hoverBg = theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100';
  const textColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-800';

  return (
    <div key={node.id}>
      <div 
        className={cn(
          "flex items-center py-1 px-2 rounded-md cursor-pointer group",
          hoverBg,
          "transition-colors",
          textColor
        )}
        style={{ paddingLeft: `${(depth * 12) + 8}px` }}
      >
        {hasChildren ? (
          <button
            onClick={() => onToggle(node.id)}
            className="p-1 rounded-full hover:bg-opacity-20 hover:bg-gray-500"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        ) : (
          <div className="w-6"></div>
        )}
        
        <div 
          className="flex items-center ml-1 flex-1"
          onClick={() => onFolderClick(node.id)}
        >
          <Folder className="h-4 w-4 mr-2 text-blue-500" />
          <span className="text-sm truncate">{node.name}</span>
        </div>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onNewFolderClick(node.id);
          }}
          className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-gray-600 hover:bg-opacity-30"
          title="Create subfolder"
        >
          <FolderPlus className="h-3 w-3" />
        </button>
      </div>
      
      {isExpanded && hasChildren && (
        <div>
          {node.children.map(childNode => (
            <FolderNode
              key={childNode.id}
              node={childNode}
              depth={depth + 1}
              isExpanded={false}
              onToggle={onToggle}
              onFolderClick={onFolderClick}
              onNewFolderClick={onNewFolderClick}
              theme={theme}
            />
          ))}
        </div>
      )}
    </div>
  );
};
