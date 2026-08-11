<template>
  <q-page class="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 font-sans">
    <!-- Cabeçalho -->
    <div class="mb-2">
      <h1 class="text-2xl sm:text-3xl font-extrabold text-pmvc-dark tracking-tight mb-1">Painel da Secretaria</h1>
      <p class="text-sm sm:text-base text-slate-500">Visão executiva da capacitação dos servidores — Secretaria de Administração.</p>
    </div>

    <!-- KPIs -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- KPI 1 -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-blue-50 text-pmvc-blue flex items-center justify-center shrink-0">
          <q-icon name="group" size="24px" />
        </div>
        <div>
          <span class="block text-xs font-medium text-slate-500">Servidores cadastrados</span>
          <div class="flex items-end gap-2">
            <span class="text-2xl font-bold text-pmvc-dark leading-none">1.482</span>
          </div>
          <span class="text-[10px] text-slate-400 mt-1 block">+24 no mês</span>
        </div>
      </div>

      <!-- KPI 2 -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <q-icon name="person_check" size="24px" />
        </div>
        <div>
          <span class="block text-xs font-medium text-slate-500">Servidores ativos</span>
          <div class="flex items-end gap-2">
            <span class="text-2xl font-bold text-pmvc-dark leading-none">1.196</span>
          </div>
          <span class="text-[10px] text-slate-400 mt-1 block">80,7% engajamento</span>
        </div>
      </div>

      <!-- KPI 3 -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
          <q-icon name="emoji_events" size="24px" />
        </div>
        <div>
          <span class="block text-xs font-medium text-slate-500">Cursos concluídos</span>
          <div class="flex items-end gap-2">
            <span class="text-2xl font-bold text-pmvc-dark leading-none">3.842</span>
          </div>
          <span class="text-[10px] text-slate-400 mt-1 block">no semestre</span>
        </div>
      </div>

      <!-- KPI 4 -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0">
          <q-icon name="trending_up" size="24px" />
        </div>
        <div>
          <span class="block text-xs font-medium text-slate-500">Taxa de conclusão</span>
          <div class="flex items-end gap-2">
            <span class="text-2xl font-bold text-pmvc-dark leading-none">68%</span>
          </div>
          <span class="text-[10px] text-slate-400 mt-1 block">+5p.p. vs trimestre</span>
        </div>
      </div>
    </div>

    <!-- Gráficos Row 1 -->
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

    <!-- Gráficos Row 2 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Status dos cursos (Donut Chart) -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
        <h3 class="font-bold text-pmvc-dark mb-1">Status dos cursos</h3>
        <p class="text-xs text-slate-500 mb-6">Distribuição geral</p>
        <div class="flex-grow flex items-center justify-center relative">
          <div class="w-full max-w-[300px]">
             <apexchart type="donut" width="100%" :options="donutOptions" :series="donutSeries"></apexchart>
          </div>
          <!-- Mockup absolute label inside chart area -->
           <div class="absolute bottom-6 right-8 bg-white px-4 py-2 rounded-xl shadow-md border border-slate-100 text-sm font-medium text-slate-700 z-10 hidden sm:block">
             Não iniciados : 180
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
          <p class="text-xs text-slate-500 mb-6">% de servidores inscritos</p>

          <div class="space-y-5">
            <!-- Trilha 1 -->
            <div>
              <div class="flex justify-between text-sm font-bold text-pmvc-dark mb-1">
                <span>Integração ao Serviço Público</span>
                <span>78%</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden flex">
                 <div class="bg-[#1b4b7f] h-2.5" style="width: 78%"></div>
                 <div class="bg-[#38b2ac] h-2.5 flex-1"></div>
              </div>
            </div>

            <!-- Trilha 2 -->
            <div>
              <div class="flex justify-between text-sm font-bold text-pmvc-dark mb-1">
                <span>Gestão e Liderança</span>
                <span>56%</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden flex">
                 <div class="bg-[#1b4b7f] h-2.5" style="width: 56%"></div>
                 <div class="bg-emerald-500 h-2.5 flex-1 opacity-80"></div>
              </div>
            </div>

            <!-- Trilha 3 -->
            <div>
              <div class="flex justify-between text-sm font-bold text-pmvc-dark mb-1">
                <span>Governança e Controle</span>
                <span>42%</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden flex">
                 <div class="bg-[#1b4b7f] h-2.5" style="width: 42%"></div>
                 <div class="bg-emerald-500 h-2.5 flex-1 opacity-80"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Alert -->
        <div class="mt-6 bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
           <q-icon name="warning_amber" class="text-amber-500 text-lg mt-0.5 shrink-0" />
           <div>
             <span class="block text-sm font-bold text-amber-900">Pendências de capacitação</span>
             <span class="text-xs text-amber-800">142 servidores ainda não iniciaram a Trilha de Integração obrigatória.</span>
           </div>
        </div>
      </div>
    </div>

    <!-- Ranking -->
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h3 class="font-bold text-pmvc-dark mb-6">Ranking — Servidores com maior engajamento</h3>

      <div class="space-y-4">
        <!-- Posicao 1 -->
        <div class="flex items-center justify-between border-b border-slate-100 pb-4">
          <div class="flex items-center gap-4">
             <div class="w-8 h-8 rounded-full bg-amber-400 text-white flex items-center justify-center font-bold text-sm shadow-sm">1º</div>
             <div>
               <span class="block text-sm font-bold text-pmvc-dark leading-tight">Maria Oliveira</span>
               <span class="text-xs text-slate-500">Sec. Administração</span>
             </div>
          </div>
          <div class="bg-blue-50 text-pmvc-blue text-xs font-bold px-3 py-1 rounded-full border border-blue-100">
             1.240 pts
          </div>
        </div>

        <!-- Posicao 2 -->
        <div class="flex items-center justify-between border-b border-slate-100 pb-4">
          <div class="flex items-center gap-4">
             <div class="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm">2º</div>
             <div>
               <span class="block text-sm font-bold text-pmvc-dark leading-tight">Carlos Souza</span>
               <span class="text-xs text-slate-500">Sec. Finanças</span>
             </div>
          </div>
          <div class="bg-blue-50 text-pmvc-blue text-xs font-bold px-3 py-1 rounded-full border border-blue-100">
             1.120 pts
          </div>
        </div>

        <!-- Posicao 3 -->
        <div class="flex items-center justify-between border-b border-slate-100 pb-4">
          <div class="flex items-center gap-4">
             <div class="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm">3º</div>
             <div>
               <span class="block text-sm font-bold text-pmvc-dark leading-tight">Ana Paula Lima</span>
               <span class="text-xs text-slate-500">Sec. Saúde</span>
             </div>
          </div>
          <div class="bg-blue-50 text-pmvc-blue text-xs font-bold px-3 py-1 rounded-full border border-blue-100">
             980 pts
          </div>
        </div>

        <!-- Posicao 4 -->
        <div class="flex items-center justify-between border-b border-slate-100 pb-4">
          <div class="flex items-center gap-4">
             <div class="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center font-bold text-sm">4º</div>
             <div>
               <span class="block text-sm font-bold text-pmvc-dark leading-tight">João Mendes</span>
               <span class="text-xs text-slate-500">Sec. Educação</span>
             </div>
          </div>
          <div class="bg-blue-50 text-pmvc-blue text-xs font-bold px-3 py-1 rounded-full border border-blue-100">
             920 pts
          </div>
        </div>

        <!-- Posicao 5 -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
             <div class="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center font-bold text-sm">5º</div>
             <div>
               <span class="block text-sm font-bold text-pmvc-dark leading-tight">Roberto Alves</span>
               <span class="text-xs text-slate-500">Sec. Infraestrutura</span>
             </div>
          </div>
          <div class="bg-blue-50 text-pmvc-blue text-xs font-bold px-3 py-1 rounded-full border border-blue-100">
             890 pts
          </div>
        </div>
      </div>
    </div>

  </q-page>
