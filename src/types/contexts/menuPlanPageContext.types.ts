import { MenuPlanFormData, MenuPlanView } from "../components";

export interface MenuPlanPageContextTypes {
    // 状態
    menuPlanViewList: MenuPlanView[] | undefined;
    menuPlanDtoListStat: { error: any; isLoading: boolean };
    isAddMenuPlan: boolean;
    isEditMenuPlan: boolean;
    editData: MenuPlanView | undefined;
  
    // ハンドラー
    updateMenuPlanViewList: (updIndex: number, key: string, flg: any, isAll?: boolean) => void;
    openAddMenuPlanForm: () => void;
    openEditMenuPlanForm: (row: MenuPlanView) => void;
    closeMenuPlanForm: () => void;
    submitAddMenuPlan: (formData: MenuPlanFormData) => Promise<void>;
    submitEditMenuPlan: (formData: MenuPlanFormData) => Promise<void>;
    submitDeleteMenuPlan: (row: MenuPlanView) => Promise<void>;
}