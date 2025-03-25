
import { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { toast } from 'sonner';

interface FolderSelectorProps {
  theme: 'dark' | 'light';
  onFolderSelect: (folderId: string | null) => void;
}

export function FolderSelector({ theme, onFolderSelect }: FolderSelectorProps) {
  const [folders, setFolders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  
  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      setFolders(data || []);
    } catch (error) {
      console.error('Error fetching folders:', error);
      toast.error('Failed to load folders');
    } finally {
      setLoading(false);
    }
  };

  // Organize folders by path
  const organizeByPath = (items: any[]) => {
    // Create a map to store nested structure
    const itemMap: Record<string, any> = {};
    
    // Make a hierarchical representation for display
    items.forEach(item => {
      // Calculate depth based on path segments
      const pathSegments = item.path.split('/').filter(Boolean);
      item.depth = pathSegments.length;
      
      // Store in map
      itemMap[item.id] = {
        ...item,
        displayName: '—'.repeat(Math.max(0, item.depth - 1)) + ' ' + item.name
      };
    });
    
    return Object.values(itemMap);
  };

  const handleFolderChange = (value: string) => {
    setSelectedFolder(value);
    onFolderSelect(value === 'root' ? null : value);
  };

  return (
    <Select value={selectedFolder} onValueChange={handleFolderChange}>
      <SelectTrigger className={loading ? 'opacity-50' : ''}>
        <SelectValue placeholder="Select a folder" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="root">Root (All Files)</SelectItem>
        {organizeByPath(folders).map(folder => (
          <SelectItem key={folder.id} value={folder.id}>
            {folder.displayName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
