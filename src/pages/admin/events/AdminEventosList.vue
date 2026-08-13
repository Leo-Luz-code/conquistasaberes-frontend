<template>
  <q-page class="p-4 sm:p-8 max-w-6xl mx-auto space-y-6 font-sans">

    <!-- Cabeçalho -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Gestão de Eventos
        </h1>

        <p class="text-xs sm:text-sm text-slate-500 mt-1">
          Crie, organize e acompanhe os eventos e palestras das secretarias
          municipais.
        </p>
      </div>

      <q-btn
        label="NOVO EVENTO"
        icon="add"
        color="primary"
        class="!py-2.5 !px-5 bg-pmvc-blue text-white font-bold rounded-xl"
        unelevated
        no-caps
        @click="openCreateModal"
      />
    </div>

    <!-- Indicadores -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div
        v-for="stat in statistics"
        :key="stat.label"
        class="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold text-slate-500">
              {{ stat.label }}
            </p>

            <p class="text-2xl font-extrabold text-slate-900 mt-1">
              {{ stat.value }}
            </p>
          </div>

          <div
            class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center"
          >
            <q-icon
              :name="stat.icon"
              size="21px"
              class="text-pmvc-blue"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div
      class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4"
    >
      <div class="grid grid-cols-1 md:grid-cols-12 gap-3">

        <q-input
          v-model="filters.search"
          outlined
          dense
          clearable
          placeholder="Buscar evento..."
          class="md:col-span-5"
          hide-bottom-space
        >
          <template #prepend>
            <q-icon
              name="search"
              class="text-slate-400"
            />
          </template>
        </q-input>

        <q-select
          v-model="filters.categoria"
          :options="categoryOptions"
          outlined
          dense
          clearable
          label="Categoria"
          class="md:col-span-2"
          hide-bottom-space
        />

        <q-select
          v-model="filters.modalidade"
          :options="modalityOptions"
          outlined
          dense
          clearable
          emit-value
          map-options
          label="Modalidade"
          class="md:col-span-2"
          hide-bottom-space
        />

        <q-select
          v-model="filters.status"
          :options="statusOptions"
          outlined
          dense
          clearable
          emit-value
          map-options
          label="Status"
          class="md:col-span-2"
          hide-bottom-space
        />

        <q-btn
          flat
          icon="filter_alt_off"
          color="grey-7"
          class="md:col-span-1"
          @click="clearFilters"
        >
          <q-tooltip>
            Limpar filtros
          </q-tooltip>
        </q-btn>

      </div>
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

    <!-- Eventos -->
    <div
      v-else-if="filteredEvents.length > 0"
      class="space-y-3"
    >
      <div
        v-for="event in filteredEvents"
        :key="event.id"
        class="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
      >
        <div class="flex flex-col sm:flex-row">

          <!-- Capa -->
          <div
            class="w-full sm:w-48 h-36 sm:h-auto shrink-0 bg-slate-100 relative overflow-hidden"
          >
            <img
              v-if="event.capaUrl"
              :src="event.capaUrl"
              :alt="event.titulo"
              class="w-full h-full object-cover"
            />

            <div
              v-else
              class="w-full h-full flex items-center justify-center"
            >
              <q-icon
                name="event"
                size="48px"
                class="text-slate-300"
              />
            </div>

            <div class="absolute top-3 left-3">
              <q-badge
                :color="
                  event.isPublished
                    ? 'positive'
                    : 'grey-7'
                "
                :label="
                  event.isPublished
                    ? 'PUBLICADO'
                    : 'RASCUNHO'
                "
                class="font-bold px-2 py-1"
              />
            </div>
          </div>

          <!-- Conteúdo -->
          <div class="flex-1 p-4 sm:p-5">

            <div
              class="flex items-start justify-between gap-4"
            >
              <div class="min-w-0">

                <div
                  class="flex flex-wrap items-center gap-2 mb-1"
                >
                  <span
                    class="text-[10px] uppercase font-bold tracking-wider text-pmvc-blue bg-blue-50 px-2 py-1 rounded-md"
                  >
                    {{ event.categoria || 'Palestra' }}
                  </span>

                  <span
                    class="text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded-md"
                  >
                    {{ formatModality(event.modalidade) }}
                  </span>
                </div>

                <h2
                  class="font-bold text-slate-900 text-base sm:text-lg leading-snug"
                >
                  {{ event.titulo }}
                </h2>

                <p
                  v-if="event.descricao"
                  class="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-2"
                >
                  {{ event.descricao }}
                </p>

              </div>

              <!-- Menu -->
              <q-btn
                flat
                round
                dense
                icon="more_vert"
                color="grey-7"
              >
                <q-menu
                  anchor="bottom right"
                  self="top right"
                  
                >
                  <q-list style="min-width: 180px">

                    <q-item
                      clickable
                      v-close-popup
                      @click="openEditModal(event)"
                    >
                      <q-item-section avatar>
                        <q-icon
                          name="edit"
                          color="primary"
                        />
                      </q-item-section>

                      <q-item-section>
                        Editar evento
                      </q-item-section>
                    </q-item>

                    <q-item
                      clickable
                      v-close-popup
                      @click="openEnrollments(event)"
                    >
                      <q-item-section avatar>
                        <q-icon
                          name="groups"
                          color="primary"
                        />
                      </q-item-section>

                      <q-item
                        clickable
                        v-close-popup
                        @click="openEnrollments(event)"
                      >
                        <q-item-section>
                          Ver inscritos
                        </q-item-section>
                      </q-item>
                    </q-item>

                    <q-separator />

                    <q-item
                      clickable
                      v-close-popup
                      class="text-negative"
                      @click="handleDelete(event)"
                    >
                      <q-item-section avatar>
                        <q-icon
                          name="delete"
                          color="negative"
                        />
                      </q-item-section>

                      <q-item-section>
                        Excluir evento
                      </q-item-section>
                    </q-item>

                  </q-list>
                </q-menu>
              </q-btn>
            </div>

            <!-- Informações -->
            <div
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100"
            >

              <!-- Data -->
              <div class="flex items-center gap-2">
                <q-icon
                  name="calendar_today"
                  size="17px"
                  class="text-pmvc-blue"
                />

                <div>
                  <p
                    class="text-[10px] text-slate-400 font-semibold"
                  >
                    DATA
                  </p>

                  <p
                    class="text-xs font-semibold text-slate-700"
                  >
                    {{ formatDate(event.dataInicio) }}
                  </p>
                </div>
              </div>

              <!-- Horário -->
              <div class="flex items-center gap-2">
                <q-icon
                  name="schedule"
                  size="17px"
                  class="text-pmvc-blue"
                />

                <div>
                  <p
                    class="text-[10px] text-slate-400 font-semibold"
                  >
                    HORÁRIO
                  </p>

                  <p
                    class="text-xs font-semibold text-slate-700"
                  >
                    {{ formatTime(event.dataInicio) }}
                    –
                    {{ formatTime(event.dataFim) }}
                  </p>
                </div>
              </div>

              <!-- Local -->
              <div class="flex items-center gap-2">
                <q-icon
                  :name="
                    event.modalidade === 'ONLINE'
                      ? 'language'
                      : 'location_on'
                  "
                  size="17px"
                  class="text-pmvc-blue"
                />

                <div class="min-w-0">
                  <p
                    class="text-[10px] text-slate-400 font-semibold"
                  >
                    LOCAL
                  </p>

                  <p
                    class="text-xs font-semibold text-slate-700 truncate"
                  >
                    {{
                      event.modalidade === 'ONLINE'
                        ? 'Online'
                        : event.local || 'Não informado'
                    }}
                  </p>
                </div>
              </div>

              <!-- Inscrições -->
              <div class="flex items-center gap-2">
                <q-icon
                  name="groups"
                  size="17px"
                  class="text-pmvc-blue"
                />

                <div>
                  <p
                    class="text-[10px] text-slate-400 font-semibold"
                  >
                    INSCRIÇÕES
                  </p>

                  <p
                    class="text-xs font-semibold text-slate-700"
                  >
                    {{ getEnrollmentCount(event) }}

                    <span v-if="event.vagas">
                      / {{ event.vagas }} vagas
                    </span>

                    <span v-else>
                      inscritos
                    </span>
                  </p>
                </div>
              </div>

            </div>

            <!-- Secretaria -->
            <div
              v-if="event.secretaria"
              class="flex items-center gap-2 mt-3"
            >
              <q-icon
                name="account_balance"
                size="16px"
                class="text-slate-400"
              />

              <span
                class="text-xs text-slate-500"
              >
                {{
                  event.secretaria.nome ||
                  event.secretaria.sigla
                }}
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else
      class="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3"
    >
      <q-icon
        name="event_busy"
        size="56px"
        class="text-slate-300"
      />

      <h3
        class="font-bold text-slate-700 text-lg"
      >
        Nenhum evento encontrado
      </h3>

      <p
        class="text-xs text-slate-500 max-w-md mx-auto"
      >
        Não existem eventos correspondentes aos filtros
        selecionados.
      </p>
    </div>

    <!-- Modal criação/edição -->
    <EventoFormModal
      v-model="showFormModal"
      :event="selectedEvent"
      :is-editing="isEditing"
      @save="handleSave"
    />

  </q-page>
