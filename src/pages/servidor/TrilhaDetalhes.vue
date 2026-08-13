<template>
  <q-page class="p-4 sm:p-8 max-w-5xl mx-auto space-y-8 font-sans pb-20">

    <!-- Loading State -->
    <div v-if="loading" class="space-y-8">
      <div class="h-8 bg-slate-200 rounded animate-pulse w-48" />
      <div class="bg-white rounded-3xl border border-slate-200 p-8 animate-pulse space-y-4">
        <div class="h-4 bg-slate-200 rounded w-24" />
        <div class="h-7 bg-slate-200 rounded w-2/3" />
        <div class="h-3 bg-slate-100 rounded w-full" />
        <div class="h-2.5 bg-slate-100 rounded-full w-full mt-2" />
      </div>
      <div class="space-y-4">
        <div v-for="n in 3" :key="n" class="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse flex gap-4 items-center">
          <div class="w-12 h-12 bg-slate-200 rounded-xl shrink-0" />
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-slate-200 rounded w-1/2" />
            <div class="h-3 bg-slate-100 rounded w-1/3" />
          </div>
        </div>
      </div>
    </div>

    <!-- Erro / Não encontrado -->
    <div v-else-if="!trilha" class="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
      <q-icon name="route" size="56px" class="text-slate-300" />
      <h2 class="font-bold text-slate-700 text-lg">Trilha não encontrada</h2>
      <p class="text-xs text-slate-500">Esta trilha pode ter sido removida ou o link está incorreto.</p>
      <router-link to="/servidor/trilhas" class="inline-block mt-2 text-xs font-bold text-pmvc-blue hover:underline">
        ← Voltar às Trilhas
      </router-link>
    </div>

    <!-- Conteúdo da Trilha -->
    <template v-else>
      <!-- Breadcrumb -->
      <router-link
        to="/servidor/trilhas"
        class="inline-flex items-center gap-1.5 text-xs font-bold text-pmvc-blue hover:underline"
      >
        <q-icon name="arrow_back" size="16px" /> Todas as Trilhas
      </router-link>

      <!-- Card Hero da Trilha -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <!-- Banner de topo -->
        <div class="bg-[#0F4C81] p-7 text-white relative overflow-hidden">
          <div class="relative z-10 space-y-3">
            <div class="flex items-center gap-3">
              <span class="px-3 py-1 text-xs font-bold rounded-full" :class="nivelClass">
                {{ nivelLabel }}
              </span>
              <span v-if="trilha.eixo" class="px-3 py-1 bg-white/15 rounded-full text-[11px] font-semibold">
                {{ trilha.eixo.nomeEixo }}
              </span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold leading-tight">{{ trilha.tituloTrilha }}</h1>
            <p class="text-sm text-white/80">
              Trilha de capacitação · {{ trilha.courses?.length || 0 }} cursos · {{ trilha.cargaHorariaTotal }}h de conteúdo
            </p>
          </div>
          <q-icon name="route" size="120px" class="text-white/5 absolute -right-6 -bottom-6 pointer-events-none" />
        </div>

        <!-- Progresso Geral -->
        <div class="p-6 border-t border-slate-100 space-y-2">
          <div class="flex justify-between items-center text-xs font-bold">
            <span class="text-slate-600">Seu progresso na trilha</span>
            <span class="text-[#0F4C81] text-sm">{{ progressoGeral }}%</span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              class="h-3 rounded-full transition-all duration-700"
              :class="progressoGeral >= 100 ? 'bg-emerald-500' : 'bg-[#0F4C81]'"
              :style="{ width: progressoGeral + '%' }"
            />
          </div>
          <p class="text-[11px] text-slate-400">
            {{ cursosConcluidosCount }} de {{ trilha.courses?.length || 0 }} cursos concluídos
          </p>
        </div>
      </div>

      <!-- Lista de Cursos da Trilha -->
      <div class="space-y-4">
        <h2 class="text-base font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <q-icon name="list_alt" size="20px" class="text-pmvc-blue" />
          Cursos desta trilha
        </h2>

        <div class="space-y-3">
          <div
            v-for="(curso, idx) in cursosEnriquecidos"
            :key="curso.id"
            class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center gap-4"
          >
            <!-- Número + Ícone -->
            <div class="flex items-center gap-4 shrink-0">
              <div
                class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold shrink-0"
                :class="curso.status === 'concluido' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'"
              >
                <q-icon v-if="curso.status === 'concluido'" name="check_circle" size="22px" class="text-emerald-600" />
                <span v-else>{{ idx + 1 }}</span>
              </div>
            </div>

            <!-- Info do Curso -->
            <div class="flex-1 min-w-0 space-y-1">
              <div class="flex items-start justify-between gap-2 flex-wrap">
                <h3 class="font-extrabold text-slate-900 text-sm leading-snug">{{ curso.titulo }}</h3>
                <span
                  class="px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0"
                  :class="statusBadgeClass(curso.status)"
                >
                  {{ statusText(curso.status) }}
                </span>
              </div>
              <p class="text-[11px] text-slate-400 font-semibold">
                {{ curso.categoria || 'Geral' }} · {{ curso.cargaHoraria }}h
                <span v-if="curso.secretaria"> · {{ curso.secretaria.sigla }}</span>
              </p>

              <!-- Mini barra de progresso (se inscrito) -->
              <div v-if="curso.status !== 'nao_inscrito'" class="flex items-center gap-2 pt-1">
                <div class="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    class="h-1.5 rounded-full"
                    :class="curso.status === 'concluido' ? 'bg-emerald-500' : 'bg-[#0F4C81]'"
                    :style="{ width: (curso.progresso || 0) + '%' }"
                  />
                </div>
                <span class="text-[10px] font-bold text-slate-500 shrink-0">{{ curso.progresso || 0 }}%</span>
              </div>
            </div>

            <!-- Botão de Ação -->
            <router-link
              :to="`/servidor/cursos/${curso.id}`"
              class="shrink-0 px-5 py-2.5 text-xs font-bold rounded-xl transition-colors"
              :class="
                curso.status === 'em_andamento'
                  ? 'bg-[#0F4C81] hover:bg-[#0C3B66] text-white'
                  : curso.status === 'concluido'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700'
              "
            >
              {{
                curso.status === 'em_andamento' ? 'Continuar' :
                curso.status === 'concluido' ? 'Rever' : 'Iniciar'
              }}
            </router-link>
          </div>
        </div>
      </div>
    </template>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCourseStore } from 'src/stores/courseStore'
