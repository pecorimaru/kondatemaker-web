import React, { useEffect, useState } from 'react';
import { decamelizeKeys } from 'humps';
import { useApp, useEventHandler, useMenuPlanDetList } from '@/hooks';
import { apiClient } from '@/utils';
import { MenuPlanDetView, MenuPlanDetFormData, MenuPlanDetRowContextTypes, MenuPlanDetRowProviderTypes } from '@/types';
import { MESSAGE_TYPE, MSG_MISSING_REQUEST } from '@/constants';
import { MenuPlanDetRowContext } from '@/contexts';

export const MenuPlanDetRowProvider: React.FC<MenuPlanDetRowProviderTypes> = ({ menuPlan, children }) => {
    const { 
      weekdayDict, 
      weekdayDictStat, 
      showMessage, 
      clearMessage,
      setIsOpeningForm,
      closeContextMenu,
      setApplyHighlighted,
    } = useApp();
    
    const { menuPlanDetDtoList = [], menuPlanDetDtoListStat, menuPlanDetDtoListMutate } = useMenuPlanDetList(menuPlan.menuPlanId);
    const [menuPlanDetViewList, setMenuPlanDetViewList] = useState<MenuPlanDetView[]>([]);
    const [isAddMenuPlanDet, setIsAddMenuPlanDet] = useState(false);
    const [isEditMenuPlanDet, setIsEditMenuPlanDet] = useState(false);
    const [editMenuPlanDetId, setEditMenuPlanDetId] = useState<number | null>(null);
    const [editData, setEditData] = useState<MenuPlanDetFormData>();
  
    useEffect(() => {
      if (!menuPlanDetDtoListStat.isLoading) {
        setMenuPlanDetViewList(menuPlanDetDtoList?.map((item) => ({...item})) ?? []);
      }
    }, [menuPlanDetDtoList, menuPlanDetDtoListStat.isLoading]);
  
    useEventHandler("click", () => closeContextMenu());
    useEventHandler("scroll", () => closeContextMenu());
  
    const submitAddMenuPlanDet = async (formData: MenuPlanDetFormData) => {
      clearMessage();
      try {
        const response = await apiClient.post(`${process.env.REACT_APP_API_CLIENT}/menuPlan/submitAddMenuPlanDet`, { 
          menuPlanId: menuPlan.menuPlanId,
          weekdayCd: formData.weekdayCd,
          recipeNm: formData.recipeNm, 
        });
        const data = await response.data;
        if (menuPlanDetDtoList) {
          menuPlanDetDtoListMutate([...menuPlanDetDtoList, data.newMenuPlanDet]);
        }
        setIsAddMenuPlanDet(false);
      } catch (error: any) {
        showMessage(error?.response?.data?.detail || error?._messageTimeout || MSG_MISSING_REQUEST, MESSAGE_TYPE.ERROR);
      };
    };
  
    const openAddMenuPlanDetForm = () => setIsAddMenuPlanDet(true);
  
    const openEditMenuPlanDetForm = (row: MenuPlanDetView) => {
      setApplyHighlighted(false);
      setEditMenuPlanDetId(row.menuPlanDetId);
      const formData: MenuPlanDetFormData = { weekdayCd: row.weekdayCd, recipeNm: row.recipeNm }
      setEditData(formData);
      setIsEditMenuPlanDet(true);
    };
  
    const closeMenuPlanDetForm = () => {    
      setIsAddMenuPlanDet(false);
      setIsEditMenuPlanDet(false);
      setIsOpeningForm(false);
    };
  
    const submitEditMenuPlanDet = async (formData: MenuPlanDetFormData) => {
      clearMessage();
      try {
        const response = await apiClient.put(`${process.env.REACT_APP_API_CLIENT}/menuPlan/submitEditMenuPlanDet`, { 
          menuPlanDetId: editMenuPlanDetId,
          weekdayCd: formData.weekdayCd,
          recipeNm: formData.recipeNm, 
        });
        const data = await response.data;
        menuPlanDetDtoListMutate(menuPlanDetDtoList?.map((item) => (
          item.menuPlanDetId === data.newMenuPlanDet.menuPlanDetId ? data.newMenuPlanDet : item
        )));
        setIsEditMenuPlanDet(false);
      } catch (error: any) {
        showMessage(error?.response?.data?.detail || error?._messageTimeout || MSG_MISSING_REQUEST, MESSAGE_TYPE.ERROR);
      }        
    };
  
    const submitDeleteMenuPlanDet = async (row: MenuPlanDetView) => {
      const deleteable = window.confirm("献立明細を削除します。\nよろしいですか？");
      if (!deleteable) {
        return;
      };
      clearMessage();
      setApplyHighlighted(false);
      const queryParams = new URLSearchParams(decamelizeKeys({ menuPlanDetId: row.menuPlanDetId })).toString();
      try {
        await apiClient.delete(`${process.env.REACT_APP_API_CLIENT}/menuPlan/submitDeleteMenuPlanDet/query_params?${queryParams}`);
        menuPlanDetDtoListMutate(menuPlanDetDtoList?.filter((item) => (item.menuPlanDetId !== row?.menuPlanDetId)));
      } catch (error: any) {
        showMessage(error?.response?.data?.detail || error?._messageTimeout || MSG_MISSING_REQUEST, MESSAGE_TYPE.ERROR);
      };
    };
  
    const contextValue: MenuPlanDetRowContextTypes = {
      menuPlan,
      weekdayDict,
      weekdayDictStat,
      menuPlanDetDtoList,
      menuPlanDetDtoListStat,
      menuPlanDetDtoListMutate,
      menuPlanDetViewList,
      setMenuPlanDetViewList,
      isAddMenuPlanDet,
      isEditMenuPlanDet,
      editData,
      submitAddMenuPlanDet,
      openAddMenuPlanDetForm,
      openEditMenuPlanDetForm,
      closeMenuPlanDetForm,
      submitEditMenuPlanDet,
      submitDeleteMenuPlanDet,
    };
  
    return (
      <MenuPlanDetRowContext.Provider value={contextValue}>
        {children}
      </MenuPlanDetRowContext.Provider>
    );
  };
  