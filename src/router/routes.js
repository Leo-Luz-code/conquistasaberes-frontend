// =============================================================================
// Conquista Saberes - Rotas do Sistema AVA Municipal
// Fluxo: Login SSO → LGPD → Dashboard → Cursos → Aula → Quiz → Certificado
// =============================================================================
const routes = [
  // ===================== ROTA PÚBLICA: LOGIN SSO =====================
  {
    name: 'login',
    path: '/login',
    component: () => import('pages/Login.vue'),
    meta: { public: true },
  },

  // ===================== ROTA PÚBLICA: VALIDAR CERTIFICADO =====================
  {
    name: 'validar-certificado',
    path: '/validar-certificado',
    component: () => import('pages/public/ValidarCertificado.vue'),
    meta: { public: true },
  },

  // ===================== ROTA LGPD: ACEITE DE TERMOS =====================
  {
    name: 'lgpd',
    path: '/lgpd',
    component: () => import('pages/LgpdTerms.vue'),
    meta: { requiredLogin: true },
  },

  // ===================== ROTAS AUTENTICADAS (MAINLAYOUT) =====================
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // Redirect inteligente baseado no role do usuário
      {
        path: '',
        component: () => import('pages/RedirectPage.vue'),
        meta: { requiredLogin: true },
      },

      // ---------- SERVIDOR: Dashboard Principal ----------
      {
        name: 'dashboard-servidor',
        path: '/servidor/dashboard',
        component: () => import('pages/servidor/DashboardServidor.vue'),
        meta: { requiredLogin: true },
      },

      // ---------- SERVIDOR: Catálogo de Cursos ----------
      {
        name: 'catalogo-cursos',
        path: '/servidor/cursos',
        component: () => import('pages/servidor/CatalogoCursos.vue'),
        meta: { requiredLogin: true },
      },

      // ---------- SERVIDOR: Player do Curso (AVA) ----------
      {
        name: 'curso-player',
        path: '/servidor/cursos/:id',
        component: () => import('pages/servidor/CursoPlayer.vue'),
        meta: { requiredLogin: true },
      },

      // ---------- SERVIDOR: Meus Certificados ----------
      {
        name: 'meus-certificados',
        path: '/servidor/certificados',
        component: () => import('pages/servidor/MeusCertificados.vue'),
        meta: { requiredLogin: true },
      },

      // ---------- SERVIDOR: Ranking / Leaderboard ----------
      {
        name: 'ranking',
        path: '/servidor/ranking',
        component: () => import('pages/servidor/Ranking.vue'),
        meta: { requiredLogin: true },
      },

      // ---------- SERVIDOR: Fórum Comunitário ----------
      {
        name: 'forum',
        path: '/servidor/forum',
        component: () => import('pages/servidor/Forum.vue'),
        meta: { requiredLogin: true },
      },

      // ---------- COMUM: Perfil do Servidor ----------
      {
        name: 'perfil',
        path: '/perfil',
        component: () => import('pages/servidor/PerfilServidor.vue'),
        meta: { requiredLogin: true },
      },

      // ---------- GESTOR/ADMIN: Dashboard Analytics ----------
      {
        name: 'dashboard-gestor',
        path: '/gestor/dashboard',
        component: () => import('pages/gestor/DashboardGestor.vue'),
        meta: { requiredLogin: true, requiredGestorLevel: true },
      },
    ],
  },

  // ===================== ERRO 404 =====================
  {
    name: 'error',
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
