// src/utils/authManager.ts
export class AuthManager {
    private static loginStateSetters: Array<(value: boolean | null) => void> = [];
  
    static subscribe(setter: (value: boolean | null) => void) {
      this.loginStateSetters.push(setter);
    }
  
    static unsubscribe(setter: (value: boolean | null) => void) {
      this.loginStateSetters = this.loginStateSetters.filter(s => s !== setter);
    }
  
    static updateLoginState(isLoggedIn: boolean | null) {
      localStorage.setItem("isLoggedIn", String(isLoggedIn));
      this.loginStateSetters.forEach(setter => setter(isLoggedIn));
    }
  
    static clearAuthState() {
        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");
        this.loginStateSetters.forEach(setter => setter(false));
      }

    static logout() {
      this.clearAuthState();
      if (window.location.pathname !== "/") {
          window.location.href = '/';
      }
    }
  }
