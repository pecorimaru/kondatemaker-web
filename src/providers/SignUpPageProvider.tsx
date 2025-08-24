import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { decamelizeKeys } from 'humps';

import { SignUpPageContext } from '@/contexts';
import { SignUpPageContextTypes } from '@/types';
import { useApp } from '@/hooks';
import { apiClient } from '@/utils';
import { MESSAGE, MESSAGE_TYPE, MSG_MISSING_REQUEST } from '@/constants';

export const SignUpPageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { setIsLoggedIn, showMessage, clearMessage } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isGoogleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const createUserSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearMessage();
    if (password !== passwordAgain) {
      showMessage(MESSAGE.PASSWORD_NOT_EQUALS, MESSAGE_TYPE.WARN)
      return;
    }
    setLoading(true);
    try {
      const response = await apiClient.post(`${process.env.REACT_APP_API_CLIENT}/login/createUser`, decamelizeKeys({ email, password }));
      const data  = response?.data;
      showMessage(data.message, MESSAGE_TYPE.INFO);
      setEmail("");
      setPassword("");
      setPasswordAgain("");
    } catch (error: any) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || MSG_MISSING_REQUEST, MESSAGE_TYPE.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const getGoogleAuth = useGoogleLogin({    
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      try {
        const userinfoResponse = await apiClient.get('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        const userinfoData = userinfoResponse.data;
        const verifyResponse = await apiClient.post(`${process.env.REACT_APP_API_CLIENT}/login/googleLogin`, decamelizeKeys({ email: userinfoData.email }));
        const verifyData = verifyResponse.data;
        localStorage.setItem("token", verifyData.accessToken);
        localStorage.setItem("isLoggedIn", "true");
        setIsLoggedIn(true);
        navigate("/home");
      } catch (error: any) {
        showMessage(error?.response?.data?.detail || error?._messageTimeout || MSG_MISSING_REQUEST, MESSAGE_TYPE.ERROR);
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: (error: any) => {
      console.error('Login Failed:', error);
    },  
  });

  const contextValue: SignUpPageContextTypes = {
    email,
    setEmail,
    password,
    setPassword,
    passwordAgain,
    setPasswordAgain,
    isLoading,
    setLoading,
    isGoogleLoading,
    setGoogleLoading,
    createUserSubmit,
    getGoogleAuth,
  };

  return (
    <SignUpPageContext.Provider value={contextValue}>
      {children}
    </SignUpPageContext.Provider>
  );
}; 