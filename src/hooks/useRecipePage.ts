import { RecipePageContext } from "@/contexts";
import { RecipePageContextTypes } from "@/types";
import { useContext } from "react";


export const useRecipePage = (): RecipePageContextTypes => {
    const context = useContext(RecipePageContext);
    if (context === undefined || context === null) {
      throw new Error('useRecipePage must be used within a RecipePageProvider');
    }
    return context;
  }; 