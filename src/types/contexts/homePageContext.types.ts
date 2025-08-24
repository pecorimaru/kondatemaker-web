
import { MenuPlanDetFormData, MenuPlanDto, ToweekMenuPlanDetView } from "@/types";

export interface HomePageContextTypes {
  selectedPlan: MenuPlanDto | undefined;
  selectedPlanStat: { error: any; isLoading: boolean };
  selectedPlanMutate: any;
  menuPlanDtoList: MenuPlanDto[] | undefined;
  menuPlanDtoListStat: { error: any; isLoading: boolean };
  toweekMenuPlanDetListDict: Record<string, ToweekMenuPlanDetView[]> | undefined;
  toweekMenuPlanDetListDictStat: { error: any; isLoading: boolean };
  toweekMenuPlanDetListDictMutate: any;
  toweekMenuPlanDetViewListDict: Record<string, ToweekMenuPlanDetView[]> | undefined;
  setToweekMenuPlanDetListDictView: (dict: Record<string, ToweekMenuPlanDetView[]>) => void;
  isMenuPlanComboBoxOpen: boolean;
  setIsMenuPlanComboBoxOpen: (open: boolean) => void;
  menuPlanComboBoxRef: React.RefObject<HTMLTableCellElement | null>;
  isRefreshing: boolean;
  setIsRefreshing: (refreshing: boolean) => void;
  handleMenuPlanComboBoxClick: (menuPlan: MenuPlanDto) => void;
  handleClickOutside: (e: Event) => void;
  isAddMenuPlanDet: boolean;
  setIsAddMenuPlanDet: (isAddMenuPlanDet: boolean) => void;
  openAddMenuPlanDetForm: () => void;
  closeMenuPlanDetForm: () => void;
  submitAddToweekMenuPlanDet: (formData: MenuPlanDetFormData) => void;
} 