
import { useState } from 'react';
import { FileUploadZone } from '../components/files/FileUploadZone';
import { FileUploader } from '../components/files/FileUploader';
import { FileDetailsForm } from '../components/files/FileDetailsForm';
import { FilePreview } from '../components/files/FilePreview';
import { cn } from '../lib/utils';
import { FileCategory } from '../types/fileTypes';

interface AddFileProps {
  theme: 'dark' | 'light';
}

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

  const handleFilesSelected = (files: FileList) => {
    const fileArray = Array.from(files);
    setSelectedFiles(fileArray);
    
    if (fileArray.length > 0 && !category) {
      const detectedCategory = getCategoryFromMimeType(fileArray[0].type);
      setCategory(detectedCategory);
    }
  };

  const handleFolderSelected = (folderId: string | null) => {
    setSelectedFolder(folderId);
  };

  const getCategoryFromMimeType = (mimeType: string): FileCategory => {
    if (mimeType.startsWith('image/')) {
      return 'property_photo';
    } else if (mimeType === 'application/pdf') {
      return 'document';
    } else if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) {
      return 'document';
    } else if (mimeType.includes('document') || mimeType.includes('word')) {
      return 'document';
    }
    return 'other';
  };

  const addTag = (tag: string) => {
    const currentTags = tags.split(',').map(t => t.trim()).filter(t => t !== '');
    if (!currentTags.includes(tag)) {
      const newTags = currentTags.length > 0 
        ? `${tags}, ${tag}` 
        : tag;
      setTags(newTags);
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
              <FilePreview 
                files={selectedFiles} 
                uploadProgress={uploadProgress} 
                theme={theme} 
              />
            )}
          </div>
          
          <div>
            <div className="mb-4">
              <h2 className={`text-lg font-semibold mb-2 ${textColor}`}>File Details</h2>
              
              <FileDetailsForm
                theme={theme}
                category={category}
                setCategory={setCategory}
                description={description}
                setDescription={setDescription}
                tags={tags}
                setTags={setTags}
                selectedFolder={selectedFolder}
                onFolderSelect={handleFolderSelected}
                onTagClick={addTag}
              />
            </div>
            
            <FileUploader
              selectedFiles={selectedFiles}
              selectedFolder={selectedFolder}
              description={description}
              tags={tags}
              category={category}
              isUploading={isUploading}
              setIsUploading={setIsUploading}
              setUploadProgress={setUploadProgress}
              getCategoryFromMimeType={getCategoryFromMimeType}
              onUploadComplete={() => {
                setSelectedFiles([]);
                setDescription('');
                setTags('');
                setUploadProgress({});
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
