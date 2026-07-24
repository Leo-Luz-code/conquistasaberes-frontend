<template>
  <q-page class="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans">
    <div v-if="courseStore.loadingDetail" class="flex justify-center py-20">
      <q-spinner-dots color="primary" size="50px" />
    </div>

    <template v-else-if="course">
      <!-- Breadcrumb e Voltar -->
      <div class="flex items-center justify-between">
        <router-link to="/servidor/cursos" class="inline-flex items-center gap-1.5 text-xs font-bold text-pmvc-blue hover:underline">
          <q-icon name="arrow_back" /> Voltar ao Catálogo
        </router-link>
        <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {{ course.categoria || 'Geral' }} • {{ course.cargaHoraria }}h
        </span>
      </div>

      <!-- Cabecalho do Curso -->
      <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="space-y-1">
            <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900">{{ course.titulo }}</h1>
            <p class="text-xs text-slate-500 max-w-3xl">{{ course.descricao }}</p>
          </div>

          <!-- Ação de Inscrição se ainda não matriculado -->
          <div v-if="!course.isEnrolled">
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
          <div v-else class="text-right">
            <span class="block text-[10px] font-bold text-slate-400 uppercase">Seu Progresso</span>
            <span class="text-lg font-extrabold text-pmvc-blue">{{ course.userProgress || 0 }}%</span>
          </div>
        </div>

        <q-linear-progress
          v-if="course.isEnrolled"
          :value="(course.userProgress || 0) / 100"
          color="primary"
          class="h-2.5 rounded-full"
        />
      </div>

      <!-- Layout Principal do AVA: Syllabus (Esquerda) + Player/Conteudo (Direita) -->
      <div v-if="course.isEnrolled" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Syllabus / Lista de Modulos (1 Coluna) -->
        <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden space-y-2 p-4 h-fit">
          <h3 class="font-extrabold text-slate-800 text-sm uppercase tracking-wider mb-2 px-2">
            Plano de Aulas
          </h3>

          <div v-for="module in course.modules" :key="module.id" class="space-y-1">
            <div class="px-3 py-2 bg-slate-100 rounded-lg text-xs font-bold text-slate-700 uppercase flex items-center justify-between">
              <span>Módulo {{ module.ordem }}: {{ module.titulo }}</span>
            </div>

            <div class="pl-2 space-y-1">
              <button
                v-for="lesson in module.lessons"
                :key="lesson.id"
                @click="selectLesson(lesson)"
                class="w-full text-left p-2.5 rounded-lg text-xs font-medium transition-all flex items-center justify-between gap-2"
                :class="currentLesson?.id === lesson.id ? 'bg-blue-50 text-pmvc-blue font-bold border-l-4 border-pmvc-blue' : 'hover:bg-slate-50 text-slate-600'"
              >
                <div class="flex items-center gap-2 truncate">
                  <q-icon
                    :name="lesson.tipo === 'VIDEO' ? 'play_circle' : lesson.tipo === 'QUIZ' ? 'quiz' : 'description'"
                    size="16px"
                    class="shrink-0 text-slate-400"
                  />
                  <span class="truncate">{{ lesson.titulo }}</span>
                </div>
                <q-icon
                  v-if="lesson.completed"
                  name="check_circle"
                  class="text-emerald-500 shrink-0"
                  size="16px"
                />
              </button>
            </div>
          </div>
        </div>

        <!-- Player de Conteudo (2 Colunas) -->
        <div class="lg:col-span-2 space-y-6">
          <div v-if="currentLesson" class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div class="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span class="px-2 py-0.5 bg-blue-50 text-pmvc-blue font-bold text-[10px] uppercase rounded">
                  {{ currentLesson.tipo }}
                </span>
                <h2 class="text-xl font-bold text-slate-900 mt-1">{{ currentLesson.titulo }}</h2>
              </div>
              <span class="text-xs text-slate-400 font-semibold flex items-center gap-1">
                <q-icon name="schedule" /> {{ currentLesson.duracaoMin || 10 }} min
              </span>
            </div>

            <!-- Renderer de Conteudo Baseado no Tipo -->
            <div class="min-h-[250px] bg-slate-50 rounded-xl p-4 border border-slate-200">
              <!-- Video -->
              <div v-if="currentLesson.tipo === 'VIDEO'" class="aspect-video w-full rounded-lg overflow-hidden bg-black flex items-center justify-center">
                <iframe
                  v-if="currentLesson.conteudoUrl"
                  :src="currentLesson.conteudoUrl"
                  class="w-full h-full border-0"
                  allowfullscreen
                ></iframe>
                <div v-else class="text-white text-center p-6 space-y-2">
                  <q-icon name="play_circle" size="48px" class="text-pmvc-blue" />
                  <p class="text-sm font-semibold">Vídeo de Capacitação Institucional</p>
                </div>
              </div>

              <!-- Texto / PDF -->
              <div v-else-if="currentLesson.tipo === 'TEXTO' || currentLesson.tipo === 'PDF'" class="prose max-w-none text-slate-700 text-sm space-y-4">
                <p v-if="currentLesson.texto">{{ currentLesson.texto }}</p>
                <div v-else class="p-6 text-center space-y-3">
                  <q-icon name="picture_as_pdf" size="48px" class="text-rose-500" />
                  <p class="font-bold text-slate-800">Material de Leitura Oficial em PDF</p>
                  <a :href="currentLesson.conteudoUrl || '#'" target="_blank" class="inline-block py-2 px-4 bg-pmvc-blue text-white rounded-lg font-bold text-xs">
                    Abrir Documento PDF
                  </a>
                </div>
              </div>

              <!-- Quiz Dinâmico -->
              <div v-else-if="currentLesson.tipo === 'QUIZ'" class="space-y-4">
                <div class="flex items-center gap-2 text-amber-700 font-bold text-sm">
                  <q-icon name="help" size="20px" /> Avaliação de Aprendizagem
                </div>
                <p class="text-xs text-slate-600">Responda à avaliação para validar o conhecimento adquirido nesta aula:</p>

                <!-- Se o Quiz possui perguntas válidas -->
                <div v-if="parsedQuiz && parsedQuiz.length > 0" class="space-y-4">
                  <div
                    v-for="(qItem, qIdx) in parsedQuiz"
                    :key="qItem.id"
                    class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3"
                  >
                    <p class="font-bold text-slate-900 text-xs sm:text-sm">
                      {{ qIdx + 1 }}. {{ qItem.pergunta }}
                    </p>

                    <div class="space-y-2">
                      <div
                        v-for="(opcao, optIdx) in qItem.opcoes"
                        :key="optIdx"
                        class="flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer"
                        :class="userAnswers[qItem.id] === optIdx ? 'bg-blue-50 border-pmvc-blue text-pmvc-blue font-bold shadow-xs' : 'border-slate-200 hover:bg-slate-50 text-slate-700'"
                        @click="userAnswers[qItem.id] = optIdx"
                      >
                        <q-radio v-model="userAnswers[qItem.id]" :val="optIdx" color="primary" dense />
                        <span class="text-xs leading-relaxed">
                          <strong class="mr-1">{{ String.fromCharCode(65 + optIdx) }})</strong> {{ opcao }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Se o Quiz estiver vazio ou inválido -->
                <div v-else class="p-6 bg-amber-50 border border-amber-200 rounded-xl text-center space-y-2">
                  <q-icon name="warning" size="36px" color="amber-8" />
                  <p class="font-bold text-slate-800 text-sm">Nenhuma pergunta encontrada</p>
                  <p class="text-xs text-slate-600">Este quiz ainda não possui perguntas cadastradas ou os dados estão em formato incompleto.</p>
                </div>
              </div>
            </div>

            <!-- Botao Concluir Aula -->
            <div class="flex justify-end pt-2">
              <q-btn
                :label="currentLesson.completed ? 'AULA JÁ CONCLUÍDA' : 'CONCLUIR AULA & GANHAR XP'"
                :color="currentLesson.completed ? 'grey-7' : 'positive'"
                icon="check_circle"
                class="!py-3 !px-6 font-bold"
                unelevated
                no-caps
                :disabled="currentLesson.completed"
                @click="handleCompleteLesson"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCourseStore } from 'src/stores/courseStore';

