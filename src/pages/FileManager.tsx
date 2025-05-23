import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { FileExplorer } from '../components/files/FileExplorer';
import { FolderTree } from '../components/files/FolderTree';
import { FileUploadZone } from '../components/files/FileUploadZone';
import { 
  FileText,
  ImageIcon, 
  File,
  FileSpreadsheet
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

interface FileManagerProps {
  theme: 'dark' | 'light';
}

export function FileManager({ theme }: FileManagerProps) {
  const [folders, setFolders] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [currentFolder, setCurrentFolder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [breadcrumbs, setBreadcrumbs] = useState<any[]>([]);

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const breadcrumbBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100';

  useEffect(() => {
    fetchRootFolder();
  }, []);

  const fetchRootFolder = async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('folders')
        .select('*')
        .is('parent_id', null)
        .order('name');

      if (error) throw error;
      
      setFolders(data || []);
      setBreadcrumbs([{ id: null, name: 'Root' }]);
      setCurrentFolder(null);
      
      const { data: rootFiles, error: filesError } = await supabase
        .from('files')
        .select('*')
        .is('folder_id', null)
        .order('created_at', { ascending: false });
        
      if (filesError) throw filesError;
      setFiles(rootFiles || []);
    } catch (error) {
      console.error('Error fetching folders:', error);
      toast.error('Failed to load folders');
    } finally {
      setLoading(false);
    }
  };

  const fetchFolder = async (folderId: string) => {
    setLoading(true);
    try {
      const { data: folder, error: folderError } = await (supabase as any)
        .from('folders')
        .select('*')
        .eq('id', folderId)
        .single();
        
      if (folderError) throw folderError;
      
      const { data: subfolders, error: subfoldersError } = await (supabase as any)
        .from('folders')
        .select('*')
        .eq('parent_id', folderId)
        .order('name');
        
      if (subfoldersError) throw subfoldersError;
      
      const { data: folderFiles, error: filesError } = await supabase
        .from('files')
        .select('*')
        .eq('folder_id', folderId)
        .order('created_at', { ascending: false });
        
      if (filesError) throw filesError;
      
      setCurrentFolder(folder);
      setFolders(subfolders || []);
      setFiles(folderFiles || []);
      
      updateBreadcrumbs(folder);
    } catch (error) {
      console.error('Error fetching folder:', error);
      toast.error('Failed to load folder');
    } finally {
      setLoading(false);
    }
  };

  const updateBreadcrumbs = async (folder: any) => {
    const newBreadcrumbs = [folder];
    let currentParentId = folder.parent_id;
    
    while (currentParentId) {
      const { data, error } = await (supabase as any)
        .from('folders')
        .select('*')
        .eq('id', currentParentId)
        .single();
        
      if (error) break;
      
      newBreadcrumbs.unshift(data);
      currentParentId = data.parent_id;
    }
    
    newBreadcrumbs.unshift({ id: null, name: 'Root' });
    setBreadcrumbs(newBreadcrumbs);
  };

  const createFolder = async (name: string) => {
    try {
      const newFolder = {
        name,
        parent_id: currentFolder?.id || null,
        path: currentFolder ? `${currentFolder.path}/${name}` : `/${name}`,
        is_system_folder: false
      };
      
      const { data, error } = await (supabase as any)
        .from('folders')
        .insert(newFolder)
        .select()
        .single();
        
      if (error) throw error;
      
      setFolders([...folders, data]);
      toast.success('Folder created successfully');
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('Failed to create folder');
    }
  };

  const navigateToBreadcrumb = (index: number) => {
    const targetBreadcrumb = breadcrumbs[index];
    if (index === 0) {
      fetchRootFolder();
    } else {
      fetchFolder(targetBreadcrumb.id);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <ImageIcon className="w-6 h-6 text-blue-500" />;
    } else if (mimeType === 'application/pdf') {
      return <FileText className="w-6 h-6 text-red-500" />;
    } else if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) {
      return <FileSpreadsheet className="w-6 h-6 text-green-500" />;
    } else if (mimeType.includes('document') || mimeType.includes('word')) {
      return <FileText className="w-6 h-6 text-indigo-500" />;
    }
    return <File className="w-6 h-6 text-gray-500" />;
  };

  const uploadFiles = async (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        const timestamp = new Date().getTime();
        
        const filePath = currentFolder?.id 
          ? `${currentFolder.path}/${timestamp}_${file.name}`
          : `root/${timestamp}_${file.name}`;
          
        const { error: uploadError } = await supabase.storage
          .from('file_management')
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;
        
        const fileMetadata = {
          filename: file.name,
          original_filename: file.name,
          description: '',
          size: file.size,
          mime_type: file.type,
          file_type: getCategoryFromMimeType(file.type),
          category: file.type.startsWith('image/') ? 'image' : 'document',
          folder_id: currentFolder?.id || null,
          storage_path: filePath,
          metadata: { tags: [] }
        };
        
        const { data: metadataData, error: metadataError } = await (supabase as any)
          .from('files')
          .insert(fileMetadata)
          .select()
          .single();
          
        if (metadataError) throw metadataError;
        
        setFiles(prevFiles => [metadataData, ...prevFiles]);
        toast.success(`Uploaded ${file.name}`);
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(`Failed to upload ${file.name}`);
      }
    }
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

  return (
    <div className="container mx-auto">
      <div className={cn("p-6 rounded-lg border", borderColor, cardBg, "mb-6")}>
        <h1 className={`text-2xl font-bold mb-6 ${textColor}`}>File Manager</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/4">
            <FolderTree 
              theme={theme}
              onFolderSelect={fetchFolder}
              onRootSelect={fetchRootFolder}
            />
            
            <div className="mt-6">
              <FileUploadZone 
                theme={theme} 
                currentFolderId={currentFolder?.id} 
                onUpload={uploadFiles} 
              />
            </div>
          </div>
          
          <div className="w-full md:w-3/4">
            <div className={cn("mb-4 p-3 rounded-lg", breadcrumbBg)}>
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-2">
                  {breadcrumbs.map((item, index) => (
                    <li key={index} className="inline-flex items-center">
                      {index > 0 && <span className={`mx-2 ${textColor}`}>/</span>}
                      <button
                        onClick={() => navigateToBreadcrumb(index)}
                        className={`${textColor} hover:underline hover:text-blue-500`}
                      >
                        {item.name}
                      </button>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
            
            <Tabs defaultValue="all">
              <TabsList className={`mb-4 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
                <TabsTrigger value="all" className={theme === 'dark' ? 'data-[state=active]:bg-gray-700' : ''}>All Files</TabsTrigger>
                <TabsTrigger value="images" className={theme === 'dark' ? 'data-[state=active]:bg-gray-700' : ''}>Images</TabsTrigger>
                <TabsTrigger value="documents" className={theme === 'dark' ? 'data-[state=active]:bg-gray-700' : ''}>Documents</TabsTrigger>
                <TabsTrigger value="others" className={theme === 'dark' ? 'data-[state=active]:bg-gray-700' : ''}>Others</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <FileExplorer 
                  theme={theme}
                  folders={folders}
                  files={files}
                  loading={loading}
                  onFolderClick={fetchFolder}
                  onCreateFolder={createFolder}
                  getFileIcon={getFileIcon}
                />
              </TabsContent>
              
              <TabsContent value="images">
                <FileExplorer 
                  theme={theme}
                  folders={[]}
                  files={files.filter(file => file.mime_type?.startsWith('image/'))}
                  loading={loading}
                  onFolderClick={fetchFolder}
                  onCreateFolder={createFolder}
                  getFileIcon={getFileIcon}
                />
              </TabsContent>
              
              <TabsContent value="documents">
                <FileExplorer 
                  theme={theme}
                  folders={[]}
                  files={files.filter(file => 
                    file.mime_type?.includes('document') || 
                    file.mime_type === 'application/pdf' ||
                    file.mime_type?.includes('spreadsheet')
                  )}
                  loading={loading}
                  onFolderClick={fetchFolder}
                  onCreateFolder={createFolder}
                  getFileIcon={getFileIcon}
                />
              </TabsContent>
              
              <TabsContent value="others">
                <FileExplorer 
                  theme={theme}
                  folders={[]}
                  files={files.filter(file => 
                    !file.mime_type?.startsWith('image/') &&
                    !file.mime_type?.includes('document') &&
                    file.mime_type !== 'application/pdf' &&
                    !file.mime_type?.includes('spreadsheet')
                  )}
                  loading={loading}
                  onFolderClick={fetchFolder}
                  onCreateFolder={createFolder}
                  getFileIcon={getFileIcon}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
