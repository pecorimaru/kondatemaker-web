import { createContext } from 'react';
import { LoginPageContextTypes } from '@/types';

export const LoginPageContext = createContext<LoginPageContextTypes | null>(null); 