export interface RecipeDto {
  recipeId: number;
  recipeNm: string;
  recipeDesc: string;
  recipeCategoryCd: string;
  recipeCategoryNm: string;
  recipeTypeCd: string;
  recipeTypeNm: string;
  recipeUrl: string;
  recipeUrlThumb: string;
  createdAt: string;
}

export interface RecipeIngredDto {
  recipeIngredId: number;
  recipeId: number;
  ingredId: number;
  ingredNm: string;
  qty: number;
  unitCd: string;
  salesAreaType: string;
} 