import { useState } from 'react';
import { 
  Folder, 
  FileText, 
  MoreHorizontal,
  Download,
  Trash2,
  ExternalLink,
  Tag
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
import { formatFileSize } from '../../lib/utils';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { cn } from '../../lib/utils';

type FileCategory = 'property_photo' | 'job_photo' | 'before_photo' | 'after_photo' | 'document' | 'invoice' | 'contract' | 'other' | undefined;

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
  const [editTags, setEditTags] = useState(false);
  const [currentTags, setCurrentTags] = useState('');
  const [currentFile, setCurrentFile] = useState<any>(null);
  const [fileCategory, setFileCategory] = useState<FileCategory>('document');
  
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const hoverBg = theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100';
  const dialogBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const inputBg = theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white';

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
      
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.filename;
      a.click();
      URL.revokeObjectURL(url);
      
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
      
      await supabase
        .from('files')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', file.id);
        
    } catch (error) {
      console.error('Preview error:', error);
      toast.error('Failed to preview file');
    }
  };

  const openEditTags = (file: any) => {
    const metadata = file.metadata || {};
    const tags = metadata.tags || [];
    setCurrentTags(tags.join(', '));
    setFileCategory(file.category || 'document');
    setCurrentFile(file);
    setEditTags(true);
  };

  const saveFileTags = async () => {
    if (!currentFile) return;
    
    try {
      const tags = currentTags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      const updatedMetadata = {
        ...currentFile.metadata,
        tags
      };
      
      const { error } = await supabase
        .from('files')
        .update({ 
          metadata: updatedMetadata,
          category: fileCategory
        })
        .eq('id', currentFile.id);
        
      if (error) throw error;
      
      toast.success('File updated successfully');
      setEditTags(false);
      
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update file');
    }
  };

  const deleteFile = async (file: any) => {
    if (!confirm(`Are you sure you want to delete ${file.filename}?`)) {
      return;
    }
    
    try {
      const { error: storageError } = await supabase.storage
        .from('file_management')
        .remove([file.storage_path]);
        
      if (storageError) throw storageError;
      
      const { error: metadataError } = await supabase
        .from('files')
        .delete()
        .eq('id', file.id);
        
      if (metadataError) throw metadataError;
      
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
        <Button onClick={() => setShowNewFolderDialog(true)} variant="outline" size="sm" 
          className={theme === 'dark' ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : ''}>
          <Folder className="mr-2 h-4 w-4" />
          New Folder
        </Button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {folders.map((folder) => (
          <div 
            key={folder.id} 
            className={cn(
              "p-4 rounded-lg border",
              borderColor,
              cardBg,
              hoverBg,
              "cursor-pointer transition-colors"
            )}
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
        
        {files.map((file) => {
          const metadata = file.metadata || {};
          const tags = metadata.tags || [];
          
          return (
            <div 
              key={file.id} 
              className={cn(
                "p-4 rounded-lg border",
                borderColor,
                cardBg,
                hoverBg,
                "cursor-pointer transition-colors relative group"
              )}
              onClick={() => previewFile(file)}
            >
              <div className="flex flex-col items-center">
                {getFileIcon(file.mime_type)}
                <span className={`text-sm ${textColor} text-center truncate w-full mt-2`}>
                  {file.filename}
                </span>
                <span className={`text-xs ${mutedColor} mt-1`}>
                  {formatFileSize(file.size)}
                </span>
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2 justify-center">
                    {tags.slice(0, 2).map((tag: string, index: number) => (
                      <span key={index} className={`text-xs px-2 py-0.5 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        {tag}
                      </span>
                    ))}
                    {tags.length > 2 && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        +{tags.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); downloadFile(file); }} 
                      className={theme === 'dark' ? 'text-gray-200 focus:bg-gray-700' : ''}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); previewFile(file); }}
                      className={theme === 'dark' ? 'text-gray-200 focus:bg-gray-700' : ''}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openEditTags(file); }}
                      className={theme === 'dark' ? 'text-gray-200 focus:bg-gray-700' : ''}>
                      <Tag className="mr-2 h-4 w-4" />
                      Edit Tags
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => { e.stopPropagation(); deleteFile(file); }}
                      className={`text-red-500 focus:text-red-500 ${theme === 'dark' ? 'focus:bg-gray-700' : ''}`}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        })}
      </div>
      
      {folders.length === 0 && files.length === 0 && (
        <div className={`flex flex-col items-center justify-center h-64 ${textColor}`}>
          <Folder className="h-16 w-16 text-gray-400 mb-4" />
          <p className="text-lg mb-2">This folder is empty</p>
          <Button variant="outline" size="sm" onClick={() => setShowNewFolderDialog(true)}
            className={theme === 'dark' ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : ''}>
            <Folder className="mr-2 h-4 w-4" />
            Create a folder
          </Button>
        </div>
      )}
      
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewFolderDialog(false)}
              className={theme === 'dark' ? 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600' : ''}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={!!filePreview} onOpenChange={() => setFilePreview(null)}>
        <DialogContent className={`max-w-3xl ${dialogBg} ${theme === 'dark' ? 'text-white border-gray-700' : ''}`}>
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
              className={theme === 'dark' ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : ''}
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
      
      <Dialog open={editTags} onOpenChange={setEditTags}>
        <DialogContent className={`${dialogBg} ${theme === 'dark' ? 'text-white border-gray-700' : ''}`}>
          <DialogHeader>
            <DialogTitle>Edit File Details</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label className={`block mb-2 text-sm font-medium ${textColor}`}>
                File Category
              </label>
              <Tabs defaultValue={fileCategory} onValueChange={(value: string) => {
                setFileCategory(value as FileCategory);
              }} className="w-full">
                <TabsList className="w-full grid grid-cols-5">
                  <TabsTrigger value="document">Document</TabsTrigger>
                  <TabsTrigger value="image">Image</TabsTrigger>
                  <TabsTrigger value="pdf">PDF</TabsTrigger>
                  <TabsTrigger value="spreadsheet">Spreadsheet</TabsTrigger>
                  <TabsTrigger value="other">Other</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div>
              <label className={`block mb-2 text-sm font-medium ${textColor}`}>
                Tags (comma-separated)
              </label>
              <Input
                placeholder="e.g. invoice, report, important"
                value={currentTags}
                onChange={(e) => setCurrentTags(e.target.value)}
                className={inputBg}
              />
              <p className={`mt-1 text-xs ${mutedColor}`}>
                Add descriptive tags to help find this file later
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTags(false)}
              className={theme === 'dark' ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : ''}>
              Cancel
            </Button>
            <Button onClick={saveFileTags}>
              <Tag className="mr-2 h-4 w-4" />
              Save Tags
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
