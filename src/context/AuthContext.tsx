"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { me as fetchMe, logout as apiLogout } from "@/functions/api/auth";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: async () => {},
  refreshUser: async () => {},
});

const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  const loadUser = useCallback(async () => {
    const token = getCookie("user_auth_token");
    
    // We try to fetch the user if we see the token OR if we don't know yet (on mount)
    // to account for HttpOnly cookies.
    try {
      const data = await fetchMe();
      console.log("AuthContext: fetchMe response", data);
      
      const userObj = data?.user || (data?.id ? data : data?.data?.user || null);
      
      if (userObj) {
        setUser(userObj);
      } else {
        setUser(null);
      }
    } catch (err) {
      if ((err as any)?.status !== 401) {
        console.error("AuthContext: loadUser failed", err);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (loading) return;

    const isProtectedRoute = pathname?.startsWith("/dashboard");
    const isAuthRoute = pathname === "/login" || pathname === "/register" || pathname === "/signup";

    console.log("AuthContext: Routing Check", { pathname, user: !!user, loading, isProtectedRoute, isAuthRoute });

    if (!user && isProtectedRoute) {
      console.log("AuthContext: Redirecting to /login");
      router.push("/login");
    } else if (user && isAuthRoute) {
      console.log("AuthContext: Redirecting to /dashboard");
      router.push("/dashboard");
    }
  }, [user, loading, pathname, router]);

  const login = (userData: User) => {
    setUser(userData);
    router.push("/dashboard");
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser: loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
