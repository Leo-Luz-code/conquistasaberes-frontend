// =============================================================================
// Conquista Saberes - Analytics Store (Pinia)
// Atende Dor #5: Dashboard Analytics Executivo
// =============================================================================
import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';

export const useAnalyticsStore = defineStore('analytics', {
  state: () => ({
    dashboard: null,
    loading: false,
  }),

  actions: {
    async fetchDashboard() {
      this.loading = true;
      try {
        const { data } = await api.get('/analytics/dashboard');
        this.dashboard = data;
        return data;
      } catch (error) {
        console.error('Erro ao buscar dashboard analítico:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
