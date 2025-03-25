
import { useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import { FileUploadZone } from '../components/files/FileUploadZone';
import { FolderSelector } from '../components/files/FolderSelector';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { FileText, Save } from 'lucide-react';

interface AddFileProps {
  theme: 'dark' | 'light';
}

export function AddFile({ theme }: AddFileProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [category, setCategory] = useState<string>('');
  
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';

  const handleFilesSelected = (files: FileList) => {
    const fileArray = Array.from(files);
    setSelectedFiles(fileArray);
    
    // Auto-detect category from first file
    if (fileArray[0]) {
      setCategory(getCategoryFromMimeType(fileArray[0].type));
    }
  };

  const handleFolderSelected = (folderId: string | null) => {
    setSelectedFolder(folderId);
  };

  const getCategoryFromMimeType = (mimeType: string): string => {
    if (mimeType.startsWith('image/')) {
      return 'image';
    } else if (mimeType === 'application/pdf') {
      return 'pdf';
    } else if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) {
      return 'spreadsheet';
    } else if (mimeType.includes('document') || mimeType.includes('word')) {
      return 'document';
    }
    return 'other';
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one file');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Get folder path if a folder is selected
      let folderPath = '';
      if (selectedFolder) {
        // Using custom table access method, ensuring we're using a type assertion
        const { data: folder } = await (supabase as any)
          .from('folders')
          .select('path')
          .eq('id', selectedFolder)
          .single();
          
        if (folder && folder.path) {
          folderPath = folder.path;
        }
      }
      
      // Process each file
      for (const file of selectedFiles) {
        // Create storage path
        const timestamp = new Date().getTime();
        const filePath = folderPath 
          ? `${folderPath}/${timestamp}_${file.name}`
          : `root/${timestamp}_${file.name}`;
        
        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('file_management')
          .upload(filePath, file);
          
        if (uploadError) {
          toast.error(`Failed to upload ${file.name}: ${uploadError.message}`);
          continue;
        }
        
        // Prepare tags array
        const tagArray = tags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0);
        
        // Add metadata - using type assertion since 'files' is the table in the database
        const fileMetadata = {
          filename: file.name,
          original_filename: file.name,
          description: description,
          size: file.size,
          mime_type: file.type,
          file_type: getCategoryFromMimeType(file.type),
          category: category === 'pdf' ? 'document' : 'other',
          storage_path: filePath,
          metadata: { tags: tagArray }
        };
        
        const { error: metadataError } = await (supabase as any)
          .from('files')
          .insert(fileMetadata);
          
        if (metadataError) {
          toast.error(`Failed to save metadata for ${file.name}`);
          continue;
        }
        
        toast.success(`Uploaded ${file.name}`);
      }
      
      // Reset form after successful upload
      setSelectedFiles([]);
      setDescription('');
      setTags('');
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('An error occurred during upload');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <div className={`p-6 rounded-lg border ${borderColor} ${cardBg} mb-6`}>
        <h1 className={`text-2xl font-bold mb-6 ${textColor}`}>Add Files</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-6">
              <h2 className={`text-lg font-semibold mb-2 ${textColor}`}>Select Files</h2>
              <FileUploadZone 
                theme={theme} 
                currentFolderId={null}
                onUpload={(files) => handleFilesSelected(files)}
                dropZoneText="Drag and drop files here or click to browse"
                showFilesPreview={true}
                buttonLabel="Select Files"
              />
            </div>
            
            {selectedFiles.length > 0 && (
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} mt-4`}>
                <h3 className={`text-md font-semibold mb-2 ${textColor}`}>Selected Files ({selectedFiles.length})</h3>
                <ul className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span className={`text-sm ${textColor}`}>{file.name}</span>
                      <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(2)} KB)</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div>
            <div className="mb-4">
              <h2 className={`text-lg font-semibold mb-2 ${textColor}`}>File Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="category" className={`block mb-2 text-sm font-medium ${textColor}`}>
                    Category
                  </label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="document">Document</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="spreadsheet">Spreadsheet</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label htmlFor="description" className={`block mb-2 text-sm font-medium ${textColor}`}>
                    Description
                  </label>
                  <Textarea
                    id="description"
                    placeholder="Enter a description for the file(s)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="resize-none"
                  />
                </div>
                
                <div>
                  <label htmlFor="tags" className={`block mb-2 text-sm font-medium ${textColor}`}>
                    Tags (comma-separated)
                  </label>
                  <Input
                    id="tags"
                    placeholder="e.g. invoice, property, report"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="folder" className={`block mb-2 text-sm font-medium ${textColor}`}>
                    Destination Folder
                  </label>
                  <FolderSelector 
                    theme={theme}
                    onFolderSelect={handleFolderSelected}
                  />
                </div>
              </div>
            </div>
            
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
          </div>
        </div>
      </div>
    </div>
  );
}
