import { boot } from 'quasar/wrappers';
import axios from 'axios';
import { Notify } from 'quasar';
import { setServerDetectedIp } from 'src/utils/media';

/**
 * Resolve dinamicamente a URL da API backend baseado no host pelo qual o frontend foi acessado.
 * Se o frontend for acessado por http://192.168.X.X:8080, o backend conectará automaticamente em http://192.168.X.X:3001.
 */
function getDynamicApiBaseUrl() {
  const envUrl = process.env.API_BASE_URL || 'http://localhost:3006/';

  if (typeof window !== 'undefined' && window.location) {
    try {
      const parsed = new URL(envUrl);
      const protocol = window.location.protocol || parsed.protocol;
      const hostname = window.location.hostname || parsed.hostname;
      const port = parsed.port ? `:${parsed.port}` : '';
      const pathname = parsed.pathname.endsWith('/') ? parsed.pathname : `${parsed.pathname}/`;
      return `${protocol}//${hostname}${port}${pathname}`;
    } catch {
      return envUrl;
    }
  }
  return envUrl;
}

// Instância Axios com base URL dinâmica da API AVA UniVC
const api = axios.create({ baseURL: getDynamicApiBaseUrl() });

export default boot(async ({ app, router }) => {
  // Inicialização assíncrona: detecta IP dinâmico da máquina para QR Codes locais
  try {
    api
      .get('/auth/server-info')
      .then((res) => {
        if (res.data?.localIp) {
          setServerDetectedIp(res.data.localIp);
        }
      })
      .catch((err) => {
        console.debug('IP dinâmico não obtido no bootstrap:', err?.message);
      });
  } catch (err) {
    console.debug('Falha ao inicializar detecção de IP:', err);
  }

  // Interceptor de Request: Injeta token JWT automaticamente
  api.interceptors.request.use(
    (config) => {
      const token = window.sessionStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Interceptor de Response: Tratamento global de erros
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;

      if (status === 401) {
        // Token expirado ou inválido - redireciona ao login
        window.sessionStorage.clear();
        router.push('/login');
        Notify.create({
          color: 'negative',
          icon: 'lock',
          position: 'top',
          timeout: 3000,
          message: 'Sessão expirada. Faça login novamente.',
        });
      } else if (status === 403) {
        Notify.create({
          color: 'warning',
          icon: 'warning',
          position: 'top',
          timeout: 3000,
          message: 'Você não tem permissão para acessar este recurso.',
        });
      } else if (status >= 500) {
        Notify.create({
          color: 'negative',
          icon: 'error',
          position: 'top',
          timeout: 4000,
          message: 'Erro interno do servidor. Tente novamente mais tarde.',
        });
      }

      return Promise.reject(error);
    }
  );

  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
