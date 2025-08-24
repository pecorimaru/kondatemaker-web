import React, { useEffect, useRef, useState } from "react";
import { useApp, useEventHandler } from "@/hooks";
import { LoadingSpinner } from "@/components/ui";
import { HeaderMenu } from "./HeaderMenu";
import { VISIBLE_TYPE } from "@/constants";
import { switchVisibleType } from "@/utils";

export const Header: React.FC = () => {
  const {
    loginUser, 
    loginUserStat, 
    currentGroup, 
    currentGroupStat, 
    isLoggedIn, 
    messageVisible, 
    setMessageVisible,
  } = useApp();

  const [currentDate, setCurrentDate] = useState("");
  const [menuListVisible, setMenuListVisible] = useState<VISIBLE_TYPE>(VISIBLE_TYPE.HIDDEN);
  // const [menuIconHover, setMenuIconHover] = useState<boolean>(false);
  // const [menuListHover, setMenuListHover] = useState<boolean>(false);
  const [dispUserGroupFlg, setDispUserGroupFlg] = useState<boolean>(true);
  const headerMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
    setCurrentDate(formattedDate);
  }, []);

  const handleClickOutside = (e: Event) => {
    if (headerMenuRef.current && !headerMenuRef.current.contains(e.target as Node)) {
      setMenuListVisible(VISIBLE_TYPE.CLOSE);
    }
  };

  useEventHandler("mousedown", handleClickOutside);
  
  // const handleMouseEnter = () => {
  //   if (!isOpeningForm) {
  //     setMenuListVisible(VISIBLE_TYPE.OPEN);
  //     setMenuIconHover(true);
  //   }
  // };

  // const handleMouseLeave = () => {
  //   setMenuIconHover(false);
  //   if (!menuListHover) setMenuListVisible(VISIBLE_TYPE.CLOSE);
  // };  

  return (
    <>
      <div className="fixed flex items-center justify-center w-full z-20 bg-blue-200 shadow-lg h-14">
        <div className="flex justify-center absolute w-full">
          <div>
            <div 
              className="text-center select-none cursor-default"
              onClick={() => setDispUserGroupFlg(!dispUserGroupFlg)}
            >
              {isLoggedIn && 
                dispUserGroupFlg ?
                  (!loginUserStat.isLoading ? loginUser?.userNm : <LoadingSpinner />)
                :
                  (!currentGroupStat.isLoading ? currentGroup?.groupNm : <LoadingSpinner />)
              }
            </div>
            <div className="text-center">{currentDate}</div>
          </div>
        </div>
        
        <div 
          className="absolute text-gray-500 py-3.5 right-16 z-0 cursor-pointer rounded-sm transition duration-300 hover:text-gray-400"
          onClick={() => setMessageVisible(switchVisibleType(messageVisible))}
        >
          <i className="text-xl fa-solid fa-message" />
        </div>
        
        {isLoggedIn &&
          <div
            className={`absolute text-gray-500 py-3 px-5 right-0 z-0 rounded-sm transition duration-300 hover:text-gray-400`}
            // onMouseEnter={handleMouseEnter}
            // onMouseLeave={handleMouseLeave}
            onClick={() => setMenuListVisible(switchVisibleType(menuListVisible))}
            onTouchStart={() => setMenuListVisible(switchVisibleType(menuListVisible))}
          >
            <i className="text-2xl fa-solid fa-bars" />
          </div>
        }
        
        {/* {messageVisible !== VISIBLE_TYPE.HIDDEN && <Toast />} */}
      </div>
      
      {menuListVisible !== VISIBLE_TYPE.HIDDEN && 
        <HeaderMenu 
          // menuIconHover={menuIconHover} 
          menuListVisible={menuListVisible} 
          setMenuListVisible={setMenuListVisible} 
          // setMenuListHover={setMenuListHover}
          headerMenuRef={headerMenuRef}
        />
      }
    </>
  );
};