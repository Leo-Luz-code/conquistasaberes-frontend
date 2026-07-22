import { boot } from 'quasar/wrappers';
import axios from 'axios';
import { Notify } from 'quasar';

// Instância Axios com base URL da API Conquista Saberes
const api = axios.create({ baseURL: process.env.API_BASE_URL });

export default boot(({ app, router }) => {
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
