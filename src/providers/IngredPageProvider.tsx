import React, { useState, useEffect, useCallback } from "react";
import { IngredPageContext } from "@/contexts";
import { IngredPageContextTypes, IngredView, IngredFormData, BaseProviderTypes } from "@/types";
import { useApp, useIngredList, useEventHandler } from "@/hooks";
import { VISIBLE_TYPE, MESSAGE_TYPE, MSG_MISSING_REQUEST } from "@/constants";
import { apiClient } from '@/utils';
import { decamelizeKeys } from 'humps';

export const IngredPageProvider: React.FC<BaseProviderTypes> = ({ children }) => {
  const { showMessage, clearMessage, setIsOpeningForm, closeContextMenu } = useApp();
  const { ingredDtoList = [], ingredDtoListStat, ingredDtoListMutate } = useIngredList();

  const [ingredViewList, setIngredViewList] = useState<IngredView[] | undefined>();
  const [isAddIngred, setIsAddIngred] = useState<boolean>(false);
  const [isEditIngred, setIsEditIngred] = useState<boolean>(false);
  const [editIngredId, setEditIngredId] = useState<number | undefined>();
  const [editData, setEditData] = useState<IngredFormData | undefined>();

  useEffect(() => {
    if (!ingredDtoListStat.isLoading) {
      setIngredViewList(
        ingredDtoList?.map((item, index) => ({
          ...item,
          ingredUnitConvVisible: ingredViewList?.[index]?.ingredUnitConvVisible || VISIBLE_TYPE.HIDDEN,
        }))
      );
    }
  }, [ingredDtoList, ingredDtoListStat.isLoading, ingredViewList]);

  const flg = { ingredUnitConvVisible: "ingredUnitConvVisible" } as const;
  const switchFlgIngredAcc = useCallback((
    updIndex: number, 
    key: keyof IngredView, 
    flg: any, 
    isAll: boolean = false
  ) => {
    if (ingredDtoList && ingredViewList) {
      setIngredViewList(
        ingredViewList.map((item, index) => ({
          ...item,
          [key]: isAll || index === updIndex ? flg : ingredViewList[index]?.[key],
        }))
      );    
    }
  }, [ingredDtoList, ingredViewList, setIngredViewList]);

  const openAddIngredForm = () => {
    setIsAddIngred(true);
  };

  const openEditIngredForm = (row: IngredView) => {
    setEditIngredId(row?.ingredId);
    setEditData({ ...row });
    setIsEditIngred(true);
  };

  const closeIngredForm = () => {
    setIsAddIngred(false);
    setIsEditIngred(false);
    setIsOpeningForm(false);
  };

  const submitAddIngred = async (formData: Partial<IngredFormData>) => {
    clearMessage();
    console.log(`食材追加 
      食材名:${formData?.ingredNm} 
      食材名（かな）${formData?.ingredNmK} 
      親食材名:${formData?.parentIngredNm} 
      標準単位:${formData?.buyUnitCd} 
      売り場:${formData?.salesAreaType}`
    );
    try {
      const response = await apiClient.post(`${process.env.REACT_APP_API_CLIENT}/ingred/submitAddIngred`, { 
        ingredNm: formData?.ingredNm,
        ingredNmK: formData?.ingredNmK,
        parentIngredNm: formData?.parentIngredNm, 
        buyUnitCd: formData?.buyUnitCd, 
        salesAreaType: formData?.salesAreaType, 
      });
      const data = await response.data;
      console.log(data.message, data);
      if (ingredDtoList) {
        ingredDtoListMutate([...ingredDtoList, data.newIngred]);
      }
      if (!formData?.isRegisterContinue) {
        setIsAddIngred(false);
      }
    } catch (error: any) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || MSG_MISSING_REQUEST, MESSAGE_TYPE.ERROR);
    }
  };

  const submitEditIngred = async (formData: Partial<IngredFormData>) => {
    clearMessage();
    console.log(`食材編集 
      食材名:${formData?.ingredNm} 
      食材名（かな）:${formData?.ingredNmK} 
      親食材名:${formData?.parentIngredNm} 
      標準単位:${formData?.buyUnitCd} 
      売り場:${formData?.salesAreaType}`
    );
    try {
      const response = await apiClient.put(`${process.env.REACT_APP_API_CLIENT}/ingred/submitEditIngred`, { 
        ingredId: editIngredId,
        ingredNm: formData?.ingredNm,
        ingredNmK: formData?.ingredNmK,
        parentIngredNm: formData?.parentIngredNm, 
        buyUnitCd: formData?.buyUnitCd, 
        salesAreaType: formData?.salesAreaType, 
      });
      const data = await response.data;
      console.log(data.message, data);
      if (ingredDtoList) {
        ingredDtoListMutate(ingredDtoList.map((item) => (
          item.ingredId === data.editIngred.ingredId ? data.editIngred : item
        )));
      }
      setIsEditIngred(false);
    } catch (error: any) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || MSG_MISSING_REQUEST, MESSAGE_TYPE.ERROR);
    }
  };

  const submitDeleteIngred = async (row: IngredView) => {
    const deleteable = window.confirm("食材を削除します。\nよろしいですか？");
    if (!deleteable) {
      return;
    }
    clearMessage();
    const queryParams = new URLSearchParams(decamelizeKeys({ ingredId: row?.ingredId })).toString();
    try {
      const response = await apiClient.delete(`${process.env.REACT_APP_API_CLIENT}/ingred/submitDeleteIngred/queryParams?${queryParams}`);
      const data = await response.data;
      console.log(data.message, data);
      if (ingredDtoList) {
        ingredDtoListMutate(ingredDtoList.filter((item) => (item.ingredId !== row?.ingredId)));
      }
    } catch (error: any) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || MSG_MISSING_REQUEST, MESSAGE_TYPE.ERROR);
    }
  };

  const contextValue: IngredPageContextTypes = {
    ingredDtoList,
    ingredDtoListStat,
    ingredDtoListMutate,
    ingredViewList,
    setIngredViewList,
    isAddIngred,
    setIsAddIngred,
    isEditIngred,
    setIsEditIngred,
    editIngredId,
    setEditIngredId,
    editData,
    setEditData,
    openAddIngredForm,
    openEditIngredForm,
    closeIngredForm,
    submitAddIngred,
    submitEditIngred,
    submitDeleteIngred,
    flg,
    switchFlgIngredAcc,
  };

  useEventHandler("click", () => closeContextMenu());
  useEventHandler("scroll", () => closeContextMenu());

  return (
    <IngredPageContext.Provider value={contextValue}>
      {children}
    </IngredPageContext.Provider>
  );
}; 