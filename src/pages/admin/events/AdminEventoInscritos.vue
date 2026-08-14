<template>
  <q-page class="p-4 sm:p-8 max-w-6xl mx-auto space-y-6 font-sans">
    <!-- Barra Superior: Navegação e Ações -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <q-btn
        label="Voltar para Gestão de Eventos"
        icon="arrow_back"
        color="primary"
        class="!py-2.5 !px-5 bg-pmvc-blue text-white font-bold rounded-xl shadow-sm self-start"
        unelevated
        no-caps
        :to="{ name: 'admin-eventos' }"
      />

      <div class="flex items-center gap-2">
        <q-btn
          color="secondary"
          icon="qr_code_2"
          label="Gerar QR Code de Presença"
          class="!py-2.5 !px-5 font-bold rounded-xl shadow-sm text-white"
          unelevated
          no-caps
          @click="openQrModal"
        />
        <q-btn
          flat
          round
          dense
          color="primary"
          icon="refresh"
          class="bg-white border border-slate-200"
          :loading="loading"
          @click="recarregarDados"
        >
          <q-tooltip>Atualizar Lista de Presenças</q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- Título e Subtítulo -->
    <div class="space-y-1">
      <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
        Controle de Presença{{ event?.titulo ? ` - ${event.titulo}` : '' }}
      </h1>
      <p class="text-xs text-slate-500">
        Monitore a frequência dos servidores inscritos em tempo real através do QR Code de check-in.
      </p>
    </div>

    <!-- Cards de Métricas / Estatísticas de Presença -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-1">
        <div class="text-xs font-bold text-slate-400 uppercase tracking-wider">Total de Inscritos</div>
        <div class="text-2xl font-black text-slate-800">{{ enrollments.length }}</div>
        <div class="text-[11px] text-slate-500">Servidores matriculados no evento</div>
      </div>

      <div class="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm space-y-1 bg-gradient-to-br from-white to-emerald-50/30">
        <div class="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center justify-between">
          <span>Presenças Confirmadas</span>
          <q-icon name="check_circle" color="positive" size="18px" />
        </div>
        <div class="text-2xl font-black text-emerald-700">{{ totalPresentes }}</div>
        <div class="text-[11px] text-emerald-600 font-medium">{{ taxaPresenca }}% de comparecimento</div>
      </div>

      <div class="bg-white rounded-2xl border border-amber-100 p-5 shadow-sm space-y-1 bg-gradient-to-br from-white to-amber-50/30">
        <div class="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center justify-between">
          <span>Presenças Pendentes</span>
          <q-icon name="hourglass_top" color="warning" size="18px" />
        </div>
        <div class="text-2xl font-black text-amber-700">{{ totalPendentes }}</div>
        <div class="text-[11px] text-amber-600 font-medium">Aguardando leitura do QR Code</div>
      </div>
    </div>

    <!-- Barra de Filtros e Busca -->
    <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <!-- Input de Busca -->
      <div class="relative flex-1 max-w-md">
        <q-icon name="search" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size="20px" />
        <input
          v-model="filtroBusca"
          type="text"
          placeholder="Buscar por nome, matrícula ou e-mail..."
          class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      <!-- Filtro por Status de Presença -->
      <div class="flex items-center gap-2">
        <q-btn-toggle
          v-model="filtroStatus"
          toggle-color="primary"
          flat
          dense
          rounded
          class="bg-slate-100 p-1 text-xs"
          :options="[
            { label: 'Todos', value: 'todos' },
            { label: 'Confirmados', value: 'confirmados' },
            { label: 'Pendentes', value: 'pendentes' },
          ]"
        />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-16">
      <q-spinner-dots color="primary" size="50px" />
    </div>

    <!-- Lista de Inscritos -->
    <div
      v-else-if="inscritosFiltrados.length > 0"
      class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
    >
      <q-list separator>
        <q-item
          v-for="enrollment in inscritosFiltrados"
          :key="enrollment.id"
          class="py-4 px-5 hover:bg-slate-50 transition-colors"
        >
          <q-item-section avatar>
            <q-avatar
              :color="enrollment.presencaValidada ? 'emerald-1' : 'blue-1'"
              :text-color="enrollment.presencaValidada ? 'emerald-8' : 'primary'"
              class="font-bold border"
              :class="enrollment.presencaValidada ? 'border-emerald-200' : 'border-blue-200'"
            >
              {{ initials(userName(enrollment.user)) }}
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <div class="flex items-center gap-2 flex-wrap">
              <q-item-label class="font-extrabold text-slate-900 text-sm">
                {{ userName(enrollment.user) }}
              </q-item-label>
              <span v-if="enrollment.user?.matricula" class="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-600">
                Matrícula: {{ enrollment.user.matricula }}
              </span>
              <span v-if="enrollment.user?.secretaria" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-[#0F4C81]">
                {{ enrollment.user.secretaria.sigla || enrollment.user.secretaria.nome }}
              </span>
            </div>

            <q-item-label caption class="text-slate-400 text-xs mt-1">
              {{ enrollment.user?.email || 'E-mail não informado' }}
              <span v-if="enrollment.user?.cargo"> · {{ enrollment.user.cargo }}</span>
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <div v-if="enrollment.presencaValidada" class="text-right space-y-1">
              <span class="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-1">
                <q-icon name="check_circle" size="14px" class="text-emerald-600" />
                Presença Confirmada
              </span>
              <div v-if="enrollment.presencaValidadaEm" class="text-[10px] text-slate-400 font-medium">
                {{ formatarDataHora(enrollment.presencaValidadaEm) }}
              </div>
            </div>

            <div v-else class="text-right">
              <span class="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold flex items-center gap-1">
                <q-icon name="schedule" size="14px" class="text-amber-500" />
                Pendente
              </span>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- Empty state -->
    <div
      v-else
      class="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3"
    >
      <q-icon name="group_off" size="56px" class="text-slate-300" />
      <h3 class="font-bold text-slate-700 text-lg">
        {{ enrollments.length === 0 ? 'Ainda não há inscritos neste evento' : 'Nenhum participante localizado com os filtros selecionados' }}
      </h3>
      <p class="text-xs text-slate-500">
        {{ enrollments.length === 0 ? 'Compartilhe o link do evento no catálogo para que os servidores se inscrevam.' : 'Tente alterar os termos da busca.' }}
      </p>
    </div>

    <!-- =================================================================== -->
    <!-- MODAL DE QR CODE DE PRESENÇA -->
    <!-- =================================================================== -->
    <q-dialog v-model="showQrModal" max-width="500px">
      <q-card style="width: 500px; max-width: 95vw" class="rounded-3xl shadow-xl overflow-hidden font-sans">
        <q-card-section class="bg-[#0F4C81] text-white p-6 text-center relative">
          <div class="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-2">
            <q-icon name="qr_code_scanner" size="28px" class="text-amber-400" />
          </div>
          <h2 class="text-lg font-black leading-tight">QR Code de Presença</h2>
          <p class="text-xs text-blue-100 mt-1 line-clamp-2">
            {{ event?.titulo }}
          </p>
          <q-btn icon="close" flat round dense class="absolute top-4 right-4 text-white/80 hover:text-white" v-close-popup />
        </q-card-section>

        <q-card-section class="p-6 sm:p-8 text-center space-y-6">
          <p class="text-xs text-slate-500">
            Projete este QR Code na tela ou imprima para que os servidores confirmem sua presença diretamente pelo celular.
          </p>

          <!-- Imagem do QR Code Gerada -->
          <div class="inline-block p-4 bg-white rounded-3xl border-2 border-slate-100 shadow-md">
            <img v-if="qrCodeDataUrl" :src="qrCodeDataUrl" alt="QR Code" class="w-64 h-64 mx-auto rounded-xl" />
            <div v-else class="w-64 h-64 flex items-center justify-center">
              <q-spinner color="primary" size="40px" />
            </div>
          </div>

          <!-- Link Público e Botões -->
          <div class="space-y-3">
            <div class="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 break-all select-all font-mono">
              {{ publicCheckinUrl }}
            </div>

            <div class="grid grid-cols-2 gap-2">
              <q-btn
                unelevated
                color="primary"
                icon="content_copy"
                label="Copiar Link"
                class="py-2.5 font-bold rounded-xl bg-[#0F4C81] text-xs"
                no-caps
                @click="copiarLink"
              />
              <q-btn
                outline
                color="primary"
                icon="open_in_new"
                label="Abrir Check-in"
                class="py-2.5 font-bold rounded-xl text-xs"
                no-caps
                :href="publicCheckinUrl"
                target="_blank"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useEventStore } from 'src/stores/eventStore'
