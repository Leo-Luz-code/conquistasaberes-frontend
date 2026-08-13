<template>
  <q-page class="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 font-sans">
    <!-- Cabeçalho -->
    <div class="row items-center justify-between q-col-gutter-md q-mb-md">
      <div class="col-12 col-sm-auto">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Eventos e Palestras
          </h1>

          <p class="text-xs sm:text-sm text-slate-500">
            Programação institucional de capacitação, palestras e encontros.
          </p>
        </div>
      </div>

      <div class="col-12 col-sm-auto q-mt-sm">
        <q-tabs
          v-model="abaAtiva"
          dense
          no-caps
          inline-label
          indicator-color="primary"
          active-color="primary"
          class="text-grey-7 full-width-xs"
        >
          <q-tab
            name="todos"
            icon="event"
            :label="`Todos os eventos (${eventos.length})`"
          />

          <q-tab
            name="meus"
            icon="bookmark"
            :label="`Meus eventos (${totalInscritos})`"
          />
        </q-tabs>
      </div>
    </div>

    <!-- Busca + Filtros -->
    <q-card
      flat
      bordered
      class="q-pa-sm shadow-1 bg-white rounded-borders q-mb-md"
    >
      <div class="row q-col-gutter-sm">
        <div class="col-12 col-sm">
          <q-input
            v-model="busca"
            dense
            debounce="300"
            outlined
            clearable
            placeholder="Buscar por título ou local..."
          >
            <template #append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

        <div class="col-12 col-sm-3">
          <q-select
            v-model="tipoFiltro"
            dense
            outlined
            emit-value
            map-options
            clearable
            :options="opcoesTipo"
            placeholder="Todos os tipos"
          />
        </div>

        <div class="col-12 col-sm-3">
          <q-select
            v-model="periodoFiltro"
            dense
            outlined
            emit-value
            map-options
            :options="opcoesPeriodo"
          />
        </div>
      </div>
    </q-card>

    <!-- Chips -->
    <div
      v-if="filtrosAtivos.length"
      class="q-mb-md q-gutter-xs"
    >
      <q-chip
        v-for="chip in filtrosAtivos"
        :key="chip.key"
        removable
        dense
        color="blue-1"
        text-color="primary"
        class="text-weight-medium"
        @remove="chip.limpar"
      >
        {{ chip.label }}
      </q-chip>

      <q-btn
        flat
        dense
        no-caps
        size="sm"
        label="Limpar tudo"
        color="grey-7"
        @click="limparFiltros"
      />
    </div>

    <!-- Loading -->
    <div
      v-if="eventStore.loading"
      class="flex justify-center py-16"
    >
      <q-spinner-dots
        color="primary"
        size="50px"
      />
    </div>

    <!-- Grid -->
    <div
      v-else-if="eventosPaginados.length"
      class="row q-col-gutter-md"
    >
      <div
        v-for="evento in eventosPaginados"
        :key="evento.id"
        class="col-12 col-md-6"
      >
        <q-card
          flat
          bordered
          class="rounded-borders row no-wrap full-height"
        >
          <!-- Data -->
          <div
            class="col-auto bg-primary text-white column items-center justify-center q-pa-md text-center"
            style="width: 112px"
          >
            <q-icon
              name="calendar_today"
              color="amber-4"
              size="22px"
            />

            <div class="text-caption text-weight-bold text-blue-2 q-mt-xs">
              {{ rotuloTemporal(evento) }}
            </div>

            <div class="text-h5 text-weight-bold q-my-xs">
              {{ rotuloDia(evento) }}
            </div>

            <div
              class="text-caption text-weight-bold text-blue-1 text-lowercase"
            >
              {{ rotuloMes(evento) }}
            </div>
          </div>

          <!-- Conteúdo -->
          <q-card-section class="col column justify-between">
            <div>
              <!-- Categorias -->
              <div class="q-gutter-xs q-mb-sm">
                <q-chip
                  dense
                  color="warning"
                  text-color="white"
                  size="sm"
                >
                  {{ evento.categoria || 'Evento' }}
                </q-chip>

                <!-- IMPORTANTE:
                     usa isEventoInscrito() e não evento.inscrito -->
                <q-chip
                  v-if="isEventoInscrito(evento)"
                  dense
                  color="positive"
                  text-color="white"
                  icon="check_circle"
                  size="sm"
                >
                  Inscrito
                </q-chip>
              </div>

              <div class="text-subtitle1 text-weight-bold text-grey-9">
                {{ evento.titulo }}
              </div>

              <div
                v-if="evento.descricao"
                class="text-caption text-grey-7 q-mt-sm"
              >
                {{ evento.descricao }}
              </div>

              <div class="text-caption text-grey-7 q-mt-sm">
                <!-- Horário -->
                <div class="row items-center q-gutter-xs">
                  <q-icon
                    name="schedule"
                    size="16px"
                  />

                  <span>
                    {{ formatHorario(evento) }}
                  </span>
                </div>

                <!-- Local -->
                <div class="row items-center q-gutter-xs q-mt-xs">
                  <q-icon
                    :name="
                      evento.modalidade === 'ONLINE'
                        ? 'language'
                        : 'place'
                    "
                    size="16px"
                  />

                  <span>
                    {{ formatLocal(evento) }}
                  </span>
                </div>

                <!-- Secretaria -->
                <div
                  v-if="evento.secretaria"
                  class="row items-center q-gutter-xs q-mt-xs"
                >
                  <q-icon
                    name="account_balance"
                    size="16px"
                  />

                  <span>
                    {{
                      evento.secretaria.nome ||
                      evento.secretaria.sigla
                    }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Ações -->
            <div class="row items-center q-gutter-xs q-mt-md">
              <!-- Botão principal -->
              <q-btn
                :color="
                  isEventoInscrito(evento)
                    ? 'positive'
                    : 'primary'
                "
                unelevated
                no-caps
                dense
                :loading="eventStore.enrolling[evento.id]"
                :disable="
                  rotuloTemporal(evento) === 'ENCERRADO' ||
                  eventStore.enrolling[evento.id]
                "
                :label="
                  isEventoInscrito(evento)
                    ? 'Inscrito'
                    : 'Inscrever-se'
                "
                :icon="
                  isEventoInscrito(evento)
                    ? 'check_circle'
                    : 'event_available'
                "
                @click="toggleInscricao(evento)"
              />

              <!-- Cancelar inscrição -->
              <q-btn
                v-if="isEventoInscrito(evento)"
                flat
                round
                dense
                icon="event_busy"
                color="grey-6"
                :loading="eventStore.enrolling[evento.id]"
                :disable="eventStore.enrolling[evento.id]"
                @click="toggleInscricao(evento)"
              >
                <q-tooltip>
                  Cancelar inscrição
                </q-tooltip>
              </q-btn>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Estado vazio -->
    <q-card
      v-else
      flat
      bordered
      class="rounded-borders q-py-xl column items-center q-gutter-sm"
    >
      <q-icon
        :name="
          abaAtiva === 'meus'
            ? 'bookmark_border'
            : 'event_busy'
        "
        size="32px"
        color="grey-5"
      />

      <div class="text-body2 text-grey-7 text-weight-medium">
        {{
          abaAtiva === 'meus'
            ? 'Você ainda não se inscreveu em nenhum evento.'
            : 'Nenhum evento encontrado com esses filtros.'
        }}
      </div>

      <q-btn
        v-if="filtrosAtivos.length"
        flat
        no-caps
        dense
        label="Limpar filtros"
        color="primary"
        @click="limparFiltros"
      />
    </q-card>

    <!-- Paginação -->
    <div
      v-if="eventosFiltrados.length"
      class="row items-center justify-end q-gutter-sm text-caption text-grey-7 q-mt-lg"
    >
      <span>Registros por página:</span>

      <q-select
        v-model="porPagina"
        dense
        borderless
        emit-value
        map-options
        :options="opcoesPorPagina"
        options-dense
        style="min-width: 56px"
        class="text-grey-8"
      />

      <span class="q-ml-sm">
        {{ inicioRegistro }}-{{ fimRegistro }}
        de {{ eventosFiltrados.length }}
      </span>

      <q-btn
        flat
        round
        dense
        icon="chevron_left"
        color="grey-7"
        :disable="pagina <= 1"
        @click="pagina--"
      />

      <q-btn
        flat
        round
        dense
        icon="chevron_right"
        color="grey-7"
        :disable="pagina >= totalPaginas"
        @click="pagina++"
      />
    </div>
  </q-page>
</template>

<script setup>
import {
  computed,
  onMounted,
  ref,
  watch,
} from 'vue'

import { useQuasar } from 'quasar'
import { useEventStore } from 'src/stores/eventStore'

const $q = useQuasar()
const eventStore = useEventStore()

const abaAtiva = ref('todos')
const busca = ref('')
const tipoFiltro = ref(null)
const periodoFiltro = ref('todos')

const pagina = ref(1)
const porPagina = ref(5)

const opcoesPorPagina = [
  { label: '5', value: 5 },
  { label: '10', value: 10 },
  { label: '15', value: 15 },
  { label: '20', value: 20 },
]

const opcoesPeriodo = [
  {
    label: 'Todos os períodos',
    value: 'todos',
  },
  {
    label: 'Próximos 7 dias',
    value: '7dias',
  },
  {
    label: 'Próximos 30 dias',
    value: '30dias',
  },
  {
    label: 'Este mês',
    value: 'estemes',
  },
]

const eventos = computed(() => eventStore.events)

/**
 * Retorna os IDs dos eventos nos quais o usuário
 * está inscrito.
 *
 * O eventStore agora mantém enrolledEvents como
 * fonte de verdade para as inscrições.
 */
const eventosInscritosIds = computed(() => {
  const inscritos = eventStore.enrolledEvents || []

  return new Set(
    inscritos
      .map((item) => {
        /*
         * Pode vir como:
         * { id: 1 }
         * { eventId: 1 }
         * { eventoId: 1 }
         * { evento: { id: 1 } }
         */
        return (
          item?.eventId ??
          item?.eventoId ??
          item?.evento?.id ??
          item?.event?.id ??
          item?.id
        )
      })
      .filter(
        (id) =>
          id !== undefined &&
          id !== null,
      )
      .map((id) => String(id)),
  )
})

/**
 * Fonte única para saber se o usuário está inscrito.
 *
 * Primeiro verifica enrolledEvents.
 * O fallback para evento.inscrito mantém compatibilidade
 * caso algum endpoint ainda retorne esse campo.
 */
function isEventoInscrito(evento) {
  if (!evento?.id) {
    return false
  }

  return (
    eventosInscritosIds.value.has(
      String(evento.id),
    ) ||
    evento.inscrito === true
  )
}

const opcoesTipo = computed(() => {
  const tipos = [
    ...new Set(
      eventos.value
        .map((event) => event.categoria)
        .filter(Boolean),
    ),
  ]

  return tipos.map((tipo) => ({
    label: tipo,
    value: tipo,
  }))
})

const totalInscritos = computed(
  () => eventStore.enrolledEvents?.length || 0,
)

const dentroDoPeriodo = (evento) => {
  if (periodoFiltro.value === 'todos') {
    return true
  }

  const agora = new Date()
  agora.setHours(0, 0, 0, 0)

  const inicio = new Date(evento.dataInicio)

  if (periodoFiltro.value === '7dias') {
    const limite = new Date(agora)
    limite.setDate(limite.getDate() + 7)

    return inicio >= agora && inicio <= limite
  }

  if (periodoFiltro.value === '30dias') {
    const limite = new Date(agora)
    limite.setDate(limite.getDate() + 30)

    return inicio >= agora && inicio <= limite
  }

  if (periodoFiltro.value === 'estemes') {
    return (
      inicio.getMonth() === agora.getMonth() &&
      inicio.getFullYear() === agora.getFullYear()
    )
  }

  return true
}

const eventosFiltrados = computed(() => {
  return eventos.value
    /*
     * MEUS EVENTOS
     *
     * Não usa evento.inscrito.
     * Usa enrolledEvents.
     */
    .filter((evento) =>
      abaAtiva.value === 'meus'
        ? isEventoInscrito(evento)
        : true,
    )

    .filter((evento) => {
      const termo = busca.value
        ?.trim()
        .toLowerCase()

      if (!termo) {
        return true
      }

      return (
        evento.titulo
          ?.toLowerCase()
          .includes(termo) ||
        evento.local
          ?.toLowerCase()
          .includes(termo)
      )
    })

    .filter(
      (evento) =>
        !tipoFiltro.value ||
        evento.categoria === tipoFiltro.value,
    )

    .filter((evento) =>
      dentroDoPeriodo(evento),
    )

    .sort(
      (a, b) =>
        new Date(a.dataInicio) -
        new Date(b.dataInicio),
    )
})

const totalPaginas = computed(() =>
  Math.max(
    1,
    Math.ceil(
      eventosFiltrados.value.length /
        porPagina.value,
    ),
  ),
)

const eventosPaginados = computed(() => {
  const inicio =
    (pagina.value - 1) *
    porPagina.value

  return eventosFiltrados.value.slice(
    inicio,
    inicio + porPagina.value,
  )
})

const inicioRegistro = computed(() => {
  if (!eventosFiltrados.value.length) {
    return 0
  }

  return (
    (pagina.value - 1) *
      porPagina.value +
    1
  )
})

const fimRegistro = computed(() =>
  Math.min(
    pagina.value * porPagina.value,
    eventosFiltrados.value.length,
  ),
)

watch(
  [
    abaAtiva,
    busca,
    tipoFiltro,
    periodoFiltro,
    porPagina,
  ],
  () => {
    pagina.value = 1
  },
)

const filtrosAtivos = computed(() => {
  const chips = []

  if (busca.value) {
    chips.push({
      key: 'busca',
      label: `Busca: "${busca.value}"`,
      limpar: () => {
        busca.value = ''
      },
    })
  }

  if (tipoFiltro.value) {
    chips.push({
      key: 'tipo',
      label: tipoFiltro.value,
      limpar: () => {
        tipoFiltro.value = null
      },
    })
  }

  if (periodoFiltro.value !== 'todos') {
    const opcao = opcoesPeriodo.find(
      (item) =>
        item.value === periodoFiltro.value,
    )

    if (opcao) {
      chips.push({
        key: 'periodo',
        label: opcao.label,
        limpar: () => {
          periodoFiltro.value = 'todos'
        },
      })
    }
  }

  return chips
})

function limparFiltros() {
  busca.value = ''
  tipoFiltro.value = null
  periodoFiltro.value = 'todos'
}

const nomesMes = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
]

