import React from 'react';

interface HeaderMenuRowProps {
  textContent: string;
  icon: string;
  onClick: () => void;
}

export const HeaderMenuRow: React.FC<HeaderMenuRowProps> = ({ 
  textContent, 
  icon, 
  onClick 
}) => {
  return (
    <li 
      className="flex items-center border-b bg-white border-slate-200 h-12 w-full transition-opacity duration-300 hover:bg-gray-100 hover:cursor-pointer"
      onClick={onClick}
    >
      <i className={`w-8 px-3 ${icon}`}></i>
      <span className="px-3">{textContent}</span>
    </li>
  );
}; 