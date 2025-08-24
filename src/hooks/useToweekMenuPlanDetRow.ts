import { useContext } from 'react';
import { ToweekMenuPlanDetRowContext } from '@/contexts';
import { ToweekMenuPlanDetRowContextTypes } from '@/types';

export const useToweekMenuPlanDetRow = (): ToweekMenuPlanDetRowContextTypes => {
  const context = useContext(ToweekMenuPlanDetRowContext);
  if (!context) {
    throw new Error('useToweekMenuPlanDetRow must be used within a ToweekMenuPlanDetRowProvider');
  }
  return context;
}; 