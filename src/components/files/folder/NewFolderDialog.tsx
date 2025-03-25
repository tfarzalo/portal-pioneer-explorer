
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';

interface NewFolderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  folderName: string;
  onFolderNameChange: (value: string) => void;
  onCreateFolder: () => void;
  isSubfolder: boolean;
  theme: 'dark' | 'light';
}

export const NewFolderDialog: React.FC<NewFolderDialogProps> = ({
  isOpen,
  onClose,
  folderName,
  onFolderNameChange,
  onCreateFolder,
  isSubfolder,
  theme,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : ''}>
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="Folder name"
            value={folderName}
            onChange={(e) => onFolderNameChange(e.target.value)}
            autoFocus
            className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}
          />
          <p className="mt-2 text-sm text-gray-500">
            {isSubfolder ? 'Creating a subfolder' : 'Creating a root folder'}
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}
            className={theme === 'dark' ? 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600' : ''}>
            Cancel
          </Button>
          <Button onClick={onCreateFolder}>
            Create Folder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
