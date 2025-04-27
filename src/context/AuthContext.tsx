"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface User {
  email: string;
  name: string;
  id: number;
  role: "ADMIN" | "SPORTSMAN";
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decoded = jwtDecode<User>(token);
        setUser(decoded);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error decodificando token:", error);
        logout();
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const error = new Error("Error en el inicio de sesión") as any;
        error.status = response.status;
        throw error;
      }

      const data = await response.json();
      const decoded = jwtDecode<User>(data.access_token);

      Cookies.set("token", data.access_token, {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      setUser(decoded);
      setIsAuthenticated(true);
      router.push("/");
    } catch (error) {
      console.error("Error de login:", error);
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}

// Hook de utilidad para protección de rutas
export function useRequireAuth(allowedRoles?: ("ADMIN" | "SPORTSMAN")[]) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.push("/"); // Redirige al home si no tiene el rol necesario
    }
  }, [isAuthenticated, user, router, allowedRoles]);

  return { isAuthenticated, user };
}
