<template>
  <div class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-subtitle1 text-weight-bold text-primary">
        Eixos de Conhecimento
      </div>
      <q-btn color="primary" icon="add" label="Novo Eixo" unelevated @click="openCreateModal" />
    </div>

    <q-table
      :rows="courseStore.eixos"
      :columns="columns"
      row-key="id"
      :loading="loading"
      no-data-label="Nenhum eixo cadastrado"
      flat bordered
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-xs">
          <q-btn flat round color="primary" icon="edit" size="sm" @click="openEditModal(props.row)">
            <q-tooltip>Editar Eixo</q-tooltip>
          </q-btn>
          <q-btn flat round color="negative" icon="delete" size="sm" @click="confirmDelete(props.row)">
            <q-tooltip>Excluir Eixo</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- Dialog Create/Edit Eixo -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ editMode ? 'Editar Eixo' : 'Novo Eixo' }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="form.nomeEixo" label="Nome do Eixo *" autofocus class="q-mb-md" />
          <q-input dense v-model="form.descricao" label="Descrição *" type="textarea" rows="3" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn flat label="Salvar" @click="save" :loading="saving" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCourseStore } from 'src/stores/courseStore';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const courseStore = useCourseStore();

const loading = ref(false);
const showDialog = ref(false);
const editMode = ref(false);
const saving = ref(false);
const editingId = ref(null);

const form = ref({
  nomeEixo: '',
  descricao: ''
});

const columns = [
  { name: 'nome', label: 'Nome do Eixo', align: 'left', field: 'nomeEixo', sortable: true },
  { name: 'descricao', label: 'Descrição', align: 'left', field: 'descricao' },
  { name: 'actions', label: 'Ações', align: 'center' }
];

const loadData = async () => {
  loading.value = true;
  await courseStore.fetchEixos();
  loading.value = false;
};

onMounted(() => {
  loadData();
});

const openCreateModal = () => {
  editMode.value = false;
  editingId.value = null;
  form.value = { nomeEixo: '', descricao: '' };
  showDialog.value = true;
};

const openEditModal = (eixo) => {
  editMode.value = true;
  editingId.value = eixo.id;
  form.value = { nomeEixo: eixo.nomeEixo, descricao: eixo.descricao };
  showDialog.value = true;
};

const save = async () => {
  if (!form.value.nomeEixo || !form.value.descricao) {
    $q.notify({ color: 'warning', message: 'Preencha todos os campos obrigatórios' });
    return;
  }
  
  saving.value = true;
  try {
    if (editMode.value) {
      await courseStore.updateEixo(editingId.value, form.value);
    } else {
      await courseStore.createEixo(form.value);
    }
    showDialog.value = false;
    await loadData();
  } catch (e) {
    console.error(e);
  } finally {
    saving.value = false;
  }
};

const confirmDelete = (eixo) => {
  $q.dialog({
    title: 'Confirmar Exclusão',
    message: `Deseja realmente remover o eixo "${eixo.nomeEixo}"?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    loading.value = true;
    await courseStore.deleteEixo(eixo.id);
    await loadData();
  });
};
</script>
