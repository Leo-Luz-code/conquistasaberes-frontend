<template>
  <div class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-subtitle1 text-weight-bold text-primary">
          {{ authStore.isGestor ? 'Minhas Trilhas de Aprendizagem' : 'Trilhas de Aprendizagem' }}
        </div>
        <div class="text-caption text-grey-7">
          {{ authStore.isGestor ? 'Listagem com as trilhas de capacitação criadas por você e total de servidores inscritos.' : 'Gerenciamento das trilhas formativas da prefeitura, cursos vinculados e servidores matriculados.' }}
        </div>
      </div>
      <q-btn color="primary" icon="add" label="Nova Trilha" unelevated @click="openCreateModal" />
    </div>

    <q-table
      :rows="courseStore.learningPaths"
      :columns="columns"
      row-key="id"
      :loading="loading"
      no-data-label="Nenhuma trilha cadastrada"
      flat bordered
    >
      <!-- Capa da Trilha -->
      <template v-slot:body-cell-capa="props">
        <q-td :props="props">
          <q-avatar square size="48px" class="bg-grey-3 rounded-borders overflow-hidden">
            <img v-if="props.row.capaUrl" :src="getMediaUrl(props.row.capaUrl)" alt="Capa" class="w-full h-full object-cover" />
            <q-icon v-else name="alt_route" color="primary" size="24px" />
          </q-avatar>
        </q-td>
      </template>

      <!-- Cursos Vinculados -->
      <template v-slot:body-cell-cursos="props">
        <q-td :props="props">
          <q-badge color="secondary" outline class="q-pa-xs">
            <q-icon name="menu_book" class="q-mr-xs" />
            {{ props.row.courses ? props.row.courses.length : (props.row.cursosCount || 0) }} Curso(s)
          </q-badge>
        </q-td>
      </template>

      <!-- Eixo Vinculado -->
      <template v-slot:body-cell-eixo="props">
        <q-td :props="props">
          <q-chip dense outline color="secondary" size="sm">
            {{ props.row.eixo ? props.row.eixo.nomeEixo : 'Sem Eixo' }}
          </q-chip>
        </q-td>
      </template>

      <!-- Ações -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-xs">
          <!-- Ver Inscritos na Trilha -->
          <q-btn
            flat
            round
            color="indigo-7"
            icon="groups"
            size="sm"
            @click="openInscritosModal(props.row)"
          >
            <q-tooltip>Ver Servidores Inscritos na Trilha</q-tooltip>
          </q-btn>

          <!-- Vincular Cursos -->
          <q-btn
            flat
            round
            color="secondary"
            icon="post_add"
            size="sm"
            @click="openLinkCoursesModal(props.row)"
          >
            <q-tooltip>Vincular Cursos</q-tooltip>
          </q-btn>

          <!-- Editar Trilha -->
          <q-btn
            flat
            round
            color="primary"
            icon="edit"
            size="sm"
            @click="openEditModal(props.row)"
          >
            <q-tooltip>Editar Trilha</q-tooltip>
          </q-btn>

          <!-- Excluir Trilha -->
          <q-btn
            flat
            round
            color="negative"
            icon="delete"
            size="sm"
            @click="confirmDelete(props.row)"
          >
            <q-tooltip>Excluir Trilha</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- Dialog Create/Edit Trilha -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="width: 580px; max-width: 95vw" class="rounded-borders">
        <q-card-section class="bg-primary text-white row items-center justify-between q-py-sm q-px-md">
          <div class="text-subtitle1 text-weight-bold">
            {{ editMode ? 'Editar Trilha' : 'Nova Trilha' }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-md">
          <q-input dense v-model="form.tituloTrilha" label="Título da Trilha *" autofocus class="q-mb-md" outlined />
          
          <div class="row q-col-gutter-sm q-mb-md">
            <div class="col-12 col-sm-6">
              <q-input dense v-model.number="form.cargaHorariaTotal" label="Carga Horária (h) *" type="number" outlined min="1" />
            </div>
            <div class="col-12 col-sm-6">
              <q-select
                dense outlined
                v-model="form.eixoId"
                :options="courseStore.eixos"
                option-value="id"
                option-label="nomeEixo"
                emit-value map-options
                label="Eixo de Conhecimento"
                clearable
              />
            </div>
          </div>

          <!-- Seção de Capa da Trilha -->
          <div class="q-pa-sm bg-grey-2 rounded-borders">
            <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">
              Imagem de Capa da Trilha
            </div>
            <div class="row q-col-gutter-sm items-center">
              <div class="col-12 col-sm-7">
                <q-input
                  v-model="form.capaUrl"
                  label="URL da Imagem de Capa"
                  outlined
                  dense
                  placeholder="https://exemplo.com/imagem.jpg"
                  hint="Colar um link de imagem"
                >
                  <template v-slot:prepend>
                    <q-icon name="image" color="primary" />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-sm-5">
                <q-file
                  v-model="capaFile"
                  label="Upload da Capa"
                  outlined
                  dense
                  accept="image/*"
                  :loading="uploadingCapa"
                  @update:model-value="handleCapaUpload"
                  hint="Fazer upload de imagem"
                >
                  <template v-slot:prepend>
                    <q-icon name="cloud_upload" color="primary" />
                  </template>
                </q-file>
              </div>
            </div>

            <!-- Preview da Capa -->
            <div v-if="form.capaUrl" class="q-mt-sm row items-center q-gutter-sm">
              <span class="text-caption text-grey-7">Pré-visualização:</span>
              <q-img
                :src="getMediaUrl(form.capaUrl)"
                style="max-width: 120px; height: 60px"
                class="rounded-borders shadow-1"
                fit="cover"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="text-primary q-px-md q-pb-md">
          <q-btn flat label="Cancelar" v-close-popup color="grey-7" />
          <q-btn unelevated color="primary" label="Salvar" @click="save" :loading="saving" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog Vincular Cursos -->
    <q-dialog v-model="showLinkCoursesDialog" persistent>
      <q-card style="min-width: 500px" class="rounded-borders">
        <q-card-section class="bg-secondary text-white row items-center justify-between q-py-sm q-px-md">
          <div class="text-subtitle1 text-weight-bold">Vincular Cursos à Trilha</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-md">
          <div class="text-caption text-grey-7 q-mb-sm">Selecione os cursos que farão parte desta trilha:</div>
          <q-select
            v-model="selectedCourses"
            :options="courseStore.courses"
            option-value="id"
            option-label="titulo"
            multiple
            use-chips
            outlined
            dense
            label="Selecione os cursos"
            emit-value
            map-options
          >
             <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
              <q-item v-bind="itemProps">
                <q-item-section side>
                  <q-checkbox :model-value="selected" @update:model-value="toggleOption(opt)" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ opt.titulo }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-card-section>

        <q-card-actions align="right" class="text-primary q-px-md q-pb-md">
          <q-btn flat label="Cancelar" v-close-popup color="grey-7" />
          <q-btn unelevated color="secondary" label="Vincular" @click="saveLinkedCourses" :loading="linking" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- =================================================================== -->
    <!-- MODAL: LISTA DE SERVIDORES INSCRITOS NA TRILHA -->
    <!-- =================================================================== -->
    <q-dialog v-model="showInscritosModal" max-width="800px">
      <q-card style="width: 800px; max-width: 95vw" class="rounded-borders shadow-3">
        <!-- Cabeçalho -->
        <q-card-section class="bg-indigo-8 text-white row items-center justify-between q-py-sm q-px-md">
          <div class="text-subtitle1 text-weight-bold row items-center">
            <q-icon name="groups" class="q-mr-sm" size="22px" />
            Servidores Inscritos: {{ selectedTrilhaForInscritos?.tituloTrilha }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <!-- Corpo do Modal -->
        <q-card-section class="q-pa-md space-y-4">
          <!-- Métricas Rápidas de Matrícula -->
          <div class="row q-col-gutter-sm q-mb-sm">
            <div class="col-12 col-sm-4">
              <q-card flat class="bg-indigo-1 q-pa-sm text-center rounded-borders">
                <div class="text-caption text-indigo-9 text-weight-bold">Total de Inscritos</div>
                <div class="text-h6 text-weight-bolder text-indigo-9">{{ trilhaEnrollments.length }}</div>
              </q-card>
            </div>
            <div class="col-12 col-sm-4">
              <q-card flat class="bg-green-1 q-pa-sm text-center rounded-borders">
                <div class="text-caption text-green-9 text-weight-bold">Concluídos (100%)</div>
                <div class="text-h6 text-weight-bolder text-green-9">{{ totalConcluidos }}</div>
              </q-card>
            </div>
            <div class="col-12 col-sm-4">
              <q-card flat class="bg-amber-1 q-pa-sm text-center rounded-borders">
                <div class="text-caption text-amber-9 text-weight-bold">Em Andamento</div>
                <div class="text-h6 text-weight-bolder text-amber-9">{{ totalEmAndamento }}</div>
              </q-card>
            </div>
          </div>

          <!-- Filtro de Busca -->
          <q-input
            dense
            outlined
            v-model="filtroInscritos"
            placeholder="Filtrar servidor por nome, matrícula, secretaria ou e-mail..."
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
            <template v-slot:append>
              <q-btn flat round dense icon="refresh" size="sm" @click="recarregarInscritosTrilha">
                <q-tooltip>Atualizar Lista</q-tooltip>
              </q-btn>
            </template>
          </q-input>

          <!-- Spinner Loading -->
          <div v-if="loadingEnrollments" class="row justify-center q-pa-lg">
            <q-spinner color="indigo-8" size="36px" />
          </div>

          <!-- Lista de Servidores -->
          <div v-else-if="inscritosFiltrados.length > 0" class="border rounded-borders overflow-hidden" style="max-height: 360px; overflow-y: auto;">
            <q-list separator dense>
              <q-item v-for="enr in inscritosFiltrados" :key="enr.userId" class="q-py-sm">
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
              {{ trilhaEnrollments.length === 0 ? 'Nenhum servidor matriculado nesta trilha até o momento.' : 'Nenhum servidor corresponde à busca.' }}
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCourseStore } from 'src/stores/courseStore';
import { useAuthStore } from 'src/stores/authStore';
import { useQuasar } from 'quasar';
import { getMediaUrl } from 'src/utils/media';

