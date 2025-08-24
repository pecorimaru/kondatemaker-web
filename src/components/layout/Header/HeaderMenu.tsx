import React from 'react';
import { useNavigate } from "react-router-dom";
import { apiClient } from '@/utils/axiosClient';
import { useApp } from '@/hooks';
import { HeaderMenuRow } from './HeaderMenuRow';
import { MESSAGE, MESSAGE_TYPE, VISIBLE_TYPE } from '@/constants';
import { AuthManager } from '@/utils/authManager';

interface HeaderMenuProps {
  // menuIconHover: boolean;
  menuListVisible: VISIBLE_TYPE;
  setMenuListVisible: (visible: VISIBLE_TYPE) => void;
  // setMenuListHover: (hover: boolean) => void;
  headerMenuRef: React.RefObject<HTMLDivElement | null>;
}

export const HeaderMenu: React.FC<HeaderMenuProps> = ({ 
  // menuIconHover, 
  menuListVisible, 
  setMenuListVisible, 
  // setMenuListHover,
  headerMenuRef,
}) => {
  const { isLoggedIn, showMessage, clearMessage } = useApp();
  const navigate = useNavigate();

  const handleMenuRow = (url: string) => {
    setMenuListVisible(VISIBLE_TYPE.CLOSE);
    navigate(url);
  };

  const handleLogout = async () => {
    clearMessage();
    // localStorage.removeItem("token");
    // localStorage.removeItem("isLoggedIn");
    // setIsLoggedIn(false);
    // window.location.href = '/';
    await apiClient.post(`${process.env.REACT_APP_API_CLIENT}/setting/logout`)
      .catch(error => {
        showMessage(
          error?.response?.data?.detail || 
          error?._messageTimeout || 
          MESSAGE.MISSING_REQUEST, 
          MESSAGE_TYPE.ERROR
        );
      })
      .finally(() => {
        AuthManager.logout();
        setMenuListVisible(VISIBLE_TYPE.CLOSE);
        // window.location.href = '/';
      });
  };

  // 他のタブでログアウトを検知
  window.addEventListener("storage", (event) => {
    console.log("catch logout event");
    if (event.key === "isLoggedIn" && !isLoggedIn) {
      AuthManager.logout();
      // setMenuListVisible(VISIBLE_TYPE.CLOSE);
      // window.location.href = '/';
    }
  });

  return (
    <div 
      className={`
        header-menu fixed max-w-48 w-2/3 right-0 z-10 shadow-lg rounded-sm
        ${menuListVisible === VISIBLE_TYPE.OPEN ? 'animate-slideIn' : 'animate-slideOut'}
      `}
      ref={headerMenuRef}
    >
      <ul className="mt-14">
        <HeaderMenuRow 
          textContent="ユーザー設定" 
          icon="fa-solid fa-user" 
          onClick={() => handleMenuRow("/userConfig")} 
        />
        <HeaderMenuRow 
          textContent="グループ設定" 
          icon="fa-solid fa-users" 
          onClick={() => handleMenuRow("/groupConfig")} 
        />
        <HeaderMenuRow 
          textContent="ログアウト" 
          icon="fa-solid fa-right-from-bracket" 
          onClick={() => handleLogout()}
        />
      </ul>
    </div>
  );
}; 