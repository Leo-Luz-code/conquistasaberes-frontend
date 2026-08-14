<template>
  <div class="q-pa-md">
    <!-- Cabeçalho Principal Responsivo -->
    <div class="row items-center justify-between q-col-gutter-md q-mb-md">
      <div class="col-12 col-sm-auto">
        <div class="text-h5 text-weight-bold text-primary row items-center">
          <q-icon name="menu_book" class="q-mr-sm" size="28px" />
          Gestão de Cursos e Conteúdos
        </div>
        <div class="text-caption text-grey-7 q-mt-xs">
          Painel administrativo para cadastro de cursos e gerenciamento de módulos e aulas (Vídeos, Textos, PDFs e Quizzes).
        </div>
      </div>
      <div class="col-12 col-sm-auto">
        <q-btn
          color="primary"
          icon="add"
          label="Novo Curso"
          unelevated
          class="full-width-xs"
          @click="openCreateModal"
        />
      </div>
    </div>

    <!-- Tabela de Cursos Cadastrados -->
    <q-card flat bordered class="q-pa-sm shadow-1 bg-white rounded-borders">
      <q-table
        :rows="courseStore.courses"
        :columns="columns"
        row-key="id"
        :loading="courseStore.loading"
        :filter="filter"
        no-data-label="Nenhum curso cadastrado no momento"
        flat
      >
        <template v-slot:top-right>
          <q-input
            dense
            debounce="300"
            v-model="filter"
            placeholder="Buscar por título ou categoria..."
            outlined
            style="min-width: 280px"
            class="full-width-xs"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <!-- Capa do Curso -->
        <template v-slot:body-cell-capa="props">
          <q-td :props="props">
            <q-avatar square size="48px" class="bg-grey-3 rounded-borders">
              <img v-if="props.row.capaUrl" :src="props.row.capaUrl" alt="Capa" />
              <q-icon v-else name="school" color="primary" size="24px" />
            </q-avatar>
          </q-td>
        </template>

        <!-- Status do Curso -->
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip
              dense
              :color="props.row.isPublished ? 'positive' : 'warning'"
              text-color="white"
              size="sm"
            >
              {{ props.row.isPublished ? 'Publicado' : 'Rascunho' }}
            </q-chip>
          </q-td>
        </template>

        <!-- Destino / Secretaria -->
        <template v-slot:body-cell-secretaria="props">
          <q-td :props="props">
            <q-chip dense outline color="primary" size="sm">
              {{ props.row.secretaria ? props.row.secretaria.sigla : 'Geral (Toda Prefeitura)' }}
            </q-chip>
          </q-td>
        </template>

        <!-- Trilha -->
        <template v-slot:body-cell-trilha="props">
          <q-td :props="props">
            <q-chip dense outline :color="props.row.trilha ? 'secondary' : 'grey-5'" size="sm">
              {{ props.row.trilha ? props.row.trilha.tituloTrilha : 'Nenhuma (Avulso)' }}
            </q-chip>
          </q-td>
        </template>

        <!-- Módulos / Estrutura -->
        <template v-slot:body-cell-modulos="props">
          <q-td :props="props">
            <q-badge color="secondary" outline class="q-pa-xs">
              <q-icon name="view_stream" class="q-mr-xs" />
              {{ props.row.modules ? props.row.modules.length : 0 }} Módulo(s)
            </q-badge>
          </q-td>
        </template>

        <!-- Ações do Administrador -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-xs">
            <!-- Ver Inscritos no Curso -->
            <q-btn
              flat
              round
              color="indigo-7"
              icon="groups"
              size="sm"
              @click="openInscritosModal(props.row)"
            >
              <q-tooltip>Ver Servidores Inscritos</q-tooltip>
            </q-btn>

            <!-- Gerenciar Módulos e Aulas (Ação explícita) -->
            <q-btn
              flat
              round
              color="secondary"
              icon="video_library"
              size="sm"
              :to="`/admin/cursos/${props.row.id}/conteudo`"
            >
              <q-tooltip>Gerenciar Módulos & Aulas</q-tooltip>
            </q-btn>

            <!-- Editar Dados do Curso em Modal -->
            <q-btn
              flat
              round
              color="primary"
              icon="edit"
              size="sm"
              @click="openEditModal(props.row)"
            >
              <q-tooltip>Editar Informações do Curso</q-tooltip>
            </q-btn>

            <!-- Excluir Curso -->
            <q-btn
              flat
              round
              color="negative"
              icon="delete"
              size="sm"
              @click="confirmDelete(props.row)"
            >
              <q-tooltip>Excluir Curso</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Modal de Criação / Edição de Curso -->
    <FormularioCursoDialog
      v-model="showCourseDialog"
      :course="selectedCourse"
      @saved="handleCourseSaved"
    />

    <!-- =================================================================== -->
    <!-- MODAL: LISTA DE SERVIDORES INSCRITOS NO CURSO -->
    <!-- =================================================================== -->
    <q-dialog v-model="showInscritosModal" max-width="800px">
      <q-card style="width: 800px; max-width: 95vw" class="rounded-borders shadow-3">
        <!-- Cabeçalho -->
        <q-card-section class="bg-indigo-8 text-white row items-center justify-between q-py-sm q-px-md">
          <div class="text-subtitle1 text-weight-bold row items-center">
            <q-icon name="groups" class="q-mr-sm" size="22px" />
            Servidores Inscritos: {{ selectedCourseForInscritos?.titulo }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-md space-y-4">
          <!-- Métricas de Matrícula -->
          <div class="row q-col-gutter-sm">
            <div class="col-12 col-sm-4">
              <div class="q-pa-sm bg-indigo-1 rounded-borders text-center">
                <div class="text-caption text-indigo-9 text-weight-bold">Total Matriculados</div>
                <div class="text-h6 text-weight-bolder text-indigo-9">{{ courseEnrollments.length }}</div>
              </div>
            </div>
            <div class="col-12 col-sm-4">
              <div class="q-pa-sm bg-green-1 rounded-borders text-center">
                <div class="text-caption text-green-9 text-weight-bold">Concluídos (100%)</div>
                <div class="text-h6 text-weight-bolder text-green-9">{{ totalConcluidos }}</div>
              </div>
            </div>
            <div class="col-12 col-sm-4">
              <div class="q-pa-sm bg-amber-1 rounded-borders text-center">
                <div class="text-caption text-amber-9 text-weight-bold">Em Andamento</div>
                <div class="text-h6 text-weight-bolder text-amber-9">{{ totalEmAndamento }}</div>
              </div>
            </div>
          </div>

          <!-- Filtro de Busca -->
          <div class="row items-center justify-between q-col-gutter-sm">
            <div class="col-12 col-sm-8">
              <q-input
                v-model="filtroInscritos"
                placeholder="Buscar por nome, matrícula ou secretaria..."
                dense
                outlined
              >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-sm-4 text-right">
              <q-btn
                flat
                color="indigo"
                icon="refresh"
                label="Atualizar"
                size="sm"
                :loading="loadingEnrollments"
                @click="carregarInscritosDoCurso"
              />
            </div>
          </div>

          <!-- Loading -->
          <div v-if="loadingEnrollments" class="row justify-center q-pa-lg">
            <q-spinner color="indigo" size="40px" />
          </div>

          <!-- Lista de Inscritos -->
          <div v-else-if="inscritosFiltrados.length > 0" class="border rounded-borders overflow-hidden" style="max-height: 380px; overflow-y: auto;">
            <q-list separator>
              <q-item v-for="enr in inscritosFiltrados" :key="enr.id" class="q-py-sm">
                <q-item-section avatar>
                  <q-avatar color="indigo-1" text-color="indigo-9" class="text-weight-bold">
                    {{ enr.nome ? enr.nome[0].toUpperCase() : '?' }}
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <div class="row items-center q-gutter-x-xs">
                    <q-item-label class="text-weight-bold text-grey-9">
                      {{ enr.nome }}
                    </q-item-label>
                    <q-badge color="grey-3" text-color="grey-8" class="q-ml-xs">
                      Matrícula: {{ enr.matricula }}
                    </q-badge>
                    <q-badge color="blue-1" text-color="primary" class="q-ml-xs">
                      {{ enr.secretaria }}
                    </q-badge>
                  </div>
                  <q-item-label caption class="text-grey-6 q-mt-xs">
                    {{ enr.email }} <span v-if="enr.cargo">• {{ enr.cargo }}</span>
                  </q-item-label>
                </q-item-section>

                <q-item-section side style="min-width: 170px;">
                  <div class="column items-end q-gutter-y-xs">
                    <div class="row items-center q-gutter-x-xs">
                      <span class="text-caption text-weight-bold text-grey-8">{{ enr.progress }}%</span>
                      <q-chip
                        dense
                        size="xs"
                        :color="enr.progress >= 100 ? 'positive' : 'primary'"
                        text-color="white"
                      >
                        {{ enr.progress >= 100 ? 'Concluído' : 'Em Andamento' }}
                      </q-chip>
                    </div>
                    <q-linear-progress
                      :value="enr.progress / 100"
                      :color="enr.progress >= 100 ? 'positive' : 'indigo'"
                      track-color="grey-3"
                      rounded
                      style="width: 140px; height: 6px"
                    />
                    <span class="text-[10px] text-grey-5">
                      Inscrito em: {{ formatarData(enr.createdAt) }}
                    </span>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center text-grey-6 q-pa-lg border-dashed rounded-borders">
            <q-icon name="people_outline" size="40px" color="grey-4" />
            <div class="text-caption q-mt-xs">
              {{ courseEnrollments.length === 0 ? 'Nenhum servidor matriculado neste curso até o momento.' : 'Nenhum servidor corresponde à busca.' }}
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useCourseStore } from 'src/stores/courseStore';
import { useQuasar } from 'quasar';
import FormularioCursoDialog from 'src/components/FormularioCursoDialog.vue';

