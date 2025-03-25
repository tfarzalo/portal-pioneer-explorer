import { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { ChevronRight, ChevronDown, Folder, Home, FolderPlus } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';

interface FolderTreeProps {
  theme: 'dark' | 'light';
  onFolderSelect: (folderId: string) => void;
  onRootSelect: () => void;
}

interface TreeNode {
  id: string;
  name: string;
  parent_id: string | null;
  path: string;
  children: TreeNode[];
}

interface FolderType {
  id: string;
  name: string;
  parent_id: string | null;
  path: string;
  is_system_folder?: boolean;
}

export function FolderTree({ theme, onFolderSelect, onRootSelect }: FolderTreeProps) {
  const [folderTree, setFolderTree] = useState<TreeNode[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [currentParentId, setCurrentParentId] = useState<string | null>(null);

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('folders')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        const rootNodes: TreeNode[] = [];
        const lookup: Record<string, TreeNode> = {};
        
        data.forEach(folder => {
          lookup[folder.id] = {
            ...folder,
            children: []
          };
        });
        
        data.forEach(folder => {
          if (folder.parent_id === null) {
            rootNodes.push(lookup[folder.id]);
          } else if (lookup[folder.parent_id]) {
            lookup[folder.parent_id].children.push(lookup[folder.id]);
          } else {
            rootNodes.push(lookup[folder.id]);
          }
        });
        
        setFolderTree(rootNodes);
      } else {
        setFolderTree([]);
      }
    } catch (error) {
      console.error('Error fetching folders:', error);
      toast.error('Failed to load folders');
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
  
  const updateBreadcrumbs = async (folder: FolderType) => {
    const newBreadcrumbs = [folder];
    let currentParentId = folder.parent_id;
    
    while (currentParentId) {
      const { data, error } = await (supabase as any)
        .from('folders')
        .select('*')
        .eq('id', currentParentId)
        .single();
        
      if (error) break;
      
      newBreadcrumbs.unshift(data);
      currentParentId = data.parent_id;
    }
    
    newBreadcrumbs.unshift({ id: null, name: 'Root' });
  };
  
  const createNewFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error('Please enter a folder name');
      return;
    }
    
    try {
      let parentPath = '';
      if (currentParentId) {
        const { data: parent } = await (supabase as any)
          .from('folders')
          .select('path')
          .eq('id', currentParentId)
          .single();
          
        if (parent && parent.path) {
          parentPath = parent.path;
        }
      }
      
      const folderPath = currentParentId 
        ? `${parentPath}/${newFolderName}` 
        : `/${newFolderName}`;
      
      const { error } = await (supabase as any)
        .from('folders')
        .insert([
          { 
            name: newFolderName, 
            parent_id: currentParentId,
            path: folderPath,
            is_system_folder: false
          }
        ])
        .select();
        
      if (error) throw error;
      
      toast.success('Folder created successfully');
      setNewFolderName('');
      setShowNewFolderDialog(false);
      
      fetchFolders();
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('Failed to create folder');
    }
  };
  
  const openNewFolderDialog = (parentId: string | null = null) => {
    setCurrentParentId(parentId);
    setNewFolderName('');
    setShowNewFolderDialog(true);
  };

  const renderFolderNode = (node: TreeNode, depth = 0) => {
    const isExpanded = expandedFolders.has(node.id);
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
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              openNewFolderDialog(node.id);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-gray-600 hover:bg-opacity-30"
            title="Create subfolder"
          >
            <FolderPlus className="h-3 w-3" />
          </button>
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
  const bgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const btnHoverBg = theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200';

  return (
    <div className={`rounded-lg border ${borderColor} ${bgColor} p-3`}>
      <div className="flex justify-between items-center mb-3">
        <h2 className={`text-lg font-semibold ${textColor}`}>Folders</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => openNewFolderDialog(null)}
          className={`p-1 h-7 w-7 ${btnHoverBg}`}
          title="Create folder"
        >
          <FolderPlus className="h-4 w-4" />
        </Button>
      </div>
      
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
      
      <div className="mt-2 max-h-[250px] overflow-y-auto scrollbar-thin">
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
      
      <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
        <DialogContent className={theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : ''}>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              autoFocus
              className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}
            />
            <p className="mt-2 text-sm text-gray-500">
              {currentParentId ? 'Creating a subfolder' : 'Creating a root folder'}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewFolderDialog(false)}
              className={theme === 'dark' ? 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600' : ''}>
              Cancel
            </Button>
            <Button onClick={createNewFolder}>
              Create Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
