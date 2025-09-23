import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const apiAuth = axios.create({
  baseURL: "https://localhost:7182/",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // <- envía/recibe cookies automáticamente
});

// === Interceptor de respuesta: refresh en 401, reintento UNA vez ===
let isRefreshing = false;
let queued: Array<(tokenRefreshed: boolean) => void> = [];

function queue(cb: (ok: boolean) => void) { queued.push(cb); }
function flush(ok: boolean) { queued.splice(0).forEach(cb => cb(ok)); }

apiAuth.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean });

    // Si no es 401 o ya reintentamos, o es el propio refresh/login/register => falla normal
    const status = error.response?.status;
    const url = (original?.url ?? "").toLowerCase();
    if (status !== 401 || original?._retry || /\/auth\/(login|register|refresh)/.test(url)) {
      return Promise.reject(error);
    }

    // Marcar para no buclear
    original._retry = true;

    // Evitar paralelismo de refresh
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue((ok) => {
          if (!ok) return reject(error);
          apiAuth.request(original).then(resolve).catch(reject);
        });
      });
    }

    isRefreshing = true;
    try {
      await apiAuth.post("/auth/refresh");        // usa las cookies
      flush(true);
      return apiAuth.request(original);           // reintenta
    } catch (e) {
      flush(false);
      // Si el refresh falla, redirigir al login
      window.location.href = "/";                 // ajusta si tu login está en otra ruta
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiAuth;
