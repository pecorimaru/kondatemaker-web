import React, { useEffect, useState } from 'react';
import { useWeekdayDict, useUnitDict, useSalesAreaDict, useRecipeTypeDict, useCurrentGroup, useLoginUser } from '@/hooks';
import { AppContextTypes, BaseProviderTypes } from '@/types';
import { AppContext } from '@/contexts';
import { VISIBLE_TYPE } from '@/constants';
import { AuthManager } from '@/utils/authManager';

export const AppProvider: React.FC<BaseProviderTypes> = ({ children }) => {
    // ログイン状態の初期化
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(
      localStorage.getItem("isLoggedIn") === "true" ? true : 
      localStorage.getItem("isLoggedIn") === "false" ? false : 
      null
    );
  
    useEffect(() => {
      // AuthManagerに状態更新関数を登録
      AuthManager.subscribe(setIsLoggedIn);
      
      return () => {
        AuthManager.unsubscribe(setIsLoggedIn);
      };
    }, []);

    // API データの取得
    const { loginUser, loginUserStat, loginUserMutate } = useLoginUser(isLoggedIn ?? false);
    const { currentGroup, currentGroupStat, currentGroupMutate } = useCurrentGroup(isLoggedIn ?? false);
    const { weekdayDict, weekdayDictStat } = useWeekdayDict();
    const { unitDict, unitDictStat } = useUnitDict();
    const { recipeTypeDict, recipeTypeDictStat } = useRecipeTypeDict();
    const { salesAreaDict, salesAreaDictStat } = useSalesAreaDict();
  
    // UI 状態の管理
    const [messageContent, setMessageContent] = useState<string | null>("");
    const [messageType, setMessageType] = useState<string | null>("");
    const [messageVisible, setMessageVisible] = useState<VISIBLE_TYPE>(VISIBLE_TYPE.HIDDEN);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [touchTimeout, setTouchTimeout] = useState<NodeJS.Timeout | null>(null);
    const [isOpeningForm, setIsOpeningForm] = useState<boolean>(false);
    const [contextDataType, setContextDataType] = useState<string | null>(null);
    const [contextMenuTargetId, setContextMenuTargetId] = useState<number | null | undefined>(null);
    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const [applyHighlighted, setApplyHighlighted] = useState<boolean>(false);
  
    // タッチイベントの処理
    const touchStart = (
      e: React.TouchEvent<HTMLTableRowElement | HTMLDivElement>, 
      id: number | null | undefined, 
      dataType: string
    ) => {
      if (id === hoveredId) {
        setApplyHighlighted(!applyHighlighted);
      } else {
        setHoveredId(id ?? null);
        setApplyHighlighted(true);
      }
  
      const touch = e.touches[0];
      setTouchTimeout(setTimeout(() => {
        const x = window.innerWidth - touch.clientX < 82 ? window.innerWidth -62 : touch.clientX +20;
        setMenuPosition({ x: x, y: touch.clientY -70 });
        setContextMenuTargetId(id);
        setContextDataType(dataType);
      }, 500));  // 500ms 長押しでポップアップを表示
    };
  
    const touchEnd = () => {
      if (contextMenuTargetId) {
        setApplyHighlighted(true);
      }
      if (touchTimeout) {  
        clearTimeout(touchTimeout);
      }
    };
  
    // コンテキストメニューの処理
    const openContextMenu = (
      e: React.MouseEvent<HTMLTableRowElement | HTMLDivElement>, 
      id: number | null | undefined, 
      screenType: string
    ) => {
      e.preventDefault();
      setContextMenuTargetId(id);
      setContextDataType(screenType);
      setMenuPosition({ x: e.clientX, y: e.clientY -50 });
    };
    
    const closeContextMenu = () => {
      setContextMenuTargetId(null);
      setContextDataType(null);
    };
  
    // ホバー状態の管理
    const hoveredRowSetting = (id: number | null | undefined) => {
      setHoveredId(id ?? null);
      setApplyHighlighted(true);
    };
  
    // メッセージ表示の管理
    const showMessage = (content: string, type: string) => {
      setMessageContent(content);
      setMessageType(type);
      setMessageVisible(VISIBLE_TYPE.OPEN);
    };
  
    const clearMessage = () => {
      setMessageContent(null);
      setMessageType(null);
    };
  
    // コンテキスト値の提供
    const contextValue: AppContextTypes = {
      // ユーザー・グループ情報
      loginUser,
      loginUserStat,
      loginUserMutate,
      currentGroup,
      currentGroupStat,
      currentGroupMutate,
      
      // 辞書データ
      weekdayDict,
      weekdayDictStat,
      recipeTypeDict,
      recipeTypeDictStat,
      unitDict,
      unitDictStat,
      salesAreaDict, 
      salesAreaDictStat,
      
      // UI状態
      menuPosition,
      setMenuPosition,
      messageContent,
      setMessageContent,
      messageType,
      setMessageType,
      messageVisible,
      setMessageVisible,
      isLoggedIn,
      setIsLoggedIn,
      isOpeningForm,
      setIsOpeningForm,
      
      // タッチ・マウス操作
      touchTimeout,
      setTouchTimeout,
      contextMenuTargetId,
      setContextMenuTargetId,
      hoveredId,
      setHoveredId,
      applyHighlighted,
      setApplyHighlighted,
      contextDataType,
      
      // イベントハンドラー
      touchStart,
      touchEnd,
      openContextMenu,
      closeContextMenu,
      showMessage,
      clearMessage,
      hoveredRowSetting
    };
  
    return (
      <AppContext.Provider value={contextValue}>
        {children}
      </AppContext.Provider>
    );
  } 