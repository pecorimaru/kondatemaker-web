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
      setToweekMenuPlanDetViewList(toweekMenuPlanDetViewListDict[weekdayCd]?.map((item) => ({
          ...item,
          recipeNmSuggestionsVisible: false,
          isEditing: false,
      })));
    };
  }, [toweekMenuPlanDetViewListDict, weekdayCd]);

  // 表示用リストで定義したフラグのスイッチング処理
  const flg = { 
    recipeNmSuggestionsVisible: "recipeNmSuggestionsVisible",
    isEditing: "isEditing",
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

  const submitEditToweekMenuPlanDet = async (recipeNm: string) => {
    if (recipeNm === befRecipeNm) {
      switchFlgToweekMenuPlanAcc(0, flg.isEditing, false, true);
      return;
    };
    const editMenuPlanDet = getEditingToweekMenuPlanDet(toweekMenuPlanDetViewList);
    const editable = window.confirm("更新内容を買い物リストに反映します。\nよろしいですか？");
    if (editable) {
      switchFlgToweekMenuPlanAcc(0, flg.isEditing, false, true);
      clearMessage();
      console.log(`今週献立明細編集 今週献立明細ID:${editMenuPlanDet?.toweekMenuPlanDetId} レシピ名:${recipeNm}`);
      try {
        const response = await apiClient.put("api/home/submitEditToweekMenuPlanDet", { 
          toweekMenuPlanDetId: editMenuPlanDet?.toweekMenuPlanDetId,
          recipeNm: recipeNm,
        });
        const data = await response.data;
        console.log(data.message, data);
        toweekMenuPlanDetListDictMutate(data.toweekMenuPlanDetListDict);
      } catch (error: any) {
        showMessage(error?.response?.data?.detail || error?._messageTimeout || MSG_MISSING_REQUEST, MESSAGE_TYPE.ERROR);
      };  
    } else {
      // 一度に複数の要素を更新するため、switchFlgToweekMenuPlanAccは使用しない
      setToweekMenuPlanDetViewList(
        toweekMenuPlanDetViewList?.map((item) => ({
          ...item,
          recipeNm: item?.toweekMenuPlanDetId === editMenuPlanDet?.toweekMenuPlanDetId ? befRecipeNm : item?.recipeNm,
          isEditing: false,
        }))
      );  
    }
  };

  const submitDeleteToweekMenuPlanDet = async (row: ToweekMenuPlanDetView) => {
    const deleteable = window.confirm("献立明細を削除します。\nよろしいですか？");
    if (!deleteable) {
      return;
    };
    clearMessage();
    const queryParams = new URLSearchParams(decamelizeKeys({ toweekMenuPlanDetId: row?.toweekMenuPlanDetId })).toString();
    try {
      const response = await apiClient.delete(`api/home/submitDeleteToweekMenuPlanDet/query_params?${queryParams}`);
      const data = await response.data;
      console.log(data.message, data);
      toweekMenuPlanDetListDictMutate(data.toweekMenuPlanDetListDict);
    } catch (error: any) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || MSG_MISSING_REQUEST, MESSAGE_TYPE.ERROR);
    }        
    setRecipeNmEditing("");
  };

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
    setRecipeNmEditing(e.target.value);
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
    if (editToweekMenuPlanDet) {
      handleEditToweekMenuPlanDet(editToweekMenuPlanDet);
    } else {
      handleEditToweekMenuPlanDetNew();
    };
    setIsEditing(false);
    setRecipeNmEditing("");
  };
  useEventHandler("mousedown", handleClickOutside);

  const handleEditToweekMenuPlanDetNew = () => {
    if (!recipeNmEditing) {
      return;
    };
    const recipeNmExists = recipeNmSuggestions?.includes(recipeNmEditing);
    if (recipeNmExists) {
      const addable = window.confirm("追加内容を買い物リストに反映します。\nよろしいですか？");
      if (addable) {
        submitAddToweekMenuPlanDet({ weekdayCd: weekdayCd, recipeNm: recipeNmEditing } as MenuPlanDetFormData);
      }
    };
  };


  const handleEditToweekMenuPlanDet = (editToweekMenuPlanDet: ToweekMenuPlanDetView) => {
    if (!editToweekMenuPlanDet.recipeNm) {
      submitDeleteToweekMenuPlanDet(editToweekMenuPlanDet);
    } else {
      // 編集したレシピ名が入力候補に存在
      const recipeNmExists = recipeNmSuggestions?.includes(editToweekMenuPlanDet.recipeNm);
      if (recipeNmExists) {
        submitEditToweekMenuPlanDet(editToweekMenuPlanDet.recipeNm);
      } else {
        setToweekMenuPlanDetViewList(toweekMenuPlanDetViewList?.map((item) => ({
            ...item,
            recipeNm: item?.toweekMenuPlanDetId === editToweekMenuPlanDet?.toweekMenuPlanDetId ? befRecipeNm : item?.recipeNm,
            isEditing: item.isEditing ? false : item.isEditing,
        })));
      };
    };
  };

  // 入力候補押下時（編集時）
  const handleEditSuggestionClick = (suggestion: string) => {
    submitEditToweekMenuPlanDet(suggestion);
    setRecipeNmEditing("");
    setBefRecipeNm("");
    setIsEditing(false);
  };

  // 入力候補押下時（新規登録時）
  const handleAddSuggestionClick = (suggestion: string) => {
    const addable = window.confirm("追加内容を買い物リストに反映します。\nよろしいですか？");
    if (addable) {
      submitAddToweekMenuPlanDet({ weekdayCd: weekdayCd, recipeNm: suggestion } as MenuPlanDetFormData);
    };
    setRecipeNmEditing("");
    setIsEditing(false);
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