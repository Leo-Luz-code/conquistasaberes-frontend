<template>
  <q-page class="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 font-sans">
    <!-- Cabeçalho e Seletor de Secretaria -->
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
            <q-chip
              v-else
              dense
              color="secondary"
              text-color="white"
              icon="supervisor_account"
              class="font-bold text-xs"
            >
              Painel do Gestor
            </q-chip>
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Métricas em Tempo Real</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-pmvc-dark tracking-tight leading-tight">
            {{ secretariaSelecionada ? secretariaSelecionada.nome : 'Visão Geral — Todas as Secretarias' }}
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 mt-1">
            {{ secretariaSelecionada ? `Indicadores de capacitação e engajamento da ${secretariaSelecionada.sigla}.` : 'Indicadores de capacitação consolidados de todos os órgãos municipais de Vitória da Conquista.' }}
          </p>
        </div>

        <div class="flex items-center gap-2">
          <q-chip
            v-if="secretariaSelecionada"
            outline
            color="primary"
            icon="check_circle"
            class="font-bold text-xs self-start sm:self-center"
          >
            Filtro Ativo: {{ secretariaSelecionada.sigla }}
          </q-chip>

          <q-btn
            flat
            round
            dense
            icon="refresh"
            color="primary"
            :loading="analyticsStore.loading"
            @click="recarregarDashboard"
          >
            <q-tooltip>Atualizar Indicadores</q-tooltip>
          </q-btn>
        </div>
      </div>

      <!-- Barra de Pesquisa e Filtro de Secretaria -->
      <div class="w-full pt-2 border-t border-slate-100">
        <label class="block text-xs font-bold text-slate-600 mb-2 flex items-center justify-between">
          <span class="flex items-center gap-1.5">
            <q-icon name="search" color="primary" size="18px" />
            Pesquisar e Filtrar por Secretaria Municipal:
          </span>
          <span v-if="secretariaSelecionada && authStore.isAdmin" class="text-xs text-pmvc-blue cursor-pointer hover:underline font-semibold" @click="limparFiltroSecretaria">
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
          placeholder="Digite o nome da secretaria, sigla (ex: SMS, SMED, SETP) ou responsável..."
          class="w-full rounded-2xl bg-slate-50 text-sm font-medium"
          @filter="filtrarOpcoesSecretaria"
          @update:model-value="onSecretariaChange"
        >
          <template v-slot:prepend>
            <q-icon name="apartment" class="text-slate-400 ml-1" />
          </template>

          <template v-slot:append>
            <q-icon
              v-if="secretariaSelecionada && authStore.isAdmin"
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

    <!-- KPIs Dinâmicos Baseados no Banco de Dados -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- KPI 1: Servidores -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-blue-50 text-pmvc-blue flex items-center justify-center shrink-0">
          <q-icon name="group" size="24px" />
        </div>
        <div>
          <span class="block text-xs font-medium text-slate-500">Servidores cadastrados</span>
          <div class="flex items-end gap-2">
            <span class="text-2xl font-extrabold text-pmvc-dark leading-none">
              {{ kpiServidores.toLocaleString() }}
            </span>
          </div>
          <span class="text-[10px] text-slate-400 mt-1 block">Vinculados no sistema</span>
        </div>
      </div>

      <!-- KPI 2: Ativos -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <q-icon name="how_to_reg" size="24px" />
        </div>
        <div>
          <span class="block text-xs font-medium text-slate-500">Servidores ativos</span>
          <div class="flex items-end gap-2">
            <span class="text-2xl font-extrabold text-pmvc-dark leading-none">
              {{ kpiAtivos.toLocaleString() }}
            </span>
          </div>
          <span class="text-[10px] text-emerald-600 font-semibold mt-1 block">{{ kpiTaxaEngajamento }}% adesão</span>
        </div>
      </div>

      <!-- KPI 3: Cursos Concluídos / Certificados -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
          <q-icon name="emoji_events" size="24px" />
        </div>
        <div>
          <span class="block text-xs font-medium text-slate-500">Cursos concluídos</span>
          <div class="flex items-end gap-2">
            <span class="text-2xl font-extrabold text-pmvc-dark leading-none">
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
            <span class="text-2xl font-extrabold text-pmvc-dark leading-none">
              {{ kpiTaxaConclusao }}%
            </span>
          </div>
          <span class="text-[10px] text-slate-400 mt-1 block">Média de aproveitamento</span>
        </div>
      </div>
    </div>

    <!-- Gráficos Row 1: Conclusão por curso & Engajamento mensal -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Conclusão por curso (Bar Chart) -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="font-bold text-pmvc-dark mb-0.5">Conclusão por curso</h3>
            <p class="text-xs text-slate-500">% de servidores que concluíram cada capacitação</p>
          </div>
          <span class="text-[11px] font-bold px-2 py-0.5 bg-blue-50 text-pmvc-blue rounded-md">
            {{ cursosStats.length }} cursos
          </span>
        </div>
        <div class="h-64">
          <apexchart
            v-if="cursosStats.length"
            type="bar"
            height="100%"
            :options="barOptions"
            :series="barSeries"
          ></apexchart>
          <div v-else class="h-full flex items-center justify-center text-xs text-slate-400">
            Nenhum curso com matrículas registrado.
          </div>
        </div>
      </div>

      <!-- Engajamento mensal (Line Chart) -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="font-bold text-pmvc-dark mb-0.5">Engajamento recente</h3>
            <p class="text-xs text-slate-500">Atividades e matrículas por mês</p>
          </div>
          <span class="text-[11px] font-bold px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md">
            Últimos 5 meses
          </span>
        </div>
        <div class="h-64">
          <apexchart
            type="line"
            height="100%"
            :options="lineOptions"
            :series="lineSeries"
          ></apexchart>
        </div>
      </div>
    </div>

    <!-- Gráficos Row 2: Status dos cursos & Trilhas mais acessadas -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Status dos cursos (Donut Chart) -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
        <h3 class="font-bold text-pmvc-dark mb-0.5">Status das matrículas</h3>
        <p class="text-xs text-slate-500 mb-6">Distribuição geral de progresso no órgão</p>
        <div class="flex-grow flex items-center justify-center relative">
          <div class="w-full max-w-[320px]">
            <apexchart
              type="donut"
              width="100%"
              :options="donutOptions"
              :series="donutSeries"
            ></apexchart>
          </div>
        </div>
      </div>

      <!-- Trilhas mais acessadas (Progress Bars) -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="font-bold text-pmvc-dark mb-0.5 flex items-center gap-2">
                <q-icon name="route" class="text-slate-400" />
                Trilhas de Aprendizagem
              </h3>
              <p class="text-xs text-slate-500">Taxa de adesão dos servidores por trilha formativa</p>
            </div>
            <span class="text-[11px] font-bold px-2 py-0.5 bg-blue-50 text-pmvc-blue rounded-md">
              {{ trilhasStats.length }} trilhas
            </span>
          </div>

          <div v-if="trilhasStats.length" class="space-y-5">
            <div v-for="trilha in trilhasStats" :key="trilha.id">
              <div class="flex justify-between text-sm font-bold text-pmvc-dark mb-1">
                <span class="truncate max-w-[240px]">{{ trilha.tituloTrilha }}</span>
                <span class="text-[#0F4C81]">{{ trilha.taxaAdesaoPercent }}% de adesão</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden flex">
                <div
                  class="bg-[#0F4C81] h-2.5 rounded-full transition-all duration-500"
                  :style="{ width: Math.max(trilha.taxaAdesaoPercent, 4) + '%' }"
                ></div>
              </div>
              <div class="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
                <span>{{ trilha.totalCursos }} {{ trilha.totalCursos === 1 ? 'curso vinculado' : 'cursos vinculados' }}</span>
                <span>{{ trilha.totalInscritos }} {{ trilha.totalInscritos === 1 ? 'servidor inscrito' : 'servidores inscritos' }}</span>
              </div>
            </div>
          </div>
          <div v-else class="py-8 text-center text-xs text-slate-400">
            Nenhuma trilha cadastrada no momento.
          </div>
        </div>

        <!-- Alert Dinâmico de Pendências -->
        <div class="mt-6 bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
          <q-icon name="warning_amber" class="text-amber-500 text-lg mt-0.5 shrink-0" />
          <div>
            <span class="block text-sm font-bold text-amber-900">Atenção ao Engajamento</span>
            <span class="text-xs text-amber-800">
              {{ servidoresSemInscricao }} {{ servidoresSemInscricao === 1 ? 'servidor' : 'servidores' }} da {{ secretariaSelecionada ? secretariaSelecionada.sigla : 'Prefeitura' }} ainda não iniciaram nenhuma capacitação no AVA.
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Ranking de Servidores por Secretaria (Leaderboard Real) -->
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="font-bold text-pmvc-dark text-lg">Ranking — Servidores com maior engajamento</h3>
          <p class="text-xs text-slate-500">
            Filtrado por: <span class="font-bold text-slate-700">{{ secretariaSelecionada ? secretariaSelecionada.nome : 'Todas as Secretarias' }}</span>
          </p>
        </div>
        <q-chip outline color="primary" dense class="font-bold text-xs">
          Top Servidores
        </q-chip>
      </div>

      <div v-if="rankingFiltrado.length" class="space-y-4">
        <div
          v-for="(servidor, index) in rankingFiltrado"
          :key="servidor.id"
          class="flex items-center justify-between border-b border-slate-100 pb-4 last:border-none hover:bg-slate-50/50 p-2 rounded-xl transition-colors"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shadow-sm"
              :class="{
                'bg-amber-400 text-white': index === 0,
                'bg-slate-300 text-slate-700': index === 1,
                'bg-amber-100 text-amber-800': index === 2,
                'bg-slate-100 text-slate-600': index > 2,
              }"
            >
              {{ index + 1 }}º
            </div>
            <div>
              <span class="block text-sm font-bold text-pmvc-dark leading-tight">{{ servidor.nome }}</span>
              <span class="text-xs text-slate-500 font-medium">
                {{ servidor.secretariaSigla }} • {{ servidor.cargo }} • Nível {{ servidor.level || 1 }}
              </span>
            </div>
          </div>
          <div class="bg-blue-50 text-pmvc-blue text-xs font-black px-3.5 py-1.5 rounded-xl border border-blue-100 flex items-center gap-1.5 shadow-sm">
            <q-icon name="military_tech" size="16px" class="text-amber-500" />
            {{ servidor.pontos }} XP
          </div>
        </div>
      </div>
      <div v-else class="text-xs text-slate-400 py-8 text-center font-medium">
        Nenhum servidor com pontuação encontrado para o filtro selecionado.
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

