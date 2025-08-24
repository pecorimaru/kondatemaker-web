import React, { useEffect, useState } from "react";
import { RecipeIngredRowContext } from "@/contexts/RecipeIngredRowContext";
import { RecipeIngredRowContextTypes } from "@/types/contexts/recipeIngredRowContext.types";
import { RecipeIngredView, IngredSelectFormData, RecipeIngredRowProviderTypes } from "@/types";
import { useApp, useEventHandler, useRecipeIngredList } from "@/hooks";
import { apiClient } from '@/utils';
import { decamelizeKeys } from 'humps';
import { MESSAGE_TYPE, MSG_MISSING_REQUEST } from "@/constants";


export const RecipeIngredRowProvider: React.FC<RecipeIngredRowProviderTypes> = ({ recipe, children }) => {
  const { showMessage, clearMessage, setIsOpeningForm, setApplyHighlighted, closeContextMenu } = useApp();

  const { recipeIngredDtoList, recipeIngredDtoListStat, recipeIngredDtoListMutate } = useRecipeIngredList(recipe.recipeId);
  const [recipeIngredViewList, setRecipeIngredViewList] = useState<RecipeIngredView[]>([]);
  const [isAddIngred, setIsAddIngred] = useState(false);
  const [isEditIngred, setIsEditIngred] = useState(false);
  const [editRecipeIngredId, setEditRecipeIngredId] = useState<number | null>(null);
  const [editData, setEditData] = useState<IngredSelectFormData>(); 

  useEffect(() => {
    if (!recipeIngredDtoListStat.isLoading) {
      setRecipeIngredViewList(recipeIngredDtoList?.map((item) => ({...item})) ?? []);
    }
  }, [recipeIngredDtoList, recipeIngredDtoListStat.isLoading]);
  
  // 画面クリック or スクロールでコンテキストメニューをクローズ
  useEventHandler("click", () => closeContextMenu());
  useEventHandler("scroll", () => closeContextMenu());

  const openAddIngredForm = () => {
    console.log("openAddIngredForm", isAddIngred);
    setIsAddIngred(true);
  };

  const openEditIngredForm = (row: RecipeIngredView) => {
    setApplyHighlighted(false);
    setEditRecipeIngredId(row?.recipeIngredId ?? null);

    const formData: IngredSelectFormData = {
      ingredNm: row.ingredNm,
      qty: row.qty ?? null,
      unitCd: row.unitCd ?? null,
      salesAreaType: row.salesAreaType ?? null,
    };

    setEditData(formData);
    setIsEditIngred(true);
  };

  const closeIngredForm = () => {
    console.log("closeIngredForm", isAddIngred);
    setIsAddIngred(false);
    setIsEditIngred(false);
    setIsOpeningForm(false);
  };

  const submitAddRecipeIngred = async (formData: IngredSelectFormData, clearForm: () => void) => {
    clearMessage();
    console.log(`レシピ食材追加 レシピID:${recipe?.recipeId} 食材名:${formData?.ingredNm} 必要量:${formData?.qty} 単位コード:${formData?.unitCd} 売り場区分${formData?.salesAreaType}`);
    try {
      const response = await apiClient.post(`${process.env.REACT_APP_API_CLIENT}/recipe/submitAddRecipeIngred`, { 
        recipeId: recipe?.recipeId,
        ingredNm: formData?.ingredNm,
        qty: formData?.qty, 
        unitCd: formData?.unitCd, 
      });
      const data = await response.data;
      console.log(data.message, data);
      if (recipeIngredDtoList) {
        recipeIngredDtoListMutate([...recipeIngredDtoList, data.newRecipeIngred]);
      }
      clearForm();
      
      if (!formData?.isRegisterContinue) {closeIngredForm()};
    } catch (error: any) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || MSG_MISSING_REQUEST, MESSAGE_TYPE.ERROR);
    };
  };

  const submitEditRecipeIngred = async (formData: IngredSelectFormData) => {
    clearMessage();
    console.log(`レシピ食材更新 レシピ食材ID${editRecipeIngredId} レシピID:${recipe?.recipeId} 食材名:${formData?.ingredNm} 必要量:${formData?.qty} 単位コード:${formData?.unitCd} 売り場区分${formData?.salesAreaType}`);
    try {
      const response = await apiClient.put(`${process.env.REACT_APP_API_CLIENT}/recipe/submitEditRecipeIngred`, { 
        recipeIngredId: editRecipeIngredId,
        ingredNm: formData?.ingredNm,
        qty: formData?.qty, 
        unitCd: formData?.unitCd,
      });
      const data = await response.data;
      console.log("更新成功", data);
      if (recipeIngredDtoList) {
        recipeIngredDtoListMutate(recipeIngredDtoList.map((item) => (
          item?.recipeIngredId === editRecipeIngredId ? data.newRecipeIngred : item
        )));
      }
      closeIngredForm();
    } catch (error: any) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || MSG_MISSING_REQUEST, MESSAGE_TYPE.ERROR);
    };        
  };

  const submitDeleteRecipeIngred = async (row: RecipeIngredView) => {
    clearMessage();
    const deleteable = window.confirm("食材を削除します。\nよろしいですか？");
    if (!deleteable) {
      return;
    }
    const queryParams = new URLSearchParams(decamelizeKeys({ recipeIngredId: row?.recipeIngredId })).toString();
    try {
      const response = await apiClient.delete(`${process.env.REACT_APP_API_CLIENT}/recipe/submitDeleteRecipeIngred/query_params?${queryParams}`);
      const data = await response.data;
      console.log(data.message, data);
      if (recipeIngredDtoList) {
        recipeIngredDtoListMutate(recipeIngredDtoList.filter((item) => item.recipeIngredId !== row.recipeIngredId), false);
      }
    } catch (error: any) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || MSG_MISSING_REQUEST, MESSAGE_TYPE.ERROR);
    };
  };

  const contextValue: RecipeIngredRowContextTypes = { 
    recipe,
    recipeIngredDtoList,
    recipeIngredDtoListStat,
    recipeIngredDtoListMutate,
    recipeIngredViewList,
    setRecipeIngredViewList,
    isAddIngred,
    setIsAddIngred,
    isEditIngred,
    setIsEditIngred,
    editRecipeIngredId,
    setEditRecipeIngredId,
    editData,
    setEditData,
    openAddIngredForm,
    openEditIngredForm,
    closeIngredForm,
    submitAddRecipeIngred,
    submitEditRecipeIngred,
    submitDeleteRecipeIngred,
  };

  // 画面クリック or スクロールでコンテキストメニューをクローズ
  useEventHandler("click", () => closeContextMenu());
  useEventHandler("scroll", () => closeContextMenu());

  return (
    <RecipeIngredRowContext.Provider value={contextValue}>
      {children}
    </RecipeIngredRowContext.Provider>
  );
}; 