import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { decamelizeKeys } from 'humps';

import { UserSettingPageContext } from '@/contexts';
import { UserSettingPageContextTypes } from '@/types';
import { useApp } from '@/hooks';
import { apiClient } from '@/utils';
import { MESSAGE_TYPE, MSG_MISSING_REQUEST } from '@/constants';

export const UserSettingPageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { loginUser, loginUserStat, setIsLoggedIn, showMessage, clearMessage, setIsOpeningForm } = useApp();
  const [userNm, setUserNm] = useState<string>("");
  const [editUserNm, setEditUserNm] = useState(loginUser?.userNm || "");
  const [isChangePassword, setIsChangePassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loginUserStat.isLoading) {
      setEditUserNm(loginUser?.userNm || "");
    };
  }, [loginUser, loginUserStat.isLoading]);

  const closeChangePasswordForm = () => {
    setIsChangePassword(false);
    setIsOpeningForm(false);
  };

  const submitEditUserNm = async () => {
    if (userNm === editUserNm) {
      return;
    };
    clearMessage();
    try {
      const response = await apiClient.post(`${process.env.REACT_APP_API_CLIENT}/setting/submitEditUserNm`, decamelizeKeys({ editUserNm }));
      const data = response.data;
      console.log(data.messaage, data);
      setUserNm(editUserNm);
    } catch (error: any) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || MSG_MISSING_REQUEST, MESSAGE_TYPE.ERROR);
    };
  };

  const submitChangePassword = async (currentPassword: string, newPassword: string) => {
    clearMessage();
    try {
      const response = await apiClient.post(
        `${process.env.REACT_APP_API_CLIENT}/setting/submitChangePassword`, 
        decamelizeKeys({ currentPassword, newPassword })
      );
      const data = response.data;
      closeChangePasswordForm();
      showMessage(data.message, MESSAGE_TYPE.INFO);
    } catch (error: any) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || MSG_MISSING_REQUEST, MESSAGE_TYPE.ERROR);
    };
  };

  const submitDeleteUser = async () => {
    const deletable = window.confirm("アカウントを削除します。\n削除した情報は元に戻すことができません。\n本当によろしいですか？");
    if (!deletable) {
      return;
    };
    clearMessage();
    try {
      const response = await apiClient.delete(`${process.env.REACT_APP_API_CLIENT}/setting/submitDeleteUser`, { 
      });
      const data = await response.data;
      console.log("削除成功", data);
      showMessage("アカウントの削除が完了しました。\nご利用ありがとうございました。", MESSAGE_TYPE.INFO)
      setIsLoggedIn(false);
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("token");
      navigate("/")
    } catch (error: any) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || MSG_MISSING_REQUEST, MESSAGE_TYPE.ERROR);
    };
  };

  const contextValue: UserSettingPageContextTypes = {
    userNm,
    setUserNm,
    editUserNm,
    setEditUserNm,
    isChangePassword,
    setIsChangePassword,
    submitEditUserNm,
    submitChangePassword,
    submitDeleteUser,
    closeChangePasswordForm,
  };

  return (
    <UserSettingPageContext.Provider value={contextValue}>
      {children}
    </UserSettingPageContext.Provider>
  );
}; 