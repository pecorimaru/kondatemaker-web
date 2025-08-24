import { useContext } from 'react';
import { AppContext } from '@/contexts';
import { AppContextTypes } from '@/types';

/**
 * アプリケーションコンテキストを使用するためのカスタムフック
 * AppProvider内でのみ使用可能
 */
export const useApp = (): AppContextTypes => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 