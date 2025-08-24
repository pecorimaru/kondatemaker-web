import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { decamelizeKeys } from 'humps';

import { ActivationPageContext } from '@/contexts';
import { ActivationPageContextTypes } from '@/types';
import { useApp } from '@/hooks';
import { apiClient } from '@/utils';
import { MESSAGE_TYPE, MSG_MISSING_REQUEST } from "@/constants";

export const ActivationPageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { showMessage } = useApp();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [token] = useState(searchParams.get("token"));
  const [isDone, setIsDone] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const activateUser = useCallback(async () => {
    if (!token) {
      setStatus("error");
      return;
    }
    if (isDone) {
      return;
    };
    setMessage("アカウントを有効化しています...")
    try { 
      const response = await apiClient.post(`${process.env.REACT_APP_API_CLIENT}/login/activate`, decamelizeKeys({ token }));
      const data = response.data;
      setStatus("ok");
      setMessage(data.message);
    } catch (error: any) {
      if (status === "loading") {
        setStatus("error");
      };
      showMessage(error?.response?.data?.detail || error?._messageTimeout || MSG_MISSING_REQUEST, MESSAGE_TYPE.ERROR);
    } finally {
      setIsDone(true);
    }
  }, [token, isDone, status, showMessage]);

  useEffect(() => {
    activateUser();
  }, [activateUser]);

  const navigateToLogin = () => {
    navigate("/");
  }

  const contextValue: ActivationPageContextTypes = {
    status,
    setStatus,
    message,
    setMessage,
    isDone,
    setIsDone,
    token,
    activateUser,
    navigateToLogin,
  };

  return (
    <ActivationPageContext.Provider value={contextValue}>
      {children}
    </ActivationPageContext.Provider>
  );
}; 