<template>
  <q-page class="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 font-sans relative pb-20">
    <!-- Cabeçalho da Página -->
    <div>
      <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-1">
        Trilhas de Aprendizagem
      </h1>
      <p class="text-xs sm:text-sm text-slate-500 max-w-2xl">
        Percursos formativos estruturados para o desenvolvimento contínuo do servidor público municipal.
      </p>
    </div>

    <!-- Barra de Busca -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <!-- Input de Busca -->
      <div class="relative flex-1 max-w-md">
        <q-icon
          name="search"
          class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          size="20px"
        />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar trilhas por nome..."
          class="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
        />
      </div>
    </div>

    <!-- Pills de Filtro por Status / Matrícula -->
    <div class="flex flex-wrap items-center gap-2">
      <button
        v-for="filtro in filtros"
        :key="filtro.value"
        @click="filtroAtivo = filtro.value"
        class="px-4 py-2 text-xs font-bold rounded-xl transition-all border flex items-center gap-1.5"
        :class="
          filtroAtivo === filtro.value
            ? 'bg-[#0F4C81] text-white border-[#0F4C81] shadow-sm'
            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
        "
      >
        <span>{{ filtro.label }}</span>
        <span
          class="px-1.5 py-0.5 rounded-full text-[10px]"
          :class="filtroAtivo === filtro.value ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'"
        >
          {{ contarStatus(filtro.value) }}
        </span>
      </button>
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
    <div v-else-if="trilhasFiltradas.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="trilha in trilhasFiltradas"
        :key="trilha.id"
        class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden group"
      >
        <!-- Topo do Card: Badge de Status/Nível + Horas -->
        <div class="space-y-4">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span
                class="px-2.5 py-0.5 text-[11px] font-bold rounded-full"
                :class="statusBadgeClass(trilha)"
              >
                {{ statusBadgeLabel(trilha) }}
              </span>
              <span
                class="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-slate-100 text-slate-700"
              >
                {{ nivelLabel(trilha) }}
              </span>
            </div>
            <span class="text-xs font-semibold text-slate-400 shrink-0">
              {{ trilha.courses?.length || 0 }} cursos · {{ trilha.cargaHorariaTotal }}h
            </span>
          </div>

          <!-- Título e Descrição -->
          <div class="space-y-2">
            <h3 class="font-extrabold text-slate-900 text-lg sm:text-xl leading-snug group-hover:text-[#0F4C81] transition-colors">
              {{ trilha.tituloTrilha }}
            </h3>
            <p class="text-xs text-slate-500 leading-relaxed">
              Trilha de capacitação estruturada para servidores públicos municipais.
            </p>
          </div>

          <!-- Chips dos cursos da Trilha -->
          <div v-if="trilha.courses?.length" class="space-y-1.5">
            <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Cursos Integrados:</span>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="curso in trilha.courses.slice(0, 3)"
                :key="curso.id"
                class="px-2 py-1 bg-slate-50 border border-slate-100 text-slate-600 rounded-lg text-[10px] font-semibold truncate max-w-[130px]"
                :title="curso.titulo"
              >
                {{ curso.titulo }}
              </span>
              <span
                v-if="trilha.courses.length > 3"
                class="px-2 py-1 bg-slate-50 border border-slate-100 text-slate-400 rounded-lg text-[10px] font-semibold"
              >
                +{{ trilha.courses.length - 3 }} mais
              </span>
            </div>
          </div>
        </div>

        <!-- Progresso e Ação -->
        <div class="space-y-4 pt-2 border-t border-slate-100">
          <!-- Se inscrito: mostra barra de progresso -->
          <div v-if="trilha.isEnrolled" class="space-y-1.5">
            <div class="flex justify-between items-center text-xs font-bold">
              <span class="text-slate-600">Progresso na trilha</span>
              <span class="text-[#0F4C81]">{{ trilha.progress }}%</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                class="h-2.5 rounded-full transition-all duration-500"
                :class="trilha.progress >= 100 ? 'bg-emerald-500' : 'bg-[#0F4C81]'"
                :style="{ width: trilha.progress + '%' }"
              />
            </div>
            <p class="text-[10px] text-slate-400">
              {{ trilha.concluidosCount || 0 }} de {{ trilha.courses?.length || 0 }} cursos concluídos
            </p>
          </div>

          <!-- Se NÃO inscrito: mostra badge de convite -->
          <div v-else class="flex items-center gap-2 text-xs text-slate-500 bg-blue-50/60 p-2.5 rounded-xl border border-blue-100">
            <q-icon name="info" size="18px" class="text-blue-600 shrink-0" />
            <span class="text-[11px] leading-tight">Ao se inscrever, você terá acesso imediato a todos os {{ trilha.courses?.length || 0 }} cursos.</span>
          </div>

          <!-- Botões de Ação -->
          <div class="flex gap-2">
            <!-- Botão de Inscrição rápida se não inscrito -->
            <q-btn
              v-if="!trilha.isEnrolled"
              unelevated
              color="primary"
              icon="how_to_reg"
              label="Inscrever-se na Trilha"
              class="w-full py-2.5 text-xs font-bold rounded-xl bg-[#0F4C81] hover:bg-[#0C3B66] text-white shadow-sm"
              :loading="matriculandoId === trilha.id"
              @click="inscreverNaTrilha(trilha)"
            />

            <!-- Botão de Acessar/Continuar se já inscrito -->
            <router-link
              v-else
              :to="{ name: 'trilha-detalhes', params: { id: trilha.id } }"
              class="block w-full py-3 text-center text-xs font-bold rounded-xl transition-colors shadow-sm"
              :class="
                trilha.progress > 0
                  ? 'bg-[#0F4C81] hover:bg-[#0C3B66] text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              "
            >
              {{ trilha.progress >= 100 ? 'Revisar Trilha' : trilha.progress > 0 ? 'Continuar Trilha' : 'Iniciar Trilha' }}
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3"
    >
      <q-icon name="route" size="56px" class="text-slate-300" />
      <h3 class="font-bold text-slate-700 text-lg">Nenhuma trilha encontrada</h3>
      <p class="text-xs text-slate-500">Não encontramos trilhas para o filtro selecionado.</p>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCourseStore } from 'src/stores/courseStore'

