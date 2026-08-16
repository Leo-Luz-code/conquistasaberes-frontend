<template>
  <div class="min-h-screen bg-slate-50 flex flex-col justify-between font-sans text-slate-800">
    <!-- Barra Superior / Topo Institucional -->
    <header class="bg-[#0F4C81] text-white py-3 sm:py-4 px-4 sm:px-6 shadow-sm border-b border-[#0C3B66]">
      <div class="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-2">
        <div class="flex items-center gap-2.5 sm:gap-3">
          <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <q-icon name="qr_code_scanner" size="22px" class="text-amber-400 sm:text-[24px]" />
          </div>
          <div>
            <div class="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-blue-200">
              Prefeitura de Vitória da Conquista
            </div>
            <div class="text-sm sm:text-lg font-extrabold tracking-tight">
              AVA UniVC · Check-in
            </div>
          </div>
        </div>

        <router-link
          to="/login"
          class="text-xs text-blue-100 hover:text-white underline font-semibold transition-colors"
        >
          Acessar AVA
        </router-link>
      </div>
    </header>

    <!-- Conteúdo Principal -->
    <main class="flex-1 max-w-xl w-full mx-auto p-3 sm:p-6 flex flex-col justify-center my-4 sm:my-6 space-y-4 sm:space-y-6">
      <!-- Loading State -->
      <div v-if="loadingEvent" class="text-center py-12 space-y-4">
        <q-spinner-dots color="primary" size="48px" />
        <p class="text-xs sm:text-sm text-slate-500 font-medium">Carregando informações do evento...</p>
      </div>

      <!-- Erro ao Carregar Evento -->
      <div
        v-else-if="!event"
        class="bg-white rounded-2xl sm:rounded-3xl border border-dashed border-red-200 p-6 sm:p-8 text-center space-y-3 shadow-sm"
      >
        <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto">
          <q-icon name="event_busy" size="28px" class="sm:text-[32px]" />
        </div>
        <h2 class="text-base sm:text-lg font-bold text-slate-800">Evento não encontrado</h2>
        <p class="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          O link de check-in pode estar incorreto ou o evento foi encerrado pela organização.
        </p>
      </div>

      <!-- Card do Evento + Formulário -->
      <template v-else>
        <!-- Card Informativo do Evento -->
        <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-7 shadow-sm space-y-3 sm:space-y-4">
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <span class="px-2.5 sm:px-3 py-0.5 sm:py-1 bg-blue-50 text-[#0F4C81] border border-blue-100 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider">
              {{ event.categoria || 'Palestra / Evento' }}
            </span>
            <span class="text-[11px] sm:text-xs font-semibold text-slate-500 flex items-center gap-1">
              <q-icon name="pin_drop" size="14px" class="text-slate-400 shrink-0" />
              <span class="truncate max-w-[200px] sm:max-w-none">{{ event.local || 'Auditório / Presencial' }}</span>
            </span>
          </div>

          <div class="space-y-1">
            <h1 class="text-lg sm:text-2xl font-extrabold text-slate-900 leading-snug sm:leading-tight">
              {{ event.titulo }}
            </h1>
            <p v-if="event.secretaria" class="text-[11px] sm:text-xs font-semibold text-slate-500">
              Realização: {{ event.secretaria.nome }} ({{ event.secretaria.sigla }})
            </p>
          </div>

          <div class="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs">
            <div class="flex items-center gap-2 text-slate-600 bg-slate-50 p-2.5 rounded-xl">
              <q-icon name="event" size="18px" class="text-[#0F4C81] shrink-0" />
              <div>
                <div class="text-[10px] font-bold text-slate-400 uppercase">Início</div>
                <div class="font-bold text-slate-800 text-[11px] sm:text-xs">{{ formatarDataHora(event.dataInicio) }}</div>
              </div>
            </div>
            <div class="flex items-center gap-2 text-slate-600 bg-slate-50 p-2.5 rounded-xl">
              <q-icon name="schedule" size="18px" class="text-[#0F4C81] shrink-0" />
              <div>
                <div class="text-[10px] font-bold text-slate-400 uppercase">Término</div>
                <div class="font-bold text-slate-800 text-[11px] sm:text-xs">{{ formatarDataHora(event.dataFim) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tela de Sucesso -->
        <div
          v-if="checkinResult && checkinResult.success"
          class="bg-white rounded-2xl sm:rounded-3xl border border-emerald-200 p-5 sm:p-8 shadow-sm space-y-5 sm:space-y-6 text-center animate-fade-in"
        >
          <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
            <q-icon name="check" size="32px" class="sm:text-[36px]" />
          </div>

          <div class="space-y-1.5 sm:space-y-2">
            <h2 class="text-lg sm:text-xl font-extrabold text-emerald-900 leading-snug">
              {{ checkinResult.alreadyConfirmed ? 'Presença já Registrada!' : 'Presença Confirmada!' }}
            </h2>
            <p class="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              {{ checkinResult.message }}
            </p>
          </div>

          <!-- Detalhes do Servidor Confirmado -->
          <div class="bg-emerald-50/60 rounded-2xl p-3.5 sm:p-4 border border-emerald-100 text-left space-y-2 text-xs">
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-emerald-100 gap-0.5 sm:gap-2">
              <span class="text-slate-500 font-medium">Servidor(a):</span>
              <span class="font-extrabold text-slate-900 text-right sm:text-left">{{ checkinResult.servidorNome }}</span>
            </div>
            <div class="flex justify-between items-center py-1 border-b border-emerald-100">
              <span class="text-slate-500 font-medium">Matrícula:</span>
              <span class="font-bold text-slate-800">{{ checkinResult.matricula }}</span>
            </div>
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 gap-0.5 sm:gap-2">
              <span class="text-slate-500 font-medium">Data/Hora do Registro:</span>
              <span class="font-bold text-emerald-800 sm:text-right">{{ formatarTimestamp(checkinResult.timestamp) }}</span>
            </div>
          </div>

          <div class="pt-2 flex flex-col gap-2.5">
            <q-btn
              outline
              color="primary"
              label="Confirmar presença de outro servidor"
              class="w-full py-2.5 text-xs font-bold rounded-xl"
              no-caps
              @click="resetForm"
            />
            <router-link
              to="/servidor/dashboard"
              class="block w-full py-3 text-center text-xs font-bold rounded-xl bg-[#0F4C81] text-white hover:bg-[#0C3B66] transition-colors shadow-sm"
            >
              Ir para meu Painel de Cursos & Eventos
            </router-link>
          </div>
        </div>

        <!-- Formulário de Check-in -->
        <div v-else class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-sm space-y-4 sm:space-y-5">
          <div class="space-y-1">
            <h2 class="text-base sm:text-lg font-extrabold text-slate-900">
              Registrar Minha Presença
            </h2>
            <p class="text-xs text-slate-500 leading-relaxed">
              Digite abaixo sua <strong>matrícula funcional</strong> ou <strong>CPF</strong> para validar sua participação presencial.
            </p>
          </div>

          <!-- Mensagem de Erro -->
          <div
            v-if="errorMessage"
            class="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs text-red-700 leading-snug"
          >
            <q-icon name="error_outline" size="18px" class="text-red-500 shrink-0 mt-0.5" />
            <div class="flex-1">{{ errorMessage }}</div>
          </div>

          <form @submit.prevent="submeterCheckin" class="space-y-4">
            <div>
              <label class="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Matrícula ou CPF *
              </label>
              <div class="relative">
                <q-icon
                  name="badge"
                  size="20px"
                  class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  v-model="matricula"
                  type="text"
                  required
                  autofocus
                  placeholder="Ex: 123456 ou 000.000.000-00"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent transition-all"
                  :disabled="submitting"
                />
              </div>
            </div>

            <q-btn
              type="submit"
              unelevated
              color="primary"
              icon="how_to_reg"
              label="Confirmar Presença"
              class="w-full py-3 text-sm font-extrabold rounded-xl bg-[#0F4C81] hover:bg-[#0C3B66] text-white shadow-md"
              :loading="submitting"
              :disable="!matricula.trim()"
            />
          </form>

          <p class="text-[11px] text-center text-slate-400">
            A presença será validada automaticamente na lista oficial do evento.
          </p>
        </div>
      </template>
    </main>

    <!-- Rodapé -->
    <footer class="py-3 sm:py-4 px-4 text-center text-[11px] sm:text-xs text-slate-400 border-t border-slate-200 bg-white">
      Prefeitura Municipal de Vitória da Conquista · Gestão de Pessoas & Inovação Digital
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useEventStore } from 'src/stores/eventStore'
import { useQuasar } from 'quasar'

const route = useRoute()
const $q = useQuasar()
const eventStore = useEventStore()

const event = ref(null)
const loadingEvent = ref(true)
const matricula = ref('')
const submitting = ref(false)
const errorMessage = ref('')
const checkinResult = ref(null)

function formatarDataHora(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatarTimestamp(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

function resetForm() {
  matricula.value = ''
  errorMessage.value = ''
  checkinResult.value = null
}

async function carregarEvento() {
  loadingEvent.value = true
  try {
    const data = await eventStore.fetchEvent(route.params.id)
    event.value = data
  } catch (error) {
    console.error('Erro ao carregar evento:', error)
    event.value = null
  } finally {
    loadingEvent.value = false
  }
}

async function submeterCheckin() {
  if (!matricula.value.trim()) return

  submitting.value = true
  errorMessage.value = ''

  try {
    const result = await eventStore.confirmEventCheckin(route.params.id, matricula.value.trim())
    checkinResult.value = result
    $q.notify({
      type: 'positive',
      icon: 'how_to_reg',
      message: result.message || 'Presença confirmada!',
      position: 'top',
    })
  } catch (error) {
    console.error('Erro no check-in:', error)
    const msg = error.response?.data?.message || 'Erro ao confirmar presença. Verifique sua matrícula.'
    errorMessage.value = msg
    $q.notify({
      type: 'negative',
      icon: 'warning',
      message: msg,
      position: 'top',
    })
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  carregarEvento()
})
</script>