const $q = useQuasar();
const courseStore = useCourseStore();

const filter = ref('');
const showCourseDialog = ref(false);
const selectedCourse = ref(null);

// Modal de Inscritos
const showInscritosModal = ref(false);
const selectedCourseForInscritos = ref(null);
const courseEnrollments = ref([]);
const loadingEnrollments = ref(false);
const filtroInscritos = ref('');

const columns = [
  { name: 'capa', label: 'Capa', align: 'center', field: 'capaUrl' },
  { name: 'titulo', label: 'Título do Curso', align: 'left', field: 'titulo', sortable: true },
  { name: 'categoria', label: 'Categoria', align: 'left', field: row => row.categoria || 'Geral', sortable: true },
  { name: 'cargaHoraria', label: 'Carga (h)', align: 'center', field: 'cargaHoraria', sortable: true },
  { name: 'secretaria', label: 'Destino', align: 'left', field: row => row.secretaria?.sigla || 'Geral' },
  { name: 'trilha', label: 'Trilha', align: 'left', field: row => row.trilha?.tituloTrilha || 'Avulso' },
  { name: 'modulos', label: 'Estrutura', align: 'center' },
  { name: 'status', label: 'Status', align: 'center', field: 'isPublished' },
  { name: 'actions', label: 'Ações', align: 'center' },
];