</template>

<script setup>
import {
  computed,
  onMounted,
  ref,
} from 'vue'

import { useQuasar } from 'quasar'
import { useEventStore } from 'src/stores/eventStore'
import { useRouter } from 'vue-router'
import EventoFormModal from '../../../components/modals/EventoFormModal.vue'

const $q = useQuasar()
const eventStore = useEventStore()

const showFormModal = ref(false)

const isEditing = ref(false)

const selectedEvent = ref(null)
const router = useRouter()

const filters = ref({
  search: '',
  categoria: null,
  modalidade: null,
  status: null,
})

const categoryOptions = [
  'Palestra',
  'Workshop',
  'Reunião',
  'Curso',
  'Seminário',
  'Capacitação',
  'Conferência',
  'Outro',
]

const modalityOptions = [
  {
    label: 'Presencial',
    value: 'PRESENCIAL',
  },
  {
    label: 'Online',
    value: 'ONLINE',
  },
  {
    label: 'Híbrido',
    value: 'HIBRIDO',
  },
]

const statusOptions = [
  {
    label: 'Publicados',
    value: 'published',
  },
  {
    label: 'Rascunhos',
    value: 'draft',
  },
]

const filteredEvents = computed(() => {
  const search =
    filters.value.search
      ?.trim()
      .toLowerCase()

  return eventStore.events.filter(
    (event) => {

      const matchesSearch =
        !search ||
        event.titulo
          ?.toLowerCase()
          .includes(search) ||
        event.descricao
          ?.toLowerCase()
          .includes(search)

      const matchesCategory =
        !filters.value.categoria ||
        event.categoria ===
          filters.value.categoria

      const matchesModality =
        !filters.value.modalidade ||
        event.modalidade ===
          filters.value.modalidade

      const matchesStatus =
        !filters.value.status ||
        (
          filters.value.status ===
          'published'
            ? event.isPublished
            : !event.isPublished
        )

      return (
        matchesSearch &&
        matchesCategory &&
        matchesModality &&
        matchesStatus
      )
    },
  )
})

