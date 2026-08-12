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

      // ---------- SERVIDOR: Dashboard Principal (Início) ----------
      {
        name: 'dashboard-servidor',
        path: '/servidor/dashboard',
        component: () => import('pages/servidor/DashboardServidor.vue'),
        meta: { requiredLogin: true },
      },

      // ---------- SERVIDOR: Notícias UniVC ----------
      {
        name: 'noticias',
        path: '/servidor/noticias',
        component: () => import('pages/servidor/Noticias.vue'),
        meta: { requiredLogin: true },
      },

      // ---------- SERVIDOR: Norminha IA ----------
      {
        name: 'norminha',
        path: '/servidor/norminha',
        component: () => import('pages/servidor/Norminha.vue'),
        meta: { requiredLogin: true },
      },

      // ---------- SERVIDOR: Catálogo de Cursos ----------
      // ---------- SERVIDOR: Trilhas de Aprendizagem ----------
      {
        name: 'trilhas-aprendizagem',
        path: '/servidor/trilhas',
        component: () => import('pages/servidor/TrilhasAprendizagem.vue'),
        meta: { requiredLogin: true },
      },

      // ---------- SERVIDOR: Cursos ----------
      {
        name: 'catalogo-cursos',
        path: '/servidor/cursos',
        component: () => import('pages/servidor/CatalogoCursos.vue'),
        meta: { requiredLogin: true },
      },

      // ---------- SERVIDOR: Eventos e Palestras ----------
      {
        name: 'eventos-palestras',
        path: '/servidor/eventos',
        component: () => import('pages/servidor/EventosPalestras.vue'),
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

      // ---------- SERVIDOR: Biblioteca -----------------
      {
        name: 'biblioteca',
        path: '/servidor/biblioteca',
        component: () => import('pages/servidor/Biblioteca.vue'),
        meta: { requiredLogin: true },
      },

      // ---------- SERVIDOR: Fórum Comunitário ----------
      {
        name: 'forum',
        path: '/servidor/forum',
        component: () => import('pages/servidor/Forum.vue'),
        meta: { requiredLogin: true },
      },

      // ---------- SERVIDOR: Passaporte Digital -------
      {
        name: 'passaporte-digital',
        path: '/servidor/passaporte',
        component: () => import('pages/servidor/PassaporteDigital.vue'),
        meta: { requiredLogin: true },
      },

      // ---------- COMUM: Perfil do Servidor ----------
      {
        name: 'perfil',
        path: '/perfil',
        component: () => import('pages/servidor/PerfilServidor.vue'),
        meta: { requiredLogin: true },
      },

      // ---------- GESTOR/: Dashboard Analytics ----------
      {
        name: 'dashboard-gestor',
        path: '/gestor/dashboard',
        component: () => import('pages/gestor/DashboardGestor.vue'),
        meta: { requiredLogin: true, requiredGestorLevel: true },
      },
      // ---------- ADMIN: Painel de Administração ----------
      {
        name: 'dashboard-admin',
        path: '/admin/dashboard',
        component: () => import('pages/admin/Dashboard.vue'),
        meta: { requiredLogin: true, requiredAdminLevel: true },
      },
      // ---------- ADMIN: Gestão de Cursos e Conteúdos ----------
      {
        name: 'admin-cursos',
        path: '/admin/cursos',
        component: () => import('pages/admin/courses/AdminCursosList.vue'),
        meta: { requiredLogin: true, requiredGestorLevel: true },
      },
      {
        name: 'admin-curso-conteudo',
        path: '/admin/cursos/:id/conteudo',
        component: () => import('pages/admin/courses/GerenciadorConteudo.vue'),
        meta: { requiredLogin: true, requiredGestorLevel: true },
      },
      // ---------- ADMIN: Gestão de Servidores ----------
      {
        name: 'admin-usuarios',
        path: '/admin/usuarios',
        component: () => import('pages/admin/users/ListUsers.vue'),
        meta: { requiredLogin: true, requiredAdminLevel: true },
      },
      {
        name: 'admin-usuarios-novo',
        path: '/admin/usuarios/novo',
        component: () => import('pages/admin/users/UserActionsForm.vue'),
        meta: { requiredLogin: true, requiredAdminLevel: true },
      },
      {
        name: 'admin-usuarios-editar',
        path: '/admin/usuarios/editar/:id',
        component: () => import('pages/admin/users/UserActionsForm.vue'),
        meta: { requiredLogin: true, requiredAdminLevel: true },
      {
        name: 'admin-biblioteca',
        path: '/admin/biblioteca',
        component: () => import('pages/admin/library/AdminBibliotecaList.vue'),
        meta: { requiredLogin: true, requiredGestorLevel: true },
      },
      {
        name: 'admin-certificados',
        path: '/admin/certificados',
        component: () => import('pages/admin/certificates/AdminGestaoCertificados.vue'),
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
]

export default routes
