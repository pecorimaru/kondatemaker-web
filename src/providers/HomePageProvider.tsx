import React, { useState, useRef, useEffect } from "react";
import { HomePageContext } from "@/contexts";
import { HomePageContextTypes, MenuPlanDetFormData, MenuPlanDto, ToweekMenuPlanDetView } from "@/types";
import { useApp, useMenuPlanList, useSelectedPlan, useToweekMenuPlanDetListDict, useEventHandler } from "@/hooks";
import { apiClient } from '@/utils';
import { MESSAGE_TYPE, MSG_MISSING_REQUEST } from '@/constants';

export const HomePageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { closeContextMenu, showMessage, setIsOpeningForm, clearMessage } = useApp();
  const { selectedPlan, selectedPlanStat, selectedPlanMutate } = useSelectedPlan();
  const { menuPlanDtoList, menuPlanDtoListStat } = useMenuPlanList();
  const { toweekMenuPlanDetListDict, toweekMenuPlanDetListDictStat, toweekMenuPlanDetListDictMutate } = useToweekMenuPlanDetListDict();
  const [toweekMenuPlanDetViewListDict, setToweekMenuPlanDetListDictView] = useState<Record<string, ToweekMenuPlanDetView[]>>();
  const [isMenuPlanComboBoxOpen, setIsMenuPlanComboBoxOpen] = useState<boolean>(false);
  const menuPlanComboBoxRef = useRef<HTMLTableCellElement>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isAddMenuPlanDet, setIsAddMenuPlanDet] = useState<boolean>(false);


  useEffect(() => {
    if(!toweekMenuPlanDetListDictStat?.isLoading) setToweekMenuPlanDetListDictView(toweekMenuPlanDetListDict);
  }, [toweekMenuPlanDetListDict, toweekMenuPlanDetListDictStat?.isLoading, setToweekMenuPlanDetListDictView]); 

  const handleMenuPlanComboBoxClick = async (menuPlan: MenuPlanDto) => {
    setIsMenuPlanComboBoxOpen(false);
    if (selectedPlan?.menuPlanId === menuPlan.menuPlanId) {
      setIsMenuPlanComboBoxOpen(false);
      return;
    }
    const changeable = window.confirm("今週の献立を変更すると追加した食材や購入状況がクリアされます。\nよろしいですか？");
    if (!changeable) {
      return;
    }
    selectedPlanMutate(menuPlan, false);
    setIsRefreshing(true);
    try {
      const response = await apiClient.put(`${process.env.REACT_APP_API_CLIENT}/home/submitRecreateToweekMenuPlan`, { selectedPlanId: menuPlan.menuPlanId });
      const data  = response.data;
      console.log(data.message, data);
      toweekMenuPlanDetListDictMutate(data.newToweekMenuPlanDetListDict, false);
    } catch (error: any) {
      selectedPlanMutate(selectedPlan);
      showMessage(error?.response?.data?.detail || error?._messageTimeout || MSG_MISSING_REQUEST, MESSAGE_TYPE.ERROR);
    } finally {
      setIsRefreshing(false);
    }
  };

  const submitAddToweekMenuPlanDet = async (formData: MenuPlanDetFormData) => {
    clearMessage();
    console.log(`今週献立明細追加 レシピ名:${formData.recipeNm}`);
    try {
      const response = await apiClient.post(`${process.env.REACT_APP_API_CLIENT}/home/submitAddToweekMenuPlanDet`, { 
        recipeNm: formData.recipeNm,
        weekdayCd: formData.weekdayCd,
      });
      const data = await response.data;
      console.log(data.message, data);
      toweekMenuPlanDetListDictMutate(data.toweekMenuPlanDetListDict);
      closeMenuPlanDetForm();
    } catch (error: any) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || MSG_MISSING_REQUEST, MESSAGE_TYPE.ERROR);
    };
  };

  const handleClickOutside = (e: Event) => {
    if (menuPlanComboBoxRef.current && !menuPlanComboBoxRef.current.contains(e.target as Node)) {
      setIsMenuPlanComboBoxOpen(false);
    }
  };

  const openAddMenuPlanDetForm = () => setIsAddMenuPlanDet(true);

  const closeMenuPlanDetForm = () => {    
    setIsAddMenuPlanDet(false);
    setIsOpeningForm(false);
  };


  // 画面クリック or スクロールでコンテキストメニューをクローズ
  useEventHandler("click", () => closeContextMenu());
  useEventHandler("scroll", () => closeContextMenu());
  useEventHandler("mousedown", handleClickOutside);

  const contextValue: HomePageContextTypes = {
    selectedPlan,
    selectedPlanStat,
    selectedPlanMutate,
    menuPlanDtoList,
    menuPlanDtoListStat,
    toweekMenuPlanDetListDict,
    toweekMenuPlanDetListDictStat,
    toweekMenuPlanDetListDictMutate,
    toweekMenuPlanDetViewListDict,
    setToweekMenuPlanDetListDictView,
    isMenuPlanComboBoxOpen,
    setIsMenuPlanComboBoxOpen,
    menuPlanComboBoxRef,
    isRefreshing,
    setIsRefreshing,
    handleMenuPlanComboBoxClick,
    handleClickOutside,
    isAddMenuPlanDet,
    setIsAddMenuPlanDet,
    openAddMenuPlanDetForm,
    closeMenuPlanDetForm,
    submitAddToweekMenuPlanDet,
  };

  return (
    <HomePageContext.Provider value={contextValue}>
      {children}
    </HomePageContext.Provider>
  );
}; 