const route = useRoute();
const courseStore = useCourseStore();
const currentLesson = ref(null);
const userAnswers = ref({});

const course = computed(() => courseStore.currentCourse);

// Parser dinâmico que converte qualquer formato de quizData em uma lista padronizada de perguntas
const parsedQuiz = computed(() => {
  if (!currentLesson.value || currentLesson.value.tipo !== 'QUIZ' || !currentLesson.value.quizData) {
    return null;
  }

  let raw = currentLesson.value.quizData;

  if (typeof raw === 'string') {
    try {
      raw = JSON.parse(raw);
    } catch (e) {
      console.error('Erro ao interpretar o JSON do quizData:', e);
      return null;
    }
  }

  if (!raw) return null;

  const questionsList = [];

  // Formato 1: { questions: [...] } (Utilizado nos seeds)
  if (raw.questions && Array.isArray(raw.questions)) {
    raw.questions.forEach((q, idx) => {
      const questionText = q.question || q.pergunta || `Pergunta ${idx + 1}`;
      const optionsList = q.options || q.opcoes || [];
      const correctIdx = q.correctIndex !== undefined ? q.correctIndex : (q.respostaCorreta !== undefined ? q.respostaCorreta : 0);

      questionsList.push({
        id: q.id || idx + 1,
        pergunta: questionText,
        opcoes: optionsList,
        respostaCorreta: correctIdx,
      });
    });
  }
  // Formato 2: { pergunta: "...", opcoes: [...], respostaCorreta: 0 } (Criado via formulário Admin)
  else if (raw.pergunta || raw.question) {
    const questionText = raw.pergunta || raw.question;
    const optionsList = raw.opcoes || raw.options || [];
    const correctIdx = raw.respostaCorreta !== undefined ? raw.respostaCorreta : (raw.correctIndex !== undefined ? raw.correctIndex : 0);

    questionsList.push({
      id: 1,
      pergunta: questionText,
      opcoes: optionsList,
      respostaCorreta: correctIdx,
    });
  }
  // Formato 3: Array direto [...]
  else if (Array.isArray(raw)) {
    raw.forEach((q, idx) => {
      const questionText = q.question || q.pergunta || `Pergunta ${idx + 1}`;
      const optionsList = q.options || q.opcoes || [];
      const correctIdx = q.correctIndex !== undefined ? q.correctIndex : (q.respostaCorreta !== undefined ? q.respostaCorreta : 0);

      questionsList.push({
        id: q.id || idx + 1,
        pergunta: questionText,
        opcoes: optionsList,
        respostaCorreta: correctIdx,
      });
    });
  }

  return questionsList.length > 0 ? questionsList : null;
});

// Limpar respostas ao trocar de aula
watch(currentLesson, () => {
  userAnswers.value = {};
});

onMounted(async () => {
  const courseId = route.params.id;
  const data = await courseStore.fetchCourseDetail(courseId);
  if (data?.modules?.[0]?.lessons?.[0]) {
    currentLesson.value = data.modules[0].lessons[0];
  }
});

function selectLesson(lesson) {
  currentLesson.value = lesson;
}

async function handleEnroll() {
  await courseStore.enrollInCourse(route.params.id);
}

async function handleCompleteLesson() {
  if (!currentLesson.value) return;
  const res = await courseStore.completeLesson(currentLesson.value.id);
  currentLesson.value.completed = true;
  await courseStore.fetchCourseDetail(route.params.id);
}
</script>
