<template>
  <q-page class="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans">
    <!-- Loading State -->
    <div v-if="courseStore.loadingDetail" class="space-y-6">
      <div class="h-6 bg-slate-200 rounded animate-pulse w-32" />
      <div class="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse space-y-3">
        <div class="h-6 bg-slate-200 rounded w-2/3" />
        <div class="h-3 bg-slate-100 rounded w-full" />
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 bg-white rounded-2xl border border-slate-200 animate-pulse">
          <div class="aspect-video bg-slate-200 rounded-t-2xl" />
          <div class="p-5 space-y-3">
            <div class="h-4 bg-slate-200 rounded w-1/2" />
            <div class="h-3 bg-slate-100 rounded w-3/4" />
          </div>
        </div>
        <div class="space-y-3">
          <div class="bg-white rounded-xl border border-slate-200 p-4 animate-pulse h-14" />
          <div class="bg-white rounded-2xl border border-slate-200 p-4 animate-pulse space-y-2.5">
            <div v-for="n in 7" :key="n" class="h-9 bg-slate-100 rounded-lg" />
          </div>
        </div>
      </div>
    </div>

    <template v-else-if="course">
      <!-- Breadcrumb e Voltar -->
      <div class="flex items-center justify-between">
        <router-link
          to="/servidor/cursos"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-pmvc-blue hover:underline"
        >
          <q-icon name="arrow_back" /> Voltar ao Catálogo
        </router-link>
        <div
          class="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider"
        >
          <span>{{ course.categoria || 'Geral' }}</span>
          <span>•</span>
          <span>{{ course.cargaHoraria }}h</span>
          <span>•</span>
          <span>{{ course.titulo }}</span>
          <span v-if="course.trilha" class="text-pmvc-blue"
            >• {{ course.trilha.tituloTrilha }}</span
          >
        </div>
      </div>

      <!-- Cabeçalho do Curso (compacto) -->
      <div
        v-if="(course.isEnrolled && (course.userProgress || 0) >= 100) || !course.isEnrolled"
        class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
      >
        <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <!-- Botão de inscrição (só se não matriculado) -->
          <div v-if="!course.isEnrolled" class="shrink-0">
            <q-btn
              label="INSCREVER-SE NO CURSO"
              color="primary"
              icon="school"
              class="!py-3 !px-6 bg-pmvc-blue text-white font-bold"
              unelevated
              no-caps
              @click="handleEnroll"
            />
          </div>
        </div>

        <!-- Banner de conclusão -->
        <div
          v-if="course.isEnrolled && (course.userProgress || 0) >= 100"
          class="flex items-center justify-between gap-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"
        >
          <div class="flex items-center gap-3">
            <q-icon name="workspace_premium" size="28px" class="text-emerald-600" />
            <div>
              <p class="font-extrabold text-emerald-800 text-sm">Curso concluído! 🎉</p>
              <p class="text-xs text-emerald-700">Seu certificado foi gerado automaticamente.</p>
            </div>
          </div>
          <!-- Download direto do PDF do certificado DESTE curso -->
          <a
            v-if="courseCertificateHash"
            :href="certificateDownloadUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors"
          >
            <q-icon name="download" size="14px" /> Baixar Certificado
          </a>
          <!-- Fallback enquanto o hash ainda não chegou -->
          <router-link
            v-else
            to="/servidor/certificados"
            class="shrink-0 px-4 py-2 bg-emerald-600/70 text-white text-xs font-bold rounded-xl"
          >
            Meus Certificados
          </router-link>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════
           LAYOUT ESTILO UDEMY
           ├── Esquerda 2/3 : player de conteúdo + avaliações
           └── Direita  1/3 : progresso discreto + plano de aulas (sticky)
      ══════════════════════════════════════════════════ -->
      <div v-if="course.isEnrolled" class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <!-- ─── ESQUERDA: Player + Comentários ──────────── -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Card do Player -->
          <div
            v-if="currentLesson"
            class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <!-- Header da Aula -->
            <div class="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
              <div>
                <span
                  class="px-2 py-0.5 bg-blue-50 text-pmvc-blue font-bold text-[10px] uppercase rounded"
                >
                  {{ currentLesson.tipo }}
                </span>
                <h2 class="text-lg font-bold text-slate-900 mt-1">{{ currentLesson.titulo }}</h2>
              </div>
              <span class="text-xs text-slate-400 font-semibold flex items-center gap-1 shrink-0">
                <q-icon name="schedule" /> {{ currentLesson.duracaoMin || 10 }} min
              </span>
            </div>

            <!-- Conteúdo: sem padding lateral para vídeo/PDF ocuparem a largura toda -->
            <div>
              <!-- Vídeo -->
              <div
                v-if="currentLesson.tipo === 'VIDEO'"
                class="aspect-video w-full bg-black flex items-center justify-center"
              >
                <iframe
                  v-if="currentLesson.conteudoUrl"
                  :src="currentLesson.conteudoUrl"
                  class="w-full h-full border-0"
                  allowfullscreen
                />
                <div v-else class="text-center p-8 space-y-3">
                  <q-icon name="play_circle" size="64px" class="text-white/25" />
                  <p class="text-sm font-semibold text-white/60">
                    Vídeo de Capacitação Institucional
                  </p>
                  <p class="text-xs text-white/35">O vídeo será disponibilizado em breve.</p>
                </div>
              </div>

              <!-- PDF via iframe -->
              <div v-else-if="currentLesson.tipo === 'PDF'">
                <iframe
                  v-if="currentLesson.conteudoUrl"
                  :src="currentLesson.conteudoUrl"
                  class="w-full border-0"
                  style="height: 520px"
                />
                <div v-else class="p-10 text-center space-y-3">
                  <q-icon name="picture_as_pdf" size="56px" class="text-rose-400" />
                  <p class="font-bold text-slate-800">Material em PDF</p>
                  <p class="text-xs text-slate-500">O documento será disponibilizado em breve.</p>
                </div>
              </div>

              <!-- Texto / Artigo -->
              <div v-else-if="currentLesson.tipo === 'TEXTO'" class="px-6 py-6">
                <p
                  v-if="currentLesson.texto"
                  class="text-sm text-slate-700 leading-relaxed whitespace-pre-line"
                >
                  {{ currentLesson.texto }}
                </p>
                <div v-else class="py-10 text-center space-y-2">
                  <q-icon name="article" size="48px" class="text-slate-300" />
                  <p class="text-sm text-slate-500">Conteúdo textual não disponível.</p>
                </div>
              </div>

              <!-- Quiz Dinâmico -->
              <div v-else-if="currentLesson.tipo === 'QUIZ'" class="px-6 py-6 space-y-4">
                <div class="flex items-center gap-2 text-amber-700 font-bold text-sm">
                  <q-icon name="help" size="20px" /> Avaliação de Aprendizagem
                </div>
                <p class="text-xs text-slate-500">
                  Responda à avaliação para validar o conhecimento adquirido:
                </p>

                <div v-if="parsedQuiz && parsedQuiz.length > 0" class="space-y-4">
                  <div
                    v-for="(qItem, qIdx) in parsedQuiz"
                    :key="qItem.id"
                    class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3"
                  >
                    <p class="font-bold text-slate-900 text-xs sm:text-sm">
                      {{ qIdx + 1 }}. {{ qItem.pergunta }}
                    </p>
                    <div class="space-y-2">
                      <div
                        v-for="(opcao, optIdx) in qItem.opcoes"
                        :key="optIdx"
                        class="flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer"
                        :class="
                          userAnswers[qItem.id] === optIdx
                            ? 'bg-blue-50 border-pmvc-blue text-pmvc-blue font-bold'
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                        "
                        @click="userAnswers[qItem.id] = optIdx"
                      >
                        <q-radio
                          v-model="userAnswers[qItem.id]"
                          :val="optIdx"
                          color="primary"
                          dense
                        />
                        <span class="text-xs leading-relaxed">
                          <strong class="mr-1">{{ String.fromCharCode(65 + optIdx) }})</strong>
                          {{ opcao }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  v-else
                  class="p-6 bg-amber-50 border border-amber-200 rounded-xl text-center space-y-2"
                >
                  <q-icon name="warning" size="36px" color="amber-8" />
                  <p class="font-bold text-slate-800 text-sm">Nenhuma pergunta cadastrada</p>
                </div>
              </div>
            </div>

            <!-- Barra de navegação: Prev / Concluir / Next -->
            <div
              class="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex-wrap"
            >
              <q-btn
                v-if="prevLesson"
                flat
                no-caps
                icon="arrow_back"
                label="Aula anterior"
                class="text-xs font-semibold text-slate-500 max-w-[170px] truncate"
                @click="selectLesson(prevLesson)"
              />
              <div v-else />

              <q-btn
                :label="isLessonCompleted(currentLesson.id) ? 'AULA CONCLUÍDA ✓' : 'Concluir'"
                :color="isLessonCompleted(currentLesson.id) ? 'grey-6' : 'positive'"
                icon="check_circle"
                class="!py-2.5 !px-5 font-bold text-xs"
                unelevated
                no-caps
                flat
                dense
                :disabled="isLessonCompleted(currentLesson.id) || concludingLesson"
                :loading="concludingLesson"
                @click="handleCompleteLesson"
              />

              <q-btn
                v-if="nextLesson"
                flat
                no-caps
                icon-right="arrow_forward"
                label="Próxima aula"
                class="text-xs font-semibold text-pmvc-blue max-w-[170px] truncate"
                @click="selectLesson(nextLesson)"
              />
              <div v-else />
            </div>
          </div>

          <!-- Estado vazio (nenhuma aula selecionada) -->
          <div
            v-else
            class="bg-white rounded-2xl border border-dashed border-slate-200 p-16 text-center space-y-3"
          >
            <q-icon name="play_circle_outline" size="56px" class="text-slate-300" />
            <p class="font-semibold text-slate-400">
              Selecione uma aula no painel à direita para começar
            </p>
          </div>

          <!-- ─── Zona de Avaliações / Comentários ─────── -->
          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div class="flex items-center gap-2">
                <q-icon name="reviews" color="primary" size="18px" />
                <h3 class="font-extrabold text-slate-800 text-sm">Avaliações do curso</h3>
                <span
                  v-if="courseStore.courseRatings?.totalAvaliacoes"
                  class="px-2 py-0.5 bg-slate-100 rounded-full text-[11px] font-semibold text-slate-500"
                >
                  {{ courseStore.courseRatings.totalAvaliacoes }}
                </span>
              </div>
              <div
                v-if="courseStore.courseRatings?.mediaAvaliacoes"
                class="flex items-center gap-1.5"
              >
                <span class="text-sm font-extrabold text-amber-600">
                  {{ Number(courseStore.courseRatings.mediaAvaliacoes).toFixed(1) }}
                </span>
                <q-rating
                  :model-value="courseStore.courseRatings.mediaAvaliacoes"
                  readonly
                  size="15px"
                  color="amber-6"
                  icon="star_border"
                  icon-selected="star"
                  :max="5"
                />
              </div>
            </div>

            <div
              v-if="courseStore.courseRatings?.avaliacoes?.length"
              class="divide-y divide-slate-100"
            >
              <div
                v-for="avaliacao in courseStore.courseRatings.avaliacoes"
                :key="avaliacao.id"
                class="px-6 py-4 space-y-1.5"
              >
                <div class="flex items-center justify-between flex-wrap gap-2">
                  <div class="flex items-center gap-2">
                    <div
                      class="w-7 h-7 rounded-full bg-pmvc-blue/10 flex items-center justify-center text-pmvc-blue font-extrabold text-xs shrink-0"
                    >
                      {{ (avaliacao.user?.nome || 'S')[0].toUpperCase() }}
                    </div>
                    <span class="text-xs font-bold text-slate-700">
                      {{ avaliacao.user?.nome || 'Servidor(a)' }}
                    </span>
                  </div>
                  <div class="flex items-center gap-2">
                    <q-rating
                      :model-value="avaliacao.rating"
                      readonly
                      size="13px"
                      color="amber-6"
                      icon="star_border"
                      icon-selected="star"
                      :max="5"
                    />
                    <span class="text-[10px] text-slate-400">
                      {{ new Date(avaliacao.createdAt).toLocaleDateString('pt-BR') }}
                    </span>
                  </div>
                </div>
                <p v-if="avaliacao.comment" class="text-xs text-slate-600 leading-relaxed pl-9">
                  {{ avaliacao.comment }}
                </p>
              </div>
            </div>

            <div v-else class="px-6 py-10 text-center space-y-2">
              <q-icon name="rate_review" size="32px" class="text-slate-200" />
              <p class="text-xs text-slate-400 font-medium">Nenhuma avaliação ainda.</p>
            </div>
          </div>
        </div>

        <!-- ─── DIREITA: Progresso + Plano de Aulas (sticky) ── -->
        <div class="space-y-3 lg:sticky lg:top-4">
          <!-- Barra de progresso discreta (mesma largura do syllabus) -->
          <div class="bg-white rounded-xl border border-slate-200 px-4 py-3 shadow-sm">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wide"
                >Progresso do curso</span
              >
              <span class="text-xs font-extrabold text-pmvc-blue"
                >{{ course.userProgress || 0 }}%</span
              >
            </div>
            <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                class="h-1.5 rounded-full transition-all duration-700"
                :class="(course.userProgress || 0) >= 100 ? 'bg-emerald-500' : 'bg-pmvc-blue'"
                :style="{ width: (course.userProgress || 0) + '%' }"
              />
            </div>
            <p class="text-[10px] text-slate-400 mt-1.5 font-medium">
              {{ course.completedLessonIds?.length || 0 }} de
              {{ course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0 }}
              aulas concluídas
            </p>
          </div>

          <!-- Plano de Aulas (scrollável, sticky) -->
          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="px-4 pt-4 pb-2.5">
              <h3 class="font-extrabold text-slate-800 text-xs uppercase tracking-wider">
                Plano de Aulas
              </h3>
            </div>

            <div class="overflow-y-auto" style="max-height: 70vh">
              <div v-for="module in course.modules" :key="module.id">
                <!-- Header do módulo (sticky dentro do scroll) -->
                <div
                  class="px-4 py-2.5 bg-slate-50 border-y border-slate-100 flex items-center justify-between sticky top-0 z-10"
                >
                  <span
                    class="text-[11px] font-bold text-slate-600 uppercase tracking-wide leading-snug"
                  >
                    {{ module.titulo }}
                  </span>
                  <span class="text-[10px] font-semibold text-slate-400 shrink-0 ml-2">
                    {{ concluidasPorModulo(module) }}/{{ module.lessons?.length || 0 }}
                  </span>
                </div>

                <!-- Aulas do módulo -->
                <button
                  v-for="lesson in module.lessons"
                  :key="lesson.id"
                  @click="selectLesson(lesson)"
                  class="w-full text-left px-4 py-3 text-xs flex items-start gap-2.5 border-b border-slate-50 last:border-0 transition-colors"
                  :class="
                    currentLesson?.id === lesson.id
                      ? 'bg-blue-50 text-pmvc-blue font-semibold'
                      : 'hover:bg-slate-50 text-slate-600 font-medium'
                  "
                >
                  <!-- Check ou ícone do tipo -->
                  <div class="shrink-0 mt-0.5">
                    <q-icon
                      v-if="isLessonCompleted(lesson.id)"
                      name="check_circle"
                      size="15px"
                      class="text-emerald-500"
                    />
                    <q-icon
                      v-else
                      :name="lessonIcon(lesson.tipo)"
                      size="15px"
                      :class="currentLesson?.id === lesson.id ? 'text-pmvc-blue' : 'text-slate-400'"
                    />
                  </div>

                  <!-- Título e duração -->
                  <div class="flex-1 min-w-0">
                    <span class="block leading-snug">{{ lesson.titulo }}</span>
                    <span class="text-[10px] text-slate-400 font-normal mt-0.5 block">
                      {{ lesson.duracaoMin || 10 }} min
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Aviso: não matriculado -->
      <div v-else class="bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center space-y-4">
        <q-icon name="school" size="48px" class="text-pmvc-blue" />
        <h2 class="font-extrabold text-slate-800 text-lg">Inscreva-se para acessar o conteúdo</h2>
        <p class="text-sm text-slate-600">
          Clique em "Inscrever-se no Curso" acima para começar sua jornada.
        </p>
      </div>
    </template>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCourseStore } from 'src/stores/courseStore'
