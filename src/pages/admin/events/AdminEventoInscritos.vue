<template>
  <q-page class="p-4 sm:p-8 max-w-6xl mx-auto space-y-6 font-sans">

    <!-- Voltar -->
    <q-btn
        label="Voltar para Gestão de Eventos"
        icon="arrow_back"
        color="primary"
        class="!py-2.5 !px-5 bg-pmvc-blue text-white font-bold rounded-xl"
        unelevated
        no-caps
        :to="{ name: 'admin-eventos' }"
      />

    <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900">
      Inscritos{{ event?.titulo ? ` - ${event.titulo}` : '' }}
    </h1>

    <!-- Loading -->
    <div
      v-if="loading"
      class="flex justify-center py-16"
    >
      <q-spinner-dots
        color="primary"
        size="50px"
      />
    </div>

    <!-- Lista -->
    <div
      v-else-if="enrollments.length > 0"
      class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
    >
      <q-list separator>
        <q-item
          v-for="enrollment in enrollments"
          :key="enrollment.id"
        >
          <q-item-section avatar>
            <q-avatar color="blue-1" text-color="primary">
              {{ initials(userName(enrollment.user)) }}
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="font-semibold text-slate-800">
              {{ userName(enrollment.user) }}
            </q-item-label>

            <q-item-label caption>
              {{ enrollment.user?.email || 'E-mail não informado' }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- Empty state -->
    <div
      v-else
      class="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3"
    >
      <q-icon
        name="group_off"
        size="56px"
        class="text-slate-300"
      />

      <h3 class="font-bold text-slate-700 text-lg">
        Ainda não há inscritos
      </h3>
    </div>

  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useEventStore } from 'src/stores/eventStore'

const route = useRoute()
const $q = useQuasar()
const eventStore = useEventStore()

const event = ref(null)
const enrollments = ref([])
const loading = ref(true)

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

onMounted(async () => {
  const eventId = route.params.id

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
})
</script>