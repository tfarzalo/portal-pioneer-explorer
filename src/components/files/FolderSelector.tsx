
import { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Folder } from 'lucide-react';

interface FolderSelectorProps {
  theme: 'dark' | 'light';
  onFolderSelect: (folderId: string | null) => void;
  initialFolderId?: string | null;
}

export function FolderSelector({ onFolderSelect, initialFolderId = null }: FolderSelectorProps) {
  const [folders, setFolders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(initialFolderId);

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
        
        // Map folder IDs to folder objects
        const folderObjects = uniqueFolderIds.map(folderId => ({
          id: folderId,
          name: `Folder ${String(folderId).substring(0, 8)}` // Use part of the ID as a name
        }));
        
        setFolders(folderObjects);
      }
    } catch (error) {
      console.error('Error fetching folders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFolderChange = (folderId: string) => {
    const id = folderId === 'root' ? null : folderId;
    setSelectedFolder(id);
    onFolderSelect(id);
  };

  return (
    <Select 
      value={selectedFolder || 'root'} 
      onValueChange={handleFolderChange}
      disabled={loading}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a folder" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="root" className="flex items-center">
          <div className="flex items-center">
            <Folder className="mr-2 h-4 w-4 text-blue-500" />
            <span>Root Directory</span>
          </div>
        </SelectItem>
        
        {folders.map((folder) => (
          <SelectItem key={folder.id} value={folder.id} className="flex items-center">
            <div className="flex items-center">
              <Folder className="mr-2 h-4 w-4 text-blue-500" />
              <span>{folder.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