function rotuloDia(evento) {
  const inicio = new Date(
    evento.dataInicio,
  )

  if (!evento.dataFim) {
    return String(
      inicio.getDate(),
    ).padStart(2, '0')
  }

  const fim = new Date(
    evento.dataFim,
  )

  if (
    inicio.getMonth() ===
    fim.getMonth()
  ) {
    return `${String(
      inicio.getDate(),
    ).padStart(2, '0')} a ${String(
      fim.getDate(),
    ).padStart(2, '0')}`
  }

  return `${String(
    inicio.getDate(),
  ).padStart(2, '0')} ${
    nomesMes[inicio.getMonth()]
  } a ${String(
    fim.getDate(),
  ).padStart(2, '0')} ${
    nomesMes[fim.getMonth()]
  }`
}

function rotuloMes(evento) {
  return nomesMes[
    new Date(
      evento.dataInicio,
    ).getMonth()
  ]
}

function rotuloTemporal(evento) {
  const agora = new Date()
  agora.setHours(0, 0, 0, 0)

  const inicio = new Date(
    evento.dataInicio,
  )

  const diffDias = Math.round(
    (inicio - agora) /
      (1000 * 60 * 60 * 24),
  )

  if (diffDias < 0) {
    return 'ENCERRADO'
  }

  if (diffDias <= 7) {
    return 'PRÓXIMO'
  }

  return 'EM BREVE'
}

