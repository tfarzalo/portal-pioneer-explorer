
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
      className={`w-full p-3 rounded-md transition-all duration-200 flex items-center justify-center
        ${hasChanges 
          ? 'bg-red-500 hover:bg-red-600 text-white shadow-sm' 
          : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
        } ${isLoading ? 'opacity-70 cursor-wait' : !hasChanges ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {isLoading ? 'Updating...' : 'Submit Update'}
    </button>
  );
};
