<template>
  <q-page class="q-pa-md bg-grey-1">
    <!-- Breadcrumbs e Cabeçalho Responsivo -->
    <div class="q-mb-md">
      <q-breadcrumbs active-color="primary" style="font-size: 14px">
        <q-breadcrumbs-el label="Gestão de Cursos" icon="menu_book" to="/admin/cursos" />
        <q-breadcrumbs-el label="Módulos & Aulas" icon="video_library" />
      </q-breadcrumbs>

      <div class="row items-center justify-between q-col-gutter-md q-mt-xs">
        <div class="col-12 col-md-auto">
          <h1 class="text-h5 text-weight-bold text-primary q-my-none row items-center">
            <q-icon name="video_library" class="q-mr-sm" color="primary" size="28px" />
            Gerenciador de Conteúdo do Curso
          </h1>
          <div class="text-caption text-grey-7 q-mt-xs" v-if="course">
            Curso: <strong class="text-primary">{{ course.titulo }}</strong> •
            Carga: {{ course.cargaHoraria }}h •
            Estrutura: {{ modules.length }} Módulo(s)
          </div>
        </div>

        <div class="col-12 col-md-auto row q-gutter-sm">
          <q-btn
            flat
            color="grey-8"
            icon="arrow_back"
            label="Voltar para Cursos"
            to="/admin/cursos"
          />
          <q-btn
            color="secondary"
            icon="add"
            label="Novo Módulo"
            unelevated
            @click="openModuleModal()"
          />
        </div>
      </div>
    </div>

    <!-- Spinner de Carregamento -->
    <div v-if="loading" class="row justify-center q-pa-xl">
      <q-spinner color="primary" size="48px" />
    </div>

    <!-- Conteúdo Principal -->
    <div v-else class="row justify-center">
      <div class="col-12 col-lg-10">
        <!-- Card Informativo do Curso -->
        <q-card flat bordered class="q-mb-md bg-white shadow-1 rounded-borders">
          <q-card-section class="row items-center justify-between q-col-gutter-sm">
            <div class="col-12 col-sm-auto row items-center q-gutter-md">
              <q-avatar square size="56px" class="bg-grey-3 rounded-borders">
                <img v-if="course?.capaUrl" :src="course.capaUrl" alt="Capa" />
                <q-icon v-else name="school" color="primary" size="32px" />
              </q-avatar>
              <div>
                <div class="text-subtitle1 text-weight-bold text-primary">
                  {{ course?.titulo }}
                </div>
                <div class="text-caption text-grey-7">
                  {{ course?.descricao }}
                </div>
              </div>
            </div>
            <div class="col-12 col-sm-auto text-right">
              <q-chip dense :color="course?.isPublished ? 'positive' : 'warning'" text-color="white">
                {{ course?.isPublished ? 'Publicado no Catálogo' : 'Rascunho' }}
              </q-chip>
            </div>
          </q-card-section>
        </q-card>

        <!-- Estrutura Expansível de Módulos & Aulas -->
        <q-card flat bordered class="shadow-1 bg-white rounded-borders">
          <q-card-section class="bg-primary text-white row items-center justify-between q-py-sm q-px-md">
            <div class="text-subtitle1 text-weight-bold row items-center">
              <q-icon name="view_stream" class="q-mr-sm" />
              Estrutura de Módulos e Aulas
            </div>
            <q-btn
              color="white"
              text-color="primary"
              icon="add_circle"
              label="Adicionar Módulo"
              size="sm"
              unelevated
              @click="openModuleModal()"
            />
          </q-card-section>

          <q-card-section class="q-pa-none">
            <div v-if="modules.length > 0">
              <q-list separator>
                <q-expansion-item
                  v-for="(mod, index) in modules"
                  :key="mod.id"
                  group="modules"
                  default-opened
                  header-class="bg-grey-2 text-weight-bold text-grey-9"
                  expand-icon-class="text-primary"
                >
                  <template v-slot:header>
                    <q-item-section avatar>
                      <q-avatar color="primary" text-color="white" size="28px" font-size="14px">
                        {{ index + 1 }}
                      </q-avatar>
                    </q-item-section>

                    <q-item-section>
                      <q-item-label class="text-weight-bold">
                        {{ mod.titulo }}
                      </q-item-label>
                      <q-item-label caption>
                        {{ mod.lessons ? mod.lessons.length : 0 }} aula(s) cadastrada(s)
                      </q-item-label>
                    </q-item-section>

                    <q-item-section side @click.stop>
                      <div class="row q-gutter-xs">
                        <q-btn
                          flat
                          round
                          dense
                          color="primary"
                          icon="add"
                          size="sm"
                          @click="openLessonModal(mod.id)"
                        >
                          <q-tooltip>Adicionar Aula</q-tooltip>
                        </q-btn>
                        <q-btn
                          flat
                          round
                          dense
                          color="grey-7"
                          icon="edit"
                          size="sm"
                          @click="openModuleModal(mod)"
                        >
                          <q-tooltip>Editar Módulo</q-tooltip>
                        </q-btn>
                        <q-btn
                          flat
                          round
                          dense
                          color="negative"
                          icon="delete"
                          size="sm"
                          @click="confirmDeleteModule(mod)"
                        >
                          <q-tooltip>Excluir Módulo</q-tooltip>
                        </q-btn>
                      </div>
                    </q-item-section>
                  </template>

                  <!-- Conteúdo do Módulo (Lista de Aulas) -->
                  <q-card class="bg-grey-1">
                    <q-card-section class="q-pa-sm">
                      <div v-if="mod.lessons && mod.lessons.length > 0">
                        <q-list bordered separator class="bg-white rounded-borders">
                          <q-item v-for="lesson in mod.lessons" :key="lesson.id" class="q-py-sm">
                            <q-item-section avatar>
                              <q-avatar :color="getLessonColor(lesson.tipo)" text-color="white" size="36px">
                                <q-icon :name="getLessonIcon(lesson.tipo)" size="20px" />
                              </q-avatar>
                            </q-item-section>

                            <q-item-section>
                              <q-item-label class="text-weight-bold text-grey-9">
                                {{ lesson.titulo }}
                              </q-item-label>
                              <q-item-label caption class="row items-center q-gutter-x-sm">
                                <q-badge :color="getLessonColor(lesson.tipo)" label="tipo" outline size="xs">
                                  {{ getLessonTypeLabel(lesson.tipo) }}
                                </q-badge>
                                <span>• {{ lesson.duracaoMin }} min</span>
                              </q-item-label>
                            </q-item-section>

                            <q-item-section side>
                              <div class="row q-gutter-xs">
                                <q-btn
                                  flat
                                  round
                                  dense
                                  icon="edit"
                                  color="primary"
                                  size="sm"
                                  @click="openLessonModal(mod.id, lesson)"
                                >
                                  <q-tooltip>Editar Aula</q-tooltip>
                                </q-btn>
                                <q-btn
                                  flat
                                  round
                                  dense
                                  icon="delete"
                                  color="negative"
                                  size="sm"
                                  @click="confirmDeleteLesson(lesson)"
                                >
                                  <q-tooltip>Excluir Aula</q-tooltip>
                                </q-btn>
                              </div>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </div>

                      <div v-else class="text-center text-grey-6 q-pa-md border-dashed rounded-borders">
                        <q-icon name="class" size="32px" color="grey-5" />
                        <div class="text-caption q-mt-xs">Nenhuma aula cadastrada neste módulo.</div>
                        <q-btn
                          flat
                          color="primary"
                          icon="add"
                          label="Cadastrar Primeira Aula"
                          size="sm"
                          class="q-mt-xs"
                          @click="openLessonModal(mod.id)"
                        />
                      </div>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
              </q-list>
            </div>

            <!-- Estado Vazio (Nenhum Módulo Criado) -->
            <div v-else class="text-center text-grey-7 q-pa-xl">
              <q-icon name="folder_open" size="64px" color="primary" />
              <div class="text-h6 text-weight-bold q-mt-md">Nenhum Módulo Criado</div>
              <div class="text-caption text-grey-7 q-mb-md">
                Comece criando a estrutura de tópicos ou módulos do seu curso.
              </div>
              <q-btn
                color="primary"
                icon="add"
                label="Criar Primeiro Módulo"
                unelevated
                @click="openModuleModal()"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- =================================================================== -->
    <!-- DIALOG: CRIAR / EDITAR MÓDULO -->
    <!-- =================================================================== -->
    <q-dialog v-model="showModuleModal" persistent max-width="480px">
      <q-card style="width: 480px; max-width: 95vw" class="rounded-borders shadow-3">
        <q-card-section class="bg-secondary text-white row items-center justify-between q-py-sm q-px-md">
          <div class="text-subtitle1 text-weight-bold row items-center">
            <q-icon name="folder" class="q-mr-sm" />
            {{ isEditingModule ? 'Editar Módulo' : 'Novo Módulo' }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-md">
          <q-form @submit.prevent="saveModule">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-input
                  v-model="moduleForm.titulo"
                  label="Título do Módulo *"
                  hint="Ex: Módulo 1 - Introdução e Legislação"
                  outlined
                  dense
                  autofocus
                  :rules="[val => !!val || 'O título é obrigatório']"
                />
              </div>
              <div class="col-12">
                <q-input
                  v-model.number="moduleForm.ordem"
                  label="Ordem de Exibição"
                  type="number"
                  outlined
                  dense
                  min="1"
                />
              </div>
            </div>

            <q-separator class="q-mt-md q-mb-sm" />
            <div class="row justify-end q-gutter-sm">
              <q-btn label="Cancelar" flat color="grey-7" v-close-popup />
              <q-btn type="submit" label="Salvar Módulo" color="secondary" unelevated :loading="savingModule" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- =================================================================== -->
    <!-- DIALOG: CRIAR / EDITAR AULA (LAYOUT ORGANIZADO E RESPONSIVO) -->
    <!-- =================================================================== -->
    <q-dialog v-model="showLessonModal" persistent max-width="720px">
      <q-card style="width: 720px; max-width: 95vw" class="rounded-borders shadow-3">
        <!-- Cabeçalho -->
        <q-card-section class="bg-primary text-white row items-center justify-between q-py-sm q-px-md">
          <div class="text-subtitle1 text-weight-bold row items-center">
            <q-icon :name="isEditingLesson ? 'edit' : 'video_call'" class="q-mr-sm" size="22px" />
            {{ isEditingLesson ? 'Editar Aula' : 'Nova Aula' }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <!-- Formulário Responsivo com Grid Alinhado -->
        <q-card-section class="q-pa-md">
          <q-form @submit.prevent="saveLesson">
            <div class="row q-col-gutter-md">
              <!-- Título da Aula -->
              <div class="col-12">
                <q-input
                  v-model="lessonForm.titulo"
                  label="Título da Aula *"
                  hint="Ex: Aula 1 - Princípios Fundamentais da Proteção de Dados"
                  outlined
                  dense
                  :rules="[val => !!val || 'Título da aula é obrigatório']"
                />
              </div>

              <!-- Tipo de Conteúdo -->
              <div class="col-12 col-sm-7">
                <q-select
                  v-model="lessonForm.tipo"
                  :options="tiposAulaOptions"
                  emit-value
                  map-options
                  label="Tipo de Conteúdo *"
                  outlined
                  dense
                >
                  <template v-slot:prepend>
                    <q-icon :name="getLessonIcon(lessonForm.tipo)" color="primary" />
                  </template>
                </q-select>
              </div>

              <!-- Duração Estimada -->
              <div class="col-12 col-sm-5">
                <q-input
                  v-model.number="lessonForm.duracaoMin"
                  label="Duração (minutos) *"
                  type="number"
                  outlined
                  dense
                  min="1"
                  :rules="[val => (val && val > 0) || 'Informe minutos válidos']"
                >
                  <template v-slot:prepend>
                    <q-icon name="timer" color="primary" />
                  </template>
                </q-input>
              </div>

              <!-- ================= DADOS DINÂMICOS CONFORME TIPO ================= -->

              <!-- TIPO 1: VÍDEO -->
              <div v-if="lessonForm.tipo === 'VIDEO'" class="col-12">
                <div class="q-pa-sm bg-red-1 rounded-borders border-red">
                  <div class="text-subtitle2 text-red-9 text-weight-bold q-mb-xs row items-center">
                    <q-icon name="play_circle" class="q-mr-xs" size="20px" /> Link do Vídeo (YouTube / Vimeo / URL Institucional)
                  </div>
                  <q-input
                    v-model="lessonForm.conteudoUrl"
                    label="URL do Vídeo *"
                    placeholder="https://www.youtube.com/watch?v=..."
                    outlined
                    dense
                    bg-color="white"
                    :rules="[val => !!val || 'A URL do vídeo é obrigatória']"
                  >
                    <template v-slot:prepend>
                      <q-icon name="link" color="red-8" />
                    </template>
                  </q-input>
                </div>
              </div>

              <!-- TIPO 2: TEXTO FORMATADO -->
              <div v-if="lessonForm.tipo === 'TEXTO'" class="col-12">
                <div class="text-subtitle2 text-weight-bold text-primary q-mb-xs row items-center">
                  <q-icon name="article" class="q-mr-xs" size="20px" /> Conteúdo da Aula em Texto
                </div>
                <q-editor
                  v-model="lessonForm.texto"
                  min-height="160px"
                  class="bg-white"
                  placeholder="Escreva aqui o artigo ou explicação da aula..."
                />
              </div>

              <!-- TIPO 3: DOCUMENTO PDF -->
              <div v-if="lessonForm.tipo === 'PDF'" class="col-12">
                <div class="q-pa-sm bg-orange-1 rounded-borders">
                  <div class="text-subtitle2 text-orange-9 text-weight-bold q-mb-xs row items-center">
                    <q-icon name="picture_as_pdf" class="q-mr-xs" size="20px" /> Material em Apostila PDF
                  </div>
                  <div class="row q-col-gutter-sm items-center">
                    <div class="col-12 col-sm-7">
                      <q-input
                        v-model="lessonForm.conteudoUrl"
                        label="URL do Documento PDF"
                        placeholder="https://exemplo.com/apostila.pdf"
                        outlined
                        dense
                        bg-color="white"
                      >
                        <template v-slot:prepend>
                          <q-icon name="link" color="orange-8" />
                        </template>
                      </q-input>
                    </div>
                    <div class="col-12 col-sm-5">
                      <q-file
                        v-model="pdfFile"
                        label="Ou Upload do PDF"
                        outlined
                        dense
                        bg-color="white"
                        accept=".pdf"
                        :loading="uploadingPdf"
                        @update:model-value="handlePdfUpload"
                      >
                        <template v-slot:prepend>
                          <q-icon name="cloud_upload" color="primary" />
                        </template>
                      </q-file>
                    </div>
                  </div>
                </div>
              </div>

              <!-- TIPO 4: QUIZ DE FIXAÇÃO -->
              <div v-if="lessonForm.tipo === 'QUIZ'" class="col-12">
                <div class="q-pa-md bg-purple-1 rounded-borders">
                  <div class="text-subtitle2 text-purple-9 text-weight-bold q-mb-sm row items-center">
                    <q-icon name="quiz" class="q-mr-xs" size="20px" /> Construtor do Quiz de Fixação
                  </div>

                  <!-- Pergunta -->
                  <q-input
                    v-model="quizBuilder.pergunta"
                    label="Enunciado da Pergunta *"
                    outlined
                    dense
                    bg-color="white"
                    class="q-mb-sm"
                    :rules="[val => !!val || 'Informe a pergunta do quiz']"
                  />

                  <!-- Alternativas -->
                  <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">
                    Opções de Resposta (Marque a opção correta):
                  </div>
                  <div
                    v-for="(opcao, idx) in quizBuilder.opcoes"
                    :key="idx"
                    class="row items-center q-mb-xs bg-white q-pa-xs rounded-borders shadow-1"
                  >
                    <q-radio
                      v-model="quizBuilder.respostaCorreta"
                      :val="idx"
                      color="positive"
                    />
                    <q-input
                      v-model="quizBuilder.opcoes[idx]"
                      :label="`Alternativa ${String.fromCharCode(65 + idx)}`"
                      dense
                      borderless
                      class="col q-ml-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Botões de Ação do Modal -->
            <q-separator class="q-mt-md q-mb-sm" />
            <div class="row justify-end q-gutter-sm">
              <q-btn label="Cancelar" flat color="grey-7" v-close-popup />
              <q-btn
                type="submit"
                :label="isEditingLesson ? 'Salvar Aula' : 'Cadastrar Aula'"
                color="primary"
                icon="check"
                unelevated
                :loading="savingLesson"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useCourseStore } from 'src/stores/courseStore';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const route = useRoute();
const courseStore = useCourseStore();

const courseId = computed(() => route.params.id);
const course = computed(() => courseStore.currentCourse);
const modules = computed(() => (course.value && course.value.modules) ? course.value.modules : []);

const loading = ref(false);
const savingModule = ref(false);
const savingLesson = ref(false);
const uploadingPdf = ref(false);
const pdfFile = ref(null);

// Módulo Modal State
const showModuleModal = ref(false);
const isEditingModule = ref(false);
const currentModuleId = ref(null);
const moduleForm = ref({
  titulo: '',
  ordem: 1,
});

// Aula Modal State
const showLessonModal = ref(false);
const isEditingLesson = ref(false);
const selectedModuleId = ref(null);
const currentLessonId = ref(null);

const lessonForm = ref({
  titulo: '',
  tipo: 'VIDEO',
  conteudoUrl: '',
  texto: '',
  quizData: '',
  duracaoMin: 10,
  ordem: 1,
});

const quizBuilder = ref({
  pergunta: '',
  opcoes: ['', '', '', ''],
  respostaCorreta: 0,
});

const tiposAulaOptions = [
  { label: 'Vídeo (YouTube / URL)', value: 'VIDEO' },
  { label: 'Texto Formatado (Artigo)', value: 'TEXTO' },
  { label: 'Documento PDF (Apostila)', value: 'PDF' },
  { label: 'Quiz de Fixação', value: 'QUIZ' },
];

onMounted(async () => {
  if (courseId.value) {
    loading.value = true;
    try {
      await courseStore.fetchCourseDetail(courseId.value);
    } catch (err) {
      $q.notify({
        color: 'negative',
        icon: 'error',
        message: 'Erro ao carregar detalhes do curso.',
      });
    } finally {
      loading.value = false;
    }
  }
});

// ================= MÓDULOS =================
const openModuleModal = (mod = null) => {
  if (mod) {
    isEditingModule.value = true;
    currentModuleId.value = mod.id;
    moduleForm.value = {
      titulo: mod.titulo,
      ordem: mod.ordem || 1,
    };
  } else {
    isEditingModule.value = false;
    currentModuleId.value = null;
    moduleForm.value = {
      titulo: '',
      ordem: modules.value.length + 1,
    };
  }
  showModuleModal.value = true;
};

const saveModule = async () => {
  savingModule.value = true;
  try {
    if (isEditingModule.value) {
      await courseStore.updateModule(currentModuleId.value, moduleForm.value);
    } else {
      await courseStore.createModule(courseId.value, moduleForm.value);
    }
    await courseStore.fetchCourseDetail(courseId.value);
    showModuleModal.value = false;
  } catch (err) {
    console.error('Erro ao salvar módulo:', err);
  } finally {
    savingModule.value = false;
  }
};

const confirmDeleteModule = (mod) => {
  $q.dialog({
    title: 'Excluir Módulo',
    message: `Deseja realmente excluir o módulo "${mod.titulo}" e todas as suas aulas?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await courseStore.deleteModule(mod.id);
      await courseStore.fetchCourseDetail(courseId.value);
    } catch (err) {
      console.error(err);
    }
  });
};

// ================= AULAS =================
const openLessonModal = (moduleId, lesson = null) => {
  selectedModuleId.value = moduleId;
  if (lesson) {
    isEditingLesson.value = true;
    currentLessonId.value = lesson.id;
    lessonForm.value = {
      titulo: lesson.titulo,
      tipo: lesson.tipo || 'VIDEO',
      conteudoUrl: lesson.conteudoUrl || '',
      texto: lesson.texto || '',
      quizData: lesson.quizData || '',
      duracaoMin: lesson.duracaoMin || 10,
      ordem: lesson.ordem || 1,
    };

    if (lesson.tipo === 'QUIZ' && lesson.quizData) {
      try {
        quizBuilder.value = JSON.parse(lesson.quizData);
      } catch (e) {
        quizBuilder.value = { pergunta: '', opcoes: ['', '', '', ''], respostaCorreta: 0 };
      }
    } else {
      quizBuilder.value = { pergunta: '', opcoes: ['', '', '', ''], respostaCorreta: 0 };
    }
  } else {
    isEditingLesson.value = false;
    currentLessonId.value = null;
    const currentMod = modules.value.find(m => m.id === moduleId);
    const existingCount = currentMod && currentMod.lessons ? currentMod.lessons.length : 0;

    lessonForm.value = {
      titulo: '',
      tipo: 'VIDEO',
      conteudoUrl: '',
      texto: '',
      quizData: '',
      duracaoMin: 10,
      ordem: existingCount + 1,
    };
    quizBuilder.value = { pergunta: '', opcoes: ['', '', '', ''], respostaCorreta: 0 };
  }
  showLessonModal.value = true;
};

const handlePdfUpload = async (file) => {
  if (!file) return;
  uploadingPdf.value = true;
  try {
    const res = await courseStore.uploadFile(file);
    if (res && res.url) {
      lessonForm.value.conteudoUrl = res.url;
      $q.notify({
        color: 'positive',
        icon: 'picture_as_pdf',
        message: 'Upload do arquivo PDF realizado com sucesso!',
      });
    }
  } catch (err) {
    console.error(err);
  } finally {
    uploadingPdf.value = false;
  }
};

const saveLesson = async () => {
  savingLesson.value = true;
  try {
    if (lessonForm.value.tipo === 'QUIZ') {
      lessonForm.value.quizData = JSON.stringify(quizBuilder.value);
    }

    if (isEditingLesson.value) {
      await courseStore.updateLesson(currentLessonId.value, lessonForm.value);
    } else {
      await courseStore.createLesson(selectedModuleId.value, lessonForm.value);
    }

    await courseStore.fetchCourseDetail(courseId.value);
    showLessonModal.value = false;
  } catch (err) {
    console.error('Erro ao salvar aula:', err);
  } finally {
    savingLesson.value = false;
  }
};

const confirmDeleteLesson = (lesson) => {
  $q.dialog({
    title: 'Excluir Aula',
    message: `Deseja remover a aula "${lesson.titulo}"?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await courseStore.deleteLesson(lesson.id);
      await courseStore.fetchCourseDetail(courseId.value);
    } catch (err) {
      console.error(err);
    }
  });
};

// ================= HELPERS VISUAIS =================
const getLessonTypeLabel = (tipo) => {
  switch (tipo) {
    case 'VIDEO': return 'Vídeo';
    case 'TEXTO': return 'Texto / Leitura';
    case 'PDF': return 'Apostila PDF';
    case 'QUIZ': return 'Quiz';
    default: return tipo;
  }
};

const getLessonIcon = (tipo) => {
  switch (tipo) {
    case 'VIDEO': return 'play_circle';
    case 'TEXTO': return 'article';
    case 'PDF': return 'picture_as_pdf';
    case 'QUIZ': return 'quiz';
    default: return 'menu_book';
  }
};

const getLessonColor = (tipo) => {
  switch (tipo) {
    case 'VIDEO': return 'red-7';
    case 'TEXTO': return 'blue-7';
    case 'PDF': return 'deep-orange-7';
    case 'QUIZ': return 'purple-7';
    default: return 'primary';
  }
};
</script>

<style scoped>
.rounded-borders {
  border-radius: 8px;
}
.border-dashed {
  border: 2px dashed #e0e0e0;
}
.border-red {
  border: 1px solid #ffcdd2;
}
</style>
