<template>
  <q-page class="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 font-sans">
    <!-- Cabeçalho e Seletor de Secretaria (Filtro do Admin) -->
    <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
      <!-- Título e Tag de Status -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 mb-1.5">
            <q-chip
              v-if="authStore.isAdmin"
              dense
              color="primary"
              text-color="white"
              icon="admin_panel_settings"
              class="font-bold text-xs"
            >
              Visão Global Admin
            </q-chip>
            <span v-else class="text-xs font-bold text-slate-400 uppercase tracking-wider">Painel Executivo</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-pmvc-dark tracking-tight leading-tight">
            {{ secretariaSelecionada ? secretariaSelecionada.nome : 'Visão Geral — Todas as Secretarias' }}
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 mt-1">
            {{ secretariaSelecionada ? `Indicadores de capacitação e engajamento da ${secretariaSelecionada.sigla}.` : 'Indicadores de capacitação consolidados de todos os órgãos municipais.' }}
          </p>
        </div>

        <q-chip
          v-if="secretariaSelecionada"
          outline
          color="primary"
          icon="check_circle"
          class="font-bold text-xs self-start sm:self-center"
        >
          Filtro Ativo: {{ secretariaSelecionada.sigla }}
        </q-chip>
      </div>

      <!-- Barra de Pesquisa e Filtro de Secretaria (Largura Total Centralizada) -->
      <div class="w-full pt-2 border-t border-slate-100">
        <label class="block text-xs font-bold text-slate-600 mb-2 flex items-center justify-between">
          <span class="flex items-center gap-1.5">
            <q-icon name="search" color="primary" size="18px" />
            Pesquisar e Filtrar por Secretaria Municipal:
          </span>
          <span v-if="secretariaSelecionada" class="text-xs text-pmvc-blue cursor-pointer hover:underline font-semibold" @click="limparFiltroSecretaria">
            Limpar filtro (Ver Todas)
          </span>
        </label>
        <q-select
          v-model="secretariaFiltro"
          :options="opcoesSecretariaFiltradas"
          option-label="nomeExibicao"
          outlined
          dense
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          placeholder="Digite o nome da secretaria, sigla (ex: SMS, SMED, SETP) ou nome do gestor..."
          class="w-full rounded-2xl bg-slate-50 text-sm font-medium"
          @filter="filtrarOpcoesSecretaria"
          @update:model-value="onSecretariaChange"
        >
          <template v-slot:prepend>
            <q-icon name="apartment" class="text-slate-400 ml-1" />
          </template>

          <template v-slot:append>
            <q-icon
              v-if="secretariaSelecionada"
              name="close"
              class="cursor-pointer text-slate-400 hover:text-slate-600"
              @click.stop="limparFiltroSecretaria"
            />
          </template>

          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-slate-400 text-xs">
                Nenhuma secretaria correspondente encontrada
              </q-item-section>
            </q-item>
          </template>

          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps" class="hover:bg-blue-50 py-3">
              <q-item-section avatar v-if="scope.opt.sigla !== 'TODAS'">
                <div
                  class="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-xs shadow-sm"
                  :style="{ backgroundColor: scope.opt.corIdentificacao || '#1b4b7f' }"
                >
                  {{ scope.opt.sigla }}
                </div>
              </q-item-section>
              <q-item-section avatar v-else>
                <div class="w-9 h-9 rounded-xl bg-blue-100 text-pmvc-blue flex items-center justify-center font-bold text-xs">
                  <q-icon name="apps" size="20px" />
                </div>
              </q-item-section>

              <q-item-section>
                <q-item-label class="font-bold text-sm text-slate-800">{{ scope.opt.nome }}</q-item-label>
                <q-item-label caption class="text-xs text-slate-500">
                  {{ scope.opt.sigla !== 'TODAS' ? `Sigla: ${scope.opt.sigla} • Resp: ${scope.opt.responsavelNome || 'Não informado'}` : 'Exibir indicadores consolidados de toda a prefeitura' }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
    </div>

    <!-- KPIs Dinâmicos Baseados na Secretaria Selecionada -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- KPI 1: Servidores -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-blue-50 text-pmvc-blue flex items-center justify-center shrink-0">
          <q-icon name="group" size="24px" />
        </div>
        <div>
          <span class="block text-xs font-medium text-slate-500">Servidores cadastrados</span>
          <div class="flex items-end gap-2">
            <span class="text-2xl font-bold text-pmvc-dark leading-none">
              {{ kpiServidores.toLocaleString() }}
            </span>
          </div>
          <span class="text-[10px] text-slate-400 mt-1 block">Vinculados ao órgão</span>
        </div>
      </div>

      <!-- KPI 2: Ativos -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <q-icon name="person_check" size="24px" />
        </div>
        <div>
          <span class="block text-xs font-medium text-slate-500">Servidores ativos</span>
          <div class="flex items-end gap-2">
            <span class="text-2xl font-bold text-pmvc-dark leading-none">
              {{ kpiAtivos.toLocaleString() }}
            </span>
          </div>
          <span class="text-[10px] text-slate-400 mt-1 block">{{ kpiTaxaEngajamento }}% engajamento</span>
        </div>
      </div>

      <!-- KPI 3: Cursos Concluídos -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
          <q-icon name="emoji_events" size="24px" />
        </div>
        <div>
          <span class="block text-xs font-medium text-slate-500">Cursos concluídos</span>
          <div class="flex items-end gap-2">
            <span class="text-2xl font-bold text-pmvc-dark leading-none">
              {{ kpiCursosConcluidos.toLocaleString() }}
            </span>
          </div>
          <span class="text-[10px] text-slate-400 mt-1 block">certificados emitidos</span>
        </div>
      </div>

      <!-- KPI 4: Taxa de Conclusão -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0">
          <q-icon name="trending_up" size="24px" />
        </div>
        <div>
          <span class="block text-xs font-medium text-slate-500">Taxa de conclusão</span>
          <div class="flex items-end gap-2">
            <span class="text-2xl font-bold text-pmvc-dark leading-none">
              {{ kpiTaxaConclusao }}%
            </span>
          </div>
          <span class="text-[10px] text-slate-400 mt-1 block">Meta municipal: 80%</span>
        </div>
      </div>
    </div>

    <!-- Gráficos Row 1: Conclusão por curso & Engajamento mensal -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Conclusão por curso (Bar Chart) -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 class="font-bold text-pmvc-dark mb-1">Conclusão por curso</h3>
        <p class="text-xs text-slate-500 mb-4">% de servidores que concluíram cada curso</p>
        <div class="h-64">
          <apexchart type="bar" height="100%" :options="barOptions" :series="barSeries"></apexchart>
        </div>
      </div>

      <!-- Engajamento mensal (Line Chart) -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 class="font-bold text-pmvc-dark mb-1">Engajamento mensal</h3>
        <p class="text-xs text-slate-500 mb-4">Acessos únicos por mês</p>
        <div class="h-64">
          <apexchart type="line" height="100%" :options="lineOptions" :series="lineSeries"></apexchart>
        </div>
      </div>
    </div>

    <!-- Gráficos Row 2: Status dos cursos & Trilhas mais acessadas -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Status dos cursos (Donut Chart) -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
        <h3 class="font-bold text-pmvc-dark mb-1">Status dos cursos</h3>
        <p class="text-xs text-slate-500 mb-6">Distribuição geral de matrículas</p>
        <div class="flex-grow flex items-center justify-center relative">
          <div class="w-full max-w-[300px]">
            <apexchart type="donut" width="100%" :options="donutOptions" :series="donutSeries"></apexchart>
          </div>
        </div>
      </div>

      <!-- Trilhas mais acessadas (Progress Bars) -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
        <div>
          <h3 class="font-bold text-pmvc-dark mb-1 flex items-center gap-2">
            <q-icon name="route" class="text-slate-400" />
            Trilhas mais acessadas
          </h3>
          <p class="text-xs text-slate-500 mb-6">% de servidores inscritos na secretaria</p>

          <div class="space-y-5">
            <!-- Trilha 1 -->
            <div>
              <div class="flex justify-between text-sm font-bold text-pmvc-dark mb-1">
                <span>Integração ao Serviço Público</span>
                <span>{{ trilha1Porcento }}%</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden flex">
                <div class="bg-[#1b4b7f] h-2.5" :style="{ width: trilha1Porcento + '%' }"></div>
                <div class="bg-[#38b2ac] h-2.5 flex-1"></div>
              </div>
            </div>

            <!-- Trilha 2 -->
            <div>
              <div class="flex justify-between text-sm font-bold text-pmvc-dark mb-1">
                <span>Gestão e Liderança</span>
                <span>{{ trilha2Porcento }}%</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden flex">
                <div class="bg-[#1b4b7f] h-2.5" :style="{ width: trilha2Porcento + '%' }"></div>
                <div class="bg-emerald-500 h-2.5 flex-1 opacity-80"></div>
              </div>
            </div>

            <!-- Trilha 3 -->
            <div>
              <div class="flex justify-between text-sm font-bold text-pmvc-dark mb-1">
                <span>Governança e Controle</span>
                <span>{{ trilha3Porcento }}%</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden flex">
                <div class="bg-[#1b4b7f] h-2.5" :style="{ width: trilha3Porcento + '%' }"></div>
                <div class="bg-emerald-500 h-2.5 flex-1 opacity-80"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Alert Dinâmico -->
        <div class="mt-6 bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
          <q-icon name="warning_amber" class="text-amber-500 text-lg mt-0.5 shrink-0" />
          <div>
            <span class="block text-sm font-bold text-amber-900">Pendências de capacitação</span>
            <span class="text-xs text-amber-800">
              Servidores da {{ secretariaSelecionada ? secretariaSelecionada.sigla : 'PMVC' }} que ainda não iniciaram a Trilha de Integração.
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Ranking de Servidores por Secretaria -->
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="font-bold text-pmvc-dark">Ranking — Servidores com maior engajamento</h3>
          <p class="text-xs text-slate-500">Filtrado por: {{ secretariaSelecionada ? secretariaSelecionada.sigla : 'Todas as Secretarias' }}</p>
        </div>
        <q-chip outline color="primary" dense class="font-bold text-xs">
          Top Servidores
        </q-chip>
      </div>

      <div class="space-y-4">
        <div
          v-for="(servidor, index) in rankingFiltrado"
          :key="servidor.id"
          class="flex items-center justify-between border-b border-slate-100 pb-4 last:border-none"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm"
              :class="{
                'bg-amber-400 text-white': index === 0,
                'bg-slate-300 text-slate-700': index === 1,
                'bg-amber-100 text-amber-700': index === 2,
                'bg-slate-100 text-slate-500': index > 2,
              }"
            >
              {{ index + 1 }}º
            </div>
            <div>
              <span class="block text-sm font-bold text-pmvc-dark leading-tight">{{ servidor.nome }}</span>
              <span class="text-xs text-slate-500">{{ servidor.secretariaSigla }} • {{ servidor.cargo }}</span>
            </div>
          </div>
          <div class="bg-blue-50 text-pmvc-blue text-xs font-bold px-3 py-1 rounded-full border border-blue-100">
            {{ servidor.pontos }} pts
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAnalyticsStore } from 'src/stores/analyticsStore'
import { useAuthStore } from 'src/stores/authStore'
import { useSecretariaStore } from 'src/stores/secretariaStore'

