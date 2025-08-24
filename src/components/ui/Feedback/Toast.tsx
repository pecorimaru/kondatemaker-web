import React, { useEffect, useRef } from 'react';
import { useApp } from '@/hooks';
import { MESSAGE_TYPE, VISIBLE_TYPE } from '@/constants';

export const Toast: React.FC = () => {
  const { messageContent, messageType, messageVisible, setMessageVisible } = useApp();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (messageVisible) {
      timerRef.current = setTimeout(() => {
        setMessageVisible(VISIBLE_TYPE.CLOSE);
      }, 3000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      } 
    };

  }, [messageVisible, setMessageVisible]);


  const handleMouseEnter = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const handleMouseLeave = () => {
    // クローズボタンによってマウスが離れた場合は再カウントしない
    if (messageVisible) {
      timerRef.current = setTimeout(() => {
        setMessageVisible(VISIBLE_TYPE.CLOSE);
      }, 3000);
    }
  };

  const handleClose = () => {
    setMessageVisible(VISIBLE_TYPE.CLOSE);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  return (
    <div className={`
      fixed flex justify-center z-30 w-96 left-1/2 -translate-x-1/2 -top-5 
      ${messageVisible !== VISIBLE_TYPE.OPEN && "pointer-events-none"}
    `}>
      <div 
        className={`
          bg-white h-24 max-w-96 w-full mt-8 rounded-sm shadow-lg transform -translate-x-1/2 transition-all duration-300
          opacity-90 hover:opacity-100
          ${messageVisible === VISIBLE_TYPE.OPEN ? 'animate-slideIn' : 'animate-slideOut'}
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex h-full opacity-100">
          <div className="pt-2  mx-2 text-lg">
              {messageType === MESSAGE_TYPE.INFO ? 
                <i className="text-green-500 fa-solid fa-circle-check" />
              : messageType === MESSAGE_TYPE.WARN ?
                <i className="text-amber-500 fa-solid fa-circle-exclamation"></i>
              : messageType === MESSAGE_TYPE.ERROR &&
                <i className="text-red-500 fa-solid fa-circle-xmark" />
              }
          </div>  
          <div className="pt-2.5 w-full">
            <span>
              {messageContent?.includes("\n") ?
                <>
                  {messageContent.split("\n").map((line, index, arr) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < arr.length - 1 && <br />} {/* 改行がある場合のみ <br /> */}
                    </React.Fragment>
                  ))}
                </>
                :
                <>{messageContent}</>
              }
            </span>
          </div>
          <div className="mt-2 mx-2 text-lg text-slate-700 opacity-50 hover:opacity-100 hover:cursor-pointer">
            <i 
              className="fa-solid fa-circle-xmark"
              onClick={() => handleClose()}
            />
          </div>  
        </div>
      </div>
    {/* </div> */}
    </div>
  )
}