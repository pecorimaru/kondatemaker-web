import React from 'react';

// 内部ライブラリ - フック
import { useJoinGroupPage } from '@/hooks';

// 内部ライブラリ - コンポーネント
import { LoadingSpinner } from '@/components/ui';

export const JoinGroupPage = () => {
  const {
    status,
    message,
    navigateToLogin,
  } = useJoinGroupPage();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white shadow-lg rounded-md">
        <div>
          {status === "loading" && 
            <>
              <LoadingSpinner />
              <p className="mt-4">{message}</p>
            </>
          }
          {status === "ok" && 
          <>
            {message?.includes("\n") ?
              <>
                {message.split("\n").map((line, index, arr) => (
                  <React.Fragment key={index}>
                    {line}
                    {index < arr.length - 1 && <br />} {/* 改行がある場合のみ <br /> */}
                  </React.Fragment>
                ))}
              </>
              :
              <>{message}</>
            }
            <div className="mt-4 text-center">
              <span 
                className="login-link-text-base"
                onClick={navigateToLogin}
              >ログイン画面に移動する</span>
            </div>
          </>
          }          
          {status === "error" && 
          <>
            {message?.includes("\n") ?
              <>
                {message.split("\n").map((line, index, arr) => (
                  <React.Fragment key={index}>
                    {line}
                    {index < arr.length - 1 && <br />} {/* 改行がある場合のみ <br /> */}
                  </React.Fragment>
                ))}
              </>
              :
              <>{message}</>
            }
            <div className="mt-4 text-center">
              <span 
                className="login-link-text-base"
                onClick={navigateToLogin}
              >ログイン画面に移動する</span>
            </div>
          </>
          }
        </div>
      </div>
    </div>
  );
}