import QRCode from 'qrcode'

const route = useRoute()
const $q = useQuasar()
const eventStore = useEventStore()

const event = ref(null)
const enrollments = ref([])
const loading = ref(true)
const filtroBusca = ref('')
const filtroStatus = ref('todos')

const showQrModal = ref(false)
const qrCodeDataUrl = ref('')

const publicCheckinUrl = computed(() => {
  const origin = window.location.origin
  return `${origin}/#/checkin/evento/${route.params.id}`
})

const totalPresentes = computed(() => {
  return enrollments.value.filter((e) => e.presencaValidada).length
})

const totalPendentes = computed(() => {
  return enrollments.value.filter((e) => !e.presencaValidada).length
})

const taxaPresenca = computed(() => {
  if (enrollments.value.length === 0) return 0
  return Math.round((totalPresentes.value / enrollments.value.length) * 100)
})

const inscritosFiltrados = computed(() => {
  let list = enrollments.value || []

  // Filtro por texto
  if (filtroBusca.value.trim()) {
    const q = filtroBusca.value.toLowerCase()
    list = list.filter((e) => {
      const nome = userName(e.user).toLowerCase()
      const mat = (e.user?.matricula || '').toLowerCase()
      const email = (e.user?.email || '').toLowerCase()
      return nome.includes(q) || mat.includes(q) || email.includes(q)
    })
  }

  // Filtro por status
  if (filtroStatus.value === 'confirmados') {
    list = list.filter((e) => e.presencaValidada)
  } else if (filtroStatus.value === 'pendentes') {
    list = list.filter((e) => !e.presencaValidada)
  }

  return list
})

function userName(user) {
  return (
    user?.nome ||
    user?.name ||
    user?.nomeCompleto ||
    'Usuário sem nome'
  )
}

function initials(name) {
  if (!name) return '?'
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

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

async function openQrModal() {
  showQrModal.value = true
  try {
    qrCodeDataUrl.value = await QRCode.toDataURL(publicCheckinUrl.value, {
      width: 320,
      margin: 2,
      color: {
        dark: '#0F4C81',
        light: '#FFFFFF',
      },
    })
  } catch (err) {
    console.error('Erro ao gerar QR Code:', err)
  }
}

function copiarLink() {
  navigator.clipboard.writeText(publicCheckinUrl.value)
  $q.notify({
    type: 'positive',
    icon: 'check',
    message: 'Link de check-in copiado para a área de transferência!',
    position: 'top',
  })
}

async function recarregarDados() {
  const eventId = route.params.id
  loading.value = true
  try {
    const [eventData, enrollmentsData] = await Promise.all([
      eventStore.fetchEvent(eventId),
      eventStore.fetchEventEnrollments(eventId),
    ])
    event.value = eventData
    enrollments.value = enrollmentsData
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Não foi possível carregar os inscritos.',
      position: 'top',
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  recarregarDados()
})
</script>