// Ranking real dos Servidores
const rankingFiltrado = computed(() => {
  return analyticsStore.dashboard?.rankingServidores || []
})

// KPIs Dinâmicos Baseados no Backend
const kpiServidores = computed(() => {
  return analyticsStore.dashboard?.totalServidores ?? 0
})

const kpiAtivos = computed(() => {
  return analyticsStore.dashboard?.servidoresAtivos ?? 0
})

const kpiTaxaEngajamento = computed(() => {
  return analyticsStore.dashboard?.taxaEngajamento ?? 0
})

const kpiCursosConcluidos = computed(() => {
  return analyticsStore.dashboard?.totalCertificados ?? 0
})

const kpiTaxaConclusao = computed(() => {
  return analyticsStore.dashboard?.avgProgressPercent ?? 0
})

// Cursos e Trilhas
const cursosStats = computed(() => {
  return analyticsStore.dashboard?.cursosStats || []
})

const trilhasStats = computed(() => {
  return analyticsStore.dashboard?.trilhasStats || []
})

const servidoresSemInscricao = computed(() => {
  return analyticsStore.dashboard?.servidoresSemInscricao ?? 0
})

// Configurações Dinâmicas dos Gráficos ApexCharts
const barSeries = computed(() => {
  const data = cursosStats.value.map((c) => c.taxaConclusaoPercent)
  return [
    {
      name: 'Taxa de Conclusão (%)',
      data: data.length ? data : [0],
    },
  ]
})

