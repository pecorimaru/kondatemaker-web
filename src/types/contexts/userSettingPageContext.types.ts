export interface UserSettingPageContextTypes {
  // 状態
  userNm: string;
  setUserNm: (userNm: string) => void;
  editUserNm: string;
  setEditUserNm: (editUserNm: string) => void;
  isChangePassword: boolean;
  setIsChangePassword: (isChangePassword: boolean) => void;
  
  // 関数
  submitEditUserNm: () => Promise<void>;
  submitChangePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  submitDeleteUser: () => Promise<void>;
  closeChangePasswordForm: () => void;
} 