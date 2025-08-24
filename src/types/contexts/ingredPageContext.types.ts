import { IngredView, IngredFormData, IngredDto } from "@/types";

export interface IngredPageContextTypes {
  ingredDtoList: IngredDto[];
  ingredDtoListStat: { error: any; isLoading: boolean };
  ingredDtoListMutate: any;
  ingredViewList: IngredView[] | undefined;
  setIngredViewList: (list: IngredView[]) => void;
  isAddIngred: boolean;
  setIsAddIngred: (add: boolean) => void;
  isEditIngred: boolean;
  setIsEditIngred: (edit: boolean) => void;
  editIngredId: number | undefined;
  setEditIngredId: (id: number | undefined) => void;
  editData: IngredFormData | undefined;
  setEditData: (data: IngredFormData | undefined) => void;
  openAddIngredForm: () => void;
  openEditIngredForm: (row: IngredView) => void;
  closeIngredForm: () => void;
  submitAddIngred: (formData: Partial<IngredFormData>) => Promise<void>;
  submitEditIngred: (formData: Partial<IngredFormData>) => Promise<void>;
  submitDeleteIngred: (row: IngredView) => Promise<void>;

  // フラグ管理
  flg: { readonly ingredUnitConvVisible: "ingredUnitConvVisible" };
  switchFlgIngredAcc: (updIndex: number, key: keyof IngredView, flg: any, isAll?: boolean) => void;
} 