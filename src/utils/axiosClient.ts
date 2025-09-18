import { MESSAGE } from '@/constants';
import axios from 'axios';
import { AuthManager } from './authManager';


// Axiosインスタンスを作成
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/', // ベースURLを設定
  timeout: import.meta.env.VITE_TIMEOUT ? Number(import.meta.env.VITE_TIMEOUT) : undefined,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 環境変数からログレベルを取得
const logLevel = import.meta.env.VITE_LOG_LEVEL || 'error';

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('request Error:', error);
    return Promise.reject(error);
  }
);

// レスポンス用インターセプター
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await apiClient.post("api/login/refresh");
        localStorage.setItem("token", response.data.newAccessToken);
        // 状態変数は変更しない（まだログイン状態のため）
        console.log("refresh successful")

        // 新しいアクセストークンをヘッダーに追加して再リクエスト
        originalRequest.headers["Authorization"] = `Bearer ${response.data.newAccessToken}`;
        return apiClient(originalRequest);

      } catch (refreshError) {
        console.log("error", refreshError);
        // AuthManagerを使って状態とlocalStorageを同期
        AuthManager.logout();
        return Promise.reject(refreshError);
      };
    };

    if (error.response.status === 403) {
      AuthManager.logout();
    };

    if (error.message === `timeout of ${import.meta.env.VITE_TIMEOUT}ms exceeded`) {
      error._messageTimeout = MESSAGE.TIMEOUT
    };
    if (logLevel === 'debug') {
      console.error('Axios Error:', error);
    } else if (logLevel === 'error') {
      console.error('An error occurred');
    };
    return Promise.reject(error); // エラーを投げる
  }
);

