import React, { useState } from 'react';
import { decamelizeKeys } from 'humps';

import { ResetPasswordPageContext } from '@/contexts';
import { ResetPasswordPageContextTypes } from '@/types';
import { useApp } from '@/hooks';
import { apiClient } from '@/utils';
import { MESSAGE_TYPE, MSG_MISSING_REQUEST } from '@/constants';

export const ResetPasswordPageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { showMessage, clearMessage } = useApp();
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const resetPasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearMessage();
    setLoading(true);
    try {
      const response = await apiClient.post(`${process.env.REACT_APP_API_CLIENT}/login/resetPassword`, decamelizeKeys({ email }));
      const data  = response?.data;
      showMessage(data.message, MESSAGE_TYPE.INFO);
      setEmail("");
    } catch (error: any) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || MSG_MISSING_REQUEST, MESSAGE_TYPE.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const contextValue: ResetPasswordPageContextTypes = {
    isLoading,
    email,
    setEmail,
    resetPasswordSubmit,
  };

  return (
    <ResetPasswordPageContext.Provider value={contextValue}>
      {children}
    </ResetPasswordPageContext.Provider>
  );
}; 