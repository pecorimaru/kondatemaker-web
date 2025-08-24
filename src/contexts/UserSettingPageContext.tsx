import { createContext } from 'react';
import { UserSettingPageContextTypes } from '@/types';

export const UserSettingPageContext = createContext<UserSettingPageContextTypes | null>(null); 