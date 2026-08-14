<template>
  <q-page class="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 font-sans relative pb-20">
    <!-- Cabeçalho da Página -->
    <div>
      <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-1">Cursos</h1>
      <p class="text-xs sm:text-sm text-slate-500">
        Catálogo de cursos disponíveis na Universidade do Servidor Público.
      </p>
    </div>

    <!-- Barra de Busca e Filtros -->
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
          placeholder="Buscar cursos..."
          class="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
        />
      </div>

      <!-- Filtro por Secretaria -->
      <div class="w-full md:w-52">
        <q-select
          v-model="secretariaFiltro"
          :options="secretariaOptions"
          option-value="id"
          option-label="sigla"
          emit-value
          map-options
          dense
          outlined
          label="Secretaria"
          clearable
          class="text-xs rounded-xl bg-white"
          @update:model-value="applyFilters"
        />
      </div>
    </div>

    <!-- Pills de Filtro por Status -->
    <div class="flex flex-wrap items-center gap-2">
      <button
        v-for="filtro in filtros"
        :key="filtro.value"
        @click="filtroAtivo = filtro.value"
        class="px-4 py-2 text-xs font-bold rounded-xl transition-all border"
        :class="
          filtroAtivo === filtro.value
            ? 'bg-[#0F4C81] text-white border-[#0F4C81] shadow-sm'
            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
        "
      >
        {{ filtro.label }}
        <span
          v-if="filtro.value !== 'todos'"
          class="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-[10px]"
        >{{ contarStatus(filtro.value) }}</span>
      </button>
    </div>

    <!-- Skeleton Loading -->
    <div v-if="courseStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="n in 6"
        :key="n"
        class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm animate-pulse"
      >
        <div class="bg-slate-200 h-28 w-full" />
        <div class="p-6 space-y-3">
          <div class="h-4 bg-slate-200 rounded w-3/4" />
          <div class="h-3 bg-slate-100 rounded w-1/2" />
          <div class="h-2.5 bg-slate-100 rounded-full w-full mt-4" />
          <div class="h-10 bg-slate-100 rounded-xl mt-4" />
        </div>
      </div>
    </div>

    <!-- Grid de Cursos -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="curso in cursosFiltrados"
        :key="curso.id"
        class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
      >
        <!-- Banner Superior -->
        <div
          class="p-6 text-white relative flex items-start justify-between min-h-[120px] overflow-hidden bg-cover bg-center"
          :class="bannerClass(curso.status)"
          :style="curso.capaUrl ? `background-image: url('${getMediaUrl(curso.capaUrl)}')` : ''"
        >
          <!-- Overlay Escuro para Capa -->
          <div v-if="curso.capaUrl" class="absolute inset-0 bg-slate-900/50 z-0 pointer-events-none"></div>

          <span
            class="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold backdrop-blur-sm relative z-10"
          >
            {{ curso.categoria || 'Geral' }}
          </span>
          <!-- Badge de trilha -->
          <span
            v-if="curso.trilha"
            class="px-2 py-0.5 bg-white/20 text-white rounded-full text-[10px] font-semibold absolute bottom-3 left-6 z-10 backdrop-blur-sm"
          >
            📍 {{ curso.trilha.tituloTrilha }}
          </span>
          <q-icon
            name="menu_book"
            size="72px"
            class="text-white/20 absolute -right-2 -bottom-3 pointer-events-none z-10"
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

            <!-- Progresso (só exibe se inscrito) -->
            <div v-if="curso.status !== 'nao_inscrito'" class="space-y-1.5 pt-2">
              <div class="flex justify-between items-center text-xs font-bold">
                <span class="text-slate-500">Progresso</span>
                <span class="text-[#0F4C81]">{{ curso.progresso }}%</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  class="h-2.5 rounded-full transition-all duration-500"
                  :class="curso.status === 'concluido' ? 'bg-emerald-500' : 'bg-[#0F4C81]'"
                  :style="{ width: curso.progresso + '%' }"
                />
              </div>
            </div>
          </div>

          <!-- Botão de Ação -->
          <router-link
            :to="`/servidor/cursos/${curso.id}`"
            class="block w-full py-3 text-center text-xs font-bold rounded-xl transition-colors shadow-sm"
            :class="
              curso.status === 'em_andamento'
                ? 'bg-[#0F4C81] hover:bg-[#0C3B66] text-white'
                : curso.status === 'concluido'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-white hover:bg-slate-50 border border-slate-300 text-slate-700'
            "
          >
            {{
              curso.status === 'em_andamento'
                ? 'Continuar'
                : curso.status === 'concluido'
                  ? 'Rever curso'
                  : 'Acessar curso'
            }}
          </router-link>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="!courseStore.loading && cursosFiltrados.length === 0"
      class="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3"
    >
      <q-icon name="search_off" size="56px" class="text-slate-300" />
      <h3 class="font-bold text-slate-700 text-lg">Nenhum curso encontrado</h3>
      <p class="text-xs text-slate-500">Tente ajustar a busca ou o filtro selecionado.</p>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCourseStore } from 'src/stores/courseStore'
