import { createContext } from 'react';
import { HomePageContextTypes } from '@/types';

export const HomePageContext = createContext<HomePageContextTypes | null>(null);