const authStore = useAuthStore()
const secretariaStore = useSecretariaStore()
const analyticsStore = useAnalyticsStore()

// Estado do Filtro de Secretaria
const secretariaFiltro = ref({
  id: 'TODAS',
  nome: 'Todas as Secretarias',
  sigla: 'TODAS',
  nomeExibicao: 'Todas as Secretarias (Visão Consolidada)',
})

const opcoesSecretariaOriginal = ref([])
const opcoesSecretariaFiltradas = ref([])

// Secretaria Selecionada Objeto
const secretariaSelecionada = computed(() => {
  if (!secretariaFiltro.value || secretariaFiltro.value.id === 'TODAS') {
    return null
  }
  return secretariaFiltro.value
})

// Dados Mockados Dinâmicos de Ranking por Secretaria
const rankingCompleto = ref([
  { id: '1', nome: 'Dra. Ana Paula Oliveira', secretariaSigla: 'SMS', secretariaId: '1', cargo: 'Médica Sanitarista', pontos: 1420 },
  { id: '2', nome: 'Prof. Carlos Eduardo Santos', secretariaSigla: 'SMED', secretariaId: '2', cargo: 'Professor Titular', pontos: 1380 },
  { id: '3', nome: 'Dr. Roberto Mendes', secretariaSigla: 'SETP', secretariaId: '3', cargo: 'Auditor de Controle', pontos: 1240 },
  { id: '4', nome: 'Mariana Lima Castro', secretariaSigla: 'SEFIN', secretariaId: '4', cargo: 'Analista Financeira', pontos: 1190 },
  { id: '5', nome: 'Eng. Fernando Rocha', secretariaSigla: 'SEMMA', secretariaId: '5', cargo: 'Engenheiro Ambiental', pontos: 1050 },
  { id: '6', nome: 'Juliana Barbosa Silva', secretariaSigla: 'SEMOB', secretariaId: '6', cargo: 'Agente de Trânsito', pontos: 980 },
  { id: '7', nome: 'Patrícia Alencar', secretariaSigla: 'SEMDES', secretariaId: '7', cargo: 'Assistente Social', pontos: 940 },
  { id: '8', nome: 'Gustavo Henrique Vasconcelos', secretariaSigla: 'CETI', secretariaId: '8', cargo: 'Analista de Sistemas', pontos: 1510 },
])

