
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
      // Force TypeScript to accept 'folders' as a valid table name
      const { data, error } = await (supabase as any)
        .from('folders')
        .select('*')
        .order('name');
        
      if (error) throw error;
      setFolders(data || []);
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
