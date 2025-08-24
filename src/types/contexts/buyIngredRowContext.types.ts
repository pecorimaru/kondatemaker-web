import { BuyIngredView } from "@/types";

export interface BuyIngredRowContextTypes {
  row: BuyIngredView;
  index: number;
  cssColor: string;
  handleOpenEditIngredForm: () => void;
  handleSubmitDeleteBuyIngred: () => void;
} 