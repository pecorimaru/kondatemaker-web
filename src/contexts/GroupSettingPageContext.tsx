import { createContext } from 'react';
import { GroupSettingPageContextTypes } from '@/types';

export const GroupSettingPageContext = createContext<GroupSettingPageContextTypes | null>(null); 