import { BaseProviderTypes, BuyIngredView } from "@/types";

export interface BuyIngredRowProviderTypes extends BaseProviderTypes {
  row: BuyIngredView;
  index: number;
}