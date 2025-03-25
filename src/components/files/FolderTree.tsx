
import { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Folder, ChevronRight, ChevronDown, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface FolderTreeProps {
  theme: 'dark' | 'light';
  onFolderSelect: (folderId: string) => void;
  onRootSelect: () => void;
}

export function FolderTree({ theme, onFolderSelect, onRootSelect }: FolderTreeProps) {
  const [folders, setFolders] = useState<any[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const bgHover = theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100';

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    setLoading(true);
    try {
      // Get all folders
      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      setFolders(data || []);
      
    } catch (error) {
      console.error('Error fetching folders:', error);
      toast.error('Failed to load folder structure');
    } finally {
      setLoading(false);
    }
  };

  // Build folder tree structure
  const buildFolderTree = (items: any[], parentId: string | null = null) => {
    return items
      .filter(item => item.parent_id === parentId)
      .map(item => ({
        ...item,
        children: buildFolderTree(items, item.id)
      }));
  };

  const folderTree = buildFolderTree(folders);

  const toggleFolder = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const renderFolderTree = (items: any[], level = 0) => {
    return (
      <ul className="space-y-1">
        {items.map(folder => (
          <li key={folder.id}>
            <div 
              className={`flex items-center py-1 px-2 rounded-md ${bgHover} cursor-pointer`}
              style={{ paddingLeft: `${(level * 12) + 8}px` }}
              onClick={() => onFolderSelect(folder.id)}
            >
              {folder.children && folder.children.length > 0 ? (
                <button
                  className="mr-1"
                  onClick={(e) => toggleFolder(folder.id, e)}
                >
                  {expandedFolders.has(folder.id) ? (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              ) : (
                <span className="ml-5"></span>
              )}
              
              <Folder className="h-4 w-4 text-yellow-500 mr-2" />
              <span className={`text-sm truncate ${textColor}`}>
                {folder.name}
              </span>
            </div>
            
            {expandedFolders.has(folder.id) && folder.children && folder.children.length > 0 && (
              renderFolderTree(folder.children, level + 1)
            )}
          </li>
        ))}
      </ul>
    );
  };

  if (loading) {
    return <div className={`p-4 ${textColor}`}>Loading folders...</div>;
  }

  return (
    <div className={`rounded-lg border p-4 ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
      <div className="flex items-center mb-4">
        <Folder className="h-5 w-5 text-yellow-500 mr-2" />
        <h3 className={`font-semibold ${textColor}`}>Folders</h3>
      </div>
      
      <div 
        className={`flex items-center py-1 px-2 rounded-md ${bgHover} cursor-pointer mb-2`}
        onClick={onRootSelect}
      >
        <Folder className="h-4 w-4 text-blue-500 mr-2" />
        <span className={`text-sm ${textColor}`}>All Files (Root)</span>
      </div>
      
      {renderFolderTree(folderTree)}
    </div>
  );
}
