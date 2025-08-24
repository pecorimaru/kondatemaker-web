import React from 'react';

export interface ResetPasswordPageContextTypes {
  isLoading: boolean;
  email: string;
  setEmail: (email: string) => void;
  resetPasswordSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
} 