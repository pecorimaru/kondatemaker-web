import { VISIBLE_TYPE } from "@/constants";
import { RecipeDto, RecipeIngredDto } from "../api";


export interface RecipeView extends RecipeDto {
  recipeIngredVisible: VISIBLE_TYPE;
  [key: string]: any;
}

export interface RecipeIngredView extends RecipeIngredDto {
}

export interface RecipeFormData {
  recipeId?: number;
  recipeNm?: string | null;
  recipeNmK?: string | null;
  recipeType?: string | null;
  recipeUrl?: string | null;
}