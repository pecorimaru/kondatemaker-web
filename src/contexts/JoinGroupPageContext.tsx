import { createContext } from 'react';
import { JoinGroupPageContextTypes } from '@/types';

export const JoinGroupPageContext = createContext<JoinGroupPageContextTypes | null>(null); 