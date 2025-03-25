
import { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { ChevronRight, ChevronDown, Folder, Home } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FolderTreeProps {
  theme: 'dark' | 'light';
  onFolderSelect: (folderId: string) => void;
  onRootSelect: () => void;
}

interface TreeNode {
  id: string;
  name: string;
  parent_id: string | null;
  children: TreeNode[];
}

export function FolderTree({ theme, onFolderSelect, onRootSelect }: FolderTreeProps) {
  const [folderTree, setFolderTree] = useState<TreeNode[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      // Use the metadata column to get folders since there's no direct folder_id column
      const { data, error } = await supabase
        .from('files')
        .select('id, metadata')
        .not('metadata', 'is', null)
        .order('created_at');
        
      if (error) throw error;
      
      if (data) {
        // Filter files that have folder_id in their metadata
        const filesWithFolders = data.filter(file => 
          file.metadata && typeof file.metadata === 'object' && file.metadata.folder_id
        );
        
        // Create a unique list of folder IDs from metadata
        const uniqueFolderIds = Array.from(
          new Set(
            filesWithFolders.map(file => 
              typeof file.metadata === 'object' ? file.metadata.folder_id : null
            ).filter(Boolean)
          )
        );
        
        // Create tree nodes for each unique folder ID
        const folderNodes: TreeNode[] = uniqueFolderIds.map(folderId => ({
          id: String(folderId),
          name: `Folder ${String(folderId).substring(0, 8)}`, // Use part of the ID as a name
          parent_id: null, // All folders at root level since we don't have parent-child info
          children: []
        }));
        
        setFolderTree(folderNodes);
      }
    } catch (error) {
      console.error('Error fetching folders:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prevExpanded => {
      const newExpanded = new Set(prevExpanded);
      if (newExpanded.has(folderId)) {
        newExpanded.delete(folderId);
      } else {
        newExpanded.add(folderId);
      }
      return newExpanded;
    });
  };

  const handleFolderClick = (folderId: string) => {
    onFolderSelect(folderId);
  };

  const renderFolderNode = (node: TreeNode, depth = 0) => {
    const isExpanded = expandedFolders.has(node.id);
    const hasChildren = node.children.length > 0;
    
    return (
      <div key={node.id}>
        <div 
          className={cn(
            "flex items-center py-1 px-2 rounded-md cursor-pointer",
            theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100',
            "transition-colors"
          )}
          style={{ paddingLeft: `${(depth * 12) + 8}px` }}
        >
          {hasChildren ? (
            <button
              onClick={() => toggleFolder(node.id)}
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
            onClick={() => handleFolderClick(node.id)}
          >
            <Folder className="h-4 w-4 mr-2 text-blue-500" />
            <span className="text-sm truncate">{node.name}</span>
          </div>
        </div>
        
        {isExpanded && hasChildren && (
          <div>
            {node.children.map(childNode => renderFolderNode(childNode, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';

  return (
    <div className={`rounded-lg border ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} p-3`}>
      <h2 className={`text-lg font-semibold mb-3 ${textColor}`}>Folders</h2>
      
      <div 
        className={cn(
          "flex items-center py-1 px-2 rounded-md cursor-pointer mb-2",
          theme === 'dark' ? 'hover:bg-gray-700 bg-gray-900' : 'hover:bg-gray-200 bg-gray-100',
          "transition-colors"
        )}
        onClick={onRootSelect}
      >
        <Home className="h-4 w-4 mr-2 text-blue-500" />
        <span className="text-sm font-medium">Root Directory</span>
      </div>
      
      <div className="mt-2 max-h-[250px] overflow-y-auto">
        {loading ? (
          <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} py-2 px-2`}>
            Loading folders...
          </div>
        ) : folderTree.length === 0 ? (
          <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} py-2 px-2`}>
            No folders found
          </div>
        ) : (
          <div>
            {folderTree.map(node => renderFolderNode(node))}
          </div>
        )}
      </div>
    </div>
  );
}
