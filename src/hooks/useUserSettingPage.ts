import { useContext } from 'react';
import { UserSettingPageContext } from '@/contexts';
import { UserSettingPageContextTypes } from '@/types';

export const useUserSettingPage = (): UserSettingPageContextTypes => {
  const context = useContext(UserSettingPageContext);
  if (!context) {
    throw new Error('useUserSettingPage must be used within a UserSettingPageProvider');
  }
  return context;
}; 