import { api } from 'src/boot/axios'

const route = useRoute()
const courseStore = useCourseStore()
const currentLesson = ref(null)
const userAnswers = ref({})
const concludingLesson = ref(false)
// Hash do certificado deste curso (para abrir direto na validação)
const courseCertificateHash = ref(null)

// URL absoluta para download do PDF via backend
const certificateDownloadUrl = computed(() => {
  if (!courseCertificateHash.value) return '#'
  const base = (api.defaults.baseURL || '').replace(/\/+$/, '')
  return `${base}/certificates/download/${encodeURIComponent(courseCertificateHash.value)}`
})

const course = computed(() => courseStore.currentCourse)

// Lista plana de todas as aulas para navegação prev/next
const allLessons = computed(() => {
  if (!course.value?.modules) return []
  return course.value.modules.flatMap((m) => m.lessons || [])
})

const currentLessonIndex = computed(() =>
  allLessons.value.findIndex((l) => l.id === currentLesson.value?.id),
)

const prevLesson = computed(() =>
  currentLessonIndex.value > 0 ? allLessons.value[currentLessonIndex.value - 1] : null,
)

const nextLesson = computed(() =>
  currentLessonIndex.value < allLessons.value.length - 1
    ? allLessons.value[currentLessonIndex.value + 1]
    : null,
)

