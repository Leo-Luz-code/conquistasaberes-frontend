import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from 'src/boot/axios';

export const useEventStore = defineStore('event', () => {
  const events = ref([])
  const enrolledEventIds = ref(new Set())
  const loading = ref(false)
  const enrolling = ref({})

  const enrolledEvents = computed(() =>
    events.value.filter((event) => enrolledEventIds.value.has(String(event.id))),
  )

  function isEnrolled(eventId) {
    return enrolledEventIds.value.has(String(eventId))
  }

  async function fetchEvents(filters = {}) {
    loading.value = true

    try {
      const params = {}

      if (filters.secretariaId) {
        params.secretariaId = filters.secretariaId
      }

      if (filters.categoria) {
        params.categoria = filters.categoria
      }

      if (filters.modalidade) {
        params.modalidade = filters.modalidade
      }

      // Busca eventos e inscrições do usuário em paralelo.
      // O GET /events é público e não sabe quem é o usuário,
      // então as inscrições vêm de um endpoint dedicado.
      const [eventsResponse, enrollmentsResponse] = await Promise.all([
        api.get('/events', { params }),
        api.get('/events/me/enrollments').catch(() => ({ data: [] })),
      ])

      const data = eventsResponse.data
      const enrolledIds = Array.isArray(enrollmentsResponse.data)
        ? enrollmentsResponse.data
        : []

      enrolledEventIds.value = new Set(enrolledIds.map((id) => String(id)))

      events.value = Array.isArray(data)
        ? data.map((event) =>
            normalizeEvent({
              ...event,
              inscrito: enrolledEventIds.value.has(String(event.id)),
            }),
          )
        : []
    } finally {
      loading.value = false
    }
  }

  async function fetchMyEnrollments() {
    try {
      const response = await api.get('/events/me/enrollments')
      const enrolledIds = Array.isArray(response.data) ? response.data : []

      enrolledEventIds.value = new Set(enrolledIds.map((id) => String(id)))

      events.value = events.value.map((event) =>
        normalizeEvent({
          ...event,
          inscrito: enrolledEventIds.value.has(String(event.id)),
        }),
      )
    } catch {
      // silencioso: se falhar, mantém o estado atual de inscrições
    }
  }

  async function enroll(eventId) {
    enrolling.value[eventId] = true

    try {
      const response = await api.post(
        `/events/${eventId}/enroll`,
      )

      enrolledEventIds.value.add(String(eventId))

      const index = events.value.findIndex(
        (event) => event.id === eventId,
      )

      if (index !== -1) {
        events.value[index] = normalizeEvent({
          ...events.value[index],
          inscrito: true,
          enrollment: response.data,
          _count: {
            ...(events.value[index]._count || {}),
            inscricoes:
              (events.value[index]._count?.inscricoes || 0) + 1,
          },
        })
      }

      return response.data
    } finally {
      enrolling.value[eventId] = false
    }
  }

  async function unenroll(eventId) {
    enrolling.value[eventId] = true

    try {
      const response = await api.delete(
        `/events/${eventId}/enroll`,
      )

      enrolledEventIds.value.delete(String(eventId))

      const index = events.value.findIndex(
        (event) => event.id === eventId,
      )

      if (index !== -1) {
        const currentCount =
          events.value[index]._count?.inscricoes || 0

        events.value[index] = normalizeEvent({
          ...events.value[index],
          inscrito: false,
          enrollment: null,
          _count: {
            ...(events.value[index]._count || {}),
            inscricoes: Math.max(0, currentCount - 1),
          },
        })
      }

      return response.data
    } finally {
      enrolling.value[eventId] = false
    }
  }

  async function fetchEvent(eventId) {
    const response = await api.get(`/events/${eventId}`)

    return normalizeEvent({
      ...response.data,
      inscrito: enrolledEventIds.value.has(String(eventId)),
    })
  }

  function normalizeEvent(event) {
    const enrollmentCount =
      event._count?.inscricoes ??
      event.inscritosCount ??
      event.inscricoes?.length ??
      0

    return {
      ...event,

      inscrito:
        event.inscrito ??
        event.isEnrolled ??
        Boolean(event.enrollment),

      inscritosCount: enrollmentCount,
    }
  }

  async function createEvent(payload) {
    const response = await api.post('/events', payload)

    const event = normalizeEvent(response.data)

    events.value.unshift(event)

    return event
  }

  async function updateEvent(eventId, eventData) {
    const response = await api.patch(`/events/${eventId}`, eventData,)

    const updatedEvent = normalizeEvent({
      ...response.data,
      inscrito: enrolledEventIds.value.has(String(eventId)),
    })

    const index = events.value.findIndex(
      (event) => event.id === eventId,
    )

    if (index !== -1) {
      events.value[index] = updatedEvent
    }

    return updatedEvent
  }

  async function deleteEvent(eventId) {
    const response = await api.delete(
      `/events/${eventId}`,
    )

    events.value = events.value.filter(
      (event) => event.id !== eventId,
    )

    enrolledEventIds.value.delete(String(eventId))

    return response.data
  }

  async function fetchEventEnrollments(eventId) {
    const response = await api.get(`/events/${eventId}/enrollments`)
 
    return Array.isArray(response.data) ? response.data : []
  }

  async function confirmEventCheckin(eventId, matricula) {
    const response = await api.post(`/events/${eventId}/checkin`, { matricula })
    return response.data
  }

  return {
    events,
    loading,
    enrolling,
    enrolledEvents,
    isEnrolled,
    fetchEvents,
    fetchMyEnrollments,
    fetchEventEnrollments,
    fetchEvent,
    confirmEventCheckin,
    enroll,
    unenroll,
    createEvent,
    updateEvent,
    deleteEvent
  }
})