const statistics = computed(() => [
  {
    label: 'Total de eventos',
    value: eventStore.events.length,
    icon: 'event',
  },
  {
    label: 'Publicados',
    value:
      eventStore.events.filter(
        (event) =>
          event.isPublished,
      ).length,
    icon: 'public',
  },
  {
    label: 'Rascunhos',
    value:
      eventStore.events.filter(
        (event) =>
          !event.isPublished,
      ).length,
    icon: 'edit_note',
  },
  {
    label: 'Inscrições',
    value:
      eventStore.events.reduce(
        (total, event) =>
          total +
          getEnrollmentCount(event),
        0,
      ),
    icon: 'groups',
  },
])

onMounted(async () => {
  try {
    await eventStore.fetchEvents()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message:
        'Não foi possível carregar os eventos.',
      position: 'top',
    })
  }
})

function openCreateModal() {
  selectedEvent.value = null
  isEditing.value = false
  showFormModal.value = true
}

function openEditModal(event) {
  selectedEvent.value = event
  isEditing.value = true
  showFormModal.value = true
}

async function handleSave(
  eventData,
  { resolve, reject } = {},
) {
  try {
    let result

    if (
      isEditing.value &&
      selectedEvent.value
    ) {
      result =
        await eventStore.updateEvent(
          selectedEvent.value.id,
          eventData,
        )

      $q.notify({
        type: 'positive',
        message:
          'Evento atualizado com sucesso.',
        position: 'top',
      })
    } else {

      result =
        await eventStore.createEvent(
          eventData,
        )

      $q.notify({
        type: 'positive',
        message:
          'Evento criado com sucesso.',
        position: 'top',
      })
    }

    showFormModal.value = false
    selectedEvent.value = null

    resolve?.(result)

  } catch (error) {

    console.error(
      error,
    )

    $q.notify({
      type: 'negative',
      message:
        error?.response?.data?.message ||
        'Não foi possível salvar o evento.',
      position: 'top',
    })

    reject?.(error)
  }
}

function handleDelete(event) {
  $q.dialog({
    title: 'Excluir Evento',

    message:
      `Tem certeza que deseja excluir o evento "${event.titulo}"?`,

    cancel: {
      label: 'Cancelar',
      flat: true,
    },

    ok: {
      label: 'Excluir',
      color: 'negative',
      unelevated: true,
    },

    persistent: true,

  }).onOk(async () => {

    try {
      await eventStore.deleteEvent(
        event.id,
      )

      $q.notify({
        type: 'positive',
        message:
          'Evento excluído com sucesso.',
        position: 'top',
      })

    } catch (error) {

      console.error(
        error,
      )

      $q.notify({
        type: 'negative',
        message:
          error?.response?.data?.message ||
          'Não foi possível excluir o evento.',
        position: 'top',
      })
    }
  })
}

function openEnrollments(event) {
  router.push({
    name: 'admin-evento-inscritos',
    params: { id: event.id },
  })
}

function clearFilters() {
  filters.value = {
    search: '',
    categoria: null,
    modalidade: null,
    status: null,
  }
}

function getEnrollmentCount(event) {
  if (
    event._count?.inscricoes !==
    undefined
  ) {
    return event._count.inscricoes
  }

  if (
    Array.isArray(event.inscricoes)
  ) {
    return event.inscricoes.length
  }

  return event.inscritosCount || 0
}

function formatModality(modality) {
  const labels = {
    PRESENCIAL: 'Presencial',
    ONLINE: 'Online',
    HIBRIDO: 'Híbrido',
  }

  return (
    labels[modality] ||
    modality ||
    'Presencial'
  )
}

function formatDate(date) {
  if (!date) return '-'

  return new Date(
    date,
  ).toLocaleDateString(
    'pt-BR',
    {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    },
  )
}

function formatTime(date) {
  if (!date) return '-'

  return new Date(
    date,
  ).toLocaleTimeString(
    'pt-BR',
    {
      hour: '2-digit',
      minute: '2-digit',
    },
  )
}
</script>