function formatHorario(evento) {
  if (!evento.dataInicio) {
    return '-'
  }

  const inicio = new Date(
    evento.dataInicio,
  ).toLocaleTimeString(
    'pt-BR',
    {
      hour: '2-digit',
      minute: '2-digit',
    },
  )

  if (!evento.dataFim) {
    return inicio
  }

  const fim = new Date(
    evento.dataFim,
  ).toLocaleTimeString(
    'pt-BR',
    {
      hour: '2-digit',
      minute: '2-digit',
    },
  )

  return `${inicio} às ${fim}`
}

function formatLocal(evento) {
  if (
    evento.modalidade === 'ONLINE'
  ) {
    return 'Online'
  }

  if (
    evento.modalidade === 'HIBRIDO'
  ) {
    return evento.local
      ? `${evento.local} · Híbrido`
      : 'Híbrido'
  }

  return (
    evento.local ||
    'Local não informado'
  )
}

async function toggleInscricao(evento) {
  const inscrito =
    isEventoInscrito(evento)

  try {
    if (inscrito) {
      await eventStore.unenroll(
        evento.id,
      )

      $q.notify({
        color: 'info',
        icon: 'info',
        message: `Inscrição cancelada para "${evento.titulo}".`,
        position: 'top',
      })

      return
    }

    await eventStore.enroll(
      evento.id,
    )

    $q.notify({
      color: 'positive',
      icon: 'check_circle',
      message: `Inscrição confirmada para "${evento.titulo}"!`,
      position: 'top',
    })
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      'Não foi possível realizar a operação.'

    $q.notify({
      type: 'negative',
      message,
      position: 'top',
    })
  }
}

onMounted(async () => {
  try {
    /*
     * fetchEvents precisa carregar os eventos e,
     * pelo novo store, também manter enrolledEvents
     * atualizado.
     */
    await eventStore.fetchEvents()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message:
        error?.response?.data?.message ||
        'Não foi possível carregar os eventos.',
      position: 'top',
    })
  }
})
</script>

<style scoped>
.rounded-borders {
  border-radius: 8px;
}

.full-height {
  height: 100%;
}

@media (max-width: 599px) {
  .full-width-xs {
    width: 100%;
  }
}
</style>