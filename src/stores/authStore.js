// =============================================================================
// Conquista Saberes - Auth Store (Pinia)
// Atende Dor #9: Autenticação SSO Municipal por CPF/Matrícula
// Atende Dor #11: Gestão de consentimento LGPD
// =============================================================================
import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { Notify, Loading, QSpinnerBall } from 'quasar';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: '',
    isAuthenticated: false,
  }),

  getters: {
    // Getters para informações do usuário autenticado
    userName: (state) => state.user?.nome || '',
    userRole: (state) => state.user?.role || 'SERVIDOR',
    userCargo: (state) => state.user?.cargo || '',
    userSecretaria: (state) => state.user?.secretaria?.sigla || '',
    userXp: (state) => state.user?.xpPoints || 0,
    userLevel: (state) => state.user?.level || 1,
    lgpdAccepted: (state) => state.user?.lgpdAccepted || false,
    userId: (state) => state.user?.id || '',

    // Verificações de Role (RBAC)
    isAdmin: (state) => state.user?.role === 'ADMIN_RH_CETI',
    isGestor: (state) => state.user?.role === 'GESTOR_SECRETARIA',
    isServidor: (state) => state.user?.role === 'SERVIDOR',
    isGestorOrAdmin: (state) =>
      state.user?.role === 'ADMIN_RH_CETI' || state.user?.role === 'GESTOR_SECRETARIA',

    // Nome curto para o header
    firstName: (state) => {
      if (!state.user?.nome) return 'Usuário';
      return state.user.nome.trim().split(' ')[0];
    },

    // Inicial para o avatar
    userInitial: (state) => {
      if (!state.user?.nome) return 'U';
      return state.user.nome.charAt(0).toUpperCase();
    },

    // Label amigável para o role
    roleLabel: (state) => {
      const roles = {
        SERVIDOR: 'Servidor Municipal',
        GESTOR_SECRETARIA: 'Gestor de Secretaria',
        ADMIN_RH_CETI: 'Administrador CETI',
      };
      return roles[state.user?.role] || 'Servidor';
    },
  },

  actions: {
    // =========================================================================
    // LOGIN SSO MUNICIPAL (CPF/Matrícula + Senha)
    // =========================================================================
    async doLogin(payload) {
      Loading.show({
        message: 'Autenticando no portal SSO Municipal...',
        delay: 300,
        spinner: QSpinnerBall,
        spinnerColor: 'blue-10',
        spinnerSize: 140,
      });

      try {
        // A API backend espera { identifier, senha }
        const loginData = {
          identifier: payload.identifier || payload.login,
          senha: payload.senha,
        };

        const response = await api.post('/auth/login', loginData);
        const { accessToken, user } = response.data;

        // Salvar token e dados do usuário
        this.setToken(accessToken);
        this.setUser(user);

        Notify.create({
          color: 'positive',
          icon: 'check_circle',
          position: 'top',
          timeout: 2500,
          message: `Bem-vindo(a) de volta, ${user.nome.split(' ')[0]}!`,
          caption: `${user.secretaria?.sigla || 'PMVC'} • ${user.cargo}`,
        });

        Loading.hide();
        return user;
      } catch (error) {
        Loading.hide();
        const message = error.response?.data?.message || 'Erro ao autenticar. Verifique suas credenciais.';
        Notify.create({
          color: 'negative',
          icon: 'error',
          position: 'top',
          timeout: 3500,
          message: message,
        });
        throw error;
      }
    },

    // =========================================================================
    // ACEITE LGPD
    // =========================================================================
    async acceptLgpd() {
      try {
        await api.post('/auth/accept-lgpd');
        if (this.user) {
          this.user.lgpdAccepted = true;
          this.user.lgpdAcceptedAt = new Date().toISOString();
          this.persistUser();
        }
        Notify.create({
          color: 'positive',
          icon: 'verified_user',
          position: 'top',
          timeout: 2500,
          message: 'Termo LGPD aceito com sucesso!',
        });
      } catch (error) {
        Notify.create({
          color: 'negative',
          icon: 'error',
          position: 'top',
          message: 'Erro ao aceitar o termo LGPD.',
        });
        throw error;
      }
    },

    // =========================================================================
    // BUSCAR PERFIL COMPLETO
    // =========================================================================
    async fetchProfile() {
      try {
        const { data } = await api.get('/auth/profile');
        this.setUser(data);
        return data;
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        throw error;
      }
    },

    // =========================================================================
    // TOKEN & SESSION MANAGEMENT
    // =========================================================================
    setToken(token) {
      this.token = token;
      this.isAuthenticated = true;
      window.sessionStorage.setItem('token', token);
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    },

    setUser(user) {
      this.user = user;
      this.persistUser();
    },

    persistUser() {
      if (this.user) {
        window.sessionStorage.setItem('user_data', JSON.stringify(this.user));
        // Compatibilidade com o template PMVC
        window.sessionStorage.setItem('user_id', this.user.id);
        window.sessionStorage.setItem('name_user', this.user.nome);
        window.sessionStorage.setItem('access_level', this.user.role);
      }
    },

    // Inicialização do sistema - restaura sessão do sessionStorage
    async initSystem() {
      const token = window.sessionStorage.getItem('token');
      const userData = window.sessionStorage.getItem('user_data');

      if (token) {
        this.token = token;
        this.isAuthenticated = true;
        api.defaults.headers.common.Authorization = `Bearer ${token}`;

        if (userData) {
          try {
            this.user = JSON.parse(userData);
          } catch {
            this.user = null;
          }
        }
      } else {
        this.isAuthenticated = false;
        this.token = '';
        this.user = null;
      }
    },

    // =========================================================================
    // LOGOUT
    // =========================================================================
    logout() {
      this.token = '';
      this.isAuthenticated = false;
      this.user = null;
      api.defaults.headers.common.Authorization = '';
      window.sessionStorage.clear();
    },
  },
});
