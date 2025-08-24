import { createContext } from 'react';
import { SignUpPageContextTypes } from '@/types';

export const SignUpPageContext = createContext<SignUpPageContextTypes | null>(null); 