import axios from "axios";
import { cookieUtils } from "../Utils/Cookies";

const apiAuth = axios.create({
  baseURL: "https://localhost:7182/",
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // Las cookies se envían automáticamente
});

// Interceptor para agregar el token a todas las requests
apiAuth.interceptors.request.use(
  (config) => {
    const token = cookieUtils.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Debug: Mostrar la URL y si hay token
    console.log(`🔗 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      hasToken: !!token,
      headers: config.headers
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

apiAuth.interceptors.response.use(
  (response) => {
    // Debug: Log successful responses
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      data: response.data
    });
    return response;
  },
  async error => {
    const originalRequest = error.config
    const currentPath = window.location.pathname;
    const publicRoutes = ['/', '/Login', '/Register'];

    // Debug: Log error responses
    console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      hasToken: !!cookieUtils.getToken()
    });

    // No manejar errores 401 en rutas públicas
    if (publicRoutes.includes(currentPath)) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh')
    ) {
      originalRequest._retry = true

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then(() => apiAuth(originalRequest))
          .catch(err => Promise.reject(err))
      }

      isRefreshing = true

      try {
        // Solo llama al refresh, las cookies se actualizan automáticamente
        await apiAuth.post('/auth/refresh')
        processQueue(null)
        return apiAuth(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        cookieUtils.removeToken()
        window.location.href = '/Login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)


export default apiAuth;