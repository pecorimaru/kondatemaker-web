import React from 'react';

interface FloatingActionButtonProps {
  onClick: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  size = 'sm'
}) => {
  
  const sizeClasses = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-14 h-14 text-xl',
    lg: 'w-16 h-16 text-2xl'
  };

  const bottomOffset = {
    sm: 'bottom-24',  // フッター(80px)の上
    md: 'bottom-24',  // フッター + 余白
    lg: 'bottom-28'
  };

  return (
    <button
      onClick={onClick}
      className={`
        fa-solid fa-plus
        fixed right-4 ${bottomOffset[size]} z-10
        ${sizeClasses[size]}
        bg-blue-400 text-white font-bold mt-0.5 h-11 w-11 
        rounded-full shadow-sm border-b-4
        transition duration-100
        border-blue-500 hover:bg-blue-400 hover:shadow-xl hover:text-slate-200
        active:bg-blue-400 active:shadow-sm active:border-opacity-0 active:translate-y-0.5
      `} >
    </button>
  );
}; 