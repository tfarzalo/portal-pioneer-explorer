
import { useState, useEffect } from 'react';
import { FolderPlus } from 'lucide-react';
import { Button } from '../ui/button';
import { FolderTreeProps, TreeNode } from './folder/types';
import { fetchFolders, createFolder } from './folder/folderService';
import { FolderNode } from './folder/FolderNode';
import { NewFolderDialog } from './folder/NewFolderDialog';
import { RootDirectoryButton } from './folder/RootDirectoryButton';

export function FolderTree({ theme, onFolderSelect, onRootSelect }: FolderTreeProps) {
  const [folderTree, setFolderTree] = useState<TreeNode[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [currentParentId, setCurrentParentId] = useState<string | null>(null);

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    setLoading(true);
    const folders = await fetchFolders();
    setFolderTree(folders);
    setLoading(false);
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

  const handleCreateFolder = async () => {
    const success = await createFolder(newFolderName, currentParentId);
    if (success) {
      setNewFolderName('');
      setShowNewFolderDialog(false);
      loadFolders();
    }
  };
  
  const openNewFolderDialog = (parentId: string | null = null) => {
    setCurrentParentId(parentId);
    setNewFolderName('');
    setShowNewFolderDialog(true);
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
      
      <RootDirectoryButton onClick={onRootSelect} theme={theme} />
      
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
            {folderTree.map(node => (
              <FolderNode
                key={node.id}
                node={node}
                isExpanded={expandedFolders.has(node.id)}
                onToggle={toggleFolder}
                onFolderClick={onFolderSelect}
                onNewFolderClick={openNewFolderDialog}
                theme={theme}
              />
            ))}
          </div>
        )}
      </div>
      
      <NewFolderDialog
        isOpen={showNewFolderDialog}
        onClose={() => setShowNewFolderDialog(false)}
        folderName={newFolderName}
        onFolderNameChange={setNewFolderName}
        onCreateFolder={handleCreateFolder}
        isSubfolder={currentParentId !== null}
        theme={theme}
      />
    </div>
  );
}
