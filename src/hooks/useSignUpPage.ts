import { useContext } from 'react';
import { SignUpPageContext } from '@/contexts';
import { SignUpPageContextTypes } from '@/types';

export const useSignUpPage = (): SignUpPageContextTypes => {
  const context = useContext(SignUpPageContext);
  if (!context) {
    throw new Error('useSignUpPage must be used within a SignUpPageProvider');
  }
  return context;
}; 