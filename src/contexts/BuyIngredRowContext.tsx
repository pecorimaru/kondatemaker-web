import { createContext } from 'react';
import { BuyIngredRowContextTypes } from '@/types';

export const BuyIngredRowContext = createContext<BuyIngredRowContextTypes | null>(null);
