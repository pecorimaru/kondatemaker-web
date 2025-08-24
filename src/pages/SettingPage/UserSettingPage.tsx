// 内部ライブラリ - フック
import { useUserSettingPage } from '@/hooks';

// 内部ライブラリ - コンポーネント
import { ChangePasswordForm } from '@/components/features/setting';

// CSS
import '@/css/styles.css';
import '@/css/output.css';

export const UserSettingPage = () => {
  const {
    editUserNm,
    setEditUserNm,
    isChangePassword,
    setIsChangePassword,
    submitEditUserNm,
    submitChangePassword,
    submitDeleteUser,
    closeChangePasswordForm,
  } = useUserSettingPage();

  return (
    <div className="main-container">
      <div className="mt-header-mb-footer">
        <div className="w-full max-w-sm mt-4 py-8 bg-white shadow-lg rounded-md">
          <div className="px-8">
            <label className="block text-md text-gray-700">表示名:</label>
            <input
                type="text"
                value={editUserNm}
                className="form-input-base"
                onChange={(e) => setEditUserNm(e.target.value)}
                onBlur={() => submitEditUserNm()}
                required
            />
          </div>
        </div>
        <div className="w-full max-w-sm mt-4  bg-white shadow-lg rounded-md">
          <button
            className="w-full h-10 text-stale-700 rounded-sm border-t hover:bg-gray-100"
            onClick={() => setIsChangePassword(true)}
          >
            <i className="fa-solid fa-key"></i>
            <span className="mx-2">パスワード変更</span>
          </button>
          <button
            className="w-full h-10 text-stale-700 border-y rounded-sm hover:bg-gray-100"
            onClick={() => submitDeleteUser()}
          >
            <i className="fa-solid fa-trash"></i>
            <span className="mx-2">アカウント削除</span>
            
          </button>
        </div>
        {isChangePassword && <ChangePasswordForm submitAction={submitChangePassword} closeChangePasswordForm={closeChangePasswordForm} />}
      </div>
    </div>
  );
};