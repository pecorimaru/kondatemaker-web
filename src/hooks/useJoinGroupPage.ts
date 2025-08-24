import { useContext } from 'react';
import { JoinGroupPageContext } from '@/contexts';
import { JoinGroupPageContextTypes } from '@/types';

export const useJoinGroupPage = (): JoinGroupPageContextTypes => {
  const context = useContext(JoinGroupPageContext);
  if (!context) {
    throw new Error('useJoinGroupPage must be used within a JoinGroupPageProvider');
  }
  return context;
}; 