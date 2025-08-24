import React, { useState } from "react";
import { IngredUnitConvRowContext } from "@/contexts";
import { IngredView, IngredUnitConvView, IngredUnitConvFormData, IngredUnitConvRowContextTypes } from "@/types";
import { useApp, useIngredUnitConvList, useEventHandler } from "@/hooks";
import { apiClient } from '@/utils';
import { decamelizeKeys } from 'humps';
import { MESSAGE_TYPE, MSG_MISSING_REQUEST } from "@/constants";

interface IngredUnitConvRowProviderTypes {
  ingred: IngredView;
  children: React.ReactNode;
}

export const IngredUnitConvRowProvider: React.FC<IngredUnitConvRowProviderTypes> = ({ ingred, children }) => {
  const { closeContextMenu, showMessage, clearMessage, setIsOpeningForm } = useApp();
  const { ingredUnitConvDtoList, ingredUnitConvDtoListStat, ingredUnitConvDtoListMutate } = useIngredUnitConvList(
    ingred.ingredUnitConvVisible !== null ? ingred?.ingredId : null
  );

  const [isAddIngredUnitConv, setIsAddIngredUnitConv] = useState<boolean>(false);
  const [isEditIngredUnitConv, setIsEditIngredUnitConv] = useState<boolean>(false);
  const [editIngredUnitConvId, setEditIngredUnitConvId] = useState<number | undefined>();
  const [editData, setEditData] = useState<IngredUnitConvFormData>();

  const openAddIngredForm = () => {
    setIsAddIngredUnitConv(true);
  };

  const openEditIngredForm = (row: IngredUnitConvView) => {
    setEditIngredUnitConvId(row?.ingredUnitConvId);
    setEditData({ ingredId: ingred?.ingredId, convUnitCd: row?.convUnitCd, convRate: row?.convRate, convWeight: row?.convWeight });
    setIsEditIngredUnitConv(true);
  };

  const closeIngredUnitConvForm = () => {
    setIsAddIngredUnitConv(false);
    setIsEditIngredUnitConv(false);
    setIsOpeningForm(false);
  };

  const submitAddIngredUnitConv = async (formData: IngredUnitConvFormData) => {
    clearMessage();
    console.log(`食材単位変換追加 食材ID:${ingred?.ingredId} 変換単位:${formData?.convUnitCd} 変換率:${formData?.convRate}`);
    try {
      const response = await apiClient.post(`${process.env.REACT_APP_API_CLIENT}/ingred/submitAddIngredUnitConv`, { 
        ingredId: ingred?.ingredId,
        convUnitCd: formData?.convUnitCd,
        convRate: (formData?.convRate || 0) / (ingred.unitConvWeight || 1), 
      });
      const data = await response.data;
      console.log(data.message, data);
      if (ingredUnitConvDtoList) {
        ingredUnitConvDtoListMutate([...ingredUnitConvDtoList, data.newIngredUnitConv]);
      }
      closeIngredUnitConvForm();
    } catch (error: any) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || MSG_MISSING_REQUEST, MESSAGE_TYPE.ERROR);
    }
  };

  const submitEditIngredUnitConv = async (formData: IngredUnitConvFormData) => {
    clearMessage();
    console.log(`食材単位変換編集 食材ID:${ingred?.ingredId} 変換単位:${formData?.convUnitCd} 変換率:${formData?.convRate} `);
    try {
      const response = await apiClient.put(`${process.env.REACT_APP_API_CLIENT}/ingred/submitEditIngredUnitConv`, { 
        ingredUnitConvId: editIngredUnitConvId,
        ingredId: ingred?.ingredId,
        convUnitCd: formData?.convUnitCd,
        convRate: (formData?.convRate || 0) / (ingred.unitConvWeight || 1), 
      });
      const data = await response.data;
      console.log(data.message, data);
      if (ingredUnitConvDtoList) {
        ingredUnitConvDtoListMutate(ingredUnitConvDtoList.map((item) => (
          item?.ingredUnitConvId === editIngredUnitConvId ? data.newIngredUnitConv : item
        )));
      }
      closeIngredUnitConvForm();
    } catch (error: any) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || MSG_MISSING_REQUEST, MESSAGE_TYPE.ERROR);
    }
  };

  const submitDeleteIngredUnitConv = async (row: IngredUnitConvView) => {
    const deleteable = window.confirm("食材を削除します。\nよろしいですか？");
    if (!deleteable) {
      return;
    }
    clearMessage();
    const queryParams = new URLSearchParams(decamelizeKeys({ ingredUnitConvId: row?.ingredUnitConvId })).toString();
    try {
      const response = await apiClient.delete(`${process.env.REACT_APP_API_CLIENT}/ingred/submitDeleteIngredUnitConv/query_params?${queryParams}`);
      const data = await response.data;
      console.log(data.message, data);
      if (ingredUnitConvDtoList) {
        ingredUnitConvDtoListMutate(ingredUnitConvDtoList.filter((item) => item.ingredUnitConvId !== row.ingredUnitConvId));
      }
    } catch (error: any) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || MSG_MISSING_REQUEST, MESSAGE_TYPE.ERROR);
    }
  };

  const contextValue = {
    ingred,
    ingredUnitConvDtoList,
    ingredUnitConvDtoListStat,
    ingredUnitConvDtoListMutate,
    isAddIngredUnitConv,
    setIsAddIngredUnitConv,
    isEditIngredUnitConv,
    setIsEditIngredUnitConv,
    editIngredUnitConvId,
    setEditIngredUnitConvId,
    editData,
    setEditData,
    openAddIngredForm,
    openEditIngredForm,
    closeIngredUnitConvForm,
    submitAddIngredUnitConv,
    submitEditIngredUnitConv,
    submitDeleteIngredUnitConv,
  } as IngredUnitConvRowContextTypes;

  useEventHandler("click", () => closeContextMenu());
  useEventHandler("scroll", () => closeContextMenu());

  return (
    <IngredUnitConvRowContext.Provider value={contextValue}>
      {children}
    </IngredUnitConvRowContext.Provider>
  );
}; 