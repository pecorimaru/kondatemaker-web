import React, { useState, useEffect, useCallback } from 'react';
import { decamelizeKeys } from 'humps';
import { useApp, useEventHandler, useMenuPlanList } from '@/hooks';
import { apiClient } from '@/utils';
import { MenuPlanView, MenuPlanFormData, MenuPlanPageContextTypes } from '@/types';
import { MESSAGE_TYPE, MSG_MISSING_REQUEST, VISIBLE_TYPE } from '@/constants';
import { MenuPlanPageContext } from '@/contexts';

interface MenuPlanPageProviderTypes {
  children: React.ReactNode;
}

export const MenuPlanPageProvider: React.FC<MenuPlanPageProviderTypes> = ({ children }) => {
    // --- useAppから取得 ---
    const { 
      showMessage, 
      clearMessage, 
      setIsOpeningForm, 
      closeContextMenu,
      setApplyHighlighted,
    } = useApp();
  
    // --- 献立プランリスト取得 ---
    const { menuPlanDtoList, menuPlanDtoListStat, menuPlanDtoListMutate } = useMenuPlanList();
    const [menuPlanViewList, setMenuPlanViewList] = useState<MenuPlanView[]>();
    const [isAddMenuPlan, setIsAddMenuPlan] = useState<boolean>(false);
    const [isEditMenuPlan, setIsEditMenuPlan] = useState<boolean>(false);
    const [editMenuPlanId, setEditMenuPlanId] = useState<number>();
    const [editData, setEditData] = useState<MenuPlanView>();
  
    // --- useEffectでリスト初期化 ---
    useEffect(() => {
      if (!menuPlanDtoListStat.isLoading) {
        setMenuPlanViewList(
          menuPlanDtoList?.map((item, index) => ({
            ...item,
            menuPlanDetVisible: menuPlanViewList?.[index]?.menuPlanDetVisible || VISIBLE_TYPE.HIDDEN,
          }))
        );
      }
    }, [menuPlanDtoList, menuPlanDtoListStat.isLoading, menuPlanViewList]);
  
    // --- 表示用リストの更新 ---
    const updateMenuPlanViewList = useCallback((updIndex: number, key: string, flg: any, isAll = false) => {
      if (menuPlanDtoList && menuPlanViewList) {
        setMenuPlanViewList(
          menuPlanViewList.map((item, index) => ({
            ...item,
            [key]: isAll || index === updIndex ? flg : menuPlanViewList[index]?.[key],
          }))
        );
      }
    }, [menuPlanDtoList, menuPlanViewList, setMenuPlanViewList]);
  
    // --- 各種フォーム操作 ---
    const openAddMenuPlanForm = () => setIsAddMenuPlan(true);
    const openEditMenuPlanForm = (row: MenuPlanView) => {
      setApplyHighlighted(false);
      setEditMenuPlanId(row?.menuPlanId);
      setEditData({ ...row });
      setIsEditMenuPlan(true);
    };
    const closeMenuPlanForm = () => {
      setIsAddMenuPlan(false);
      setIsEditMenuPlan(false);
      setIsOpeningForm(false);
    };
  
    // --- API操作 ---
    const submitAddMenuPlan = async (formData: MenuPlanFormData) => {
      clearMessage();
      try {
        const response = await apiClient.post(`${process.env.REACT_APP_API_CLIENT}/menuPlan/submitAddMenuPlan`, { 
          menuPlanNm: formData.menuPlanNm,
          menuPlanNmK: formData?.menuPlanNmK,
        });
        const data = await response.data;
        menuPlanDtoListMutate([...(menuPlanDtoList || []), data.newMenuPlan]);
        setIsAddMenuPlan(false);
      } catch (error: any) {
        showMessage(error?.response?.data?.detail || error?._messageTimeout || MSG_MISSING_REQUEST, MESSAGE_TYPE.ERROR);
      }
    };
  
    const submitEditMenuPlan = async (formData: MenuPlanFormData) => {
      clearMessage();
      try {
        const response = await apiClient.put(`${process.env.REACT_APP_API_CLIENT}/menuPlan/submitEditMenuPlan`, { 
          menuPlanId: editMenuPlanId,
          menuPlanNm: formData.menuPlanNm,
          menuPlanNmK: formData?.menuPlanNmK,
        });
        const data = await response.data;
        menuPlanDtoListMutate(menuPlanDtoList?.map((menuPlan) => (
          menuPlan.menuPlanId === data.newMenuPlan.menuPlanId ? data.newMenuPlan : menuPlan
        )));
        setIsEditMenuPlan(false);
      } catch (error: any) {
        showMessage(error?.response?.data?.detail || error?._messageTimeout || MSG_MISSING_REQUEST, MESSAGE_TYPE.ERROR);
      }
    };
  
    const submitDeleteMenuPlan = async (row: MenuPlanView) => {
      clearMessage();
      const deleteable = window.confirm("献立プランを削除します。\n明細も含めてすべて削除されますがよろしいですか？");
      if (!deleteable) return;
      const queryParams = new URLSearchParams(decamelizeKeys({ menuPlanId: row.menuPlanId })).toString();
      try {
        await apiClient.delete(`${process.env.REACT_APP_API_CLIENT}/menuPlan/submitDeleteMenuPlan/query_params?${queryParams}`);
        menuPlanDtoListMutate(menuPlanDtoList?.filter((item) => (item.menuPlanId !== row.menuPlanId)));
        closeContextMenu();
      } catch (error: any) {
        showMessage(error?.response?.data?.detail || error?._messageTimeout || MSG_MISSING_REQUEST, MESSAGE_TYPE.ERROR);
      }
    };
  
    // 画面クリック or スクロールでコンテキストメニューをクローズ
    useEventHandler("click", () => closeContextMenu());
    useEventHandler("scroll", () => closeContextMenu());

    // --- Context値としてまとめて提供 ---
    const contextValue: MenuPlanPageContextTypes = {
      menuPlanViewList,
      menuPlanDtoListStat,
      isAddMenuPlan,
      isEditMenuPlan,
      editData,
      updateMenuPlanViewList,
      openAddMenuPlanForm,
      openEditMenuPlanForm,
      closeMenuPlanForm,
      submitAddMenuPlan,
      submitEditMenuPlan,
      submitDeleteMenuPlan,
    };
  
    return (
      <MenuPlanPageContext.Provider value={contextValue}>
        {children}
      </MenuPlanPageContext.Provider>
    );
  };
  
  