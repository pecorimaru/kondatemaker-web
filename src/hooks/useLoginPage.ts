import { useContext } from 'react';
import { LoginPageContext } from '@/contexts';
import { LoginPageContextTypes } from '@/types';

export const useLoginPage = (): LoginPageContextTypes => {
  const context = useContext(LoginPageContext);
  if (!context) {
    throw new Error('useLoginPage must be used within a LoginPageProvider');
  }
  return context;
}; 