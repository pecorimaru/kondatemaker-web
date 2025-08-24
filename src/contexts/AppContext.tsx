import { createContext } from "react";
import { AppContextTypes } from "@/types";

export const AppContext = createContext<AppContextTypes | null>(null);

