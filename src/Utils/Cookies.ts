import Cookies from 'js-cookie';

// Utilidades para manejar cookies (tokens)

export const cookieUtils = {
  // Obtener token (lee la cookie que setea el backend)
  getToken: (): string | undefined => {
    const token = Cookies.get('accessToken');
    console.log('Token:', token ? `${token.substring(0, 10)}...` : 'Nu hay token');
    return token;
  },

  // Eliminar token (para logout)
  removeToken: () => {
    console.log('Removing tokens...');
    Cookies.remove('accessToken', { path: '/', domain: window.location.hostname });
    Cookies.remove('refreshToken', { path: '/', domain: window.location.hostname });
    
    // También intentar sin especificar dominio
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    
    console.log('🍪 Tokens removed. Remaining cookies:', document.cookie);
  },

  // Verificar si existe token
  hasToken: (): boolean => {
    const hasToken = !!Cookies.get('accessToken');
    console.log('🔍 Has token check:', hasToken);
    return hasToken;
  },

  // Debug: Mostrar todas las cookies
  debugCookies: () => {
    console.log('🍪 All cookies:', {
      accessToken: Cookies.get('accessToken'),
      refreshToken: Cookies.get('refreshToken'),
      allCookies: document.cookie
    });
  }
}