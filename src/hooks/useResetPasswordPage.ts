import { useContext } from 'react';
import { ResetPasswordPageContext } from '@/contexts';
import { ResetPasswordPageContextTypes } from '@/types';

export const useResetPasswordPage = (): ResetPasswordPageContextTypes => {
  const context = useContext(ResetPasswordPageContext);
  if (!context) {
    throw new Error('useResetPasswordPage must be used within a ResetPasswordPageProvider');
  }
  return context;
}; 