import { useState, useRef } from 'react';
import { Upload, File, X } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface FileUploadZoneProps {
  theme: 'dark' | 'light';
  currentFolderId?: string | null;
  onUpload: (files: FileList) => void;
  dropZoneText?: string;
  showFilesPreview?: boolean;
  buttonLabel?: string;
}

export function FileUploadZone({ 
  theme, 
  onUpload,
  dropZoneText = "Drag and drop files here or click to browse",
  showFilesPreview = false,
  buttonLabel = "Upload Files"
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-300';
  const borderActive = 'border-blue-500';
  const bgColor = theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100/50';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textMuted = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const fileBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100';

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    if (showFilesPreview) {
      setSelectedFiles(Array.from(files));
    } else {
      onUpload(files);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadClick = () => {
    if (selectedFiles.length > 0) {
      const fileList = new DataTransfer();
      selectedFiles.forEach(file => fileList.items.add(file));
      onUpload(fileList.files);
      setSelectedFiles([]);
    } else {
      fileInputRef.current?.click();
    }
  };

  return (
    <div>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer",
          isDragging ? borderActive : borderColor,
          bgColor
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center">
          <Upload className={cn("h-10 w-10 mb-2", isDragging ? "text-blue-500" : textMuted)} />
          <p className={`text-sm text-center ${textColor}`}>{dropZoneText}</p>
          <p className={`text-xs mt-1 ${textMuted}`}>
            Supports images, documents, PDFs, and more
          </p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          className="hidden"
          multiple
        />
      </div>
      
      {showFilesPreview && selectedFiles.length > 0 && (
        <div className="mt-4">
          <h4 className={`text-sm font-medium mb-2 ${textColor}`}>Selected Files ({selectedFiles.length})</h4>
          <ul className={cn(
            "space-y-2 max-h-40 overflow-auto scrollbar-thin",
            theme === 'dark' ? 'scrollbar-track-gray-700 scrollbar-thumb-gray-600' : 'scrollbar-track-gray-200 scrollbar-thumb-gray-300'
          )}>
            {selectedFiles.map((file, index) => (
              <li key={index} className={cn(
                "flex items-center justify-between p-2 rounded-md", 
                fileBg
              )}>
                <div className="flex items-center">
                  <File className="h-4 w-4 mr-2 text-blue-500" />
                  <div>
                    <p className={`text-sm ${textColor}`}>{file.name}</p>
                    <p className={`text-xs ${textMuted}`}>{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <button 
                  className="text-red-500 hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {showFilesPreview && (
        <Button 
          className="w-full mt-4" 
          onClick={handleUploadClick}
        >
          {buttonLabel}
        </Button>
      )}
    </div>
  );
}