const rankingFiltrado = computed(() => {
  if (!secretariaSelecionada.value) {
    return rankingCompleto.value.slice(0, 5)
  }
  const filtrados = rankingCompleto.value.filter((s) => s.secretariaSigla === secretariaSelecionada.value.sigla)
  return filtrados.length ? filtrados : rankingCompleto.value.slice(0, 3)
})

// Cálculo Dinâmico de KPIs baseado na Secretaria Selecionada e Backend
const kpiServidores = computed(() => {
  if (analyticsStore.dashboard?.totalServidores !== undefined && !secretariaSelecionada.value) {
    return analyticsStore.dashboard.totalServidores
  }
  if (secretariaSelecionada.value) {
    return secretariaSelecionada.value.servidoresCount || 150
  }
  return secretariaStore.secretarias.reduce((acc, s) => acc + (s.servidoresCount || 0), 0) || 1482
})

const kpiAtivos = computed(() => Math.round(kpiServidores.value * 0.8))

const kpiTaxaEngajamento = computed(() => {
  if (secretariaSelecionada.value) {
    return secretariaSelecionada.value.taxaAdesao || 85
  }
  return 81
})

const kpiCursosConcluidos = computed(() => {
  if (analyticsStore.dashboard?.totalCertificados !== undefined && !secretariaSelecionada.value) {
    return analyticsStore.dashboard.totalCertificados
  }
  if (secretariaSelecionada.value) {
    return (secretariaSelecionada.value.cursosOfertadosCount || 5) * 40
  }
  return 3842
})

