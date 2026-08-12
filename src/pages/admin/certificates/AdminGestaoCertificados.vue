<template>
  <q-page class="p-4 sm:p-8">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-pmvc-dark">Gestão de Certificados</h1>
        <p class="text-sm text-pmvc-gray mt-1">Acompanhe, emita manualmente e revogue certificados emitidos pela Universidade do Servidor Público.</p>
      </div>
      <q-btn unelevated no-caps icon="workspace_premium" label="Emitir certificado" class="bg-pmvc-blue text-white rounded-lg px-4 py-2 font-semibold shadow-sm hover:bg-pmvc-lightBlue transition-colors self-start sm:self-auto" @click="showEmitirModal = true" />
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      <div class="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3"><div class="h-10 w-10 rounded-lg bg-pmvc-blue/10 flex items-center justify-center"><q-icon name="workspace_premium" class="text-pmvc-blue" size="20px" /></div><div><p class="text-xs text-pmvc-gray m-0">Total</p><p class="text-lg font-bold text-pmvc-dark m-0 leading-tight">{{ pagination.rowsNumber }}</p></div></div>
      <div class="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3"><div class="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center"><q-icon name="check_circle_outline" class="text-emerald-600" size="20px" /></div><div><p class="text-xs text-pmvc-gray m-0">Emitidos</p><p class="text-lg font-bold text-pmvc-dark m-0 leading-tight">{{ totalEmitidos }}</p></div></div>
      <div class="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3"><div class="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center"><q-icon name="block" class="text-red-500" size="20px" /></div><div><p class="text-xs text-pmvc-gray m-0">Revogados</p><p class="text-lg font-bold text-pmvc-dark m-0 leading-tight">{{ totalRevogados }}</p></div></div>
      <div class="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3"><div class="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center"><q-icon name="event" class="text-amber-600" size="20px" /></div><div><p class="text-xs text-pmvc-gray m-0">Emitidos este mês</p><p class="text-lg font-bold text-pmvc-dark m-0 leading-tight">{{ totalEsteMes }}</p></div></div>
    </div>

    <div class="flex flex-col sm:flex-row gap-3 mb-6">
      <q-input v-model="busca" dense outlined clearable placeholder="Buscar por servidor, curso ou código de validação..." class="flex-1 bg-white rounded-lg" input-class="text-pmvc-dark"><template #prepend><q-icon name="search" class="text-pmvc-gray" /></template></q-input>
      <q-select v-model="statusFiltro" dense outlined emit-value map-options clearable :options="opcoesStatus" placeholder="Todos os status" class="w-full sm:w-56 bg-white rounded-lg" />
    </div>

    <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <q-table :rows="certificados" :columns="colunas" row-key="id" flat :loading="carregando" v-model:pagination="pagination" @request="onRequest" no-data-label="Nenhum certificado encontrado." class="certificados-table">
        <template #loading><q-inner-loading showing color="primary" /></template>
        <template #body-cell-user="props"><q-td :props="props"><div class="flex items-center gap-3"><div class="h-9 w-9 rounded-lg bg-pmvc-blue flex items-center justify-center text-white text-sm font-bold shrink-0">{{ (props.row.userName || '?').charAt(0).toUpperCase() }}</div><div class="flex flex-col leading-tight"><span class="font-medium text-pmvc-dark">{{ props.row.userName }}</span><span class="text-xs text-pmvc-gray">{{ props.row.userMatricula || '—' }}</span></div></div></q-td></template>
        <template #body-cell-course="props"><q-td :props="props"><span class="text-pmvc-dark">{{ props.row.courseTitle }}</span></q-td></template>
        <template #body-cell-codigoValidacao="props"><q-td :props="props"><span class="text-xs font-mono text-pmvc-gray">{{ props.row.codigoValidacao }}</span></q-td></template>
        <template #body-cell-issuedAt="props"><q-td :props="props"><span class="text-pmvc-gray text-sm">{{ formatarData(props.row.issuedAt) }}</span></q-td></template>
        <template #body-cell-status="props"><q-td :props="props"><q-badge rounded class="px-2 py-1 normal-case font-medium" :class="props.row.status === 'EMITTED' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'">{{ props.row.status === 'EMITTED' ? 'Emitido' : 'Revogado' }}</q-badge></q-td></template>
        <template #body-cell-acoes="props"><q-td :props="props" class="text-right"><q-btn flat round dense icon="visibility" size="sm" class="text-pmvc-gray hover:text-pmvc-blue" @click="visualizarCertificado(props.row)"><q-tooltip>Visualizar</q-tooltip></q-btn><q-btn flat round dense icon="download" size="sm" class="text-pmvc-gray hover:text-pmvc-blue" @click="baixarCertificado(props.row)"><q-tooltip>Baixar</q-tooltip></q-btn><q-btn v-if="props.row.status === 'EMITTED'" flat round dense icon="block" size="sm" class="text-pmvc-gray hover:text-red-500" @click="confirmarRevogacao(props.row)"><q-tooltip>Revogar</q-tooltip></q-btn><q-btn v-else flat round dense icon="restart_alt" size="sm" class="text-pmvc-gray hover:text-emerald-600" @click="reativarCertificado(props.row)"><q-tooltip>Reativar emissão</q-tooltip></q-btn></q-td></template>
      </q-table>
    </div>

    <EmitirCertificadoModal v-model="showEmitirModal" :usuarios="usuariosDisponiveis" :cursos="cursosDisponiveis" @buscar-usuarios="buscarUsuarios" @buscar-cursos="buscarCursos" @emitir="emitirCertificado" />
    <ConfirmRevogarCertificado v-model="showRevogarModal" :certificado="certificadoSelecionado" @confirm="revogarCertificado" />
  </q-page>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import EmitirCertificadoModal from 'src/components/modals/EmitirCertificadoModal.vue'
