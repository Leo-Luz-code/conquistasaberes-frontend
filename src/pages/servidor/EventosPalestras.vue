<template>
  <q-page class="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 font-sans relative pb-20">
    <!-- Cabeçalho da Página -->
    <div>
      <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-1">
        Eventos e Palestras
      </h1>
      <p class="text-xs sm:text-sm text-slate-500">
        Programação institucional de capacitação, palestras e encontros.
      </p>
    </div>

    <!-- Grid de Eventos (2 Colunas em telas médias e grandes) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div
        v-for="evento in eventos"
        :key="evento.id"
        class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row items-stretch"
      >
        <!-- Bloco de Data Esquerdo (Azul Escuro) -->
        <div class="bg-[#0F4C81] text-white w-full sm:w-32 flex flex-col items-center justify-center p-6 shrink-0 rounded-t-3xl sm:rounded-t-none sm:rounded-l-3xl">
          <q-icon name="calendar_today" size="24px" class="text-amber-400 mb-1" />
          <span class="text-[10px] font-extrabold tracking-wider text-blue-200 uppercase">PRÓXIMO</span>
          <span class="text-2xl sm:text-3xl font-extrabold leading-none my-1 text-center">
            {{ evento.dia }}
          </span>
          <span class="text-xs font-bold text-blue-100 lowercase">
            {{ evento.mes }}
          </span>
        </div>

        <!-- Conteúdo Direito do Evento -->
        <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
          <div class="space-y-3">
            <!-- Badge de Categoria/Tipo -->
            <div>
              <span class="px-3 py-1 bg-amber-100 text-amber-800 font-bold text-xs rounded-full inline-block">
                {{ evento.tipo }}
              </span>
            </div>

            <!-- Título do Evento -->
            <h3 class="font-extrabold text-slate-900 text-base sm:text-lg leading-snug">
              {{ evento.titulo }}
            </h3>

            <!-- Detalhes de Horário e Local -->
            <div class="space-y-1.5 text-xs text-slate-500 font-medium">
              <div class="flex items-center gap-2">
                <q-icon name="schedule" size="16px" class="text-slate-400" />
                <span>{{ evento.horario }}</span>
              </div>
              <div class="flex items-center gap-2">
                <q-icon name="place" size="16px" class="text-slate-400" />
                <span>{{ evento.local }}</span>
              </div>
            </div>
          </div>

          <!-- Botão de Inscrição -->
          <div>
            <button
              @click="toggleInscricao(evento)"
              class="px-6 py-2.5 text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
              :class="evento.inscrito
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-[#0F4C81] hover:bg-[#0C3B66] text-white'"
            >
              {{ evento.inscrito ? 'Inscrito ✓' : 'Inscrever-se' }}
            </button>
          </div>
        </div>
      </div>
    </div>


  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const eventos = ref([
  {
    id: '1',
    dia: '15',
    mes: 'mai',
    tipo: 'Palestra',
    titulo: 'Palestra: Inovação no Setor Público Municipal',
    horario: '14h às 17h',
    local: 'Auditório Prefeitura · Online',
    inscrito: false,
  },
  {
    id: '2',
    dia: '22',
    mes: 'mai',
    tipo: 'Workshop',
    titulo: 'Workshop de Liderança Pública',
    horario: '09h às 12h',
    local: 'UniVC Sede',
    inscrito: false,
  },
  {
    id: '3',
    dia: '03 a 07',
    mes: 'jun',
    tipo: 'Semana temática',
    titulo: 'Semana da Ética no Serviço Público',
    horario: 'Programação variada',
    local: 'Híbrido',
    inscrito: false,
  },
  {
    id: '4',
    dia: '20',
    mes: 'jun',
    tipo: 'Encontro',
    titulo: 'Encontro de Servidores 2026',
    horario: '08h às 18h',
    local: 'Centro de Convenções VC',
    inscrito: false,
  },
]);

function toggleInscricao(evento) {
  evento.inscrito = !evento.inscrito;
  if (evento.inscrito) {
    $q.notify({
      color: 'positive',
      icon: 'check_circle',
      message: `Inscrição confirmada para "${evento.titulo}"!`,
      position: 'top',
    });
  } else {
    $q.notify({
      color: 'info',
      icon: 'info',
      message: `Inscrição cancelada para "${evento.titulo}".`,
      position: 'top',
    });
  }
}
</script>
