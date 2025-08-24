import { createContext } from 'react';
import { RecipePageContextTypes } from '@/types';

export const RecipePageContext = createContext<RecipePageContextTypes | null>(null);
