import type { MouseEventHandler } from "react";

interface AddRowButtonProps {
    textContent: string;
    onClick: MouseEventHandler<HTMLTableCellElement>
    cssWidth: string;
  }
  
export const AddRowButton: React.FC<AddRowButtonProps> = ({ textContent, onClick, cssWidth }) => {
return (
    <tr className="flex justify-end mt-1">
      <td
        className={`${cssWidth} text-sm text-slate-400 p-3 rounded-sm cursor-pointer hover:shadow-md hover:text-slate-700 hover:bg-white duration-500 ease-in-out`} 
        onClick={onClick}
      >
        <i className="fa-regular fa-square-plus" />{`　${textContent}`}
      </td>
    </tr>
);
};