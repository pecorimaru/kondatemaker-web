import '@/css/styles.css';
import '@/css/output.css';

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';


import { decamelizeKeys } from 'humps';
import { apiClient } from '../../utils/axiosClient';
import { useApp } from '@/hooks';
import { MESSAGE_TYPE, MSG_MISSING_REQUEST } from '@/constants';
import { LoadingSpinner } from '@/components/ui';


export const ResetPasswordPage = () => {

  const { showMessage, clearMessage } = useApp();
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

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

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white shadow-lg rounded-md">
        <h2 className="text-2xl text-center text-slate-700">パスワード再発行</h2>
        <form onSubmit={resetPasswordSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-slate-700">
              メールアドレス:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-input-base"
            />
          </div>
          <div>
            <button
              type="submit"
              className="button-base h-12 w-full text-white bg-blue-400 border-b-blue-500 rounded-sm hover:text-gray-100"
            >
              {isLoading ? <LoadingSpinner /> : <span>パスワード再発行メールを送信</span>}
            </button>
          </div>
        </form>
        <div className="text-center">
          <span 
            className="login-link-text-base"
            onClick={() => navigate("/")}
          >ログイン画面に戻る</span>
        </div>
      </div>
    </div>
  );
}