onMounted(() => {
  courseStore.fetchAllAdminCourses();
});

const totalConcluidos = computed(() => {
  return courseEnrollments.value.filter(e => e.progress >= 100 || e.statusConclusao === 'CONCLUIDO').length;
});

const totalEmAndamento = computed(() => {
  return courseEnrollments.value.filter(e => e.progress < 100 && e.statusConclusao !== 'CONCLUIDO').length;
});

const inscritosFiltrados = computed(() => {
  const list = courseEnrollments.value || [];
  if (!filtroInscritos.value.trim()) return list;
  const q = filtroInscritos.value.toLowerCase();
  return list.filter(e => {
    return (
      (e.nome || '').toLowerCase().includes(q) ||
      (e.matricula || '').toLowerCase().includes(q) ||
      (e.email || '').toLowerCase().includes(q) ||
      (e.secretaria || '').toLowerCase().includes(q)
    );
  });
});

const openCreateModal = () => {
  selectedCourse.value = null;
  showCourseDialog.value = true;
};

const openEditModal = (course) => {
  selectedCourse.value = course;
  showCourseDialog.value = true;
};

const openInscritosModal = async (course) => {
  selectedCourseForInscritos.value = course;
  showInscritosModal.value = true;
  filtroInscritos.value = '';
  await carregarInscritosDoCurso();
};

const carregarInscritosDoCurso = async () => {
  if (!selectedCourseForInscritos.value) return;
  loadingEnrollments.value = true;
  try {
    courseEnrollments.value = await courseStore.fetchCourseEnrollments(selectedCourseForInscritos.value.id);
  } catch (err) {
    console.error('Erro ao carregar inscritos do curso:', err);
    $q.notify({
      type: 'negative',
      message: 'Não foi possível carregar os servidores inscritos.',
    });
  } finally {
    loadingEnrollments.value = false;
  }
};

const formatarData = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const handleCourseSaved = () => {
  courseStore.fetchAllAdminCourses();
};

const confirmDelete = (course) => {
  $q.dialog({
    title: 'Confirmar Exclusão',
    message: `Deseja realmente remover o curso "${course.titulo}"?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    await courseStore.deleteCourse(course.id);
    await courseStore.fetchAllAdminCourses();
  });
};
</script>

<style scoped>
.rounded-borders {
  border-radius: 8px;
}
@media (max-width: 599px) {
  .full-width-xs {
    width: 100%;
  }
}
</style>
