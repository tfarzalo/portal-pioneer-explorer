
import { Tag } from 'lucide-react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Select,
  SelectValue,
} from '../ui/select';
import { FolderSelector } from './FolderSelector';
import { cn } from '../../lib/utils';

interface FileDetailsFormProps {
  theme: 'dark' | 'light';
  category: string;
  setCategory: (category: string) => void;
  description: string;
  setDescription: (description: string) => void;
  tags: string;
  setTags: (tags: string) => void;
  selectedFolder: string | null;
  onFolderSelect: (folderId: string | null) => void;
  onTagClick: (tag: string) => void;
}

export function FileDetailsForm({
  theme,
  category,
  setCategory,
  description,
  setDescription,
  tags,
  setTags,
  selectedFolder,
  onFolderSelect,
  onTagClick
}: FileDetailsFormProps) {
  const inputBg = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  
  const suggestedTags = [
    'invoice', 'report', 'contract', 'important', 'archive',
    'client', 'project', 'draft', 'final', 'review'
  ];

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="category" className={`block mb-2 text-sm font-medium ${textColor}`}>
          Category
        </label>
        <Select 
          value={category} 
          onValueChange={setCategory}
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
              onClick={() => onTagClick(tag)}
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
          onFolderSelect={onFolderSelect}
        />
      </div>
    </div>
  );
}
