
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
import { FileText, Save, Tag } from 'lucide-react';
import { cn } from '../lib/utils';

interface AddFileProps {
  theme: 'dark' | 'light';
}

// Define allowed file categories to match database enum
type FileCategory = 'document' | 'image' | 'pdf' | 'other' | 'property_photo' | 
  'job_photo' | 'before_photo' | 'after_photo' | 'invoice' | 'contract';

export function AddFile({ theme }: AddFileProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [category, setCategory] = useState<FileCategory>('document');
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const inputBg = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';

  const handleFilesSelected = (files: FileList) => {
    const fileArray = Array.from(files);
    setSelectedFiles(fileArray);
    
    if (fileArray.length > 0 && !category) {
      setCategory(getCategoryFromMimeType(fileArray[0].type));
    }
  };

  const handleFolderSelected = (folderId: string | null) => {
    setSelectedFolder(folderId);
  };

  const getCategoryFromMimeType = (mimeType: string): FileCategory => {
    if (mimeType.startsWith('image/')) {
      return 'image';
    } else if (mimeType === 'application/pdf') {
      return 'pdf';
    } else if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) {
      return 'document';
    } else if (mimeType.includes('document') || mimeType.includes('word')) {
      return 'document';
    }
    return 'other';
  };

  const suggestedTags = [
    'invoice', 'report', 'contract', 'important', 'archive',
    'client', 'project', 'draft', 'final', 'review'
  ];

  const addTag = (tag: string) => {
    const currentTags = tags.split(',').map(t => t.trim()).filter(t => t !== '');
    if (!currentTags.includes(tag)) {
      const newTags = currentTags.length > 0 
        ? `${tags}, ${tag}` 
        : tag;
      setTags(newTags);
    }
  };

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
        
        // Track progress using the onProgress callback
        const { data: storageData, error: uploadError } = await supabase.storage
          .from('file_management')
          .upload(filePath, file, options, {
            onUploadProgress: (progress) => {
              const percent = Math.round((progress.loaded / progress.total) * 100);
              setUploadProgress(prev => ({
                ...prev,
                [file.name]: percent
              }));
            },
          });
          
        if (uploadError) {
          toast.error(`Failed to upload ${file.name}: ${uploadError.message}`);
          return null;
        }
        
        const tagArray = tags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0);
        
        const detectedCategory = getCategoryFromMimeType(file.type);
        
        const fileMetadata = {
          filename: file.name,
          original_filename: file.name,
          description: description,
          size: file.size,
          mime_type: file.type,
          file_type: detectedCategory,
          category: category || detectedCategory,
          storage_path: filePath,
          folder_id: folderId,
          metadata: { tags: tagArray }
        };
        
        const { data: fileData, error: metadataError } = await supabase
          .from('files')
          .insert({
            ...fileMetadata,
            category: category || detectedCategory
          })
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
      setSelectedFiles([]);
      setDescription('');
      setTags('');
      setUploadProgress({});
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(`An error occurred during upload: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <div className={cn("p-6 rounded-lg border", borderColor, cardBg, "mb-6")}>
        <h1 className={`text-2xl font-bold mb-6 ${textColor}`}>Add Files</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-6">
              <h2 className={`text-lg font-semibold mb-2 ${textColor}`}>Select Files</h2>
              <FileUploadZone 
                theme={theme} 
                currentFolderId={selectedFolder}
                onUpload={(files) => handleFilesSelected(files)}
                dropZoneText="Drag and drop files here or click to browse"
                showFilesPreview={true}
                buttonLabel="Select Files"
              />
            </div>
            
            {selectedFiles.length > 0 && (
              <div className={cn(
                "p-4 rounded-lg mt-4",
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
              )}>
                <h3 className={`text-md font-semibold mb-2 ${textColor}`}>Selected Files ({selectedFiles.length})</h3>
                <ul className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <li key={index} className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <span className={`text-sm ${textColor}`}>{file.name}</span>
                        <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(2)} KB)</span>
                      </div>
                      {uploadProgress[file.name] !== undefined && (
                        <div className="mt-1 w-full bg-gray-300 rounded-full h-1.5">
                          <div 
                            className="bg-blue-500 h-1.5 rounded-full" 
                            style={{ width: `${uploadProgress[file.name]}%` }}
                          />
                        </div>
                      )}
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
                  <Select 
                    value={category} 
                    onValueChange={(value) => setCategory(value as FileCategory)}
                  >
                    <SelectTrigger className={inputBg}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                      <SelectItem value="document">Document</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="invoice">Invoice</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="property_photo">Property Photo</SelectItem>
                      <SelectItem value="job_photo">Job Photo</SelectItem>
                      <SelectItem value="before_photo">Before Photo</SelectItem>
                      <SelectItem value="after_photo">After Photo</SelectItem>
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
                    className={cn("resize-none", inputBg)}
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
                    className={inputBg}
                  />
                  
                  <div className="mt-2 flex flex-wrap gap-1">
                    {suggestedTags.map((tag, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => addTag(tag)}
                        className={cn(
                          "inline-flex items-center px-2 py-1 rounded-md text-xs",
                          theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                        )}
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </button>
                    ))}
                  </div>
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
