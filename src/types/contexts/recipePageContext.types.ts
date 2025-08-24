import { RecipeView, RecipeFormData } from "@/types";

export interface RecipePageContextTypes {
  recipeDtoList: RecipeView[];
  recipeDtoListStat: { error: any; isLoading: boolean };
  recipeDtoListMutate: any;
  recipeViewList: RecipeView[];
  setRecipeViewList: (list: RecipeView[]) => void;
  isAddRecipe: boolean;
  setIsAddRecipe: (add: boolean) => void;
  isEditRecipe: boolean;
  setIsEditRecipe: (edit: boolean) => void;
  editRecipeId: number | null;
  setEditRecipeId: (id: number | null) => void;
  editData: RecipeFormData;
  setEditData: (data: RecipeFormData) => void;
  openAddRecipeForm: () => void;
  openEditRecipeForm: (row: RecipeView) => void;
  closeRecipeForm: () => void;
  submitAddRecipe: (formData: RecipeFormData) => Promise<void>;
  submitEditRecipe: (formData: RecipeFormData) => Promise<void>;
  submitDeleteRecipe: (row: RecipeView) => Promise<void>;
  flg: any;
  switchFlgRecipeAcc: (updIndex: number, key: string, flg: any, isAll?: boolean) => void;
} 