import { MenuPlanPageContext } from "@/contexts";
import { MenuPlanPageContextTypes } from "@/types";
import { useContext } from "react";


export const useMenuPlanPage = (): MenuPlanPageContextTypes => {
    const context = useContext(MenuPlanPageContext);
    if (context === undefined || context === null) {
      throw new Error('useMenuPlanPage must be used within a MenuPlanPageProvider');
    }
    return context;
  }; 