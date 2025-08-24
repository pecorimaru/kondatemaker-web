import { createContext } from 'react';
import { IngredPageContextTypes } from '@/types';

export const IngredPageContext = createContext<IngredPageContextTypes | null>(null);
