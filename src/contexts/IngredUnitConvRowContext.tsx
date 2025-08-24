import { createContext } from 'react';
import { IngredUnitConvRowContextTypes } from '@/types';

export const IngredUnitConvRowContext = createContext<IngredUnitConvRowContextTypes | null>(null);
