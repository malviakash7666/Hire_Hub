import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getMe, logoutUser } from "../api/auth.api";
import { AuthContext, type User } from "./AuthContextType";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const logout = async () => {
    try {
      await logoutUser(); // ✅ backend cookies clear karega
    } catch {
      // ignore error
    } finally {
      setUser(null); // ✅ frontend state clear
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}