const kpiTaxaConclusao = computed(() => {
  if (analyticsStore.dashboard?.avgProgressPercent !== undefined && !secretariaSelecionada.value) {
    return analyticsStore.dashboard.avgProgressPercent
  }
  if (secretariaSelecionada.value) {
    return Math.min(95, (secretariaSelecionada.value.taxaAdesao || 75) - 5)
  }
  return 68
})

// Trilhas porcentagens dinâmicas
const trilha1Porcento = computed(() => (secretariaSelecionada.value ? 85 : 78))
const trilha2Porcento = computed(() => (secretariaSelecionada.value ? 62 : 56))
const trilha3Porcento = computed(() => (secretariaSelecionada.value ? 48 : 42))

// Configurações Dinâmicas dos Gráficos ApexCharts
const barSeries = computed(() => [
  {
    name: 'Concluídos',
    data: secretariaSelecionada.value ? [88, 72, 60, 55, 80, 45] : [79, 65, 52, 41, 74, 38],
  },
])

const barOptions = ref({
  chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'inherit' },
  colors: ['#1b4b7f'],
  plotOptions: { bar: { borderRadius: 4, columnWidth: '65%' } },
  dataLabels: { enabled: false },
  xaxis: {
    categories: ['Ética', 'Atendimento', 'LGPD', 'Liderança', 'Comunicação', 'Inovação'],
    axisBorder: { show: true, color: '#e2e8f0' },
    labels: { style: { colors: '#64748b', fontSize: '11px' } },
  },
  yaxis: { max: 100, tickAmount: 4, labels: { style: { colors: '#64748b', fontSize: '11px' } } },
  grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
})

