export interface JoinGroupPageContextTypes {
  // 状態
  status: string;
  setStatus: (status: string) => void;
  token: string | null;
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  message: string;
  setMessage: (message: string) => void;
  
  // 関数
  submitJoinGroup: () => Promise<void>;
  navigateToLogin: () => void;
} 