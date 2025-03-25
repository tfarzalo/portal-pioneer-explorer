
interface JobUpdateButtonProps {
  onClick: () => void;
  isLoading: boolean;
  hasChanges: boolean;
}

export const JobUpdateButton = ({ 
  onClick, 
  isLoading, 
  hasChanges 
}: JobUpdateButtonProps) => {
  return (
    <button 
      onClick={onClick}
      disabled={isLoading || !hasChanges}
      className={`w-full p-3 bg-red-500 hover:bg-red-600 text-white rounded flex items-center justify-center ${
        (isLoading || !hasChanges) ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {isLoading ? 'Updating...' : 'Submit Update'}
    </button>
  );
};