function isLessonCompleted(lessonId) {
  return course.value?.completedLessonIds?.includes(lessonId) ?? false
}

function concluidasPorModulo(module) {
  return (module.lessons || []).filter((l) => isLessonCompleted(l.id)).length
}

function lessonIcon(tipo) {
  if (tipo === 'VIDEO') return 'play_circle'
  if (tipo === 'QUIZ') return 'quiz'
  if (tipo === 'PDF') return 'picture_as_pdf'
  return 'article'
}

// Parser dinâmico de quizData (mantido integralmente)
const parsedQuiz = computed(() => {
  if (
    !currentLesson.value ||
    currentLesson.value.tipo !== 'QUIZ' ||
    !currentLesson.value.quizData
  ) {
    return null
  }

  let raw = currentLesson.value.quizData

  if (typeof raw === 'string') {
    try {
      raw = JSON.parse(raw)
    } catch (e) {
      console.error('Erro ao interpretar quizData:', e)
      return null
    }
  }

  if (!raw) return null

  const questionsList = []

  if (raw.questions && Array.isArray(raw.questions)) {
    raw.questions.forEach((q, idx) => {
      questionsList.push({
        id: q.id || idx + 1,
        pergunta: q.question || q.pergunta || `Pergunta ${idx + 1}`,
        opcoes: q.options || q.opcoes || [],
        respostaCorreta: q.correctIndex !== undefined ? q.correctIndex : (q.respostaCorreta ?? 0),
      })
    })
  } else if (raw.pergunta || raw.question) {
    questionsList.push({
      id: 1,
      pergunta: raw.pergunta || raw.question,
      opcoes: raw.opcoes || raw.options || [],
      respostaCorreta: raw.respostaCorreta ?? raw.correctIndex ?? 0,
    })
  } else if (Array.isArray(raw)) {
    raw.forEach((q, idx) => {
      questionsList.push({
        id: q.id || idx + 1,
        pergunta: q.question || q.pergunta || `Pergunta ${idx + 1}`,
        opcoes: q.options || q.opcoes || [],
        respostaCorreta: q.correctIndex !== undefined ? q.correctIndex : (q.respostaCorreta ?? 0),
      })
    })
  }

  return questionsList.length > 0 ? questionsList : null
})

