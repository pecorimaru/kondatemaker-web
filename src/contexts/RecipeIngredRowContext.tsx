import { createContext } from 'react';
import { RecipeIngredRowContextTypes } from '@/types';

export const RecipeIngredRowContext = createContext<RecipeIngredRowContextTypes | null>(null);
