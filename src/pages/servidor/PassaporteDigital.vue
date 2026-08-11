<template>
  <q-page class="p-4 sm:p-8 max-w-6xl mx-auto space-y-6 font-sans">
    <!-- Cabecalho -->
    <div>
      <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900">Passaporte Digital do Servidor</h1>
      <p class="text-xs sm:text-sm text-slate-500">
        Sua jornada de aprendizagem na Universidade do Servidor Público - UniVC.
      </p>
    </div>

    <!-- Banner Principal do Servidor -->
    <div class="bg-gradient-to-r from-pmvc-blue to-teal-600 rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 shrink-0 bg-pmvc-blue border-2 border-amber-400 rounded-2xl flex items-center justify-center text-amber-400 font-extrabold text-2xl">
          {{ userInitial }}
        </div>

        <div class="space-y-1">
          <span class="inline-block px-2.5 py-0.5 bg-amber-400 text-pmvc-blue text-[10px] font-extrabold uppercase rounded-md">
            {{ roleLabel }}
          </span>
          <h2 class="text-white font-extrabold text-lg leading-none">{{ userFullName }}</h2>
          <p class="text-blue-100 text-xs">{{ secretariaNome }} · Matrícula {{ matricula }}</p>
          <div class="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-[11px] font-semibold text-blue-50">
            <span>{{ stats.cursosConcluidos }} cursos concluídos</span>
            <span>·</span>
            <span>{{ stats.trilhasEmAndamento }} trilhas em andamento</span>
            <span>·</span>
            <span>{{ stats.certificados }} certificados</span>
          </div>
        </div>
      </div>

      <div class="bg-white/10 border border-white/20 rounded-2xl px-5 py-3 text-center shrink-0">
        <span class="block text-[10px] text-blue-100 uppercase font-semibold">Pontuação</span>
        <span class="block text-2xl font-extrabold text-amber-400 leading-tight">{{ stats.pontuacao.toLocaleString('pt-BR') }}</span>
        <span class="block text-[10px] text-blue-100">pts</span>
      </div>
    </div>

    <!-- Cards de Estatísticas -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm">
        <div class="w-11 h-11 bg-blue-50 text-pmvc-blue rounded-xl flex items-center justify-center shrink-0">
          <q-icon name="emoji_events" size="22px" />
        </div>
        <div>
          <span class="block text-xs text-slate-500 font-semibold">Cursos concluídos</span>
          <span class="block text-xl font-extrabold text-slate-900">{{ stats.cursosConcluidos }}</span>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm">
        <div class="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
          <q-icon name="alt_route" size="22px" />
        </div>
        <div>
          <span class="block text-xs text-slate-500 font-semibold">Trilhas em andamento</span>
          <span class="block text-xl font-extrabold text-slate-900">{{ stats.trilhasEmAndamento }}</span>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm">
        <div class="w-11 h-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
          <q-icon name="workspace_premium" size="22px" />
        </div>
        <div>
          <span class="block text-xs text-slate-500 font-semibold">Certificados</span>
          <span class="block text-xl font-extrabold text-slate-900">{{ stats.certificados }}</span>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm">
        <div class="w-11 h-11 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
          <q-icon name="flag" size="22px" />
        </div>
        <div>
          <span class="block text-xs text-slate-500 font-semibold">Conquistas</span>
          <span class="block text-xl font-extrabold text-slate-900">{{ badges.filter(b => b.conquistado).length }}</span>
        </div>
      </div>
    </div>

    <!-- Conquistas e Badges -->
    <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
      <h2 class="text-lg font-bold text-slate-800">Conquistas e Badges</h2>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div
          v-for="badge in badges"
          :key="badge.id"
          class="rounded-2xl p-4 text-center space-y-2 border"
          :class="badge.conquistado
            ? 'bg-amber-50 border-amber-100'
            : 'bg-slate-50 border-slate-100'"
        >
          <div
            class="w-11 h-11 mx-auto rounded-full flex items-center justify-center"
            :class="badge.conquistado ? 'bg-amber-400 text-white' : 'bg-slate-200 text-slate-400'"
          >
            <q-icon :name="badge.icon" size="22px" />
          </div>
          <h4 class="font-bold text-xs leading-snug" :class="badge.conquistado ? 'text-slate-800' : 'text-slate-400'">
            {{ badge.titulo }}
          </h4>
          <p class="text-[10px] leading-snug" :class="badge.conquistado ? 'text-slate-500' : 'text-slate-400'">
            {{ badge.descricao }}
          </p>
        </div>
      </div>
    </div>

    <!-- Progresso Geral -->
    <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
      <h2 class="text-lg font-bold text-slate-800">Progresso geral da jornada</h2>
      <div class="flex items-center justify-between">
        <p class="text-xs text-slate-500">Você concluiu {{ progressoGeral }}% do plano de desenvolvimento</p>
        <span class="text-sm font-extrabold text-slate-800">{{ progressoGeral }}%</span>
      </div>
      <q-linear-progress
        :value="progressoGeral / 100"
        size="10px"
        class="rounded-full"
        color="primary"
        track-color="slate-100"
      />
    </div>

    <!-- Histórico de Cursos Concluídos -->
    <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
      <h2 class="text-lg font-bold text-slate-800">Histórico de cursos concluídos</h2>

      <div v-if="loading" class="flex justify-center py-10">
        <q-spinner-dots color="primary" size="40px" />
      </div>

      <div v-else-if="cursosConcluidos.length > 0" class="divide-y divide-slate-100">
        <div
          v-for="curso in cursosConcluidos"
          :key="curso.id"
          class="flex items-center justify-between py-3 first:pt-0 last:pb-0"
        >
          <div class="flex items-center gap-3 min-w-0">
            <q-icon name="check_circle" size="22px" class="text-emerald-500 shrink-0" />
            <div class="min-w-0">
              <h4 class="font-bold text-slate-900 text-sm truncate">{{ curso.titulo }}</h4>
              <p class="text-xs text-slate-400">Concluído em {{ formatDate(curso.concluidoEm) }} · {{ curso.cargaHoraria }}h</p>
            </div>
          </div>

          <router-link
            :to="`/servidor/certificados`"
            class="shrink-0 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase rounded-full hover:bg-emerald-100 transition-colors"
          >
            Certificado
          </router-link>
        </div>
      </div>

      <div v-else class="text-center py-10 space-y-2">
        <q-icon name="school" size="48px" class="text-slate-300" />
        <p class="text-xs text-slate-500">Nenhum curso concluído até o momento.</p>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from 'src/stores/authStore';
