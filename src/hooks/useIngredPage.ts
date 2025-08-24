import { IngredPageContext } from "@/contexts";
import { IngredPageContextTypes } from "@/types";
import { useContext } from "react";


export const useIngredPage = (): IngredPageContextTypes => {
    const context = useContext(IngredPageContext);
    if (context === undefined || context === null) {
      throw new Error('useIngredPage must be used within a IngredPageProvider');
    }
    return context;
  }; 