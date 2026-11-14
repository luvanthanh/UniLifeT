import { createContext, useContext, useMemo, useState } from "react";
import { api, getRole, getToken, setToken as persistToken } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(getToken());
  const role = getRole(token);

  const value = useMemo(() => ({
    token,
    role,
    async login(username, password) {
      const result = await api.login(username, password);
      if (!result?.checkAuthenticated || !result.token) throw new Error("Thông tin đăng nhập không hợp lệ.");
      persistToken(result.token);
      setTokenState(result.token);
      return getRole(result.token);
    },
    logout() {
      persistToken("");
      setTokenState("");
    }
  }), [token, role]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
