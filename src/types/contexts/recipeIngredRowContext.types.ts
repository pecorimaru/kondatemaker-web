import { IngredSelectFormData, RecipeView, RecipeIngredView } from "@/types";

export interface RecipeIngredRowContextTypes {
  recipe: RecipeView;
  recipeIngredDtoList: RecipeIngredView[] | undefined;
  recipeIngredDtoListStat: { error: any; isLoading: boolean };
  recipeIngredDtoListMutate: any;
  recipeIngredViewList: RecipeIngredView[];
  setRecipeIngredViewList: (list: RecipeIngredView[]) => void;
  isAddIngred: boolean;
  setIsAddIngred: (add: boolean) => void;
  isEditIngred: boolean;
  setIsEditIngred: (edit: boolean) => void;
  editRecipeIngredId: number | null;
  setEditRecipeIngredId: (id: number | null) => void;
  editData: IngredSelectFormData | undefined;
  setEditData: (data: IngredSelectFormData | undefined) => void;
  openAddIngredForm: () => void;
  openEditIngredForm: (row: RecipeIngredView) => void;
  closeIngredForm: () => void;
  submitAddRecipeIngred: (formData: IngredSelectFormData, clearForm: () => void) => Promise<void>;
  submitEditRecipeIngred: (formData: IngredSelectFormData) => Promise<void>;
  submitDeleteRecipeIngred: (row: RecipeIngredView) => Promise<void>;
} 