const lineSeries = computed(() => [
  {
    name: 'Acessos únicos',
    data: secretariaSelecionada.value ? [120, 180, 240, 310, 420] : [420, 580, 750, 920, 1200],
  },
])

const lineOptions = ref({
  chart: { type: 'line', toolbar: { show: false }, fontFamily: 'inherit' },
  colors: ['#f59e0b'],
  stroke: { curve: 'smooth', width: 3 },
  markers: { size: 6, colors: ['#f59e0b'], strokeColors: '#fff', strokeWidth: 2 },
  xaxis: {
    categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
    labels: { style: { colors: '#64748b', fontSize: '11px' } },
  },
  yaxis: { min: 0, tickAmount: 4, labels: { style: { colors: '#64748b', fontSize: '11px' } } },
  grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
})

const donutSeries = computed(() => {
  if (secretariaSelecionada.value) {
    const total = kpiServidores.value
    return [Math.round(total * 0.6), Math.round(total * 0.25), Math.round(total * 0.15)]
  }
  return [1240, 480, 180]
})

const donutOptions = ref({
  chart: { type: 'donut', fontFamily: 'inherit' },
  labels: ['Concluídos', 'Em andamento', 'Não iniciados'],
  colors: ['#22c55e', '#eab308', '#64748b'],
  plotOptions: { pie: { donut: { size: '55%' } } },
  dataLabels: { enabled: false },
  stroke: { width: 3, colors: ['#ffffff'] },
  legend: { position: 'bottom', horizontalAlign: 'center', fontSize: '11px', labels: { colors: '#64748b' } },
})

// Função para filtrar opções no autocomplete
function filtrarOpcoesSecretaria(val, update) {
  if (val === '') {
    update(() => {
      opcoesSecretariaFiltradas.value = opcoesSecretariaOriginal.value
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    opcoesSecretariaFiltradas.value = opcoesSecretariaOriginal.value.filter(
      (v) =>
        v.nome.toLowerCase().includes(needle) ||
        v.sigla.toLowerCase().includes(needle) ||
        (v.responsavelNome && v.responsavelNome.toLowerCase().includes(needle))
    )
  })
}

async function onSecretariaChange(opt) {
  const targetId = opt && opt.id !== 'TODAS' ? opt.id : null
  await analyticsStore.fetchDashboard(targetId)
}

async function limparFiltroSecretaria() {
  secretariaFiltro.value = opcoesSecretariaOriginal.value[0] || {
    id: 'TODAS',
    nome: 'Todas as Secretarias',
    sigla: 'TODAS',
    nomeExibicao: 'Todas as Secretarias (Visão Consolidada)',
  }
  await analyticsStore.fetchDashboard(null)
}

onMounted(async () => {
  await Promise.all([
    secretariaStore.fetchSecretarias(),
    analyticsStore.fetchDashboard(),
  ])

  // Prepara lista de secretarias para o Select com busca
  const lista = [
    {
      id: 'TODAS',
      nome: 'Todas as Secretarias',
      sigla: 'TODAS',
      nomeExibicao: 'Todas as Secretarias (Visão Consolidada)',
    },
  ]

  secretariaStore.secretarias.forEach((s) => {
    lista.push({
      ...s,
      nomeExibicao: `${s.sigla} - ${s.nome}`,
    })
  })

  opcoesSecretariaOriginal.value = lista
  opcoesSecretariaFiltradas.value = lista
})
</script>

<style scoped>
/* Scoped styles */
</style>
