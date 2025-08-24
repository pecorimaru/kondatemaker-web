import { BuyIngredDto } from "../api";

export interface BuyIngredView extends BuyIngredDto {
    isEditing?: boolean;
    isSelected?: boolean;
    isBought: boolean;
    [key: string]: any;
  } 