import ConfirmRevogarCertificado from 'src/components/modals/ConfirmRevogarCertificado.vue'

const $q = useQuasar()
const carregando = ref(false)
const busca = ref('')
const statusFiltro = ref(null)
const certificados = ref([])
const usuariosDisponiveis = ref([])
const cursosDisponiveis = ref([])
const showEmitirModal = ref(false)
const showRevogarModal = ref(false)
const certificadoSelecionado = ref(null)
const pagination = ref({ page: 1, rowsPerPage: 10, rowsNumber: 0 })
let filtroTimer

const opcoesStatus = [{ label: 'Emitido', value: 'EMITTED' }, { label: 'Revogado', value: 'REVOKED' }]
const colunas = [
  { name: 'user', label: 'Servidor', field: 'userName', align: 'left', sortable: true },
  { name: 'course', label: 'Curso', field: 'courseTitle', align: 'left', sortable: true },
  { name: 'codigoValidacao', label: 'Código de validação', field: 'codigoValidacao', align: 'left' },
  { name: 'issuedAt', label: 'Emitido em', field: 'issuedAt', align: 'left', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'left', sortable: true },
  { name: 'acoes', label: '', field: 'acoes', align: 'right' },
]

// Os totais por status refletem a página carregada: a API não fornece agregações por status.
const totalEmitidos = computed(() => certificados.value.filter(({ status }) => status === 'EMITTED').length)
const totalRevogados = computed(() => certificados.value.filter(({ status }) => status === 'REVOKED').length)
const totalEsteMes = computed(() => { const now = new Date(); return certificados.value.filter(({ issuedAt, status }) => { const date = new Date(issuedAt); return status === 'EMITTED' && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear() }).length })

function getListParams(page = pagination.value.page, limit = pagination.value.rowsPerPage) {
  const term = busca.value?.trim()
  const params = { page, limit, ...(statusFiltro.value && { status: statusFiltro.value }) }
  if (!term) return params
  // O endpoint possui filtros independentes (AND). Um código é identificável; os demais termos são pesquisados como servidor.
  if (/^CET-/i.test(term)) params.codigoValidacao = term
  else params.userName = term
  return params
}

async function carregarCertificados(page = pagination.value.page, limit = pagination.value.rowsPerPage) {
  carregando.value = true
  try {
    const { data } = await api.get('/certificates/admin/list', { params: getListParams(page, limit) })
    certificados.value = data.data
    pagination.value = { ...pagination.value, page: data.meta.page, rowsPerPage: data.meta.limit, rowsNumber: data.meta.total }
  } catch (error) {
    certificados.value = []
    pagination.value = { ...pagination.value, rowsNumber: 0 }
    notificarErro(error, 'Não foi possível carregar os certificados.')
  } finally { carregando.value = false }
}

