
import { supabase } from '../../../integrations/supabase/client';
import { TreeNode, FolderType } from './types';
import { toast } from 'sonner';

export const fetchFolders = async (): Promise<TreeNode[]> => {
  try {
    const { data, error } = await (supabase as any)
      .from('folders')
      .select('*')
      .order('name');
      
    if (error) throw error;
    
    if (data && data.length > 0) {
      return buildFolderTree(data);
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching folders:', error);
    toast.error('Failed to load folders');
    return [];
  }
};

export const createFolder = async (
  name: string, 
  parentId: string | null
): Promise<boolean> => {
  if (!name.trim()) {
    toast.error('Please enter a folder name');
    return false;
  }
  
  try {
    let parentPath = '';
    if (parentId) {
      const { data: parent } = await (supabase as any)
        .from('folders')
        .select('path')
        .eq('id', parentId)
        .single();
        
      if (parent && parent.path) {
        parentPath = parent.path;
      }
    }
    
    const folderPath = parentId 
      ? `${parentPath}/${name}` 
      : `/${name}`;
    
    const { error } = await (supabase as any)
      .from('folders')
      .insert([
        { 
          name: name, 
          parent_id: parentId,
          path: folderPath,
          is_system_folder: false
        }
      ])
      .select();
      
    if (error) throw error;
    
    toast.success('Folder created successfully');
    return true;
  } catch (error) {
    console.error('Error creating folder:', error);
    toast.error('Failed to create folder');
    return false;
  }
};

const buildFolderTree = (folders: FolderType[]): TreeNode[] => {
  const rootNodes: TreeNode[] = [];
  const lookup: Record<string, TreeNode> = {};
  
  folders.forEach((folder: FolderType) => {
    lookup[folder.id] = {
      ...folder,
      children: []
    };
  });
  
  folders.forEach((folder: FolderType) => {
    if (folder.parent_id === null) {
      rootNodes.push(lookup[folder.id]);
    } else if (lookup[folder.parent_id]) {
      lookup[folder.parent_id].children.push(lookup[folder.id]);
    } else {
      rootNodes.push(lookup[folder.id]);
    }
  });
  
  return rootNodes;
};