// import { usePassportStore } from 'src/stores/passportStore';

const authStore = useAuthStore();
// const passportStore = usePassportStore();

const loading = ref(false);

// ---------------------------------------------------------------------------
// DADOS DO SERVIDOR — vindos direto do authStore (não mockado)
// Ajuste os nomes dos campos abaixo conforme o shape real do seu authStore
// ---------------------------------------------------------------------------
const userFullName = computed(() => authStore.nameUser || authStore.user?.nome || 'Servidor');
const userInitial = computed(() => userFullName.value.charAt(0).toUpperCase());
const roleLabel = computed(() => authStore.roleLabel || authStore.user?.cargo || 'Servidor Municipal');
const secretariaNome = computed(() => authStore.user?.secretaria?.nome || 'Secretaria não informada');
const matricula = computed(() => authStore.user?.matricula || '-');

// ---------------------------------------------------------------------------
// MOCK DATA — trocar por passportStore.stats / .badges / .cursosConcluidos
// quando o endpoint agregador (ex: GET /servidor/passaporte) existir
// ---------------------------------------------------------------------------
const stats = ref({
  cursosConcluidos: 7,
  trilhasEmAndamento: 2,
  certificados: 5,
  pontuacao: 1240,
});

const progressoGeral = ref(35);

const badges = ref([
  { id: 1, titulo: 'Primeiro Curso Concluído', descricao: 'Você concluiu seu primeiro curso na UniVC.', icon: 'school', conquistado: true },
  { id: 2, titulo: 'Servidor em Desenvolvimento', descricao: '5 cursos concluídos.', icon: 'auto_awesome', conquistado: true },
  { id: 3, titulo: 'Participante Ativo', descricao: 'Participou de discussões no Fórum.', icon: 'groups', conquistado: true },
  { id: 4, titulo: 'Trilha em Progresso', descricao: 'Iniciou pelo menos uma trilha.', icon: 'alt_route', conquistado: true },
  { id: 5, titulo: 'Embaixador UniVC', descricao: 'Conclua 10 cursos para desbloquear.', icon: 'star', conquistado: false },
]);

const cursosConcluidos = ref([
  { id: 1, titulo: 'Introdução à Transformação Digital', concluidoEm: '2026-04-20', cargaHoraria: 6 },
  { id: 2, titulo: 'Comunicação Institucional Básica', concluidoEm: '2026-04-10', cargaHoraria: 4 },
  { id: 3, titulo: 'Atendimento ao Cidadão — Módulo I', concluidoEm: '2026-03-28', cargaHoraria: 5 },
  { id: 4, titulo: 'Princípios da Administração Pública', concluidoEm: '2026-03-15', cargaHoraria: 4 },
]);

function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('pt-BR');
}

onMounted(() => {
  // passportStore.fetchPassportData();
});
</script>