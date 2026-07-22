<template>
  <q-page class="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 font-sans">
    <!-- Cabecalho -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-pmvc-blue font-bold text-xs rounded-full mb-1">
          <q-icon name="analytics" /> Visão Executiva & RH Central
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900">Painel de Gestão e Telemetria</h1>
        <p class="text-xs sm:text-sm text-slate-500">Indicadores de progresso, adesão e matriz de competências da PMVC</p>
      </div>
    </div>

    <div v-if="analyticsStore.loading" class="flex justify-center py-20">
      <q-spinner-dots color="primary" size="50px" />
    </div>

    <template v-else-if="dash">
      <!-- Grid de KPIs ( Cards de Metricas ) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-blue-100 text-pmvc-blue flex items-center justify-center font-bold text-xl shrink-0">
            <q-icon name="groups" size="28px" />
          </div>
          <div>
            <span class="block text-[10px] font-bold text-slate-400 uppercase">Servidores Inscritos</span>
            <span class="text-2xl font-extrabold text-slate-900">{{ dash.totalServidores || 0 }}</span>
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xl shrink-0">
            <q-icon name="task_alt" size="28px" />
          </div>
          <div>
            <span class="block text-[10px] font-bold text-slate-400 uppercase">Taxa de Conclusão</span>
            <span class="text-2xl font-extrabold text-slate-900">{{ dash.taxaConclusao || 0 }}%</span>
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xl shrink-0">
            <q-icon name="workspace_premium" size="28px" />
          </div>
          <div>
            <span class="block text-[10px] font-bold text-slate-400 uppercase">Certificados Emitidos</span>
            <span class="text-2xl font-extrabold text-slate-900">{{ dash.totalCertificados || 0 }}</span>
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xl shrink-0">
            <q-icon name="stars" size="28px" />
          </div>
          <div>
            <span class="block text-[10px] font-bold text-slate-400 uppercase">Total XP Conquistado</span>
            <span class="text-2xl font-extrabold text-slate-900">{{ dash.totalXpGerado || 0 }}</span>
          </div>
        </div>
      </div>

      <!-- Detalhamento por Secretaria & Competencias -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Tabela por Secretaria -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 class="font-bold text-slate-900 text-base flex items-center gap-2">
            <q-icon name="apartment" class="text-pmvc-blue" /> Desempenho por Secretaria
          </h3>

          <div class="space-y-3">
            <div
              v-for="sec in (dash.secretariasData || [])"
              :key="sec.sigla"
              class="p-4 bg-slate-50 rounded-xl space-y-2"
            >
              <div class="flex justify-between items-center text-xs">
                <span class="font-bold text-slate-900">{{ sec.nome }} ({{ sec.sigla }})</span>
                <span class="font-extrabold text-pmvc-blue">{{ sec.concluidos }} / {{ sec.inscritos }} Concluídos</span>
              </div>
              <q-linear-progress
                :value="sec.inscritos > 0 ? (sec.concluidos / sec.inscritos) : 0"
                color="primary"
                class="h-2 rounded-full"
              />
            </div>
          </div>
        </div>

        <!-- Matriz de Competencias Mais Desenvolvidas -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 class="font-bold text-slate-900 text-base flex items-center gap-2">
            <q-icon name="psychology" class="text-amber-500" /> Matriz de Habilidades RH
          </h3>

          <p class="text-xs text-slate-500">Mapeamento de competências adquiridas com maior impacto no serviço público:</p>

          <div class="space-y-3 pt-2">
            <div
              v-for="skill in (dash.topSkills || defaultSkills)"
              :key="skill.nome"
              class="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl"
            >
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                  <q-icon name="verified" />
                </div>
                <span class="font-bold text-slate-800 text-xs">{{ skill.nome }}</span>
              </div>
              <span class="font-extrabold text-slate-900 text-xs">{{ skill.totalServidores }} Servidores</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </q-page>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useAnalyticsStore } from 'src/stores/analyticsStore';

const analyticsStore = useAnalyticsStore();

const dash = computed(() => analyticsStore.dashboard);

const defaultSkills = [
  { nome: 'Lei Geral de Proteção de Dados (LGPD)', totalServidores: 42 },
  { nome: 'Inovação e Gestão Digital', totalServidores: 38 },
  { nome: 'Atendimento e Acessibilidade WCAG', totalServidores: 29 },
  { nome: 'Processo Eletrônico Municipal', totalServidores: 21 },
];

onMounted(() => {
  analyticsStore.fetchDashboard();
});
</script>
