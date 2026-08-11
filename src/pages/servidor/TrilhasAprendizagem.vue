<template>
  <q-page class="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 font-sans relative pb-20">
    <!-- Cabeçalho da Página -->
    <div>
      <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-1">
        Trilhas de Aprendizagem
      </h1>
      <p class="text-xs sm:text-sm text-slate-500 max-w-2xl">
        Percursos formativos estruturados para o desenvolvimento profissional do servidor público municipal.
      </p>
    </div>

    <!-- Grid de Cards de Trilhas (3 Colunas) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="trilha in trilhas"
        :key="trilha.id"
        class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-6"
      >
        <!-- Topo do Card: Badge + Horas -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span
              class="px-3 py-1 text-xs font-bold rounded-full"
              :class="trilha.levelClass"
            >
              {{ trilha.nivel }}
            </span>
            <span class="text-xs font-semibold text-slate-400">
              {{ trilha.cursosCount }} cursos · {{ trilha.cargaHoraria }}h
            </span>
          </div>

          <!-- Título e Descrição -->
          <div class="space-y-2">
            <h3 class="font-extrabold text-slate-900 text-lg sm:text-xl leading-snug">
              {{ trilha.titulo }}
            </h3>
            <p class="text-xs text-slate-500 leading-relaxed">
              {{ trilha.descricao }}
            </p>
          </div>
        </div>

        <!-- Progresso e Ação -->
        <div class="space-y-4 pt-4">
          <div class="space-y-1.5">
            <div class="flex justify-between items-center text-xs font-bold">
              <span class="text-slate-600">Progresso</span>
              <span class="text-[#0F4C81]">{{ trilha.progresso }}%</span>
            </div>
            <!-- Progress Bar: Fundo Verde, Preenchimento Azul -->
            <div class="w-full bg-emerald-500 rounded-full h-2.5 overflow-hidden">
              <div
                class="bg-[#0F4C81] h-2.5 rounded-full transition-all duration-500"
                :style="{ width: trilha.progresso + '%' }"
              ></div>
            </div>
          </div>

          <!-- Botão de Ação -->
          <router-link
            :to="`/servidor/cursos`"
            class="block w-full py-3 text-center text-xs font-bold rounded-xl transition-colors shadow-sm"
            :class="trilha.progresso > 0 ? 'bg-[#0F4C81] hover:bg-[#0C3B66] text-white' : 'bg-white hover:bg-slate-50 border border-slate-300 text-slate-700'"
          >
            {{ trilha.progresso > 0 ? 'Continuar trilha' : 'Acessar trilha' }}
          </router-link>
        </div>
      </div>
    </div>


  </q-page>
</template>

<script setup>
import { ref } from 'vue';

const trilhas = ref([
  {
    id: 'trilha-1',
    nivel: 'Básico',
    levelClass: 'bg-emerald-100 text-emerald-800',
    cursosCount: 3,
    cargaHoraria: 12,
    titulo: 'Trilha de Integração ao Serviço Público Municipal',
    descricao: 'Fundamentos essenciais para o servidor que ingressa na administração pública municipal.',
    progresso: 45,
  },
  {
    id: 'trilha-2',
    nivel: 'Intermediário',
    levelClass: 'bg-amber-100 text-amber-800',
    cursosCount: 3,
    cargaHoraria: 18,
    titulo: 'Trilha de Gestão e Liderança',
    descricao: 'Desenvolva competências para liderar equipes e conduzir processos com efetividade.',
    progresso: 20,
  },
  {
    id: 'trilha-3',
    nivel: 'Avançado',
    levelClass: 'bg-indigo-100 text-indigo-800',
    cursosCount: 3,
    cargaHoraria: 20,
    titulo: 'Trilha de Governança, Controle e Inovação',
    descricao: 'Gestão moderna do serviço público: LGPD, riscos e transformação digital.',
    progresso: 0,
  },
]);
</script>