function onRequest({ pagination: requested }) { carregarCertificados(requested.page, requested.rowsPerPage) }
watch([busca, statusFiltro], () => { clearTimeout(filtroTimer); filtroTimer = setTimeout(() => carregarCertificados(1), 350) })
onMounted(() => carregarCertificados())
onBeforeUnmount(() => clearTimeout(filtroTimer))

async function buscarUsuarios(search) {
  if (!search || search.trim().length < 2) { usuariosDisponiveis.value = []; return }
  try { const { data } = await api.get('/certificates/admin/search-servidores', { params: { search: search.trim() } }); usuariosDisponiveis.value = data.map((user) => ({ ...user, name: user.nome })) } catch (error) { notificarErro(error, 'Não foi possível pesquisar os servidores.') }
}

async function buscarCursos(search) {
  if (!search || search.trim().length < 2) { cursosDisponiveis.value = []; return }
  try { const { data } = await api.get('/certificates/admin/search-cursos', { params: { search: search.trim() } }); cursosDisponiveis.value = data.map((course) => ({ ...course, title: course.titulo })) } catch (error) { notificarErro(error, 'Não foi possível pesquisar os cursos.') }
}

function formatarData(data) { return data ? new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(data)) : '—' }
function urlPdf(row) { return `${api.defaults.baseURL || ''}/certificates/download/${encodeURIComponent(row.codigoValidacao)}` }
function visualizarCertificado(row) { window.open(urlPdf(row), '_blank', 'noopener,noreferrer') }
function baixarCertificado(row) { const link = document.createElement('a'); link.href = urlPdf(row); link.download = `Certificado_${row.codigoValidacao}.pdf`; document.body.appendChild(link); link.click(); link.remove() }
function confirmarRevogacao(row) { certificadoSelecionado.value = row; showRevogarModal.value = true }

async function emitirCertificado({ userId, courseId }) {
  try { await criarCertificado({ userId, courseId }); showEmitirModal.value = false; $q.notify({ type: 'positive', message: 'Certificado emitido com sucesso.' }); await carregarCertificados(1) }
  catch (error) {
    const body = error?.response?.data
    if (body?.requiresConfirmation) {
      $q.dialog({ title: 'Emitir sem conclusão?', message: body.message, cancel: true, persistent: true, ok: { label: 'Emitir mesmo assim', color: 'primary', unelevated: true } }).onOk(async () => {
        try { await criarCertificado({ userId, courseId, confirmarSemConclusao: true }); showEmitirModal.value = false; $q.notify({ type: 'positive', message: 'Certificado emitido administrativamente.' }); await carregarCertificados(1) } catch (retryError) { notificarErro(retryError, 'Não foi possível emitir o certificado.') }
      })
    } else notificarErro(error, 'Não foi possível emitir o certificado.')
  }
}
function criarCertificado(payload) { return api.post('/certificates/admin', payload) }
async function atualizarStatus(id, status, sucesso) { try { await api.patch(`/certificates/admin/${id}`, { status }); $q.notify({ type: 'positive', message: sucesso }); showRevogarModal.value = false; certificadoSelecionado.value = null; await carregarCertificados() } catch (error) { notificarErro(error, 'Não foi possível atualizar o certificado.') } }
function revogarCertificado() { if (certificadoSelecionado.value) return atualizarStatus(certificadoSelecionado.value.id, 'REVOKED', 'Certificado revogado.') }
function reativarCertificado(row) { return atualizarStatus(row.id, 'EMITTED', 'Certificado reativado.') }
function notificarErro(error, fallback) { const message = error?.response?.data?.message; $q.notify({ type: 'negative', message: Array.isArray(message) ? message.join(', ') : message || fallback }) }
</script>

<style scoped>
.certificados-table :deep(thead tr) { background-color: #f8fafc; }
.certificados-table :deep(th) { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; font-weight: 700; }
</style>