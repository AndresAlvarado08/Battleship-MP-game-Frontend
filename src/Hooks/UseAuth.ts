import { useEffect, useState } from 'react';
import { cookieUtils } from '../Utils/Cookies';
import { useNavigate } from '@tanstack/react-router';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const hasToken = cookieUtils.hasToken();
      setIsAuthenticated(hasToken);
      setIsLoading(false);
      
      console.log('🔐 Auth Check:', { hasToken, token: cookieUtils.getToken() });
      
      // Si no hay token y estamos en una ruta protegida, redirigir al login
      const currentPath = window.location.pathname;
      const protectedRoutes = ['/lobby', '/sala'];
      const isProtectedRoute = protectedRoutes.some(route => currentPath.startsWith(route));
      
      if (!hasToken && isProtectedRoute) {
        console.log('🚫 No token found, redirecting to login...');
        navigate({ to: '/' });
      }
    };

    checkAuth();
    
    // Re-check cada 30 segundos
    const interval = setInterval(checkAuth, 30000);
    
    return () => clearInterval(interval);
  }, [navigate]);

  const logout = () => {
    cookieUtils.removeToken();
    setIsAuthenticated(false);
    navigate({ to: '/' });
    console.log('🚪 User logged out');
  };

  return {
    isAuthenticated,
    isLoading,
    hasToken: cookieUtils.hasToken(),
    logout,
  };
};