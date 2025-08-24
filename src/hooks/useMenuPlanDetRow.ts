import { MenuPlanDetRowContext } from "@/contexts";
import { MenuPlanDetRowContextTypes } from "@/types";
import { useContext } from "react";

export const useMenuPlanDetRow = (): MenuPlanDetRowContextTypes => {
    const context = useContext(MenuPlanDetRowContext);
    if (!context) throw new Error('useMenuPlanDetRowContext must be used within a MenuPlanDetRowProvider');
    return context;
  }; 