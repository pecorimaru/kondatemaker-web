import { KeyedMutator } from 'swr';
import { ToweekMenuPlanDetView } from '@/types';
import { WEEKDAY_CD } from '@/constants';
import React from 'react';

export interface ToweekMenuPlanDetRowContextTypes {
  // 状態
  weekdayCd: WEEKDAY_CD;
  toweekMenuPlanDetViewListDict?: Record<string, ToweekMenuPlanDetView[]>;
  toweekMenuPlanDetListDictMutate: KeyedMutator<Record<string, ToweekMenuPlanDetView[]>>;
  isRefreshing: boolean;
  toweekMenuPlanDetViewList: ToweekMenuPlanDetView[];
  setToweekMenuPlanDetViewList: (list: ToweekMenuPlanDetView[]) => void;
  
  // 編集状態
  befRecipeNm: string;
  setBefRecipeNm: (recipeNm: string) => void;
  recipeNmEditing: string;
  setRecipeNmEditing: (recipeNm: string) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  
  // レシピ名候補とリファレンス
  recipeNmSuggestions: string[] | undefined;
  recipeNmRef: React.RefObject<HTMLInputElement | null>;
  recipeNmSuggestionsRef: React.RefObject<HTMLInputElement | null>;
  
  // フラグ管理
  flg: {
    recipeNmSuggestionsVisible: string;
    isEditing: string;
    isAlert: string;
  };
  
  // ハンドラー
  switchFlgToweekMenuPlanAcc: (updIndex: number, key: string, flg: boolean, isAll?: boolean) => void;
  handleEditClick: (row: ToweekMenuPlanDetView, index: number) => void;
  handleAddRecipeNmChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEditRecipeNmChange: (e: React.ChangeEvent<HTMLInputElement>, row: ToweekMenuPlanDetView) => void;
  handleClickOutside: (e: Event) => void;
  handleEditSuggestionClick: (suggestion: string, row: ToweekMenuPlanDetView) => void;
  handleAddSuggestionClick: (suggestion: string) => void;
  
  // API操作
  submitEditToweekMenuPlanDet: (recipeNm: string) => Promise<void>;
  submitDeleteToweekMenuPlanDet: (row: ToweekMenuPlanDetView) => Promise<void>;
} 