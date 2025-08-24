import { useContext } from 'react';
import { GroupSettingPageContext } from '@/contexts';
import { GroupSettingPageContextTypes } from '@/types';

export const useGroupSettingPage = (): GroupSettingPageContextTypes => {
  const context = useContext(GroupSettingPageContext);
  if (!context) {
    throw new Error('useGroupSettingPage must be used within a GroupSettingPageProvider');
  }
  return context;
}; 