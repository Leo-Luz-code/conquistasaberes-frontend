// =============================================================================
// Conquista Saberes - Router com Navigation Guards RBAC
// Atende Dor #9: SSO Municipal
// Atende Dor #11: Verificação de aceite LGPD antes de navegar
// =============================================================================
import { route } from 'quasar/wrappers';
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router';
import routes from './routes';
import { useAuthStore } from 'src/stores/authStore';

export default route(function () {
  const authStore = useAuthStore();

  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async (to, from, next) => {
    try {
      // Rotas públicas: sem restrição
      if (to.meta.public) {
        next();
        return;
      }

      // Verificar autenticação
      if (to.meta.requiredLogin && !authStore.isAuthenticated) {
        next({ name: 'login', query: { to: to.fullPath } });
        return;
      }

      // Verificar aceite LGPD (exceto na própria página de LGPD)
      if (
        authStore.isAuthenticated &&
        authStore.user &&
        !authStore.lgpdAccepted &&
        to.name !== 'lgpd' &&
        to.name !== 'login'
      ) {
        next({ name: 'lgpd' });
        return;
      }

      // Verificar nível Gestor/Admin
      if (to.meta.requiredGestorLevel && !authStore.isGestorOrAdmin) {
        next({ name: 'error' });
        return;
      }

      next();
    } catch (error) {
      console.error('Erro no router guard:', error);
      next({ name: 'login' });
    }
  });

  return Router;
});
