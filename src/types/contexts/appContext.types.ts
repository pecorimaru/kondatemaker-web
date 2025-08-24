import { KeyedMutator } from 'swr';
import { UserDto } from '../api/user.types';
import { GroupDto } from '../api/group.types';
import React from 'react';
import { VISIBLE_TYPE, WEEKDAY_CD } from '@/constants';

export interface AppContextTypes {
  // ユーザー情報関連
  loginUser: UserDto | undefined;
  loginUserStat: { error: any, isLoading: boolean };
  loginUserMutate: KeyedMutator<UserDto>;
  
  // グループ情報関連
  currentGroup: GroupDto | undefined;
  currentGroupStat: { error: any, isLoading: boolean };
  currentGroupMutate: KeyedMutator<GroupDto>;
  
  // 辞書データ関連
  weekdayDict: Record<WEEKDAY_CD, string> | undefined;
  weekdayDictStat: { error: any, isLoading: boolean };
  unitDict: Record<string, string> | undefined;
  unitDictStat: { error: any, isLoading: boolean };
  recipeTypeDict: Record<string, string> | undefined;
  recipeTypeDictStat: { error: any, isLoading: boolean };
  salesAreaDict: Record<string, string> | undefined;
  salesAreaDictStat: { error: any, isLoading: boolean };
  
  // UI状態管理
  menuPosition: { x: number, y: number };
  setMenuPosition: (menuPosition: { x: number, y: number }) => void;
  messageContent: string | null;
  setMessageContent: (messageContent: string | null) => void;
  messageType: string | null;
  setMessageType: (messageType: string | null) => void;
  messageVisible: VISIBLE_TYPE;
  setMessageVisible: (messageVisible: VISIBLE_TYPE) => void;
  isLoggedIn: boolean | null;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  isOpeningForm: boolean;
  setIsOpeningForm: (isOpeningForm: boolean) => void;
  
  // タッチ・マウス操作関連
  touchTimeout: NodeJS.Timeout | null;
  setTouchTimeout: (touchTimeout: NodeJS.Timeout | null) => void;
  contextMenuTargetId: number | null | undefined;
  setContextMenuTargetId: (contextMenuTargetId: number | null | undefined) => void;
  hoveredId: number | null;
  setHoveredId: (hoveredId: number | null) => void;
  applyHighlighted: boolean;
  setApplyHighlighted: (applyHighlighted: boolean) => void;
  contextDataType: string | null;
  
  // イベントハンドラー
  touchStart: (e: React.TouchEvent<HTMLTableRowElement | HTMLDivElement>, id: number | null | undefined, screenType: string) => void;
  touchEnd: () => void;
  openContextMenu: (e: React.MouseEvent<HTMLTableRowElement | HTMLDivElement>, id: number | null | undefined, screenType: string) => void;
  closeContextMenu: () => void;
  showMessage: (content: string, type: string) => void;
  clearMessage: () => void;
  hoveredRowSetting: (id: number | null | undefined) => void;
}
