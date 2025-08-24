import { HomePageContext } from "@/contexts";
import { HomePageContextTypes } from "@/types";
import { useContext } from "react";


export const useHomePage = (): HomePageContextTypes => {
    const context = useContext(HomePageContext);
    if (context === undefined || context === null) {
      throw new Error('useHomePage must be used within a HomePageProvider');
    }
    return context;
  }; 