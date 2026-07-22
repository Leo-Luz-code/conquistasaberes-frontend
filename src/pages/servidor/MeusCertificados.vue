<template>
  <q-page class="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 font-sans">
    <!-- Cabecalho -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900">Meus Certificados Oficiais</h1>
        <p class="text-xs sm:text-sm text-slate-500">Documentos digitais emitidos pela PMVC para progressão funcional</p>
      </div>

      <router-link
        to="/validar-certificado"
        target="_blank"
        class="inline-flex items-center gap-2 py-2.5 px-4 bg-white border border-slate-300 hover:border-pmvc-blue text-pmvc-blue font-bold rounded-xl text-xs transition-colors shadow-sm"
      >
        <q-icon name="qr_code" /> Portal Público de Validação
      </router-link>
    </div>

    <!-- Lista de Certificados -->
    <div v-if="certificateStore.loading" class="flex justify-center py-16">
      <q-spinner-dots color="primary" size="50px" />
    </div>

    <div v-else-if="certificateStore.certificates.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="cert in certificateStore.certificates"
        :key="cert.id"
        class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center shrink-0">
              <q-icon name="workspace_premium" size="28px" />
            </div>
            <div>
              <span class="text-[10px] font-extrabold uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                EMITIDO & VÁLIDO
              </span>
              <h3 class="font-bold text-slate-900 text-base leading-snug mt-1">{{ cert.course?.titulo }}</h3>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
          <div>
            <span class="block text-[10px] font-semibold text-slate-400 uppercase">Carga Horária</span>
            <span class="font-bold text-slate-800">{{ cert.course?.cargaHoraria }} Horas</span>
          </div>
          <div>
            <span class="block text-[10px] font-semibold text-slate-400 uppercase">Data da Emissão</span>
            <span class="font-bold text-slate-800">{{ formatDate(cert.issuedAt) }}</span>
          </div>
          <div class="col-span-2 pt-1">
            <span class="block text-[10px] font-semibold text-slate-400 uppercase">Código Hash de Validação</span>
            <span class="font-mono font-bold text-pmvc-blue text-xs">{{ cert.codigoValidacao }}</span>
          </div>
        </div>

        <div class="flex items-center justify-between pt-2">
          <router-link
            :to="`/validar-certificado?hash=${cert.codigoValidacao}`"
            target="_blank"
            class="text-xs font-bold text-slate-500 hover:text-pmvc-blue flex items-center gap-1"
          >
            <q-icon name="open_in_new" /> Verificar Autenticidade
          </router-link>

          <a
            :href="certificateStore.getDownloadUrl(cert.codigoValidacao)"
            target="_blank"
            class="inline-flex items-center gap-2 py-2 px-4 bg-pmvc-blue hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow"
          >
            <q-icon name="download" /> DOWNLOAD PDF
          </a>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
      <q-icon name="workspace_premium" size="56px" class="text-slate-300" />
      <h3 class="font-bold text-slate-700 text-lg">Nenhum certificado emitido ainda</h3>
      <p class="text-xs text-slate-500 max-w-md mx-auto">Conclua todas as aulas de um curso no catálogo para gerar automaticamente seu certificado de capacitação com hash de autenticidade.</p>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue';
import { useCertificateStore } from 'src/stores/certificateStore';

const certificateStore = useCertificateStore();

onMounted(() => {
  certificateStore.fetchMyCertificates();
});

function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('pt-BR');
}
</script>