const barOptions = computed(() => {
  const categories = cursosStats.value.map((c) => {
    return c.titulo.length > 20 ? c.titulo.substring(0, 18) + '...' : c.titulo
  })
  return {
    chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'inherit' },
    colors: ['#0F4C81'],
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '50%',
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val}%`,
      style: { fontSize: '10px', colors: ['#ffffff'], fontWeight: 'bold' },
    },
    xaxis: {
      categories: categories.length ? categories : ['Sem cursos'],
      axisBorder: { show: true, color: '#e2e8f0' },
      labels: { style: { colors: '#64748b', fontSize: '11px', fontWeight: 600 } },
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 4,
      labels: {
        formatter: (val) => `${Math.round(val)}%`,
        style: { colors: '#64748b', fontSize: '11px' },
      },
    },
    grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
    tooltip: {
      y: { formatter: (val) => `${val}% dos inscritos concluíram` },
    },
  }
})

const lineSeries = computed(() => {
  const data = (analyticsStore.dashboard?.engajamentoMeses || []).map((m) => m.acessos)
  return [
    {
      name: 'Atividades e Matrículas',
      data: data.length ? data : [0],
    },
  ]
})

const lineOptions = computed(() => {
  const categories = (analyticsStore.dashboard?.engajamentoMeses || []).map((m) => m.mes)
  return {
    chart: { type: 'line', toolbar: { show: false }, fontFamily: 'inherit' },
    colors: ['#f59e0b'],
    stroke: { curve: 'smooth', width: 3 },
    markers: { size: 5, colors: ['#f59e0b'], strokeColors: '#fff', strokeWidth: 2 },
    xaxis: {
      categories: categories.length ? categories : ['Jan'],
      labels: { style: { colors: '#64748b', fontSize: '11px', fontWeight: 600 } },
    },
    yaxis: {
      min: 0,
      tickAmount: 4,
      labels: { style: { colors: '#64748b', fontSize: '11px' } },
    },
    grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
    tooltip: {
      y: { formatter: (val) => `${val} ações registradas` },
    },
  }
})

const donutSeries = computed(() => {
  const status = analyticsStore.dashboard?.statusMatriculas
  if (!status || (status.concluidos === 0 && status.emAndamento === 0 && status.naoIniciados === 0)) {
    return [0, 0, 1]
  }
  return [status.concluidos, status.emAndamento, status.naoIniciados]
})

const donutOptions = computed(() => ({
  chart: { type: 'donut', fontFamily: 'inherit' },
  labels: ['Concluídos', 'Em andamento', 'Não iniciados'],
  colors: ['#10b981', '#f59e0b', '#94a3b8'],
  plotOptions: { pie: { donut: { size: '60%' } } },
  dataLabels: { enabled: false },
  stroke: { width: 3, colors: ['#ffffff'] },
  legend: { position: 'bottom', horizontalAlign: 'center', fontSize: '12px', labels: { colors: '#475569' } },
  tooltip: {
    y: { formatter: (val) => `${val} matrículas` },
  },
}))

// Filtragem no autocomplete
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

async function recarregarDashboard() {
  const targetId = secretariaSelecionada.value ? secretariaSelecionada.value.id : null
  await analyticsStore.fetchDashboard(targetId)
}

onMounted(async () => {
  await secretariaStore.fetchSecretarias()

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

  // Se o usuário for gestor e tiver secretaria vinculada, pré-seleciona a secretaria dele
  if (authStore.isGestor && !authStore.isAdmin && authStore.user?.secretariaId) {
    const secEncontrada = lista.find((s) => s.id === authStore.user.secretariaId)
    if (secEncontrada) {
      secretariaFiltro.value = secEncontrada
      await analyticsStore.fetchDashboard(secEncontrada.id)
      return
    }
  }

  await analyticsStore.fetchDashboard(null)
})
</script>

<style scoped>
/* Scoped styles */
</style>