import { api } from 'src/boot/axios'

const route = useRoute()
const courseStore = useCourseStore()

const trilha = ref(null)
const loading = ref(false)

// Nível derivado da carga horária (sem necessidade de migration)
const nivelLabel = computed(() => {
  const h = trilha.value?.cargaHorariaTotal || 0
  if (h <= 12) return 'Básico'
  if (h <= 20) return 'Intermediário'
  return 'Avançado'
})

const nivelClass = computed(() => {
  const n = nivelLabel.value
  if (n === 'Básico') return 'bg-emerald-100/30 text-emerald-100 border border-emerald-300/30'
  if (n === 'Intermediário') return 'bg-amber-100/20 text-amber-100 border border-amber-300/30'
  return 'bg-indigo-100/20 text-indigo-100 border border-indigo-300/30'
})

// Map de meus cursos para join de progresso
const myCoursesMap = computed(() => {
  const map = {}
  courseStore.myCourses.forEach((mc) => { map[mc.id] = mc })
  return map
})

// Cursos enriquecidos com progresso do usuário
const cursosEnriquecidos = computed(() => {
  if (!trilha.value?.courses) return []
  return trilha.value.courses.map((curso) => {
    const myCourse = myCoursesMap.value[curso.id]
    return {
      ...curso,
      status: myCourse?.status ?? 'nao_inscrito',
      progresso: myCourse?.progresso ?? 0,
    }
  })
})

const cursosConcluidosCount = computed(() =>
  cursosEnriquecidos.value.filter((c) => c.status === 'concluido').length
)

const progressoGeral = computed(() => {
  const cursos = cursosEnriquecidos.value
  if (!cursos.length) return 0
  const soma = cursos.reduce((acc, c) => acc + (c.progresso || 0), 0)
  return Math.round(soma / cursos.length)
})

function statusBadgeClass(status) {
  if (status === 'em_andamento') return 'bg-amber-100 text-amber-800'
  if (status === 'concluido') return 'bg-emerald-100 text-emerald-800'
  if (status === 'nao_inscrito') return 'bg-blue-50 text-blue-700'
  return 'bg-slate-100 text-slate-600'
}

function statusText(status) {
  if (status === 'em_andamento') return 'Em andamento'
  if (status === 'concluido') return 'Concluído ✓'
  if (status === 'nao_inscrito') return 'Disponível'
  return 'Não iniciado'
}

onMounted(async () => {
  loading.value = true
  try {
    const [trilhaRes] = await Promise.all([
      api.get(`/learning-paths/${route.params.id}`),
      courseStore.fetchMyCourses(),
    ])
    trilha.value = trilhaRes.data
  } catch (err) {
    console.error('Erro ao carregar trilha:', err)
    trilha.value = null
  } finally {
    loading.value = false
  }
})
</script>
