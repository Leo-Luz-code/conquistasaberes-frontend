<template>
  <q-page class="q-pa-md bg-grey-1">
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
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCourseStore } from 'src/stores/courseStore';
import { useQuasar } from 'quasar';
import FormularioCursoDialog from 'src/components/FormularioCursoDialog.vue';

const $q = useQuasar();
const courseStore = useCourseStore();

const filter = ref('');
const showCourseDialog = ref(false);
const selectedCourse = ref(null);

const columns = [
  { name: 'capa', label: 'Capa', align: 'center', field: 'capaUrl' },
  { name: 'titulo', label: 'Título do Curso', align: 'left', field: 'titulo', sortable: true },
  { name: 'categoria', label: 'Categoria', align: 'left', field: row => row.categoria || 'Geral', sortable: true },
  { name: 'cargaHoraria', label: 'Carga (h)', align: 'center', field: 'cargaHoraria', sortable: true },
  { name: 'secretaria', label: 'Destino', align: 'left', field: row => row.secretaria?.sigla || 'Geral' },
  { name: 'modulos', label: 'Estrutura', align: 'center' },
  { name: 'status', label: 'Status', align: 'center', field: 'isPublished' },
  { name: 'actions', label: 'Ações', align: 'center' },
];

onMounted(() => {
  courseStore.fetchAllAdminCourses();
});

const openCreateModal = () => {
  selectedCourse.value = null;
  showCourseDialog.value = true;
};

const openEditModal = (course) => {
  selectedCourse.value = course;
  showCourseDialog.value = true;
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