</template>

<script setup>
import { ref } from 'vue';

// ApexCharts Options - Mocked data based on mockups

// 1. Bar Chart (Conclusão por curso)
const barSeries = ref([{
  name: 'Concluídos',
  data: [79, 65, 52, 41, 74, 38]
}]);

const barOptions = ref({
  chart: {
    type: 'bar',
    toolbar: { show: false },
    fontFamily: 'inherit'
  },
  colors: ['#1b4b7f'],
  plotOptions: {
    bar: {
      borderRadius: 4,
      columnWidth: '65%',
    }
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: ['Ética', 'Atendimento', 'LGPD', 'Liderança', 'Comunicação', 'Inovação'],
    axisBorder: { show: true, color: '#e2e8f0' },
    axisTicks: { show: true },
    labels: { style: { colors: '#64748b', fontSize: '11px' } }
  },
  yaxis: {
    max: 80,
    tickAmount: 4,
    labels: { style: { colors: '#64748b', fontSize: '11px' } }
  },
  grid: {
    borderColor: '#f1f5f9',
    strokeDashArray: 4,
    yaxis: { lines: { show: true } }
  }
});

// 2. Line Chart (Engajamento mensal)
const lineSeries = ref([{
  name: 'Acessos únicos',
  data: [420, 580, 750, 920, 1200]
}]);

const lineOptions = ref({
  chart: {
    type: 'line',
    toolbar: { show: false },
    fontFamily: 'inherit',
    dropShadow: { enabled: true, color: '#f59e0b', top: 5, left: 0, blur: 5, opacity: 0.1 }
  },
  colors: ['#f59e0b'],
  stroke: {
    curve: 'smooth',
    width: 3
  },
  markers: {
    size: 6,
    colors: ['#f59e0b'],
    strokeColors: '#fff',
    strokeWidth: 2,
    hover: { size: 8 }
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
    axisBorder: { show: true, color: '#e2e8f0' },
    labels: { style: { colors: '#64748b', fontSize: '11px' } },
    tooltip: { enabled: false }
  },
  yaxis: {
    min: 0,
    max: 1200,
    tickAmount: 4,
    labels: { style: { colors: '#64748b', fontSize: '11px' } }
  },
  grid: {
    borderColor: '#f1f5f9',
    strokeDashArray: 4
  }
});

// 3. Donut Chart (Status dos cursos)
const donutSeries = ref([1240, 480, 180]);

const donutOptions = ref({
  chart: {
    type: 'donut',
    fontFamily: 'inherit'
  },
  labels: ['Concluídos', 'Em andamento', 'Não iniciados'],
  colors: ['#22c55e', '#eab308', '#64748b'],
  plotOptions: {
    pie: {
      donut: {
        size: '55%',
      },
      expandOnClick: false
    }
  },
  dataLabels: { enabled: false },
  stroke: { width: 3, colors: ['#ffffff'] },
  legend: {
    position: 'bottom',
    horizontalAlign: 'center',
    markers: { radius: 2, offsetX: -2 },
    itemMargin: { horizontal: 8, vertical: 0 },
    fontSize: '11px',
    labels: { colors: '#64748b' }
  },
  tooltip: {
    y: { formatter: function (val) { return val + " cursos" } }
  }
});
</script>

<style scoped>
/* Scoped styles se necessário */
</style>
