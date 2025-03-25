
import { useState } from 'react';
import { 
  Folder, 
  FileText, 
  MoreHorizontal,
  Download,
  Trash2,
  ExternalLink 
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { supabase } from '../../integrations/supabase/client';
import { toast } from 'sonner';

interface FileExplorerProps {
  theme: 'dark' | 'light';
  folders: any[];
  files: any[];
  loading: boolean;
  onFolderClick: (folderId: string) => void;
  onCreateFolder: (name: string) => void;
  getFileIcon: (mimeType: string) => JSX.Element;
}

export function FileExplorer({ 
  theme, 
  folders, 
  files, 
  loading, 
  onFolderClick, 
  onCreateFolder,
  getFileIcon 
}: FileExplorerProps) {
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [filePreview, setFilePreview] = useState<any>(null);
  
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const hoverBg = theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100';

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      toast.error('Please enter a folder name');
      return;
    }
    
    onCreateFolder(newFolderName);
    setNewFolderName('');
    setShowNewFolderDialog(false);
  };

  const downloadFile = async (file: any) => {
    try {
      const { data, error } = await supabase.storage
        .from('file_management')
        .download(file.storage_path);
        
      if (error) throw error;
      
      // Create a download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.filename;
      a.click();
      URL.revokeObjectURL(url);
      
      // Update last_accessed_at
      await supabase
        .from('files')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', file.id);
        
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    }
  };

  const previewFile = async (file: any) => {
    try {
      // Only preview images for now
      if (!file.mime_type.startsWith('image/')) {
        toast.info('Preview only available for images');
        return;
      }
      
      const { data: url } = supabase.storage
        .from('file_management')
        .getPublicUrl(file.storage_path);
        
      setFilePreview({
        ...file,
        url: url.publicUrl
      });
      
      // Update accessed timestamp
      await supabase
        .from('files')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', file.id);
        
    } catch (error) {
      console.error('Preview error:', error);
      toast.error('Failed to preview file');
    }
  };

  const deleteFile = async (file: any) => {
    if (!confirm(`Are you sure you want to delete ${file.filename}?`)) {
      return;
    }
    
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('file_management')
        .remove([file.storage_path]);
        
      if (storageError) throw storageError;
      
      // Delete metadata
      const { error: metadataError } = await supabase
        .from('files')
        .delete()
        .eq('id', file.id);
        
      if (metadataError) throw metadataError;
      
      // Update UI
      toast.success('File deleted successfully');
      
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete file');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className={`text-lg ${textColor}`}>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className={`text-xl font-semibold ${textColor}`}>
          {folders.length} Folders, {files.length} Files
        </h2>
        <Button onClick={() => setShowNewFolderDialog(true)} variant="outline" size="sm">
          <Folder className="mr-2 h-4 w-4" />
          New Folder
        </Button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* Folders first */}
        {folders.map((folder) => (
          <div 
            key={folder.id} 
            className={`p-4 rounded-lg border ${borderColor} ${cardBg} ${hoverBg} cursor-pointer transition-colors`}
            onClick={() => onFolderClick(folder.id)}
          >
            <div className="flex flex-col items-center">
              <Folder className="h-12 w-12 text-yellow-500 mb-2" />
              <span className={`text-sm ${textColor} text-center truncate w-full`}>
                {folder.name}
              </span>
            </div>
          </div>
        ))}
        
        {/* Then files */}
        {files.map((file) => (
          <div 
            key={file.id} 
            className={`p-4 rounded-lg border ${borderColor} ${cardBg} ${hoverBg} cursor-pointer transition-colors relative group`}
            onClick={() => previewFile(file)}
          >
            <div className="flex flex-col items-center">
              {getFileIcon(file.mime_type)}
              <span className={`text-sm ${textColor} text-center truncate w-full mt-2`}>
                {file.filename}
              </span>
              <span className="text-xs text-gray-500 mt-1">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            </div>
            
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); downloadFile(file); }}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); previewFile(file); }}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => { e.stopPropagation(); deleteFile(file); }}
                    className="text-red-500 focus:text-red-500"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
      
      {folders.length === 0 && files.length === 0 && (
        <div className={`flex flex-col items-center justify-center h-64 ${textColor}`}>
          <Folder className="h-16 w-16 text-gray-400 mb-4" />
          <p className="text-lg mb-2">This folder is empty</p>
          <Button variant="outline" size="sm" onClick={() => setShowNewFolderDialog(true)}>
            <Folder className="mr-2 h-4 w-4" />
            Create a folder
          </Button>
        </div>
      )}
      
      {/* New Folder Dialog */}
      <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewFolderDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* File Preview Dialog */}
      <Dialog open={!!filePreview} onOpenChange={() => setFilePreview(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{filePreview?.filename}</DialogTitle>
          </DialogHeader>
          <div className="py-4 flex items-center justify-center overflow-auto">
            {filePreview?.mime_type.startsWith('image/') ? (
              <img 
                src={filePreview?.url} 
                alt={filePreview?.filename} 
                className="max-h-[60vh] object-contain" 
              />
            ) : (
              <div className="text-center">
                <FileText className="h-20 w-20 mx-auto text-gray-400 mb-4" />
                <p>Preview not available for this file type</p>
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => downloadFile(filePreview)}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button
              variant="default"
              onClick={() => setFilePreview(null)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
