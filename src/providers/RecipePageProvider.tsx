import React, { useState, useCallback, useEffect } from "react";
import { RecipePageContext } from "@/contexts";
import { RecipeView, RecipeFormData, RecipePageContextTypes } from "@/types";
import { useApp, useRecipeList, useEventHandler } from "@/hooks";
import { apiClient } from '@/utils';
import { decamelizeKeys } from 'humps';
import { MESSAGE_TYPE, MSG_MISSING_REQUEST, VISIBLE_TYPE } from "@/constants";

export const RecipePageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showMessage, clearMessage, setIsOpeningForm, closeContextMenu } = useApp();
  const { recipeDtoList, recipeDtoListStat, recipeDtoListMutate } = useRecipeList();
  const [recipeViewList, setRecipeViewList] = useState<RecipeView[]>([]);
  const [isAddRecipe, setIsAddRecipe] = useState<boolean>(false);
  const [isEditRecipe, setIsEditRecipe] = useState<boolean>(false);
  const [editRecipeId, setEditRecipeId] = useState<number | null>(null);
  const [editData, setEditData] = useState<RecipeFormData>({ recipeNm: null, recipeNmK: null, recipeType: null, recipeUrl: null });

  useEffect(() => {
    if (!recipeDtoListStat.isLoading) {
      setRecipeViewList(
        recipeDtoList
        ?.map((item, index) => ({
          ...item,
          recipeIngredVisible: recipeViewList?.[index]?.recipeIngredVisible || VISIBLE_TYPE.HIDDEN,
        })) ?? []
      );
    };
  }, [recipeDtoList, recipeDtoListStat.isLoading, recipeViewList]);

  const flg = { recipeIngredVisible: "recipeIngredVisible" };
  const switchFlgRecipeAcc = useCallback((updIndex: number, key: string, flg: any, isAll = false) => {
    if (recipeDtoList && recipeViewList) {
      setRecipeViewList(
        recipeViewList?.map((item, index) => ({
          ...item,
          [key]: isAll || index === updIndex ? flg : recipeViewList[index]?.[key],
        }))
      );
    };
  }, [recipeDtoList, recipeViewList, setRecipeViewList]);

  const openAddRecipeForm = () => {
    setIsAddRecipe(true);
  };

  const openEditRecipeForm = (row: RecipeView) => {
    setEditRecipeId(row?.recipeId ?? null);
    setEditData({ ...row });
    setIsEditRecipe(true);
  };

  const closeRecipeForm = () => {
    setIsAddRecipe(false);
    setIsEditRecipe(false);
    setIsOpeningForm(false);
  };

  const submitAddRecipe = async (formData: RecipeFormData) => {
    clearMessage();
    console.log(`レシピ追加 レシピ名:${formData?.recipeNm} レシピ名（かな）${formData?.recipeNmK} レシピ種別:${formData?.recipeType} レシピURL:${formData?.recipeUrl}`);
    try {
      const response = await apiClient.post(`${process.env.REACT_APP_API_CLIENT}/recipe/submitAddRecipe`, { 
        recipeNm: formData?.recipeNm,
        recipeNmK: formData?.recipeNmK,
        recipeType: formData?.recipeType, 
        recipeUrl: formData?.recipeUrl, 
      });
      const data = await response.data;
      console.log(data.message, data);
      if (recipeDtoList) {
        recipeDtoListMutate([...recipeDtoList, data.newRecipe]);
      }
      closeRecipeForm();
    } catch (error: any) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || MSG_MISSING_REQUEST, MESSAGE_TYPE.ERROR);
    };
  };

  const submitEditRecipe = async (formData: RecipeFormData) => {
    clearMessage();
    console.log(`レシピ更新 レシピ名:${formData?.recipeNm} レシピ名（かな）${formData?.recipeNmK} レシピ種別:${formData?.recipeType} レシピURL:${formData?.recipeUrl}`);
    try {
      const response = await apiClient.put(`${process.env.REACT_APP_API_CLIENT}/recipe/submitEditRecipe`, { 
        recipeId: editRecipeId,
        recipeNm: formData?.recipeNm,
        recipeNmK: formData?.recipeNmK,
        recipeType: formData?.recipeType, 
        recipeUrl: formData?.recipeUrl, 
      });
      const data = await response.data;
      console.log(data.message, data);
      recipeDtoListMutate(
        recipeDtoList?.map((item) => (item.recipeId === data.newRecipe.recipeId ? data.newRecipe : item)
      ));
      closeRecipeForm();
    } catch (error: any) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || MSG_MISSING_REQUEST, MESSAGE_TYPE.ERROR);
    };
  };

  const submitDeleteRecipe = async (row: RecipeView) => {
    clearMessage();
    const deleteable = window.confirm("レシピを削除します。\nよろしいですか？");
    if (!deleteable) {
      return;
    }
    const queryParams = new URLSearchParams(decamelizeKeys({ recipeId: row?.recipeId })).toString();
    try {
      const response = await apiClient.delete(`${process.env.REACT_APP_API_CLIENT}/recipe/submitDeleteRecipe/queryParams?${queryParams}`);
      const data = await response.data;
      console.log(data.message, data);
      recipeDtoListMutate(recipeDtoList?.filter((item) => (item.recipeId !== row?.recipeId)));
    } catch (error: any) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || MSG_MISSING_REQUEST, MESSAGE_TYPE.ERROR);
    };
  };

  useEventHandler("click", () => closeContextMenu());
  useEventHandler("scroll", () => closeContextMenu());

  const contextValue = {
    recipeDtoList,
    recipeDtoListStat,
    recipeDtoListMutate,
    recipeViewList,
    setRecipeViewList,
    isAddRecipe,
    setIsAddRecipe,
    isEditRecipe,
    setIsEditRecipe,
    editRecipeId,
    setEditRecipeId,
    editData,
    setEditData,
    openAddRecipeForm,
    openEditRecipeForm,
    closeRecipeForm,
    submitAddRecipe,
    submitEditRecipe,
    submitDeleteRecipe,
    flg,
    switchFlgRecipeAcc,
  } as RecipePageContextTypes;

  return (
    <RecipePageContext.Provider value={contextValue}>
      {children}
    </RecipePageContext.Provider>
  );
}; 