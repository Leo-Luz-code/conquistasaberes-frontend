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

    <!-- Skeleton Loading -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="n in 3"
        :key="n"
        class="bg-white rounded-3xl border border-slate-200 p-7 shadow-sm animate-pulse space-y-5"
      >
        <div class="flex justify-between">
          <div class="h-6 bg-slate-200 rounded-full w-24" />
          <div class="h-4 bg-slate-100 rounded w-28" />
        </div>
        <div class="space-y-2">
          <div class="h-5 bg-slate-200 rounded w-3/4" />
          <div class="h-3 bg-slate-100 rounded w-full" />
          <div class="h-3 bg-slate-100 rounded w-5/6" />
        </div>
        <div class="h-2.5 bg-slate-100 rounded-full w-full" />
        <div class="h-10 bg-slate-100 rounded-xl" />
      </div>
    </div>

    <!-- Grid de Cards de Trilhas -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="trilha in trilhasComProgresso"
        :key="trilha.id"
        class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-6"
      >
        <!-- Topo do Card: Badge + Horas -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span
              class="px-3 py-1 text-xs font-bold rounded-full"
              :class="nivelClass(trilha)"
            >
              {{ nivelLabel(trilha) }}
            </span>
            <span class="text-xs font-semibold text-slate-400">
              {{ trilha.courses?.length || 0 }} cursos · {{ trilha.cargaHorariaTotal }}h
            </span>
          </div>

          <!-- Título e Descrição -->
          <div class="space-y-2">
            <h3 class="font-extrabold text-slate-900 text-lg sm:text-xl leading-snug">
              {{ trilha.tituloTrilha }}
            </h3>
            <p v-if="trilha.eixo" class="text-xs text-slate-500 leading-relaxed">
              <span class="font-semibold text-slate-600">Eixo:</span> {{ trilha.eixo.nomeEixo }}
            </p>
            <p v-else class="text-xs text-slate-500 leading-relaxed">
              Trilha de capacitação estruturada para servidores públicos municipais.
            </p>
          </div>

          <!-- Chips dos cursos (até 3) -->
          <div v-if="trilha.courses?.length" class="flex flex-wrap gap-1.5">
            <span
              v-for="curso in trilha.courses.slice(0, 3)"
              :key="curso.id"
              class="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-semibold truncate max-w-[120px]"
            >
              {{ curso.titulo }}
            </span>
            <span
              v-if="trilha.courses.length > 3"
              class="px-2 py-0.5 bg-slate-100 text-slate-400 rounded-md text-[10px] font-semibold"
            >
              +{{ trilha.courses.length - 3 }} mais
            </span>
          </div>
        </div>

        <!-- Progresso e Ação -->
        <div class="space-y-4 pt-2">
          <div class="space-y-1.5">
            <div class="flex justify-between items-center text-xs font-bold">
              <span class="text-slate-600">Progresso na trilha</span>
              <span class="text-[#0F4C81]">{{ calcularProgresso(trilha) }}%</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                class="h-2.5 rounded-full transition-all duration-500"
                :class="calcularProgresso(trilha) >= 100 ? 'bg-emerald-500' : 'bg-[#0F4C81]'"
                :style="{ width: calcularProgresso(trilha) + '%' }"
              />
            </div>
          </div>

          <!-- Botão de Ação — navega para TrilhaDetalhes -->
          <router-link
            :to="{ name: 'trilha-detalhes', params: { id: trilha.id } }"
            class="block w-full py-3 text-center text-xs font-bold rounded-xl transition-colors shadow-sm"
            :class="
              calcularProgresso(trilha) > 0
                ? 'bg-[#0F4C81] hover:bg-[#0C3B66] text-white'
                : 'bg-white hover:bg-slate-50 border border-slate-300 text-slate-700'
            "
          >
            {{ calcularProgresso(trilha) > 0 ? 'Continuar trilha' : 'Acessar trilha' }}
          </router-link>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="trilhasComProgresso.length === 0"
        class="col-span-full bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3"
      >
        <q-icon name="route" size="56px" class="text-slate-300" />
        <h3 class="font-bold text-slate-700 text-lg">Nenhuma trilha disponível</h3>
        <p class="text-xs text-slate-500">As trilhas de capacitação serão exibidas aqui quando cadastradas.</p>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCourseStore } from 'src/stores/courseStore'

const courseStore = useCourseStore()
const loading = ref(false)

// Nível baseado na carga horária total da trilha (heurística, já que o schema não tem campo nivel)
function nivelLabel(trilha) {
  const h = trilha.cargaHorariaTotal || 0
  if (h <= 12) return 'Básico'
  if (h <= 20) return 'Intermediário'
  return 'Avançado'
}

function nivelClass(trilha) {
  const nivel = nivelLabel(trilha)
  if (nivel === 'Básico') return 'bg-emerald-100 text-emerald-800'
  if (nivel === 'Intermediário') return 'bg-amber-100 text-amber-800'
  return 'bg-indigo-100 text-indigo-800'
}

// Calcula o progresso médio do usuário nos cursos da trilha
function calcularProgresso(trilha) {
  const myCoursesMap = {}
  courseStore.myCourses.forEach((mc) => {
    myCoursesMap[mc.id] = mc
  })

  const cursosDaTrilha = trilha.courses || []
  if (cursosDaTrilha.length === 0) return 0

  const soma = cursosDaTrilha.reduce((acc, curso) => {
    return acc + (myCoursesMap[curso.id]?.progresso ?? 0)
  }, 0)

  return Math.round(soma / cursosDaTrilha.length)
}

const trilhasComProgresso = computed(() => courseStore.learningPaths)

onMounted(async () => {
  loading.value = true
  try {
    await Promise.all([
      courseStore.fetchLearningPaths(),
      courseStore.fetchMyCourses(),
    ])
  } finally {
    loading.value = false
  }
})
</script>
