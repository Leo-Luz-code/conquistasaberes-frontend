// =============================================================================
// Conquista Saberes - Certificate Store (Pinia)
// Atende Dor #7: Certificação Automatizada com Hash e Validação
// =============================================================================
import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';

export const useCertificateStore = defineStore('certificate', {
  state: () => ({
    certificates: [],
    validationResult: null,
    loading: false,
  }),

  actions: {
    // Certificados do servidor autenticado
    async fetchMyCertificates() {
      this.loading = true;
      try {
        const { data } = await api.get('/certificates/my-certificates');
        this.certificates = data;
        return data;
      } catch (error) {
        console.error('Erro ao buscar certificados:', error);
        return [];
      } finally {
        this.loading = false;
      }
    },

    // Validação pública de certificado por código Hash
    async validateCertificate(hash) {
      this.loading = true;
      try {
        const { data } = await api.get(`/certificates/validate/${hash}`);
        this.validationResult = data;
        return data;
      } catch (error) {
        this.validationResult = null;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // URL de download do certificado PDF
    getDownloadUrl(hash) {
      return `${process.env.API_BASE_URL}certificates/download/${hash}`;
    },
  },
});
