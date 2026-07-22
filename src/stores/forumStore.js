// =============================================================================
// Conquista Saberes - Forum Store (Pinia)
// Atende Dor #8: Comunidades & Fórum Colaborativo
// =============================================================================
import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { Notify } from 'quasar';

export const useForumStore = defineStore('forum', {
  state: () => ({
    posts: [],
    loading: false,
  }),

  actions: {
    async fetchPosts(courseId = null) {
      this.loading = true;
      try {
        const params = {};
        if (courseId) params.courseId = courseId;
        const { data } = await api.get('/forum', { params });
        this.posts = data;
        return data;
      } catch (error) {
        console.error('Erro ao buscar posts do fórum:', error);
        return [];
      } finally {
        this.loading = false;
      }
    },

    async createPost(postData) {
      try {
        const { data } = await api.post('/forum', postData);
        Notify.create({
          color: 'positive',
          icon: 'forum',
          position: 'top',
          timeout: 2500,
          message: 'Postagem publicada com sucesso!',
        });
        await this.fetchPosts(postData.courseId);
        return data;
      } catch (error) {
        Notify.create({
          color: 'negative',
          icon: 'error',
          position: 'top',
          message: 'Erro ao publicar postagem.',
        });
        throw error;
      }
    },
  },
});
