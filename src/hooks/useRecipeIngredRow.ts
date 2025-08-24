import { RecipeIngredRowContext } from "@/contexts";
import { RecipeIngredRowContextTypes } from "@/types";
import { useContext } from "react";


export const useRecipeIngredRow = (): RecipeIngredRowContextTypes => {
    const context = useContext(RecipeIngredRowContext);
    if (context === undefined || context === null) {
      throw new Error('useRecipeIngredRow must be used within a RecipeIngredRowProvider');
    }
    return context;
  }; 