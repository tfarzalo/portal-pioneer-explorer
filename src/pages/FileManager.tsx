
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { FileExplorer } from '../components/files/FileExplorer';
import { FolderTree } from '../components/files/FolderTree';
import { FileUploadZone } from '../components/files/FileUploadZone';
import { 
  FolderIcon, 
  FileIcon, 
  FolderPlus as FolderPlusIcon, 
  FileText, 
  ImageIcon, 
  File as FileIconBase,
  BarChart 
} from 'lucide-react';
import { toast } from 'sonner';

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

  useEffect(() => {
    fetchRootFolder();
  }, []);

  const fetchRootFolder = async () => {
    setLoading(true);
    try {
      // Get the root folders (those without a parent)
      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .is('parent_id', null);

      if (error) throw error;
      
      setFolders(data || []);
      setBreadcrumbs([{ id: null, name: 'Root' }]);
      setCurrentFolder(null);
      
      // Get files in the root folder (i.e., those with no folder_id)
      const { data: rootFiles, error: filesError } = await supabase
        .from('file_metadata')
        .select('*')
        .is('folder_id', null);
        
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
      // Get the selected folder
      const { data: folder, error: folderError } = await supabase
        .from('folders')
        .select('*')
        .eq('id', folderId)
        .single();
        
      if (folderError) throw folderError;
      
      // Get subfolders
      const { data: subfolders, error: subfoldersError } = await supabase
        .from('folders')
        .select('*')
        .eq('parent_id', folderId);
        
      if (subfoldersError) throw subfoldersError;
      
      // Get files in this folder
      const { data: folderFiles, error: filesError } = await supabase
        .from('file_metadata')
        .select('*')
        .eq('folder_id', folderId);
        
      if (filesError) throw filesError;
      
      setCurrentFolder(folder);
      setFolders(subfolders || []);
      setFiles(folderFiles || []);
      
      // Update breadcrumbs
      updateBreadcrumbs(folder);
    } catch (error) {
      console.error('Error fetching folder:', error);
      toast.error('Failed to load folder');
    } finally {
      setLoading(false);
    }
  };

  const updateBreadcrumbs = async (folder: any) => {
    // Start with the current folder
    const newBreadcrumbs = [folder];
    let currentParentId = folder.parent_id;
    
    // Add all parents
    while (currentParentId) {
      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .eq('id', currentParentId)
        .single();
        
      if (error) break;
      
      newBreadcrumbs.unshift(data);
      currentParentId = data.parent_id;
    }
    
    // Add the root
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
      
      const { data, error } = await supabase
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
      return <BarChart className="w-6 h-6 text-green-500" />;
    } else if (mimeType.includes('document') || mimeType.includes('word')) {
      return <FileText className="w-6 h-6 text-indigo-500" />;
    }
    return <FileIconBase className="w-6 h-6 text-gray-500" />;
  };

  const uploadFiles = async (files: FileList, currentFolderId: string | null) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        // Upload to storage
        const filePath = currentFolderId 
          ? `${currentFolder.path}/${file.name}`
          : `root/${file.name}`;
          
        const { error: uploadError } = await supabase.storage
          .from('file_management')
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;
        
        // Add metadata
        const fileMetadata = {
          filename: file.name,
          original_filename: file.name,
          description: '',
          size: file.size,
          mime_type: file.type,
          category: getCategoryFromMimeType(file.type),
          folder_id: currentFolderId,
          storage_path: filePath,
          tags: []
        };
        
        const { data: metadataData, error: metadataError } = await supabase
          .from('file_metadata')
          .insert(fileMetadata)
          .select()
          .single();
          
        if (metadataError) throw metadataError;
        
        setFiles([...files, metadataData]);
        toast.success(`Uploaded ${file.name}`);
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    
    // Refresh the current view
    if (currentFolderId) {
      fetchFolder(currentFolderId);
    } else {
      fetchRootFolder();
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
      <div className={`p-6 rounded-lg border ${borderColor} ${cardBg} mb-6`}>
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
            <div className={`mb-4 p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
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
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Files</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="others">Others</TabsTrigger>
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
                  folders={[]} /* No folders in filtered views */
                  files={files.filter(file => file.category === 'image')}
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
                    file.category === 'document' || 
                    file.category === 'pdf' ||
                    file.category === 'spreadsheet'
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
                    file.category === 'other'
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
