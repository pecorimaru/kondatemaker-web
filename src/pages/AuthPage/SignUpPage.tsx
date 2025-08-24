import { useNavigate } from 'react-router-dom';

import '@/css/styles.css';
import '@/css/output.css';

import { GoogleContinueButton, LoadingSpinner } from '@/components/ui';
import { useSignUpPage } from '@/hooks';


export const SignUpPage = () => {

  const {
    email,
    setEmail,
    password,
    setPassword,
    passwordAgain,
    setPasswordAgain,
    isLoading,
    createUserSubmit,
    getGoogleAuth,
    isGoogleLoading,
  } = useSignUpPage();

  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white shadow-lg rounded-md">
        <h2 className="text-2xl text-center text-slate-700">新規登録</h2>
        <form onSubmit={createUserSubmit} className="space-y-4">
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
            <label htmlFor="password" className="block text-sm text-slate-700">
              パスワード:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input-base"
            />
          </div>
          <div>
            <label htmlFor="passwordAgain" className="block text-sm text-slate-700">
              パスワード（再入力）:
            </label>
            <input
              type="password"
              id="passwordAgain"
              value={passwordAgain}
              onChange={(e) => setPasswordAgain(e.target.value)}
              required
              className="login-input-base"
            />
          </div>
          <div>
            <button
              type="submit"
              className="button-base h-12 w-full text-white bg-blue-400 border-b-blue-500 rounded-sm hover:text-gray-100"
            >
              {isLoading ? <LoadingSpinner /> : <span>アカウント作成</span>}
            </button>
          </div>
        </form>
        <div>
          <span className="text-sm text-slate-700">アカウントをお持ちの場合 </span>
          <span 
            className="login-link-text-base"
            onClick={() => navigate("/")}
          >ログイン画面に戻る</span>
        </div>
        <div className="flex justify-center items-center">
          <div className="border-t border-gray-300 w-2/5"></div>
          <span className="my-1 mx-3 text-sm text-slate-700">または</span>
          <div className="border-t border-gray-300 w-2/5"></div>
        </div>
        <div>
          <GoogleContinueButton getGoogleAuth={getGoogleAuth} isGoogleLoading={isGoogleLoading} />
        </div>
      </div>
    </div>
  );
}