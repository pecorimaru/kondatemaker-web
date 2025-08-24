import { createContext } from 'react';
import { BuyPageContextTypes } from '@/types';

export const BuyPageContext = createContext<BuyPageContextTypes | null>(null);
