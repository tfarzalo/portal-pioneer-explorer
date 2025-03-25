
import { FileText } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FilePreviewProps {
  files: File[];
  uploadProgress: { [key: string]: number };
  theme: 'dark' | 'light';
}

export function FilePreview({ files, uploadProgress, theme }: FilePreviewProps) {
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  
  return (
    <div className={cn(
      "p-4 rounded-lg mt-4",
      theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
    )}>
      <h3 className={`text-md font-semibold mb-2 ${textColor}`}>Selected Files ({files.length})</h3>
      <ul className="space-y-2">
        {files.map((file, index) => (
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
  );
}
