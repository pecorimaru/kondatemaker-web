interface FormSubmitButtonProps {
    textContent?: string | null;
  }
  
  export const FormSubmitButton: React.FC<FormSubmitButtonProps>  = ({ textContent }) => {
    return (
      <button
        type="submit"
        className="bg-blue-400 text-white py-2 px-6 rounded-sm shadow-md border-b-4 border-blue-500 ml-2 hover:bg-blue-400 hover:shadow-lg active:bg-blue-400 active:shadow-sm active:border-opacity-0 active:translate-y-0.5 transition duration-100"
      >
        {textContent ? textContent : "保存"}
      </button>
    );
  };
  