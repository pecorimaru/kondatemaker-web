import React from 'react';

interface FooterButtonProps {
  textContent: string;
  icon: string;
  onClick: () => void;
}

export const FooterButton: React.FC<FooterButtonProps> = ({ 
  textContent, 
  icon, 
  onClick 
}) => {
  return (
    <div className="inline-block">
      <p className="text-slate-700 flex justify-center text-xs">
        {textContent}
      </p>
      <button 
        className={`
          ${icon} bg-blue-400 text-white font-bold mt-0.5 h-11 w-11 
          rounded-lg shadow-sm border-b-4
          transition duration-100
          border-blue-500 hover:bg-blue-400 hover:shadow-xl hover:text-slate-200
          active:bg-blue-400 active:shadow-sm active:border-opacity-0 active:translate-y-0.5
        `}
        onClick={onClick}
      />
    </div>
  );
}; 