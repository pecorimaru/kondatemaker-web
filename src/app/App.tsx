// 外部ライブラリ
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 内部ライブラリ - ページコンポーネント
import {
  HomePage,
  GroupSettingPage,
  ResetPasswordPage,
  SignUpPage,
  ActivationPage,
  JoinGroupPage,
  LoginPage,
  BuyPage,
  MenuPlanPage,
  RecipePage,
  UserSettingPage,
  IngredPage,
  NotFoundPage,
} from '@/pages';

// 内部ライブラリ - フック
import { useApp } from '@/hooks';

// 内部ライブラリ - コンポーネント
import { Footer, Header } from '@/components/layout';
import { LoadingSpinner, Toast } from '@/components/ui';

// 内部ライブラリ - プロバイダー
import {
  HomePageProvider,
  BuyPageProvider,
  MenuPlanPageProvider,
  RecipePageProvider,
  IngredPageProvider,
  SignUpPageProvider,
  LoginPageProvider,
  ActivationPageProvider,
  ResetPasswordPageProvider,
  GroupSettingPageProvider,
  JoinGroupPageProvider,
  UserSettingPageProvider,
} from '@/providers';

// CSS（最後）
import '@/css/styles.css';
import '@/css/output.css';
import { VISIBLE_TYPE } from '@/constants';


export const App = () => {

  const { 
    isLoggedIn, 
    weekdayDictStat, 
    unitDictStat, 
    recipeTypeDictStat, 
    salesAreaDictStat, 
    messageVisible 
  } = useApp();

  return (
    <BrowserRouter basename="/">
      <div className="bg-slate-100 h-screen font-sans">
        {(weekdayDictStat.isLoading || unitDictStat.isLoading || recipeTypeDictStat.isLoading || salesAreaDictStat.isLoading) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10">
            <LoadingSpinner />
          </div>
        )}
        {messageVisible !== VISIBLE_TYPE.HIDDEN && <Toast />}
        <Header />
        <Routes>
          <Route path="/" element={
            <LoginPageProvider>
              <LoginPage />
            </LoginPageProvider>
          } />
          <Route path="/resetPassword" element={
            <ResetPasswordPageProvider>
              <ResetPasswordPage />
            </ResetPasswordPageProvider>
          } />
          <Route path="/signUp" element={
            <SignUpPageProvider>
              <SignUpPage />
            </SignUpPageProvider>
          } />
          <Route path="/home" element={
            <HomePageProvider>
              <HomePage />
            </HomePageProvider>
          } />
          <Route path="/buy" element={
            <BuyPageProvider>
              <BuyPage />
            </BuyPageProvider>
          } />
          <Route path="/menuPlan" element={
            <MenuPlanPageProvider>
              <MenuPlanPage />
            </MenuPlanPageProvider>
          } />
          <Route path="/recipe" element={
            <RecipePageProvider>
              <RecipePage />
            </RecipePageProvider>
          } />
          <Route path="/ingred" element={
            <IngredPageProvider>
              <IngredPage />
            </IngredPageProvider>
          } />
          <Route path="/userConfig" element={
            <UserSettingPageProvider>
              <UserSettingPage />
            </UserSettingPageProvider>
          } />
          <Route path="/groupConfig" element={
            <GroupSettingPageProvider>
              <GroupSettingPage />
            </GroupSettingPageProvider>
          } />
          <Route path="/activate" element={
            <ActivationPageProvider>
              <ActivationPage />
            </ActivationPageProvider>
          } />
          <Route path="/joinGroup" element={
            <JoinGroupPageProvider>
              <JoinGroupPage />
            </JoinGroupPageProvider>
          } />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        {isLoggedIn && <Footer />}
      </div>
    </BrowserRouter>
  )
}



