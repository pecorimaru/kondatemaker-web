import React from 'react';

export interface GroupSettingPageContextTypes {
  // 状態
  isMemberInvite: boolean;
  setIsMemberInvite: (isMemberInvite: boolean) => void;
  editGroupNm: string;
  setEditGroupNm: (editGroupNm: string) => void;
  
  // 関数
  submitEditGroupNm: (e: React.FocusEvent<HTMLInputElement>) => Promise<void>;
  submitExitGroup: () => Promise<void>;
  submitChangeGroup: (groupId: number) => Promise<void>;
  closeMemberInviteForm: () => void;
  submitMemberInvite: (formData: { toEmail: string }) => Promise<void>;
} 