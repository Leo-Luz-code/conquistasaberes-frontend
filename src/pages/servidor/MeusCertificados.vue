<template>
  <q-page class="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 font-sans">
    <!-- Cabecalho -->
    <div>
      <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900">Meus Certificados</h1>
      <p class="text-xs sm:text-sm text-slate-500">
        Todos os certificados emitidos pela Universidade do Servidor Público - UniVC.
      </p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-16">
      <q-spinner-dots color="primary" size="50px" />
    </div>

    <!-- Lista de Certificados -->
    <div v-else-if="certificates.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="cert in certificates"
        :key="cert.id"
        class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
      >
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
            <q-icon name="military_tech" size="26px" />
          </div>
          <div class="min-w-0">
            <h3 class="font-bold text-slate-900 text-base leading-snug truncate">
              {{ cert.titulo }}
            </h3>
            <p class="text-xs text-slate-500">
              Concluído em {{ formatDate(cert.concluidoEm) }} · {{ cert.cargaHoraria }}h
            </p>
          </div>
        </div>

        <div>
          <span class="block text-[10px] font-semibold text-slate-400 uppercase">Código</span>
          <span class="font-mono font-bold text-slate-700 text-xs">{{ cert.codigo }}</span>
        </div>

        <div class="flex items-center gap-3 pt-2">
          <router-link
            :to="`/validar-certificado?hash=${cert.codigo}`"
            target="_blank"
            class="flex-1 text-center inline-flex items-center justify-center gap-1.5 py-2 px-4 bg-white border border-slate-300 hover:border-pmvc-blue text-slate-700 font-bold rounded-xl text-xs transition-colors"
          >
            <q-icon name="visibility" size="16px" /> Visualizar
          </router-link>

          
          <a :href="cert.downloadUrl"
            target="_blank"
            class="flex-1 text-center inline-flex items-center justify-center gap-1.5 py-2 px-4 bg-pmvc-blue hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow"
          >
            <q-icon name="download" size="16px" /> Baixar
          </a>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
      <q-icon name="workspace_premium" size="56px" class="text-slate-300" />
      <h3 class="font-bold text-slate-700 text-lg">Nenhum certificado emitido ainda</h3>
      <p class="text-xs text-slate-500 max-w-md mx-auto">
        Conclua todas as aulas de um curso no catálogo para gerar automaticamente seu certificado de capacitação com hash de autenticidade.
      </p>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// import { useCertificateStore } from 'src/stores/certificateStore';
// const certificateStore = useCertificateStore();

const loading = ref(false);

// ---------------------------------------------------------------------------
// MOCK DATA — substituir por certificateStore.certificates quando integrar
// ---------------------------------------------------------------------------
const certificates = ref([
  {
    id: 1,
    titulo: 'Ética e Conduta no Serviço Público Municipal',
    concluidoEm: '2026-05-02',
    cargaHoraria: 4,
    codigo: 'UNIVC-2026-ETIC-0042-MO',
    downloadUrl: '#',
  },
  {
    id: 2,
    titulo: 'Introdução à Transformação Digital',
    concluidoEm: '2026-04-20',
    cargaHoraria: 6,
    codigo: 'UNIVC-2026-TDIG-0091-MO',
    downloadUrl: '#',
  },
  {
    id: 3,
    titulo: 'Comunicação Institucional Básica',
    concluidoEm: '2026-04-10',
    cargaHoraria: 4,
    codigo: 'UNIVC-2026-COMU-0067-MO',
    downloadUrl: '#',
  },
  {
    id: 4,
    titulo: 'Atendimento ao Cidadão - Módulo I',
    concluidoEm: '2026-03-28',
    cargaHoraria: 5,
    codigo: 'UNIVC-2026-ATEN-0114-MO',
    downloadUrl: '#',
  },
  {
    id: 5,
    titulo: 'Princípios da Administração Pública',
    concluidoEm: '2026-03-15',
    cargaHoraria: 4,
    codigo: 'UNIVC-2026-PRAD-0028-MO',
    downloadUrl: '#',
  },
]);

function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('pt-BR');
}

onMounted(() => {
  // certificateStore.fetchMyCertificates();
});
</script>