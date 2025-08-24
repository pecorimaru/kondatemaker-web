import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { createRoot } from 'react-dom/client';
// import { reportWebVitals } from './reportWebVitals';

import '@/css/output.css';
import '@/css/index.css';

import { App } from './app/App';
import { AppProvider } from './providers';

const rootElement = document.getElementById("root");
if (rootElement) {  // rootElementがnullでないことを確認
  const root = createRoot(rootElement);

  // 環境変数でStrictModeを制御
  const isStrictModeEnabled = process.env.REACT_APP_STRICT_MODE === 'true';
  
  const AppComponent = (
    <GoogleOAuthProvider clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}>
      <AppProvider>
        <App />
      </AppProvider>
    </GoogleOAuthProvider>
  );

  root.render(
    isStrictModeEnabled ? (
      <React.StrictMode>
        {AppComponent}
      </React.StrictMode>
    ) : (
      AppComponent
    )
  );

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  // reportWebVitals();
};