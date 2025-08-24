import { BuyIngredRowContext } from "@/contexts";
import { BuyIngredRowContextTypes } from "@/types";
import { useContext } from "react";


export const useBuyIngredRow = (): BuyIngredRowContextTypes => {
    const context = useContext(BuyIngredRowContext);
    if (context === undefined || context === null) {
      throw new Error('useBuyIngredRow must be used within a BuyIngredRowProvider');
    }
    return context;
  }; 