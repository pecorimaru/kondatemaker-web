interface FormCloseButtonProps {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
  };
  
  export const FormCloseButton: React.FC<FormCloseButtonProps> = ({ onClick }) => {
    return (
      <button
        type="button"
        onClick={onClick}
        className="bg-red-400 text-white py-2 px-6 rounded-sm shadow-md border-b-4 border-red-500 hover:bg-red-400 hover:shadow-lg active:bg-red-400 active:shadow-sm active:border-opacity-0 active:translate-y-0.5 transition duration-100"
      >
        閉じる
      </button>
    );
  };