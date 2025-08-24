import { IngredView, IngredUnitConvView, IngredUnitConvFormData } from "@/types";

export interface IngredUnitConvRowContextTypes {
  ingred: IngredView;
  ingredUnitConvDtoList: IngredUnitConvView[] | undefined;
  ingredUnitConvDtoListStat: { error: any; isLoading: boolean };
  ingredUnitConvDtoListMutate: any;
  isAddIngredUnitConv: boolean;
  setIsAddIngredUnitConv: (add: boolean) => void;
  isEditIngredUnitConv: boolean;
  setIsEditIngredUnitConv: (edit: boolean) => void;
  editIngredUnitConvId: number | undefined;
  setEditIngredUnitConvId: (id: number | undefined) => void;
  editData: IngredUnitConvFormData | undefined;
  setEditData: (data: IngredUnitConvFormData | undefined) => void;
  openAddIngredForm: () => void;
  openEditIngredForm: (row: IngredUnitConvView) => void;
  closeIngredUnitConvForm: () => void;
  submitAddIngredUnitConv: (formData: IngredUnitConvFormData) => Promise<void>;
  submitEditIngredUnitConv: (formData: IngredUnitConvFormData) => Promise<void>;
  submitDeleteIngredUnitConv: (row: IngredUnitConvView) => Promise<void>;
} 