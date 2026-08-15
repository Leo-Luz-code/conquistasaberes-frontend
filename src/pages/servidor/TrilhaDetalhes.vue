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
        <div
          class="p-7 sm:p-10 text-white relative overflow-hidden bg-cover bg-center"
          :class="trilha.isEnrolled && trilha.progress >= 100 ? 'bg-gradient-to-r from-emerald-600 to-teal-700' : 'bg-[#0F4C81]'"
          :style="trilha.capaUrl ? `background-image: url('${getMediaUrl(trilha.capaUrl)}')` : ''"
        >
          <!-- Overlay escuro se tiver capaUrl -->
          <div v-if="trilha.capaUrl" class="absolute inset-0 bg-slate-900/70 z-0 pointer-events-none"></div>

          <div class="relative z-10 space-y-4 max-w-3xl">
            <div class="flex items-center gap-3 flex-wrap">
              <span class="px-3 py-1 text-xs font-bold rounded-full backdrop-blur-sm" :class="nivelClass">
                {{ nivelLabel }}
              </span>
              <span
                v-if="trilha.isEnrolled"
                class="px-3 py-1 rounded-full text-[11px] font-bold backdrop-blur-sm"
                :class="trilha.progress >= 100 ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-slate-900'"
              >
                {{ trilha.progress >= 100 ? '✓ Trilha Concluída' : 'Em Andamento' }}
              </span>
            </div>

            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">{{ trilha.tituloTrilha }}</h1>
            <p class="text-sm sm:text-base text-blue-100">
              Trilha de capacitação · {{ trilha.courses?.length || 0 }} cursos integrados · {{ trilha.cargaHorariaTotal }}h de carga horária total
            </p>

            <!-- Botão de inscrição no banner se não inscrito -->
            <div v-if="!trilha.isEnrolled" class="pt-2">
              <q-btn
                unelevated
                color="amber-5"
                text-color="dark"
                icon="how_to_reg"
                label="Inscrever-se nesta Trilha Completa"
                class="px-6 py-3 font-bold rounded-xl shadow-md text-sm"
                :loading="matriculando"
                @click="inscreverNaTrilha"
              />
            </div>
          </div>
          <q-icon name="route" size="140px" class="text-white/10 absolute -right-6 -bottom-6 pointer-events-none" />
        </div>

        <!-- Progresso Geral (Se matriculado) -->
        <div v-if="trilha.isEnrolled" class="p-6 border-t border-slate-100 space-y-2">
          <div class="flex justify-between items-center text-xs font-bold">
            <span class="text-slate-600">Seu progresso na trilha</span>
            <span class="text-[#0F4C81] text-sm">{{ trilha.progress }}%</span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              class="h-3 rounded-full transition-all duration-700"
              :class="trilha.progress >= 100 ? 'bg-emerald-500' : 'bg-[#0F4C81]'"
              :style="{ width: trilha.progress + '%' }"
            />
          </div>
          <p class="text-[11px] text-slate-400">
            {{ trilha.concluidosCount || 0 }} de {{ trilha.courses?.length || 0 }} cursos concluídos
          </p>
        </div>

        <!-- Aviso se não matriculado -->
        <div v-else class="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4 flex-wrap">
          <div class="flex items-center gap-3 text-xs text-slate-600">
            <q-icon name="school" size="20px" class="text-[#0F4C81]" />
            <span>Matricule-se para acompanhar seu progresso e receber certificados ao concluir cada etapa.</span>
          </div>
          <q-btn
            unelevated
            color="primary"
            label="Inscrever-se"
            size="sm"
            class="px-4 py-2 font-bold rounded-xl bg-[#0F4C81]"
            :loading="matriculando"
            @click="inscreverNaTrilha"
          />
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
            v-for="(curso, idx) in trilha.courses"
            :key="curso.id"
            class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center gap-4"
          >
            <!-- Número + Ícone -->
            <div class="flex items-center gap-4 shrink-0">
              <div
                class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold shrink-0"
                :class="curso.status === 'CONCLUIDO' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'"
              >
                <q-icon v-if="curso.status === 'CONCLUIDO'" name="check_circle" size="22px" class="text-emerald-600" />
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
              <div v-if="curso.isEnrolled" class="flex items-center gap-2 pt-1">
                <div class="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    class="h-1.5 rounded-full"
                    :class="curso.status === 'CONCLUIDO' ? 'bg-emerald-500' : 'bg-[#0F4C81]'"
                    :style="{ width: (curso.progress || 0) + '%' }"
                  />
                </div>
                <span class="text-[10px] font-bold text-slate-500 shrink-0">{{ curso.progress || 0 }}%</span>
              </div>
            </div>

            <!-- Botão de Ação -->
            <router-link
              :to="`/servidor/cursos/${curso.id}`"
              class="shrink-0 px-5 py-2.5 text-xs font-bold rounded-xl transition-colors text-center"
              :class="
                curso.status === 'EM_ANDAMENTO'
                  ? 'bg-[#0F4C81] hover:bg-[#0C3B66] text-white'
                  : curso.status === 'CONCLUIDO'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700'
              "
            >
              {{
                curso.status === 'EM_ANDAMENTO' ? 'Continuar' :
                curso.status === 'CONCLUIDO' ? 'Rever' : 'Acessar Aula'
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
import { getMediaUrl } from 'src/utils/media'

const route = useRoute()
const courseStore = useCourseStore()

const trilha = ref(null)
const loading = ref(false)
const matriculando = ref(false)

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

function statusBadgeClass(status) {
  if (status === 'EM_ANDAMENTO') return 'bg-amber-100 text-amber-800'
  if (status === 'CONCLUIDO') return 'bg-emerald-100 text-emerald-800'
  if (status === 'DISPONIVEL') return 'bg-blue-50 text-blue-700'
  return 'bg-slate-100 text-slate-600'
}

function statusText(status) {
  if (status === 'EM_ANDAMENTO') return 'Em andamento'
  if (status === 'CONCLUIDO') return 'Concluído ✓'
  if (status === 'DISPONIVEL') return 'Disponível'
  return 'Não iniciado'
}

async function carregarTrilha() {
  loading.value = true
  try {
    const { data } = await api.get(`/learning-paths/${route.params.id}`)
    trilha.value = data
  } catch (err) {
    console.error('Erro ao carregar trilha:', err)
    trilha.value = null
  } finally {
    loading.value = false
  }
}

async function inscreverNaTrilha() {
  if (!trilha.value) return
  matriculando.value = true
  try {
    await courseStore.enrollLearningPath(trilha.value.id)
    await carregarTrilha()
  } catch (error) {
    console.error('Erro ao se inscrever na trilha:', error)
  } finally {
    matriculando.value = false
  }
}

onMounted(() => {
  carregarTrilha()
})
</script>
