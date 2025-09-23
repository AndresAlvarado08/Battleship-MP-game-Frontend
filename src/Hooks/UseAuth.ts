import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { validate, getUser, type UserResponse } from "../Auth/Services/authService";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserResponse | null>(null);
  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
    try {
      const v = await validate();
      if (v.valid) {
        const u = await getUser();
        setUser(u);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    const id = setInterval(checkAuth, 30_000); // refresco periódico
    return () => clearInterval(id);
  }, [checkAuth]);

  const logout = async () => {
    try {
      await fetch("https://localhost:7182/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {}
    setIsAuthenticated(false);
    setUser(null);
    navigate({ to: "/" });
  };

  return {
    isAuthenticated,
    isLoading,
    user,              // { username }
    refreshAuth: checkAuth,
    logout,
  };
};
