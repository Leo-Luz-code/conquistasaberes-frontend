<template>
  <q-page padding class="max-w-9xl animate-fade-in-down">
    <CetiCard icon="people" title="Usuários do Sistema">
      <TableList
        title="Lista de usuários"
        :column="columns"
        :rows="rows"
        :acoes="acoes"
        routeAdd="/admin/usuarios/novo"
        titleButtonAdd="Adicionar Usuário"
        @getUsers="getUsers"
        :itemsPerPage="10"
        :maxPages="max_pages"
        :currentPage="currentPage"
        :filters="filters"
        @clearFilters="clearFilters"
      >
      </TableList>
    </CetiCard>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { api } from 'src/boot/axios';
import showNotification from 'src/utils/quasarPlugins/notifyMessage';
import CetiCard from '../../../components/common/CetiCard.vue';
import TableList from 'src/components/tables/TableList.vue';
import showModal from 'src/utils/quasarPlugins/dialogMessage';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/authStore';

const authStore = useAuthStore();
const $q = useQuasar();
const max_pages = ref(1);
const currentPage = ref(1);
const currentSearch = ref('');
const router = useRouter();

const modelsFilters = ref({
  nivel: '',
  situacao: '',
});

const filters = ref([
  {
    label: 'Nível',
    model: modelsFilters.value.nivel,
    options: [
      { label: 'Todos', value: '' },
      { label: 'Administrador', value: 'ADMIN_RH_CETI' },
      { label: 'Gestor', value: 'GESTOR_SECRETARIA' },
      { label: 'Servidor', value: 'SERVIDOR' },
    ],
    actions: (val) => {
      modelsFilters.value.nivel = val || '';
      currentPage.value = 1;
      getUsers(currentSearch.value, 1);
    },
  },
  {
    label: 'Situação',
    model: modelsFilters.value.situacao,
    options: [
      { label: 'Todos', value: '' },
      { label: 'Ativo', value: 'ATIVO' },
      { label: 'Inativo', value: 'INATIVO' },
    ],
    actions: (val) => {
      modelsFilters.value.situacao = val || '';
      currentPage.value = 1;
      getUsers(currentSearch.value, 1);
    },
  },
]);

const acoes = ref([
  {
    label: 'Editar',
    icon: 'edit',
    color: 'primary',
    administrator: true,
    action: (row) => {
      router.push(`/admin/usuarios/editar/${row.id}`);
    },
  },
  {
    label: 'Excluir',
    icon: 'delete',
    color: 'negative',
    administrator: authStore.isAdmin,
    action: (row) => {
      deleteUser(row);
    },
  },
]);

const columns = ref([
  {
    name: 'nome',
    required: true,
    label: 'Nome',
    align: 'left',
    field: 'nome',
    sortable: true,
  },
  {
    name: 'matricula',
    align: 'center',
    label: 'Matrícula',
    field: 'matricula',
    sortable: true,
  },
  {
    name: 'email',
    align: 'center',
    label: 'E-mail',
    field: 'email',
    sortable: true,
  },
  {
    name: 'nivel',
    align: 'center',
    label: 'Nível',
    field: (row) => {
      if (row.role === 'ADMIN_RH_CETI') return 'Administrador';
      if (row.role === 'GESTOR_SECRETARIA') return 'Gestor';
      return 'Servidor';
    },
    sortable: true,
  },
  {
    name: 'situacao',
    align: 'center',
    label: 'Situação',
    field: (row) => (row.statusAtivo ? 'Ativo' : 'Inativo'),
    sortable: true,
  },
  {
    name: 'acoes',
    field: 'acoes',
    align: 'center',
    label: 'Ações',
    sortable: false,
  },
]);
const rows = ref([]);

onMounted(() => {
  getUsers('', 1);
});

async function getUsers(pesquisa = '', page = 1) {
  if (typeof pesquisa === 'string') {
    currentSearch.value = pesquisa;
  }
  currentPage.value = Number(page) || 1;

  $q.loading.show({
    message: 'Buscando informações no servidor...',
  });

  const filtros = {
    nivel: modelsFilters.value.nivel,
    situacao: modelsFilters.value.situacao,
  };

  try {
    let url = `usuarios?pagina=${currentPage.value}&itensPorPagina=10`;

    if (currentSearch.value && currentSearch.value.trim() !== '') {
      url += `&busca=${encodeURIComponent(currentSearch.value.trim())}`;
    }

    const filtrosAtivos = [];
    const valoresAtivos = [];

    if (filtros.nivel) {
      filtrosAtivos.push('nivel');
      valoresAtivos.push(filtros.nivel);
    }

    if (filtros.situacao) {
      filtrosAtivos.push('situacao');
      valoresAtivos.push(filtros.situacao);
    }

    if (filtrosAtivos.length > 0) {
      url += `&filtro=${filtrosAtivos.join(',')}&valor=${valoresAtivos.join(',')}`;
    }

    const { data } = await api.get(url);

    rows.value = data.data || [];
    max_pages.value = Number(data.maxPag) || 1;
  } catch (error) {
    showNotification('negative', 'Erro ao buscar usuários', 'top', 3000);
  } finally {
    $q.loading.hide();
  }
}

async function clearFilters() {
  modelsFilters.value.nivel = '';
  modelsFilters.value.situacao = '';
  currentSearch.value = '';
  currentPage.value = 1;
  await getUsers('', 1);
}

async function deleteUser(user) {
  showModal(`Tem certeza que deseja excluir o usuário`, user.nome).onOk(
    async () => {
      $q.loading.show({
        message: 'Aguarde, excluindo usuário...',
        spinnerColor: 'blue-5',
      });
      try {
        const { status } = await api.delete(`usuarios/${user.id}`);
        if (status == 200) {
          showNotification(
            'positive',
            'Usuário removido com sucesso!',
            'top',
            3000,
          );
        }
        getUsers(currentSearch.value, currentPage.value);
        $q.loading.hide();
      } catch (error) {
        showNotification('negative', error.response?.data?.message || 'Erro ao excluir usuário', 'top', 3000);
        $q.loading.hide();
      }
    },
  );
}
</script>

<style scoped></style>
