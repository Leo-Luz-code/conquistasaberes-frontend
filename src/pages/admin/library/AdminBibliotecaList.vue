<template>
  <q-page class="p-4 sm:p-8">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div><h1 class="text-2xl font-bold text-pmvc-dark">Gestão da Biblioteca</h1><p class="text-sm text-pmvc-gray mt-1">Cadastre e gerencie normativos, manuais, cartilhas, boletins e modelos disponíveis para os servidores.</p></div>
      <q-btn unelevated no-caps icon="add" label="Novo material" class="bg-pmvc-blue text-white rounded-lg px-4 py-2 font-semibold shadow-sm hover:bg-pmvc-lightBlue transition-colors self-start sm:self-auto" @click="openCreateModal" />
    </div>

    <div class="flex flex-col sm:flex-row gap-3 mb-6">
      <q-input v-model="busca" dense outlined clearable placeholder="Buscar por título ou categoria..." class="flex-1 bg-white rounded-lg" input-class="text-pmvc-dark"><template #prepend><q-icon name="search" class="text-pmvc-gray" /></template></q-input>
      <q-select v-model="categoriaFiltro" dense outlined emit-value map-options clearable :options="opcoesCategoriaFiltro" placeholder="Todas as categorias" class="w-full sm:w-64 bg-white rounded-lg" />
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      <div v-for="cat in resumoCategorias" :key="cat.nome" class="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center text-center gap-2 cursor-pointer transition-all hover:shadow-md hover:border-pmvc-blue/30" :class="{ '!border-pmvc-blue !ring-1 !ring-pmvc-blue/30': categoriaFiltro === cat.nome }" @click="toggleFiltroCategoria(cat.nome)">
        <div class="h-10 w-10 rounded-lg bg-pmvc-blue/10 flex items-center justify-center"><q-icon :name="cat.icon" class="text-pmvc-blue" size="20px" /></div><span class="text-sm font-semibold text-pmvc-dark leading-tight">{{ cat.nome }}</span><span class="text-xs text-pmvc-gray">{{ cat.total }} {{ cat.total === 1 ? 'item' : 'itens' }}</span>
      </div>
    </div>

    <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <q-table :rows="materiais" :columns="colunas" row-key="id" flat :loading="carregando" v-model:pagination="pagination" @request="onRequest" no-data-label="Nenhum material cadastrado ainda." class="biblioteca-table">
        <template #loading><q-inner-loading showing color="primary" /></template>
        <template #body-cell-titulo="props"><q-td :props="props"><div class="flex items-center gap-3"><div class="h-9 w-9 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0" :class="badgeArquivo(props.row.documentoUrl).class">{{ badgeArquivo(props.row.documentoUrl).label }}</div><span class="font-medium text-pmvc-dark">{{ props.row.titulo }}</span></div></q-td></template>
        <template #body-cell-categoria="props"><q-td :props="props"><q-badge rounded outline color="primary" class="px-2 py-1 normal-case font-medium">{{ props.row.categoria }}</q-badge></q-td></template>
        <template #body-cell-createdAt="props"><q-td :props="props"><span class="text-pmvc-gray text-sm">{{ formatarData(props.row.createdAt) }}</span></q-td></template>
        <template #body-cell-acoes="props"><q-td :props="props" class="text-right"><q-btn flat round dense icon="visibility" size="sm" class="text-pmvc-gray hover:text-pmvc-blue" @click="visualizarArquivo(props.row)"><q-tooltip>Visualizar arquivo</q-tooltip></q-btn><q-btn flat round dense icon="edit" size="sm" class="text-pmvc-gray hover:text-pmvc-blue" @click="openEditModal(props.row)"><q-tooltip>Editar</q-tooltip></q-btn><q-btn flat round dense icon="delete_outline" size="sm" class="text-pmvc-gray hover:text-red-500" @click="confirmarExclusao(props.row)"><q-tooltip>Excluir</q-tooltip></q-btn></q-td></template>
      </q-table>
    </div>

    <BibliotecaFormModal v-model="showFormModal" :material="materialSelecionado" :categorias="categorias" @salvar="salvarMaterial" />
    <ConfirmDeleteBiblioteca v-model="showDeleteModal" :material="materialSelecionado" @confirm="excluirMaterial" />
  </q-page>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import BibliotecaFormModal from 'src/components/modals/BibliotecaFormModal.vue'
import ConfirmDeleteBiblioteca from 'src/components/modals/ConfirmDeleteBiblioteca.vue'

const $q = useQuasar()
const categoriasPadrao = ['Normativos', 'Materiais de aula', 'Guias rápidos', 'Boletins técnicos', 'Modelos e documentos']
const iconesCategoria = { Normativos: 'description', 'Materiais de aula': 'menu_book', 'Guias rápidos': 'summarize', 'Boletins técnicos': 'article', 'Modelos e documentos': 'file_copy' }
const carregando = ref(false)
const busca = ref('')
const categoriaFiltro = ref(null)
const materiais = ref([])
const categoriasApi = ref([])
const showFormModal = ref(false)
const showDeleteModal = ref(false)
const materialSelecionado = ref(null)
const pagination = ref({ page: 1, rowsPerPage: 8, rowsNumber: 0 })
let filtroTimer

