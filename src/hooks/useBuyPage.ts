import { BuyPageContext } from "@/contexts";
import { BuyPageContextTypes } from "@/types";
import { useContext } from "react";


export const useBuyPage = (): BuyPageContextTypes => {
    const context = useContext(BuyPageContext);
    if (context === undefined || context === null) {
      throw new Error('useBuyPage must be used within a BuyPageProvider');
    }
    return context;
  }; 