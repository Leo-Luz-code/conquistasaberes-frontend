<template>
  <q-page class="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 font-sans relative pb-20">
    <!-- Cabeçalho da Página -->
    <div>
      <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-1">
        Cursos
      </h1>
      <p class="text-xs sm:text-sm text-slate-500">
        Catálogo de cursos disponíveis na Universidade do Servidor Público.
      </p>
    </div>

    <!-- Barra de Busca e Filtros por Status -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <!-- Input de Busca -->
      <div class="relative flex-1 max-w-md">
        <q-icon name="search" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size="20px" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar cursos..."
          class="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
        />
      </div>

      <!-- Pills de Filtro por Status -->
      <div class="flex flex-wrap items-center gap-2">
        <button
          v-for="filtro in filtros"
          :key="filtro.value"
          @click="filtroAtivo = filtro.value"
          class="px-4 py-2 text-xs font-bold rounded-xl transition-all border"
          :class="filtroAtivo === filtro.value
            ? 'bg-[#0F4C81] text-white border-[#0F4C81] shadow-sm'
            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'"
        >
          {{ filtro.label }}
        </button>
      </div>
    </div>

    <!-- Grid de Cursos (3 Colunas) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="curso in cursosFiltrados"
        :key="curso.id"
        class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
      >
        <!-- Banner Superior Azul Escuro -->
        <div class="bg-[#0F4C81] p-6 text-white relative flex items-start justify-between min-h-[110px] overflow-hidden">
          <span class="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold backdrop-blur-sm relative z-10">
            {{ curso.categoria }}
          </span>

          <!-- Marca d'água de Livro Aberto -->
          <q-icon
            name="menu_book"
            size="72px"
            class="text-white/10 absolute -right-2 -bottom-3 pointer-events-none"
          />
        </div>

        <!-- Conteúdo do Card -->
        <div class="p-6 flex-1 flex flex-col justify-between space-y-5">
          <div class="space-y-3">
            <h3 class="font-extrabold text-slate-900 text-lg leading-snug">
              {{ curso.titulo }}
            </h3>

            <div class="flex items-center justify-between text-xs pt-1">
              <span class="text-slate-400 font-semibold flex items-center gap-1">
                <q-icon name="schedule" size="16px" /> {{ curso.cargaHoraria }}h
              </span>

              <span
                class="px-3 py-0.5 font-bold rounded-full text-[11px]"
                :class="statusBadgeClass(curso.status)"
              >
                {{ statusText(curso.status) }}
              </span>
            </div>

            <!-- Progresso -->
            <div class="space-y-1.5 pt-2">
              <div class="flex justify-between items-center text-xs font-bold">
                <span class="text-slate-500">Progresso</span>
                <span class="text-[#0F4C81]">{{ curso.progresso }}%</span>
              </div>
              <div class="w-full bg-emerald-500 rounded-full h-2.5 overflow-hidden">
                <div
                  class="bg-[#0F4C81] h-2.5 rounded-full transition-all duration-500"
                  :style="{ width: curso.progresso + '%' }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Botão de Ação -->
          <router-link
            :to="`/servidor/cursos/${curso.id}`"
            class="block w-full py-3 text-center text-xs font-bold rounded-xl transition-colors shadow-sm"
            :class="curso.status === 'em_andamento'
              ? 'bg-[#0F4C81] hover:bg-[#0C3B66] text-white'
              : 'bg-white hover:bg-slate-50 border border-slate-300 text-slate-700'"
          >
            {{ curso.status === 'em_andamento' ? 'Continuar' : (curso.status === 'concluido' ? 'Refazer curso' : 'Acessar curso') }}
          </router-link>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="cursosFiltrados.length === 0"
      class="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3"
    >
      <q-icon name="search_off" size="56px" class="text-slate-300" />
      <h3 class="font-bold text-slate-700 text-lg">Nenhum curso encontrado</h3>
      <p class="text-xs text-slate-500">Tente ajustar a busca ou o filtro de status selecionado.</p>
    </div>


  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';

const searchQuery = ref('');
const filtroAtivo = ref('todos');

const filtros = [
  { label: 'Todos', value: 'todos' },
  { label: 'Em andamento', value: 'em_andamento' },
  { label: 'Concluídos', value: 'concluido' },
  { label: 'Não iniciados', value: 'nao_iniciado' },
];

const cursos = ref([
  {
    id: '1',
    categoria: 'Integração',
    titulo: 'Ética e Conduta no Serviço Público Municipal',
    cargaHoraria: 4,
    status: 'em_andamento',
    progresso: 75,
  },
  {
    id: '2',
    categoria: 'Atendimento',
    titulo: 'Atendimento Humanizado ao Cidadão',
    cargaHoraria: 6,
    status: 'nao_iniciado',
    progresso: 0,
  },
  {
    id: '3',
    categoria: 'Governança',
    titulo: 'LGPD no Serviço Público',
    cargaHoraria: 8,
    status: 'em_andamento',
    progresso: 30,
  },
  {
    id: '4',
    categoria: 'Gestão',
    titulo: 'Gestão de Processos na Administração Pública',
    cargaHoraria: 12,
    status: 'nao_iniciado',
    progresso: 0,
  },
  {
    id: '5',
    categoria: 'Inovação',
    titulo: 'Inovação e Transformação Digital no Setor Público',
    cargaHoraria: 10,
    status: 'nao_iniciado',
    progresso: 0,
  },
  {
    id: '6',
    categoria: 'Comunicação',
    titulo: 'Comunicação Assertiva no Trabalho',
    cargaHoraria: 5,
    status: 'concluido',
    progresso: 100,
  },
]);

const cursosFiltrados = computed(() => {
  return cursos.value.filter((c) => {
    const matchFiltro = filtroAtivo.value === 'todos' || c.status === filtroAtivo.value;
    const matchBusca = !searchQuery.value || c.titulo.toLowerCase().includes(searchQuery.value.toLowerCase()) || c.categoria.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchFiltro && matchBusca;
  });
});

function statusBadgeClass(status) {
  if (status === 'em_andamento') return 'bg-amber-100 text-amber-800';
  if (status === 'concluido') return 'bg-emerald-100 text-emerald-800';
  return 'bg-slate-100 text-slate-600';
}

function statusText(status) {
  if (status === 'em_andamento') return 'Em andamento';
  if (status === 'concluido') return 'Concluído';
  return 'Não iniciado';
}
</script>
