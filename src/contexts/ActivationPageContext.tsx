import { createContext } from 'react';
import { ActivationPageContextTypes } from '@/types';

export const ActivationPageContext = createContext<ActivationPageContextTypes | null>(null); 