import { MenuPlanDetDto } from "../api";
import { MenuPlanDetFormData, MenuPlanDetView, MenuPlanView } from "../components";

export interface MenuPlanDetRowContextTypes {
  // 状態
  menuPlan: MenuPlanView;
  weekdayDict: any;
  weekdayDictStat: any;
  menuPlanDetDtoList: MenuPlanDetDto[];
  menuPlanDetDtoListStat: any;
  menuPlanDetDtoListMutate: any;
  menuPlanDetViewList: MenuPlanDetView[];
  setMenuPlanDetViewList: (list: MenuPlanDetView[]) => void;
  isAddMenuPlanDet: boolean;
  isEditMenuPlanDet: boolean;
  editData: MenuPlanDetFormData | undefined;

  // ハンドラー
  submitAddMenuPlanDet: (formData: MenuPlanDetFormData) => Promise<void>;
  openAddMenuPlanDetForm: () => void;
  openEditMenuPlanDetForm: (row: MenuPlanDetView) => void;
  closeMenuPlanDetForm: () => void;
  submitEditMenuPlanDet: (formData: MenuPlanDetFormData) => Promise<void>;
  submitDeleteMenuPlanDet: (row: MenuPlanDetView) => Promise<void>;
} 