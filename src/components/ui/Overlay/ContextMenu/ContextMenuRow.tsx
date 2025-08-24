import React from 'react';
import { ContextMenuItem } from "@/types";

interface ContextMenuRowProps {
    contextMenu: ContextMenuItem;
  }
  
  export const ContextMenuRow: React.FC<ContextMenuRowProps> = ({ contextMenu }) => {
    return (
      <li 
        className="bg-white text-sm py-2 px-4 rounded-sm cursor-pointer border-b border-b-gray-200 duration-300 hover:bg-gray-100"
        onClick={contextMenu.onClick}
      >
        {contextMenu.label}
      </li>
    );
  };