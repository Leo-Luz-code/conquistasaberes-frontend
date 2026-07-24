// =============================================================================
// Conquista Saberes - Course Store (Pinia)
// Atende Dor #1: Catálogo Unificado de Cursos
// Atende Dor #2: Tracking de Progresso Granular
// =============================================================================
import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { Notify } from 'quasar';

export const useCourseStore = defineStore('course', {
  state: () => ({
    courses: [],
    currentCourse: null,
    enrollments: [],
    recommendations: [],
    learningPaths: [],
    loading: false,
    loadingDetail: false,
  }),

  getters: {
    publishedCourses: (state) => state.courses,
    courseById: (state) => (id) => state.courses.find((c) => c.id === id),
  },

  actions: {
    // Listar cursos com filtros opcionais
    async fetchCourses(filters = {}) {
      this.loading = true;
      try {
        const params = {};
        if (filters.search) params.search = filters.search;
        if (filters.secretariaId) params.secretariaId = filters.secretariaId;
        if (filters.categoria && filters.categoria !== 'Todas') params.categoria = filters.categoria;

        const { data } = await api.get('/courses', { params });
        this.courses = data;
        return data;
      } catch (error) {
        console.error('Erro ao buscar cursos:', error);
        return [];
      } finally {
        this.loading = false;
      }
    },

    // Detalhes do curso com módulos e progresso do servidor
    async fetchCourseDetail(courseId) {
      this.loadingDetail = true;
      try {
        const { data } = await api.get(`/courses/${courseId}`);
        this.currentCourse = data;
        return data;
      } catch (error) {
        console.error('Erro ao buscar detalhes do curso:', error);
        Notify.create({
          color: 'negative',
          icon: 'error',
          position: 'top',
          message: 'Erro ao carregar os detalhes do curso.',
        });
        throw error;
      } finally {
        this.loadingDetail = false;
      }
    },

    // Inscrição no curso
    async enrollInCourse(courseId) {
      try {
        const { data } = await api.post(`/courses/${courseId}/enroll`);
        Notify.create({
          color: 'positive',
          icon: 'school',
          position: 'top',
          timeout: 3000,
          message: 'Inscrição realizada com sucesso!',
          caption: 'Agora você pode iniciar o curso.',
        });
        // Recarregar detalhes para atualizar status
        await this.fetchCourseDetail(courseId);
        return data;
      } catch (error) {
        Notify.create({
          color: 'negative',
          icon: 'error',
          position: 'top',
          message: 'Erro ao se inscrever no curso.',
        });
        throw error;
      }
    },

    // Concluir aula - retorna XP, progresso, badges e certificados
    async completeLesson(lessonId) {
      try {
        const { data } = await api.post(`/courses/lessons/${lessonId}/complete`);

        // Notificação de XP ganho
        if (data.gainedXp > 0) {
          Notify.create({
            color: 'positive',
            icon: 'emoji_events',
            position: 'top',
            timeout: 3000,
            message: `+${data.gainedXp} XP conquistados!`,
            caption: `Nível ${data.level} • ${data.courseProgress}% do curso concluído`,
          });
        }

        // Notificação de Badge conquistado
        if (data.newBadgeEarned) {
          setTimeout(() => {
            Notify.create({
              color: 'amber-8',
              icon: 'military_tech',
              position: 'top-right',
              timeout: 5000,
              message: `🏅 Nova Conquista: ${data.newBadgeEarned.nome}!`,
              caption: data.newBadgeEarned.descricao,
            });
          }, 1500);
        }

        // Notificação de Certificado emitido
        if (data.newCertificateCode) {
          setTimeout(() => {
            Notify.create({
              color: 'info',
              icon: 'workspace_premium',
              position: 'top',
              timeout: 6000,
              message: '📜 Certificado Emitido!',
              caption: `Código: ${data.newCertificateCode}`,
            });
          }, 3000);
        }

        return data;
      } catch (error) {
        Notify.create({
          color: 'negative',
          icon: 'error',
          position: 'top',
          message: 'Erro ao concluir a aula.',
        });
        throw error;
      }
    },

    // Recomendações de cursos por IA
    async fetchRecommendations() {
      try {
        const { data } = await api.get('/recommendations');
        this.recommendations = data;
        return data;
      } catch (error) {
        console.error('Erro ao buscar recomendações:', error);
        return [];
      }
    },

    // Trilhas de aprendizagem
    async fetchLearningPaths() {
      try {
        const { data } = await api.get('/learning-paths');
        this.learningPaths = data;
        return data;
      } catch (error) {
        console.error('Erro ao buscar trilhas:', error);
        return [];
      }
    },

    // =========================================================================
    // AÇÕES ADMINISTRATIVAS (CRUD CURSOS, MÓDULOS, AULAS, UPLOAD)
    // =========================================================================

    async fetchAllAdminCourses() {
      this.loading = true;
      try {
        const { data } = await api.get('/courses/admin/all');
        this.courses = data;
        return data;
      } catch (error) {
        console.error('Erro ao buscar cursos admin:', error);
        Notify.create({ color: 'negative', message: 'Erro ao carregar lista de cursos admin.' });
        return [];
      } finally {
        this.loading = false;
      }
    },

    async createCourse(courseData) {
      try {
        const { data } = await api.post('/courses', courseData);
        Notify.create({ color: 'positive', icon: 'check', message: 'Curso criado com sucesso!' });
        return data;
      } catch (error) {
        Notify.create({ color: 'negative', icon: 'error', message: 'Erro ao criar curso.' });
        throw error;
      }
    },

    async updateCourse(id, courseData) {
      try {
        const { data } = await api.put(`/courses/${id}`, courseData);
        Notify.create({ color: 'positive', icon: 'check', message: 'Curso atualizado com sucesso!' });
        return data;
      } catch (error) {
        Notify.create({ color: 'negative', icon: 'error', message: 'Erro ao atualizar curso.' });
        throw error;
      }
    },

    async deleteCourse(id) {
      try {
        await api.delete(`/courses/${id}`);
        Notify.create({ color: 'positive', icon: 'delete', message: 'Curso removido com sucesso!' });
      } catch (error) {
        Notify.create({ color: 'negative', icon: 'error', message: 'Erro ao excluir curso.' });
        throw error;
      }
    },

    async createModule(courseId, moduleData) {
      try {
        const { data } = await api.post(`/courses/${courseId}/modules`, moduleData);
        Notify.create({ color: 'positive', icon: 'check', message: 'Módulo adicionado!' });
        return data;
      } catch (error) {
        Notify.create({ color: 'negative', icon: 'error', message: 'Erro ao criar módulo.' });
        throw error;
      }
    },

    async updateModule(moduleId, moduleData) {
      try {
        const { data } = await api.put(`/courses/modules/${moduleId}`, moduleData);
        Notify.create({ color: 'positive', icon: 'check', message: 'Módulo atualizado!' });
        return data;
      } catch (error) {
        Notify.create({ color: 'negative', icon: 'error', message: 'Erro ao atualizar módulo.' });
        throw error;
      }
    },

    async deleteModule(moduleId) {
      try {
        await api.delete(`/courses/modules/${moduleId}`);
        Notify.create({ color: 'positive', icon: 'delete', message: 'Módulo removido!' });
      } catch (error) {
        Notify.create({ color: 'negative', icon: 'error', message: 'Erro ao excluir módulo.' });
        throw error;
      }
    },

    async createLesson(moduleId, lessonData) {
      try {
        const { data } = await api.post(`/courses/modules/${moduleId}/lessons`, lessonData);
        Notify.create({ color: 'positive', icon: 'check', message: 'Aula cadastrada!' });
        return data;
      } catch (error) {
        Notify.create({ color: 'negative', icon: 'error', message: 'Erro ao criar aula.' });
        throw error;
      }
    },

    async updateLesson(lessonId, lessonData) {
      try {
        const { data } = await api.put(`/courses/lessons/${lessonId}`, lessonData);
        Notify.create({ color: 'positive', icon: 'check', message: 'Aula atualizada!' });
        return data;
      } catch (error) {
        Notify.create({ color: 'negative', icon: 'error', message: 'Erro ao atualizar aula.' });
        throw error;
      }
    },

    async deleteLesson(lessonId) {
      try {
        await api.delete(`/courses/lessons/${lessonId}`);
        Notify.create({ color: 'positive', icon: 'delete', message: 'Aula removida!' });
      } catch (error) {
        Notify.create({ color: 'negative', icon: 'error', message: 'Erro ao excluir aula.' });
        throw error;
      }
    },

    async uploadFile(file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await api.post('/courses/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
      } catch (error) {
        Notify.create({ color: 'negative', icon: 'error', message: 'Erro ao fazer upload do arquivo.' });
        throw error;
      }
    },
  },
});