const categorias = computed(() => [...new Set([...categoriasPadrao, ...categoriasApi.value.map(({ categoria }) => categoria)])])
const colunas = [{ name: 'titulo', label: 'Título', field: 'titulo', align: 'left', sortable: true }, { name: 'categoria', label: 'Categoria', field: 'categoria', align: 'left', sortable: true }, { name: 'createdAt', label: 'Cadastrado em', field: 'createdAt', align: 'left', sortable: true }, { name: 'acoes', label: '', field: 'acoes', align: 'right' }]
const opcoesCategoriaFiltro = computed(() => categorias.value.map((categoria) => ({ label: categoria, value: categoria })))
const resumoCategorias = computed(() => categorias.value.map((nome) => ({ nome, icon: iconesCategoria[nome] || 'folder', total: categoriasApi.value.find((item) => item.categoria === nome)?.total || 0 })))

function paramsLista(page = pagination.value.page, limit = pagination.value.rowsPerPage) { return { page, limit, ...(busca.value?.trim() && { search: busca.value.trim() }), ...(categoriaFiltro.value && { categoria: categoriaFiltro.value }) } }
async function carregarMateriais(page = pagination.value.page, limit = pagination.value.rowsPerPage) {
  carregando.value = true
  try { const { data } = await api.get('/library', { params: paramsLista(page, limit) }); materiais.value = data.data; pagination.value = { ...pagination.value, page: data.meta.page, rowsPerPage: data.meta.limit, rowsNumber: data.meta.total } }
  catch (error) { materiais.value = []; pagination.value = { ...pagination.value, rowsNumber: 0 }; notificarErro(error, 'Não foi possível carregar os materiais.') }
  finally { carregando.value = false }
}
async function carregarCategorias() { try { const { data } = await api.get('/library/categories'); categoriasApi.value = data } catch (error) { notificarErro(error, 'Não foi possível carregar as categorias.') } }
function onRequest({ pagination: novaPaginacao }) { carregarMateriais(novaPaginacao.page, novaPaginacao.rowsPerPage) }
watch([busca, categoriaFiltro], () => { clearTimeout(filtroTimer); filtroTimer = setTimeout(() => carregarMateriais(1), 350) })
onMounted(async () => { await Promise.all([carregarMateriais(), carregarCategorias()]) })
onBeforeUnmount(() => clearTimeout(filtroTimer))

function toggleFiltroCategoria(nome) { categoriaFiltro.value = categoriaFiltro.value === nome ? null : nome }
function badgeArquivo(url) { const ext = (url || '').split('?')[0].split('.').pop().toUpperCase(); const mapa = { PDF: { label: 'PDF', class: 'bg-amber-100 text-amber-700' }, DOCX: { label: 'DOCX', class: 'bg-blue-100 text-blue-700' }, DOC: { label: 'DOC', class: 'bg-blue-100 text-blue-700' }, XLSX: { label: 'XLSX', class: 'bg-emerald-100 text-emerald-700' }, XLS: { label: 'XLS', class: 'bg-emerald-100 text-emerald-700' } }; return mapa[ext] || { label: ext || '—', class: 'bg-slate-100 text-slate-600' } }
function formatarData(data) { return data ? new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(data)) : '—' }
function urlArquivo(url) {
  const arquivoUrl = String(url || '')

  if (arquivoUrl.startsWith('http://') || arquivoUrl.startsWith('https://')) {
    return arquivoUrl
  }

  const baseUrl = (api.defaults.baseURL || '').replace(/\/+$/, '')
  const path = arquivoUrl.replace(/^\/+/, '')

  return `${baseUrl}/${path}`
}
function visualizarArquivo(row) { window.open(urlArquivo(row.documentoUrl), '_blank', 'noopener,noreferrer') }
function openCreateModal() { materialSelecionado.value = null; showFormModal.value = true }
function openEditModal(row) { materialSelecionado.value = row; showFormModal.value = true }
function confirmarExclusao(row) { materialSelecionado.value = row; showDeleteModal.value = true }

async function salvarMaterial(payload) {
  carregando.value = true
  try {
    const formData = new FormData()
    formData.append('titulo', payload.titulo)
    formData.append('categoria', payload.categoria)
    if (payload.documentoUrl) formData.append('documentoUrl', payload.documentoUrl)
    if (payload.file) formData.append('file', payload.file)
    if (payload.id) { await api.patch(`/library/admin/${payload.id}`, formData); $q.notify({ type: 'positive', message: 'Material atualizado com sucesso.' }) }
    else { await api.post('/library/admin', formData); $q.notify({ type: 'positive', message: 'Material cadastrado com sucesso.' }) }
    showFormModal.value = false
    await Promise.all([carregarMateriais(1), carregarCategorias()])
  } catch (error) { notificarErro(error, 'Não foi possível salvar o material.') }
  finally { carregando.value = false }
}
async function excluirMaterial() {
  if (!materialSelecionado.value) return
  carregando.value = true
  try { await api.delete(`/library/admin/${materialSelecionado.value.id}`); $q.notify({ type: 'positive', message: 'Material removido da biblioteca.' }); showDeleteModal.value = false; materialSelecionado.value = null; await Promise.all([carregarMateriais(), carregarCategorias()]) }
  catch (error) { notificarErro(error, 'Não foi possível remover o material.') }
  finally { carregando.value = false }
}
function notificarErro(error, fallback) { const message = error?.response?.data?.message; $q.notify({ type: 'negative', message: Array.isArray(message) ? message.join(', ') : message || fallback }) }
</script>

<style scoped>
.biblioteca-table :deep(thead tr) { background-color: #f8fafc; }
.biblioteca-table :deep(th) { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; font-weight: 700; }
</style>