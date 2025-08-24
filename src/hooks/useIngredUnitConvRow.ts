import { IngredUnitConvRowContext } from "@/contexts";
import { IngredUnitConvRowContextTypes } from "@/types";
import { useContext } from "react";


export const useIngredUnitConvRow = (): IngredUnitConvRowContextTypes => {
    const context = useContext(IngredUnitConvRowContext);
    if (context === undefined || context === null) {
      throw new Error('useIngredUnitConvRow must be used within a IngredUnitConvRowProvider');
    }
    return context;
  }; 