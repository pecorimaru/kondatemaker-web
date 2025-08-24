import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { decamelizeKeys } from 'humps';

import { JoinGroupPageContext } from '@/contexts';
import { JoinGroupPageContextTypes } from '@/types';
import { apiClient } from '@/utils';
import { MSG_MISSING_REQUEST } from '@/constants';

export const JoinGroupPageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [token] = useState(searchParams.get("token"));
  const [isDone, setIsDone] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const submitJoinGroup = useCallback(async () => {
    if (!token) {
      setStatus("error");
      return;
    }
    if (isDone) {return};

    setMessage("グループに参加しています...")
    try { 
      const response = await apiClient.post(`${process.env.REACT_APP_API_CLIENT}/setting/joinGroup`, decamelizeKeys({ token }));
      const data = response.data;
      setStatus("ok");
      setMessage(data.message);
    } catch (error: any) {
      setStatus("error");
      setMessage(error?.response?.data?.detail || error?._messageTimeout || MSG_MISSING_REQUEST);
    } finally {
      setIsDone(true);
    }
  }, [token, isDone]);

  useEffect(() => {
    submitJoinGroup();
  }, [submitJoinGroup]);

  const navigateToLogin = () => {
    navigate("/");
  };

  const contextValue: JoinGroupPageContextTypes = {
    status,
    setStatus,
    token,
    isDone,
    setIsDone,
    message,
    setMessage,
    submitJoinGroup,
    navigateToLogin,
  };

  return (
    <JoinGroupPageContext.Provider value={contextValue}>
      {children}
    </JoinGroupPageContext.Provider>
  );
}; 