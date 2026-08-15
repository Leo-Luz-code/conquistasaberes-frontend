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
        this.certificates = Array.isArray(data) ? data : [];
        return this.certificates;
      } catch (error) {
        this.certificates = [];
        return [];
      } finally {
        this.loading = false;
      }
    },

    // Validação pública de certificado por código Hash ou ID
    async validateCertificate(hash) {
      if (!hash) return { isValid: false, valid: false };
      this.loading = true;
      try {
        const cleanHash = encodeURIComponent(hash.trim());
        const { data } = await api.get(`/certificates/validate/${cleanHash}`);
        this.validationResult = data;
        return data;
      } catch (error) {
        this.validationResult = { isValid: false, valid: false };
        return { isValid: false, valid: false };
      } finally {
        this.loading = false;
      }
    },

    // URL de download do certificado PDF
    getDownloadUrl(hash) {
      if (!hash) return '#';
      const base = api.defaults?.baseURL || 'http://localhost:3001/';
      const cleanBase = base.endsWith('/') ? base : `${base}/`;
      return `${cleanBase}certificates/download/${encodeURIComponent(hash.trim())}`;
    },

    // Download do PDF como Blob
    async downloadCertificate(hash) {
      if (!hash) return;
      this.loading = true;
      try {
        const cleanHash = encodeURIComponent(hash.trim());
        const response = await api.get(`/certificates/download/${cleanHash}`, {
          responseType: 'blob',
        });
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Certificado_${hash}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Erro ao baixar certificado:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
