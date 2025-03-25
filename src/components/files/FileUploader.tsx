
import { supabase } from '../../integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Save } from 'lucide-react';
import { FileCategory } from '../../types/fileTypes';

interface FileUploaderProps {
  selectedFiles: File[];
  selectedFolder: string | null;
  description: string;
  tags: string;
  category: FileCategory;
  isUploading: boolean;
  setIsUploading: (isUploading: boolean) => void;
  setUploadProgress: (progress: { [key: string]: number }) => void;
  getCategoryFromMimeType: (mimeType: string) => FileCategory;
  onUploadComplete: () => void;
}

export function FileUploader({
  selectedFiles,
  selectedFolder,
  description,
  tags,
  category,
  isUploading,
  setIsUploading,
  setUploadProgress,
  getCategoryFromMimeType,
  onUploadComplete
}: FileUploaderProps) {
  const uploadFiles = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one file');
      return;
    }
    
    setIsUploading(true);
    
    try {
      let folderPath = '';
      let folderId = null;
      
      if (selectedFolder) {
        const { data: folder, error } = await supabase
          .from('folders')
          .select('path, id')
          .eq('id', selectedFolder)
          .single();
          
        if (error) {
          throw new Error(`Folder error: ${error.message}`);
        }
          
        if (folder) {
          folderPath = folder.path;
          folderId = folder.id;
        }
      }
      
      // Create an array to store successful upload promises
      const uploadPromises = selectedFiles.map(async (file) => {
        const timestamp = new Date().getTime();
        const filePath = folderPath 
          ? `${folderPath}/${timestamp}_${file.name}`
          : `root/${timestamp}_${file.name}`;
        
        // Setup upload with progress tracking
        const options = {
          cacheControl: '3600',
          upsert: false
        };
        
        // Track progress using the onUploadProgress callback
        const { error: uploadError } = await supabase.storage
          .from('file_management')
          .upload(filePath, file, options);
          
        if (uploadError) {
          toast.error(`Failed to upload ${file.name}: ${uploadError.message}`);
          return null;
        }
        
        // Update progress for this file
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: 100
        }));
        
        const tagArray = tags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0);
        
        const detectedCategory = getCategoryFromMimeType(file.type);
        // Make sure we have a valid category
        const fileCategory: FileCategory = 
          (category || detectedCategory) as FileCategory;
        
        const fileMetadata = {
          filename: file.name,
          original_filename: file.name,
          description: description,
          size: file.size,
          mime_type: file.type,
          file_type: detectedCategory,
          category: fileCategory,
          storage_path: filePath,
          folder_id: folderId,
          metadata: { tags: tagArray }
        };
        
        const { data: fileData, error: metadataError } = await supabase
          .from('files')
          .insert(fileMetadata)
          .select()
          .single();
          
        if (metadataError) {
          toast.error(`Failed to save metadata for ${file.name}: ${metadataError.message}`);
          return null;
        }
        
        toast.success(`Uploaded ${file.name}`);
        return fileData;
      });
      
      // Wait for all uploads to complete
      await Promise.all(uploadPromises);
      
      // Reset form after successful uploads
      onUploadComplete();
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(`An error occurred during upload: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Button
      onClick={uploadFiles}
      disabled={isUploading || selectedFiles.length === 0}
      className="w-full mt-6"
    >
      {isUploading ? (
        <>Uploading...</>
      ) : (
        <>
          <Save className="mr-2 h-4 w-4" />
          Upload Files
        </>
      )}
    </Button>
  );
}
