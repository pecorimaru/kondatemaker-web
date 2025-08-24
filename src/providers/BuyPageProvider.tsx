import React, { useState, useEffect } from "react";
import { BuyPageContext } from "@/contexts";
import { useApp, useBuyIngredList, useEventHandler } from "@/hooks";
import { BuyIngredView, IngredSelectFormData, BuyPageContextTypes, BaseProviderTypes } from "@/types";
import { decamelizeKeys } from 'humps';
import { apiClient } from '@/utils';
import { MESSAGE_TYPE, MSG_MISSING_REQUEST } from '@/constants';

export const BuyPageProvider: React.FC<BaseProviderTypes> = ({ children }) => {
  const { closeContextMenu, showMessage, clearMessage, setIsOpeningForm } = useApp();
  const { buyIngredList = [], buyIngredListStat, buyIngredListMutate } = useBuyIngredList();

  const [incompleteList, setIncompleteList] = useState<BuyIngredView[] | undefined>([]);
  const [completeList, setCompleteList] = useState<BuyIngredView[] | undefined>([]);
  const [editBuyIngredId, setEditBuyIngredId] = useState<number | undefined>(undefined);
  const [editData, setEditData] = useState<IngredSelectFormData | undefined>(undefined);
  const [isAddIngred, setIsAddIngred] = useState(false);
  const [isEditIngred, setIsEditIngred] = useState(false);

  useEffect(() => {
    if (!buyIngredListStat?.isLoading) {
      setIncompleteList(
        buyIngredList
        ?.filter(buyIngredList => buyIngredList.boughtFlg === "F")
        ?.map((item, index) => ({
          ...item,
          num: index +1,
          isBought: false,
        }))
      );
      setCompleteList(
        buyIngredList
        ?.filter(buyIngredList => buyIngredList.boughtFlg === "T")
        ?.map((item, index) => ({
          ...item,
          num: buyIngredList?.filter(buyIngredList => buyIngredList.boughtFlg === "F")?.length + index +1,
          isBought: true,
        }))
      );
    }
  }, [buyIngredList, buyIngredListStat?.isLoading, setIncompleteList, setCompleteList]);

  const submitSwitchCompletion = (row: BuyIngredView) => {
    clearMessage();
    const stillIncomplete = incompleteList?.filter((item) => (item.buyIngredId !== row?.buyIngredId));
    const stillComplete = completeList?.filter((item) => (item.buyIngredId !== row?.buyIngredId));
    const changeToIncomplete = row?.isBought ? [{ ...row, isBought: !row?.isBought }] : [] ;
    const changeToComplete = !row?.isBought ? [{ ...row, isBought: !row?.isBought }] : [] ;
    setCompleteList([...stillComplete || [], ...changeToComplete]);
    setIncompleteList([...stillIncomplete || [], ...changeToIncomplete]);
    const boughtFlg = !row?.isBought ? "T" : "F";
    apiClient.put(`${process.env.REACT_APP_API_CLIENT}/buy/submitSwitchCompletion`, decamelizeKeys({ buyIngredId: row?.buyIngredId, boughtFlg }))
      .then(response => {
        const data  = response.data;
        console.log(data.message, data);
        buyIngredListMutate(buyIngredList?.map((item) => (
          item.buyIngredId === data.newBuyIngred.buyIngredId ? data.newBuyIngred : item          
        )), { revalidate: false });
      })
      .catch(error => {
        showMessage(error?.response?.data?.detail || error?._messageTimeout || MSG_MISSING_REQUEST, MESSAGE_TYPE.ERROR);   
      });
  };

  const openAddIngredForm = () => {
    setIsAddIngred(true);
  };

  const openEditIngredForm = (row: BuyIngredView) => {
    setIsEditIngred(true);
    setEditBuyIngredId(row?.buyIngredId || undefined);
    const formData: IngredSelectFormData = {
      ingredId: row?.ingredId,
      ingredNm: row?.ingredNm,
      qty: row?.qty,
      unitCd: row?.unitCd,
      salesAreaType: row?.salesAreaType,
    };
    setEditData(formData);
  };

  const closeIngredForm = () => {
    setIsAddIngred(false);
    setIsEditIngred(false);
    setIsOpeningForm(false);
  };

  const submitAddBuyIngred = async (formData: IngredSelectFormData, clearForm: () => void) => {
    console.log(`購入食材追加 食材名:${formData?.ingredNm} 必要量:${formData?.qty} 単位:${formData?.unitCd} 売り場:${formData?.salesAreaType}`)
    try {
      const response = await apiClient.post(`${process.env.REACT_APP_API_CLIENT}/buy/submitAddBuyIngred`, { 
        ingredNm: formData?.ingredNm,
        qty: formData?.qty, 
        unitCd: formData?.unitCd, 
        salesAreaType: formData?.salesAreaType, 
        isBuyEveryWeek: formData?.isBuyEveryWeek,
      });
      const data = response.data;
      console.log(data.message, data)
      buyIngredListMutate([...buyIngredList, data?.newBuyIngred]);
      clearForm();
      showMessage(data.message, MESSAGE_TYPE.INFO);
      if (!formData?.isRegisterContinue) {closeIngredForm()};
    } catch (error: any) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || MSG_MISSING_REQUEST, MESSAGE_TYPE.ERROR);
    };
  };

  const submitEditBuyIngred = async (formData: IngredSelectFormData) => {
    console.log(`購入食材更新 食材名:${formData?.ingredNm} 必要量:${formData?.qty} 単位:${formData?.unitCd} 売り場:${formData?.salesAreaType}`)
    try {
      const response = await apiClient.put(`${process.env.REACT_APP_API_CLIENT}/buy/submitEditBuyIngred`, { 
        buyIngredId: editBuyIngredId,
        ingredNm: formData?.ingredNm,
        qty: formData?.qty, 
        unitCd: formData?.unitCd,
        salesAreaType: formData?.salesAreaType,
        isBuyEveryWeek: formData?.isBuyEveryWeek,
      });
      const data = await response.data;
      console.log(data.message, data);
      buyIngredListMutate(buyIngredList?.map((item) => (
        item?.buyIngredId === data?.newBuyIngred?.buyIngredId ? data?.newBuyIngred : item
      )));
      closeIngredForm();
    } catch (error: any) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || MSG_MISSING_REQUEST, MESSAGE_TYPE.ERROR);
    };        
  };

  const submitDeleteBuyIngred = async (row: BuyIngredView) => {
    const deleteable = window.confirm(`食材を削除します。\nよろしいですか？ \n${row?.ingredNm}`);
    if (deleteable) {
      const query_params = new URLSearchParams(decamelizeKeys({ buyIngredId: row?.buyIngredId })).toString();
      try {
        const response = await apiClient.delete(`${process.env.REACT_APP_API_CLIENT}/buy/submitDeleteBuyIngred/queryParams?${query_params}`);
        const data = await response.data;
        console.log(data.message, data);
        buyIngredListMutate(buyIngredList?.filter((item) => (item?.buyIngredId !== row?.buyIngredId)));
      } catch (error: any) {
        showMessage(error?.response?.data?.detail || error?._messageTimeout || MSG_MISSING_REQUEST, MESSAGE_TYPE.ERROR);
      };        
    };
  };

  // 画面クリック or スクロールでコンテキストメニューをクローズ
  useEventHandler("click", () => closeContextMenu());
  useEventHandler("scroll", () => closeContextMenu());

  const contextValue: BuyPageContextTypes = {
    buyIngredList,
    buyIngredListStat,
    buyIngredListMutate,
    incompleteList,
    setIncompleteList,
    completeList,
    setCompleteList,
    editBuyIngredId,
    setEditBuyIngredId,
    editData,
    setEditData,
    isAddIngred,
    setIsAddIngred,
    isEditIngred,
    setIsEditIngred,
    submitSwitchCompletion,
    openAddIngredForm,
    openEditIngredForm,
    closeIngredForm,
    submitAddBuyIngred,
    submitEditBuyIngred,
    submitDeleteBuyIngred,
  };

  return (
    <BuyPageContext.Provider value={contextValue}>
      {children}
    </BuyPageContext.Provider>
  );
}; 