const $q = useQuasar();
const courseStore = useCourseStore();
const authStore = useAuthStore();

const loading = ref(false);
const showDialog = ref(false);
const editMode = ref(false);
const saving = ref(false);
const editingId = ref(null);

const capaFile = ref(null);
const uploadingCapa = ref(false);

const showLinkCoursesDialog = ref(false);
const linking = ref(false);
const selectedCourses = ref([]);
const activeTrilhaId = ref(null);

// Modal de Servidores Inscritos
const showInscritosModal = ref(false);
const selectedTrilhaForInscritos = ref(null);
const trilhaEnrollments = ref([]);
const loadingEnrollments = ref(false);
const filtroInscritos = ref('');

const form = ref({
  tituloTrilha: '',
  cargaHorariaTotal: 0,
  eixoId: null,
  capaUrl: ''
});

const columns = [
  { name: 'capa', label: 'Capa', align: 'center', field: 'capaUrl' },
  { name: 'titulo', label: 'Título da Trilha', align: 'left', field: 'tituloTrilha', sortable: true },
  { name: 'carga', label: 'Carga (h)', align: 'center', field: 'cargaHorariaTotal', sortable: true },
  { name: 'cursos', label: 'Cursos Vinculados', align: 'center' },
  { name: 'eixo', label: 'Eixo Vinculado', align: 'left', field: row => row.eixo?.nomeEixo || 'Sem Eixo' },
  { name: 'actions', label: 'Ações', align: 'center' }
];

