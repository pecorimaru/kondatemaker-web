

export interface ActivationPageContextTypes {
  status: "loading" | "ok" | "error";
  setStatus: (status: "loading" | "ok" | "error") => void;
  message: string;
  setMessage: (message: string) => void;
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  token: string | null;
  activateUser: () => Promise<void>;
  navigateToLogin: () => void;
} 