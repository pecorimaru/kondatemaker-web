import React from 'react';


export interface SignUpPageContextTypes {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  passwordAgain: string;
  setPasswordAgain: (passwordAgain: string) => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  isGoogleLoading: boolean;
  setGoogleLoading: (loading: boolean) => void;
  createUserSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  getGoogleAuth: () => void;
} 