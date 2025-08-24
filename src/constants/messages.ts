// メッセージ関連の定数
export const MESSAGE = {
  MISSING_REQUEST: "リクエスト処理に失敗しました。ネットワーク接続を確認してください。",
  PASSWORD_NOT_EQUALS: "パスワードが一致しません。\n入力内容を確認してください。",
  TIMEOUT: "処理がタイムアウトしました。"
} as const;

// 後方互換性のため
export const MSG_MISSING_REQUEST = MESSAGE.MISSING_REQUEST;

export const MESSAGE_TYPE = {
  INFO: "1",
  WARN: "2",
  ERROR: "3",
} as const; 