import { BuyIngredDto, BuyIngredView, IngredSelectFormData } from "@/types";

export interface BuyPageContextTypes {
  buyIngredList: BuyIngredDto[];
  buyIngredListStat: { error: any; isLoading: boolean };
  buyIngredListMutate: any;
  incompleteList: BuyIngredView[] | undefined;
  setIncompleteList: (list: BuyIngredView[]) => void;
  completeList: BuyIngredView[] | undefined;
  setCompleteList: (list: BuyIngredView[]) => void;
  editBuyIngredId: number | undefined;
  setEditBuyIngredId: (id: number | undefined) => void;
  editData: IngredSelectFormData | undefined;
  setEditData: (data: IngredSelectFormData | undefined) => void;
  isAddIngred: boolean;
  setIsAddIngred: (add: boolean) => void;
  isEditIngred: boolean;
  setIsEditIngred: (edit: boolean) => void;
  submitSwitchCompletion: (row: BuyIngredView) => void;
  openAddIngredForm: () => void;
  openEditIngredForm: (row: BuyIngredView) => void;
  closeIngredForm: () => void;
  submitAddBuyIngred: (formData: IngredSelectFormData, clearForm: () => void) => Promise<void>;
  submitEditBuyIngred: (formData: IngredSelectFormData) => Promise<void>;
  submitDeleteBuyIngred: (row: BuyIngredView) => Promise<void>;
} 