const loadData = async () => {
  loading.value = true;
  await Promise.all([
    courseStore.fetchAdminLearningPaths(),
    courseStore.fetchEixos(),
    courseStore.fetchAllAdminCourses()
  ]);
  loading.value = false;
};

onMounted(() => {
  loadData();
});

const openCreateModal = () => {
  editMode.value = false;
  editingId.value = null;
  capaFile.value = null;
  form.value = { tituloTrilha: '', cargaHorariaTotal: 0, eixoId: null, capaUrl: '' };
  showDialog.value = true;
};

const openEditModal = (trilha) => {
  editMode.value = true;
  editingId.value = trilha.id;
  capaFile.value = null;
  form.value = {
    tituloTrilha: trilha.tituloTrilha,
    cargaHorariaTotal: trilha.cargaHorariaTotal,
    eixoId: trilha.eixoId,
    capaUrl: trilha.capaUrl || ''
  };
  showDialog.value = true;
};

const handleCapaUpload = async (file) => {
  if (!file) return;
  uploadingCapa.value = true;
  try {
    const res = await courseStore.uploadFile(file);
    if (res && res.url) {
      form.value.capaUrl = res.url;
      $q.notify({
        color: 'positive',
        icon: 'cloud_done',
        message: 'Upload da capa da trilha realizado com sucesso!',
      });
    }
  } catch (err) {
    $q.notify({
      color: 'negative',
      icon: 'error',
      message: 'Erro ao fazer upload da imagem.',
    });
  } finally {
    uploadingCapa.value = false;
  }
};