watch(currentLesson, () => {
  userAnswers.value = {}
})

onMounted(async () => {
  const courseId = route.params.id
  const data = await courseStore.fetchCourseDetail(courseId)
  await courseStore.fetchCourseRatings(courseId)
  if (data?.modules?.[0]?.lessons?.[0]) {
    currentLesson.value = data.modules[0].lessons[0]
  }
  // Se o curso já estava concluído antes, busca o hash do certificado deste curso
  if (data?.userProgress >= 100) {
    try {
      const { data: certs } = await api.get('/certificates/my-certificates')
      const cert = certs.find((c) => c.courseId === courseId)
      if (cert) courseCertificateHash.value = cert.codigoValidacao
    } catch (e) {
      console.warn('Não foi possível carregar o certificado:', e)
    }
  }
})

function selectLesson(lesson) {
  currentLesson.value = lesson
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function handleEnroll() {
  await courseStore.enrollInCourse(route.params.id)
}

async function handleCompleteLesson() {
  if (!currentLesson.value || concludingLesson.value) return
  concludingLesson.value = true
  try {
    const result = await courseStore.completeLesson(currentLesson.value.id)
    // Captura o hash do certificado se o curso foi concluído nesta aula
    if (result?.newCertificateCode) {
      courseCertificateHash.value = result.newCertificateCode
    }
    await courseStore.fetchCourseDetail(route.params.id)
    if (nextLesson.value) {
      setTimeout(() => selectLesson(nextLesson.value), 1200)
    }
  } finally {
    concludingLesson.value = false
  }
}
</script>
