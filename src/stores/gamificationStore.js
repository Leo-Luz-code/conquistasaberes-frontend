// =============================================================================
// Conquista Saberes - Gamification Store (Pinia)
// Atende Dor #3: Gamificação com XP, Níveis, Badges e Ranking
// =============================================================================
import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { Notify } from 'quasar';

export const useGamificationStore = defineStore('gamification', {
  state: () => ({
    xpPoints: 0,
    level: 1,
    nextLevelXp: 250,
    badges: [],
    allBadges: [],
    leaderboard: {
      topUsers: [],
      topSecretarias: [],
    },
    loading: false,
  }),

  getters: {
    // Porcentagem de progresso para o próximo nível
    xpProgress: (state) => {
      const currentLevelXp = (state.level - 1) * 250;
      const xpInCurrentLevel = state.xpPoints - currentLevelXp;
      const xpNeeded = 250;
      return Math.min(100, Math.round((xpInCurrentLevel / xpNeeded) * 100));
    },

    // Badges conquistados
    earnedBadges: (state) => state.badges.filter((b) => b.earned),

    // Badges não conquistados
    lockedBadges: (state) => state.badges.filter((b) => !b.earned),

    // Título do nível atual
    levelTitle: (state) => {
      if (state.level >= 10) return 'Mestre do Saber';
      if (state.level >= 7) return 'Especialista';
      if (state.level >= 5) return 'Avançado';
      if (state.level >= 3) return 'Intermediário';
      return 'Iniciante';
    },
  },

  actions: {
    // Status de gamificação do servidor autenticado
    async fetchMyStatus() {
      this.loading = true;
      try {
        const { data } = await api.get('/gamification/my-status');
        this.xpPoints = data.xpPoints;
        this.level = data.level;
        this.nextLevelXp = data.nextLevelXp;
        this.badges = data.badges;
        return data;
      } catch (error) {
        console.error('Erro ao buscar status de gamificação:', error);
      } finally {
        this.loading = false;
      }
    },

    // Ranking individual e intersecretarial
    async fetchLeaderboard() {
      try {
        const { data } = await api.get('/gamification/leaderboard');
        this.leaderboard = data;
        return data;
      } catch (error) {
        console.error('Erro ao buscar ranking:', error);
      }
    },

    // =========================================================================
    // CRUD DE BADGES (ADMIN)
    // =========================================================================

    async fetchAllBadges() {
      this.loading = true;
      try {
        const { data } = await api.get('/gamification/badges');
        this.allBadges = data;
        return data;
      } catch (error) {
        Notify.create({ color: 'negative', icon: 'error', message: 'Erro ao carregar lista de conquistas/badges.' });
        console.error('Erro ao buscar badges:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createBadge(payload) {
      try {
        const { data } = await api.post('/gamification/badges', payload);
        Notify.create({ color: 'positive', icon: 'check', message: 'Conquista/Badge criada com sucesso!' });
        await this.fetchAllBadges();
        return data;
      } catch (error) {
        Notify.create({ color: 'negative', icon: 'error', message: 'Erro ao criar conquista.' });
        throw error;
      }
    },

    async updateBadge(id, payload) {
      try {
        const { data } = await api.put(`/gamification/badges/${id}`, payload);
        Notify.create({ color: 'positive', icon: 'check', message: 'Conquista atualizada com sucesso!' });
        await this.fetchAllBadges();
        return data;
      } catch (error) {
        Notify.create({ color: 'negative', icon: 'error', message: 'Erro ao atualizar conquista.' });
        throw error;
      }
    },

    async deleteBadge(id) {
      try {
        await api.delete(`/gamification/badges/${id}`);
        Notify.create({ color: 'positive', icon: 'delete', message: 'Conquista removida com sucesso!' });
        await this.fetchAllBadges();
      } catch (error) {
        Notify.create({ color: 'negative', icon: 'error', message: 'Erro ao excluir conquista.' });
        throw error;
      }
    },
  },
});
