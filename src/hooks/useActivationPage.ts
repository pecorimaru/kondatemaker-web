import { useContext } from 'react';
import { ActivationPageContext } from '@/contexts';
import { ActivationPageContextTypes } from '@/types';

export const useActivationPage = (): ActivationPageContextTypes => {
  const context = useContext(ActivationPageContext);
  if (!context) {
    throw new Error('useActivationPage must be used within a ActivationPageProvider');
  }
  return context;
}; 