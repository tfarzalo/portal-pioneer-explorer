
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
import { toast } from 'sonner';

interface FolderSelectorProps {
  theme: 'dark' | 'light';
  onFolderSelect: (folderId: string | null) => void;
  initialFolderId?: string | null;
}

export function FolderSelector({ theme, onFolderSelect, initialFolderId = null }: FolderSelectorProps) {
  const [folders, setFolders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(initialFolderId);

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      // Get folders from the folders table
      const { data: folderData, error: folderError } = await (supabase as any)
        .from('folders')
        .select('id, name, path')
        .order('name');
        
      if (folderError) throw folderError;
      
      setFolders(folderData || []);
    } catch (error) {
      console.error('Error fetching folders:', error);
      toast.error('Failed to load folders');
    } finally {
      setLoading(false);
    }
  };

  const handleFolderChange = (folderId: string) => {
    const id = folderId === 'root' ? null : folderId;
    setSelectedFolder(id);
    onFolderSelect(id);
  };

  const textColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-700';
  const selectBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';

  return (
    <Select 
      value={selectedFolder || 'root'} 
      onValueChange={handleFolderChange}
      disabled={loading}
    >
      <SelectTrigger className={`w-full ${selectBg}`}>
        <SelectValue placeholder="Select a folder" />
      </SelectTrigger>
      <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
        <SelectItem value="root" className={`flex items-center ${textColor}`}>
          <div className="flex items-center">
            <Folder className="mr-2 h-4 w-4 text-blue-500" />
            <span>Root Directory</span>
          </div>
        </SelectItem>
        
        {folders.map((folder) => (
          <SelectItem key={folder.id} value={folder.id} className={`flex items-center ${textColor}`}>
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
