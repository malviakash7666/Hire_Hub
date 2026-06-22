import { createContext } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "client" | "writer";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
export type { User, AuthContextType };