const save = async () => {
  if (!form.value.tituloTrilha || !form.value.cargaHorariaTotal) {
    $q.notify({ color: 'warning', message: 'Preencha título e carga horária' });
    return;
  }
  
  saving.value = true;
  try {
    if (editMode.value) {
      await courseStore.updateLearningPath(editingId.value, form.value);
    } else {
      await courseStore.createLearningPath(form.value);
    }
    showDialog.value = false;
    await loadData();
  } catch (e) {
    console.error(e);
  } finally {
    saving.value = false;
  }
};

const openLinkCoursesModal = (trilha) => {
  activeTrilhaId.value = trilha.id;
  selectedCourses.value = courseStore.courses
    .filter(c => c.trilha && c.trilha.id === trilha.id)
    .map(c => c.id);
  showLinkCoursesDialog.value = true;
};

const saveLinkedCourses = async () => {
  linking.value = true;
  try {
    await courseStore.linkCoursesToPath(activeTrilhaId.value, selectedCourses.value);
    showLinkCoursesDialog.value = false;
    await loadData();
  } catch (e) {
    console.error(e);
  } finally {
    linking.value = false;
  }
};

const confirmDelete = (trilha) => {
  $q.dialog({
    title: 'Confirmar Exclusão',
    message: `Deseja realmente remover a trilha "${trilha.tituloTrilha}"?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    loading.value = true;
    await courseStore.deleteLearningPath(trilha.id);
    await loadData();
  });
};

// Métodos do Modal de Inscritos
const openInscritosModal = async (trilha) => {
  selectedTrilhaForInscritos.value = trilha;
  filtroInscritos.value = '';
  showInscritosModal.value = true;
  await recarregarInscritosTrilha();
};

const recarregarInscritosTrilha = async () => {
  if (!selectedTrilhaForInscritos.value) return;
  loadingEnrollments.value = true;
  try {
    const list = await courseStore.fetchLearningPathEnrollments(selectedTrilhaForInscritos.value.id);
    trilhaEnrollments.value = list;
  } catch (e) {
    console.error(e);
  } finally {
    loadingEnrollments.value = false;
  }
};

const totalConcluidos = computed(() => {
  return trilhaEnrollments.value.filter(e => e.progress >= 100 || e.status === 'CONCLUIDO').length;
});

const totalEmAndamento = computed(() => {
  return trilhaEnrollments.value.filter(e => e.progress < 100 && e.status !== 'CONCLUIDO').length;
});

const inscritosFiltrados = computed(() => {
  const list = trilhaEnrollments.value || [];
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

const formatarData = (dt) => {
  if (!dt) return 'Recente';
  const d = new Date(dt);
  return d.toLocaleDateString('pt-BR');
};
</script>
