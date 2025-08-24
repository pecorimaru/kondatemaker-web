import React, { useState, useEffect } from 'react';
import { decamelizeKeys } from 'humps';

import { GroupSettingPageContext } from '@/contexts';
import { GroupSettingPageContextTypes } from '@/types';
import { useApp } from '@/hooks';
import { apiClient } from '@/utils';
import { MESSAGE_TYPE, MSG_MISSING_REQUEST } from '@/constants';

export const GroupSettingPageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { currentGroup, currentGroupStat, currentGroupMutate, showMessage, clearMessage } = useApp();
  const [isMemberInvite, setIsMemberInvite] = useState(false);
  const [editGroupNm, setEditGroupNm] = useState("");

  useEffect(() => {
    if (!currentGroupStat.isLoading) {
      setEditGroupNm(currentGroup?.groupNm || "");
    };
  }, [currentGroup, currentGroupStat.isLoading]);

  const submitEditGroupNm = async (e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (editGroupNm === currentGroup?.groupNm) {
      return;
    };
    clearMessage();
    try {
      const response = await apiClient.post(`${process.env.REACT_APP_API_CLIENT}/setting/submitEditGroupNm`, decamelizeKeys({ editGroupNm }));
      const data = response.data;
      console.log(data.message, data);
      currentGroupMutate(data.editGroup);
    } catch (error: any) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || MSG_MISSING_REQUEST, MESSAGE_TYPE.ERROR);
    };
  };

  const submitExitGroup = async () => {
    const deletable = window.confirm("グループから脱退すると、再度招待されない限り元に戻すことはできません。\n本当によろしいですか？");
    if (!deletable) {
      return;
    };
    clearMessage();
    try {
      const response = await apiClient.post(`${process.env.REACT_APP_API_CLIENT}/setting/exitGroup`);
      const data = response.data;
      console.log(data.message, data);
      localStorage.setItem("token", data.accessToken);
      window.location.reload();
    } catch (error: any) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || MSG_MISSING_REQUEST, MESSAGE_TYPE.ERROR);
    };
  };

  const submitChangeGroup = async(groupId: number) => {
    clearMessage();
    try {
      const response = await apiClient.post(`${process.env.REACT_APP_API_CLIENT}/setting/changeGroup`, decamelizeKeys({ groupId }));
      const data = response.data;
      localStorage.setItem("token", data.accessToken);
      window.location.reload();
    } catch (error: any) {
      showMessage(error.response.data.detail ? error.response.data.detail : MSG_MISSING_REQUEST, MESSAGE_TYPE.ERROR);
    };
  }

  const closeMemberInviteForm = () => {
    setIsMemberInvite(false);
  };

  const submitMemberInvite = async (formData: { toEmail: string }) => {
    clearMessage();
    try {
      const response = await apiClient.post(`${process.env.REACT_APP_API_CLIENT}/setting/submitMemberInvite`, decamelizeKeys({ toEmail: formData.toEmail }));
      const data = response.data;
      console.log(data.message, data);
      showMessage(data.message, MESSAGE_TYPE.INFO);
      closeMemberInviteForm();
    } catch (error: any) {
      showMessage(error.response.data.detail ? error.response.data.detail : MSG_MISSING_REQUEST, MESSAGE_TYPE.ERROR);
    };
  };

  const contextValue: GroupSettingPageContextTypes = {
    isMemberInvite,
    setIsMemberInvite,
    editGroupNm,
    setEditGroupNm,
    submitEditGroupNm,
    submitExitGroup,
    submitChangeGroup,
    closeMemberInviteForm,
    submitMemberInvite,
  };

  return (
    <GroupSettingPageContext.Provider value={contextValue}>
      {children}
    </GroupSettingPageContext.Provider>
  );
}; 