const courseStore = useCourseStore()
const loading = ref(false)
const matriculandoId = ref(null)

const searchQuery = ref('')
const filtroAtivo = ref('minhas')

const filtros = [
  { label: 'Minhas Trilhas', value: 'minhas' },
  { label: 'Em andamento', value: 'em_andamento' },
  { label: 'Concluídas', value: 'concluidas' },
  { label: 'Disponíveis', value: 'disponiveis' },
  { label: 'Todas', value: 'todas' },
]

function nivelLabel(trilha) {
  const h = trilha.cargaHorariaTotal || 0
  if (h <= 12) return 'Básico'
  if (h <= 20) return 'Intermediário'
  return 'Avançado'
}

function statusBadgeLabel(trilha) {
  if (trilha.isEnrolled) {
    if (trilha.progress >= 100) return 'Concluída'
    return 'Inscrito'
  }
  return 'Disponível'
}

function statusBadgeClass(trilha) {
  if (trilha.isEnrolled) {
    if (trilha.progress >= 100) return 'bg-emerald-100 text-emerald-800'
    return 'bg-blue-100 text-[#0F4C81]'
  }
  return 'bg-slate-100 text-slate-600'
}

function contarStatus(filtro) {
  const list = courseStore.learningPaths || []
  if (filtro === 'todas') return list.length
  if (filtro === 'minhas') return list.filter((t) => t.isEnrolled).length
  if (filtro === 'em_andamento') return list.filter((t) => t.isEnrolled && t.progress < 100).length
  if (filtro === 'concluidas') return list.filter((t) => t.isEnrolled && t.progress >= 100).length
  if (filtro === 'disponiveis') return list.filter((t) => !t.isEnrolled).length
  return 0
}

const trilhasFiltradas = computed(() => {
  let list = courseStore.learningPaths || []

  // Filtro por texto
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(
      (t) =>
        t.tituloTrilha?.toLowerCase().includes(q) ||
        t.courses?.some((c) => c.titulo?.toLowerCase().includes(q))
    )
  }

  // Filtro por status
  if (filtroAtivo.value === 'minhas') {
    list = list.filter((t) => t.isEnrolled)
  } else if (filtroAtivo.value === 'em_andamento') {
    list = list.filter((t) => t.isEnrolled && t.progress < 100)
  } else if (filtroAtivo.value === 'concluidas') {
    list = list.filter((t) => t.isEnrolled && t.progress >= 100)
  } else if (filtroAtivo.value === 'disponiveis') {
    list = list.filter((t) => !t.isEnrolled)
  }

  return list
})

async function inscreverNaTrilha(trilha) {
  matriculandoId.value = trilha.id
  try {
    await courseStore.enrollLearningPath(trilha.id)
  } catch (error) {
    console.error('Erro ao matricular na trilha:', error)
  } finally {
    matriculandoId.value = null
  }
}

onMounted(async () => {
  loading.value = true
  try {
    await Promise.all([
      courseStore.fetchLearningPaths(),
      courseStore.fetchMyCourses(),
    ])
    // Se o usuário ainda não tiver nenhuma trilha inscrita, muda para a aba "Disponíveis" para não mostrar tela vazia de início
    const inscritasCount = (courseStore.learningPaths || []).filter((t) => t.isEnrolled).length
    if (inscritasCount === 0) {
      filtroAtivo.value = 'disponiveis'
    }
  } finally {
    loading.value = false
  }
})
</script>

