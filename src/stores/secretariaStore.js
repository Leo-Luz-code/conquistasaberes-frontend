import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'src/boot/axios'

export const useSecretariaStore = defineStore('secretariaStore', () => {
  const loading = ref(false)
  const secretarias = ref([])

  // Ações de CRUD consumindo API REST no Backend NestJS
  async function fetchSecretarias() {
    loading.value = true
    try {
      const response = await api.get('/secretarias')
      secretarias.value = response.data || []
      return secretarias.value
    } catch (error) {
      console.error('Falha ao buscar secretarias do servidor:', error)
      secretarias.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  async function createSecretaria(payload) {
    loading.value = true
    try {
      const response = await api.post('/secretarias', payload)
      if (response.data) {
        secretarias.value.unshift(response.data)
      }
      return response.data
    } catch (error) {
      console.error('Erro ao cadastrar secretaria no backend:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function updateSecretaria(id, payload) {
    loading.value = true
    try {
      const response = await api.put(`/secretarias/${id}`, payload)
      const index = secretarias.value.findIndex((s) => s.id === id)
      if (index !== -1 && response.data) {
        secretarias.value[index] = { ...secretarias.value[index], ...response.data }
      }
      return response.data
    } catch (error) {
      console.error(`Erro ao atualizar secretaria ${id}:`, error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function toggleStatus(id) {
    try {
      const response = await api.patch(`/secretarias/${id}/toggle-status`)
      const item = secretarias.value.find((s) => s.id === id)
      if (item && response.data) {
        item.ativa = response.data.ativa
      }
    } catch (error) {
      console.error(`Erro ao alternar status da secretaria ${id}:`, error)
      throw error
    }
  }

  async function deleteSecretaria(id) {
    loading.value = true
    try {
      await api.delete(`/secretarias/${id}`)
      secretarias.value = secretarias.value.filter((s) => s.id !== id)
    } catch (error) {
      console.error(`Erro ao excluir secretaria ${id}:`, error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    secretarias,
    loading,
    fetchSecretarias,
    createSecretaria,
    updateSecretaria,
    toggleStatus,
    deleteSecretaria,
  }
})
