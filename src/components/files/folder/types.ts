
export interface TreeNode {
  id: string;
  name: string;
  parent_id: string | null;
  path: string;
  children: TreeNode[];
}

export interface FolderType {
  id: string;
  name: string;
  parent_id: string | null;
  path: string;
  is_system_folder?: boolean;
}

export interface FolderTreeProps {
  theme: 'dark' | 'light';
  onFolderSelect: (folderId: string) => void;
  onRootSelect: () => void;
}
