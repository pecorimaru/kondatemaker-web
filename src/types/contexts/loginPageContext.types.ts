import React from 'react';

export interface LoginPageContextTypes {
  // 状態
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  isGoogleLoading: boolean;
  setGoogleLoading: (loading: boolean) => void;
  
  // 関数
  getGoogleAuth: () => void;
  submitLogin: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  navigateToResetPassword: () => void;
  navigateToSignUp: () => void;
} 