import { createContext } from "react";
import { MenuPlanDetRowContextTypes } from "@/types";

export const MenuPlanDetRowContext = createContext<MenuPlanDetRowContextTypes | null>(null);
