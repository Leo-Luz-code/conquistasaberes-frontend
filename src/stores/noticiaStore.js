import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'src/boot/axios'

export const useNoticiaStore = defineStore('noticiaStore', () => {
  const loading = ref(false)
  const noticias = ref([])

  // Ações CRUD Consumindo REST API no Backend
  async function fetchNoticias(onlyPublished = false, secretariaId = null) {
    loading.value = true
    try {
      const params = {}
      if (onlyPublished) params.onlyPublished = true
      if (secretariaId) params.secretariaId = secretariaId

      const response = await api.get('/noticias', { params })
      noticias.value = response.data || []
      return noticias.value
    } catch (error) {
      console.error('Falha ao buscar notícias do servidor:', error)
      noticias.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  async function createNoticia(payload) {
    loading.value = true
    try {
      const response = await api.post('/noticias', payload)
      if (response.data) {
        if (response.data.destaque) {
          noticias.value.forEach((n) => (n.destaque = false))
        }
        noticias.value.unshift(response.data)
      }
      return response.data
    } catch (error) {
      console.error('Erro ao criar notícia no backend:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function updateNoticia(id, payload) {
    loading.value = true
    try {
      const response = await api.put(`/noticias/${id}`, payload)
      const index = noticias.value.findIndex((n) => n.id === id)
      if (index !== -1 && response.data) {
        noticias.value[index] = { ...noticias.value[index], ...response.data }
      }
      return response.data
    } catch (error) {
      console.error(`Erro ao atualizar notícia ${id}:`, error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function toggleStatus(id) {
    try {
      const response = await api.patch(`/noticias/${id}/toggle-status`)
      const item = noticias.value.find((n) => n.id === id)
      if (item && response.data) {
        item.publicada = response.data.publicada
      }
    } catch (error) {
      console.error(`Erro ao alternar status da notícia ${id}:`, error)
      throw error
    }
  }

  async function toggleDestaque(id) {
    try {
      const response = await api.patch(`/noticias/${id}/toggle-destaque`)
      const item = noticias.value.find((n) => n.id === id)
      if (item && response.data) {
        if (response.data.destaque) {
          noticias.value.forEach((n) => (n.destaque = false))
        }
        item.destaque = response.data.destaque
      }
    } catch (error) {
      console.error(`Erro ao alternar destaque da notícia ${id}:`, error)
      throw error
    }
  }

  async function deleteNoticia(id) {
    loading.value = true
    try {
      await api.delete(`/noticias/${id}`)
      noticias.value = noticias.value.filter((n) => n.id !== id)
    } catch (error) {
      console.error(`Erro ao excluir notícia ${id}:`, error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    noticias,
    loading,
    fetchNoticias,
    createNoticia,
    updateNoticia,
    toggleStatus,
    toggleDestaque,
    deleteNoticia,
  }
})