import { getMediaUrl } from 'src/utils/media'

const courseStore = useCourseStore()

const searchQuery = ref('')
const filtroAtivo = ref('todos')
const secretariaFiltro = ref(null)

const filtros = [
  { label: 'Todos', value: 'todos' },
  { label: 'Em andamento', value: 'em_andamento' },
  { label: 'Concluídos', value: 'concluido' },
  { label: 'Não iniciados', value: 'nao_iniciado' },
]

// Todas as secretarias para o select de filtro
const secretariaOptions = computed(() => [
  { id: null, sigla: 'Todas as Secretarias' },
  ...courseStore.secretarias,
])

// Join entre catálogo público e meus cursos para derivar status e progresso
const cursosComProgresso = computed(() => {
  const myCoursesMap = {}
  courseStore.myCourses.forEach((mc) => {
    myCoursesMap[mc.id] = mc
  })

  return courseStore.courses.map((curso) => {
    const myCourse = myCoursesMap[curso.id]
    return {
      ...curso,
      status: myCourse?.status ?? 'nao_inscrito',
      progresso: myCourse?.progresso ?? 0,
    }
  })
})

const cursosFiltrados = computed(() => {
  return cursosComProgresso.value.filter((c) => {
    const matchFiltro = filtroAtivo.value === 'todos' || c.status === filtroAtivo.value
    const matchBusca =
      !searchQuery.value ||
      c.titulo?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.categoria?.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchFiltro && matchBusca
  })
})

function contarStatus(status) {
  return cursosComProgresso.value.filter((c) => c.status === status).length
}

async function applyFilters() {
  await courseStore.fetchCourses({
    search: searchQuery.value,
    secretariaId: secretariaFiltro.value,
  })
}

function bannerClass(status) {
  if (status === 'em_andamento') return 'bg-[#0F4C81]'
  if (status === 'concluido') return 'bg-emerald-700'
  return 'bg-slate-700'
}

function statusBadgeClass(status) {
  if (status === 'em_andamento') return 'bg-amber-100 text-amber-800'
  if (status === 'concluido') return 'bg-emerald-100 text-emerald-800'
  if (status === 'nao_inscrito') return 'bg-blue-50 text-blue-700'
  return 'bg-slate-100 text-slate-600'
}

function statusText(status) {
  if (status === 'em_andamento') return 'Em andamento'
  if (status === 'concluido') return 'Concluído'
  if (status === 'nao_inscrito') return 'Disponível'
  return 'Não iniciado'
}

onMounted(async () => {
  await Promise.all([
    courseStore.fetchCourses(),
    courseStore.fetchMyCourses(),
    courseStore.fetchSecretarias(),
  ])
})
</script>
