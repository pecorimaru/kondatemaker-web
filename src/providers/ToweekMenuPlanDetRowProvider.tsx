import React, { useState, useCallback, useEffect, useRef } from 'react';
import { decamelizeKeys } from 'humps';

import { ToweekMenuPlanDetRowContextTypes, ToweekMenuPlanDetView, MenuPlanDetFormData } from '@/types';
import { useApp, useEventHandler, useHomePage, useRecipeNmSuggestions } from '@/hooks';
import { apiClient } from '@/utils';
import { MESSAGE_TYPE, MSG_MISSING_REQUEST, WEEKDAY_CD } from '@/constants';
import { ToweekMenuPlanDetRowContext } from '@/contexts';

interface ToweekMenuPlanDetRowProviderProps {
  children: React.ReactNode;
  weekdayCd: WEEKDAY_CD;
}

function getEditingToweekMenuPlanDet(toweekMenuPlanDetViewList: ToweekMenuPlanDetView[]) {
  const toweekMenuPlanDet = toweekMenuPlanDetViewList.filter((item) => item.isEditing);
  return toweekMenuPlanDet ? toweekMenuPlanDet[0] : undefined;
}

export const ToweekMenuPlanDetRowProvider: React.FC<ToweekMenuPlanDetRowProviderProps> = ({
  children,
  weekdayCd,
}) => {

  const { 
    closeContextMenu, 
    showMessage, 
    clearMessage,
  } = useApp();

  const { toweekMenuPlanDetViewListDict, toweekMenuPlanDetListDictMutate, isRefreshing, submitAddToweekMenuPlanDet } = useHomePage();

  const [toweekMenuPlanDetViewList, setToweekMenuPlanDetViewList] = useState<ToweekMenuPlanDetView[]>([]);
  const [befRecipeNm, setBefRecipeNm] = useState<string>("");
  const [recipeNmEditing, setRecipeNmEditing] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const recipeNmRef = useRef<HTMLInputElement | null>(null);
  const recipeNmSuggestionsRef = useRef<HTMLInputElement | null>(null);
  const { recipeNmSuggestions } = useRecipeNmSuggestions(recipeNmEditing);

  // 献立プラン明細リストを表示用リストにセット
  useEffect(() => {
    if(toweekMenuPlanDetViewListDict) {
      setToweekMenuPlanDetViewList(
        toweekMenuPlanDetViewListDict[weekdayCd]?.map((item) => ({
          ...item,
          recipeNmSuggestionsVisible: false,
          isEditing: false,
          isAlert: false,
        }))
      );
    };
  }, [toweekMenuPlanDetViewListDict, weekdayCd]);

  // 表示用リストで定義したフラグのスイッチング処理
  const flg = { 
    recipeNmSuggestionsVisible: "recipeNmSuggestionsVisible",
    isEditing: "isEditing",
    isAlert: "isAlert",
  };

  const switchFlgToweekMenuPlanAcc = useCallback((updIndex: number, key: string, flg: boolean, isAll=false) => {
    if (toweekMenuPlanDetViewListDict && toweekMenuPlanDetViewList) {
      setToweekMenuPlanDetViewList(
        toweekMenuPlanDetViewList?.map((item, index) => ({
          ...item,
          [key]: isAll || index === updIndex ? flg : toweekMenuPlanDetViewList[index]?.[key],
        }))
      );    
    };
  }, [toweekMenuPlanDetViewListDict, toweekMenuPlanDetViewList]);

  // 画面クリック or スクロールでコンテキストメニューをクローズ
  useEventHandler("click", () => closeContextMenu());
  useEventHandler("scroll", () => closeContextMenu());
  
  // 編集時に対象項目にフォーカス
  useEffect(() => {if (isEditing && recipeNmRef.current) {recipeNmRef.current.focus()}}, [isEditing]);

  const handleEditClick = (row: ToweekMenuPlanDetView, index: number) => {
    switchFlgToweekMenuPlanAcc(index, flg.isEditing, true);
    setRecipeNmEditing(row.recipeNm);
    setBefRecipeNm(row.recipeNm);
    setIsEditing(true);
  };

  const handleAddRecipeNmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const changedRecipeNm = e.target.value;
    setRecipeNmEditing(changedRecipeNm);    
  };

  const handleEditRecipeNmChange = (e: React.ChangeEvent<HTMLInputElement>, row: ToweekMenuPlanDetView) => {
    e.preventDefault();
    const changedRecipeNm = e.target.value;
    setRecipeNmEditing(changedRecipeNm);    
    setToweekMenuPlanDetViewList(
      toweekMenuPlanDetViewList?.map((item) => ({
        ...item,
        recipeNm: item?.recipeId === row?.recipeId ? e.target.value : item?.recipeNm
      }))
    );
  };

  // 入力候補 or 対象項目以外を押下した場合に入力候補エリアを非表示
  const handleClickOutside = (e: Event) => {
    // 編集中ではない場合
    if (!isEditing) {
      return;
    };

    // 編集中の項目もしくは入力候補を押下した場合
    if (
      (recipeNmRef.current instanceof HTMLElement && recipeNmRef.current.contains(e.target as Node)) ||
      (recipeNmSuggestionsRef.current instanceof HTMLElement && recipeNmSuggestionsRef.current.contains(e.target as Node))
    ) {
      return;
    }

    // 編集中の献立明細を取得（新規追加の場合はundifined）
    const editToweekMenuPlanDet = getEditingToweekMenuPlanDet(toweekMenuPlanDetViewList);

    // 編集したレシピ名が入力候補に存在
    const recipeNmExists = recipeNmSuggestions?.includes(recipeNmEditing);

    // 編集したレシピ名が空白ではない場合
    if (recipeNmEditing) {
      // 編集したレシピが存在する場合
      if (recipeNmExists) {
        // 新規 or 更新
        if (editToweekMenuPlanDet) {      
          submitEditToweekMenuPlanDet(recipeNmEditing);
        } else {
          const addable = window.confirm("追加内容を買い物リストに反映します。\nよろしいですか？");
          if (addable) {
            submitAddToweekMenuPlanDet({ weekdayCd: weekdayCd, recipeNm: recipeNmEditing } as MenuPlanDetFormData);
            setRecipeNmEditing("");
          };
        };
      };
    } else {
      // 編集によって空白にした場合は既存のレシピを削除
      if(befRecipeNm && editToweekMenuPlanDet) {
        submitDeleteToweekMenuPlanDet(editToweekMenuPlanDet);
      };
    };
    setToweekMenuPlanDetViewList(
      toweekMenuPlanDetViewList?.map((item) => ({
        ...item,
        isEditing: item.isEditing ? false : item.isEditing,
        isAlert: item.isEditing ? Boolean(recipeNmEditing) && !recipeNmExists : item.isAlert,
      }))
    );
    setIsEditing(false);
    setBefRecipeNm("");
  };
  useEventHandler("mousedown", handleClickOutside);

  // 入力候補押下時（編集時）
  const handleEditSuggestionClick = (suggestion: string, row: ToweekMenuPlanDetView) => {
    submitEditToweekMenuPlanDet(suggestion);
    // 一度に複数の要素を更新するため、switchFlgToweekMenuPlanAccは使用しない
    setToweekMenuPlanDetViewList(
      toweekMenuPlanDetViewList?.map((item) => ({
        ...item,
        recipeNm: item?.recipeId === row?.recipeId ? suggestion : item?.recipeNm,
        isEditing: item?.recipeId === row?.recipeId ? false : item?.isEditing,
        isAlert: item?.isEditing ? false : item?.isAlert,
      }))
    );
    setIsEditing(false);
    setBefRecipeNm("");
  };

  // 入力候補押下時（新規登録時）
  const handleAddSuggestionClick = (suggestion: string) => {
    const addable = window.confirm("追加内容を買い物リストに反映します。\nよろしいですか？");
    if (addable) {
      submitAddToweekMenuPlanDet({ weekdayCd: weekdayCd, recipeNm: suggestion } as MenuPlanDetFormData);
      setRecipeNmEditing("");
    };
    setIsEditing(false);
  };


  const submitEditToweekMenuPlanDet = async (recipeNm: string) => {
    if (recipeNmEditing === befRecipeNm) {
      return;
    };
    const editable = window.confirm("更新内容を買い物リストに反映します。\nよろしいですか？");
    if (!editable) {
      return;
    };
    clearMessage();
    const editMenuPlanDet = getEditingToweekMenuPlanDet(toweekMenuPlanDetViewList);
    console.log(`今週献立明細編集 今週献立明細ID:${editMenuPlanDet?.toweekMenuPlanDetId} レシピ名:${recipeNm}`);
    try {
      const response = await apiClient.put(`${process.env.REACT_APP_API_CLIENT}/home/submitEditToweekMenuPlanDet`, { 
        toweekMenuPlanDetId: editMenuPlanDet?.toweekMenuPlanDetId,
        recipeNm: recipeNm,
      });
      const data = await response.data;
      console.log(data.message, data);
      toweekMenuPlanDetListDictMutate(data.toweekMenuPlanDetListDict);
    } catch (error: any) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || MSG_MISSING_REQUEST, MESSAGE_TYPE.ERROR);
    };
    setRecipeNmEditing("");
  };

  const submitDeleteToweekMenuPlanDet = async (row: ToweekMenuPlanDetView) => {
    const deleteable = window.confirm("献立明細を削除します。\nよろしいですか？");
    if (!deleteable) {
      return;
    };
    clearMessage();
    const queryParams = new URLSearchParams(decamelizeKeys({ toweekMenuPlanDetId: row?.toweekMenuPlanDetId })).toString();
    try {
      const response = await apiClient.delete(`${process.env.REACT_APP_API_CLIENT}/home/submitDeleteToweekMenuPlanDet/query_params?${queryParams}`);
      const data = await response.data;
      console.log(data.message, data);
      toweekMenuPlanDetListDictMutate(data.toweekMenuPlanDetListDict);
    } catch (error: any) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || MSG_MISSING_REQUEST, MESSAGE_TYPE.ERROR);
    }        
    setRecipeNmEditing("");
  };

  const contextValue: ToweekMenuPlanDetRowContextTypes = {
    weekdayCd,
    toweekMenuPlanDetViewListDict,
    toweekMenuPlanDetListDictMutate,
    isRefreshing,
    toweekMenuPlanDetViewList,
    setToweekMenuPlanDetViewList,
    befRecipeNm,
    setBefRecipeNm,
    recipeNmEditing,
    setRecipeNmEditing,
    isEditing,
    setIsEditing,
    recipeNmSuggestions,
    recipeNmRef,
    recipeNmSuggestionsRef,
    flg,
    switchFlgToweekMenuPlanAcc,
    handleEditClick,
    handleAddRecipeNmChange,
    handleEditRecipeNmChange,
    handleClickOutside,
    handleEditSuggestionClick,
    handleAddSuggestionClick,
    submitEditToweekMenuPlanDet,
    submitDeleteToweekMenuPlanDet,
  };

  return (
    <ToweekMenuPlanDetRowContext.Provider value={contextValue}>
      {children}
    </ToweekMenuPlanDetRowContext.Provider>
  );
}; 