<template>
  <div class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-subtitle1 text-weight-bold text-primary">
          {{ authStore.isGestor ? 'Minhas Trilhas de Aprendizagem' : 'Trilhas de Aprendizagem' }}
        </div>
        <div v-if="authStore.isGestor" class="text-caption text-grey-7">
          Listagem com as trilhas de capacitação criadas por você.
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
          <q-avatar square size="48px" class="bg-grey-3 rounded-borders">
            <img v-if="props.row.capaUrl" :src="getMediaUrl(props.row.capaUrl)" alt="Capa" />
            <q-icon v-else name="alt_route" color="primary" size="24px" />
          </q-avatar>
        </q-td>
      </template>

      <template v-slot:body-cell-eixo="props">
        <q-td :props="props">
          <q-chip dense outline color="secondary" size="sm">
            {{ props.row.eixo ? props.row.eixo.nomeEixo : 'Sem Eixo' }}
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-xs">
          <q-btn flat round color="secondary" icon="post_add" size="sm" @click="openLinkCoursesModal(props.row)">
            <q-tooltip>Vincular Cursos</q-tooltip>
          </q-btn>
          <q-btn flat round color="primary" icon="edit" size="sm" @click="openEditModal(props.row)">
            <q-tooltip>Editar Trilha</q-tooltip>
          </q-btn>
          <q-btn flat round color="negative" icon="delete" size="sm" @click="confirmDelete(props.row)">
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
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

const form = ref({
  tituloTrilha: '',
  cargaHorariaTotal: 0,
  eixoId: null,
  capaUrl: ''
});

const columns = [
  { name: 'capa', label: 'Capa', align: 'center', field: 'capaUrl' },
  { name: 'titulo', label: 'Título', align: 'left', field: 'tituloTrilha', sortable: true },
  { name: 'carga', label: 'Carga (h)', align: 'center', field: 'cargaHorariaTotal', sortable: true },
  { name: 'eixo', label: 'Eixo Vinculado', align: 'left', field: row => row.eixo?.nomeEixo || '' },
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
</script>
