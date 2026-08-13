import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'src/boot/axios'

export const useNoticiaStore = defineStore('noticiaStore', () => {
  const loading = ref(false)

  // Lista mockada de notícias ricas com campos institucionais e editoriais
  const noticias = ref([
    {
      id: '1',
      titulo: 'Prefeitura lança a Universidade do Servidor Público — UniVC',
      subtitulo: 'Iniciativa marca um novo ciclo de valorização e capacitação contínua dos servidores municipais de Vitória da Conquista.',
      conteudo: 'A Prefeitura Municipal de Vitória da Conquista, por meio do CETI, lançou oficialmente o Ambiente Virtual de Aprendizagem Conquista Saberes / UniVC. O sistema foi desenvolvido para integrar cursos presenciais, híbridos e EAD, com suporte à gamificação, passaporte digital e assistente com IA.',
      categoria: 'Destaque',
      capaUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop',
      destaque: true,
      publicada: true,
      visualizacoes: 1420,
      autorNome: 'Assessoria de Comunicação CETI',
      secretariaAlvoId: null,
      secretariaAlvoSigla: 'Todas as Secretarias',
      dataPublicacao: '2026-04-28T10:00:00Z',
    },
    {
      id: '2',
      titulo: 'Nova trilha de capacitação em atendimento ao cidadão no serviço público',
      subtitulo: 'Conjunto de cursos voltados ao atendimento humanizado, comunicação não violenta e resolutividade.',
      conteudo: 'Com foco na excelência da prestação de serviços à comunidade de Conquista, a nova Trilha de Atendimento Humanizado traz conteúdos práticos e casos de estudo para servidores de recepção, protocolos e secretarias.',
      categoria: 'Trilhas',
      capaUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
      destaque: false,
      publicada: true,
      visualizacoes: 840,
      autorNome: 'Coordenação Pedagógica UniVC',
      secretariaAlvoId: null,
      secretariaAlvoSigla: 'Todas as Secretarias',
      dataPublicacao: '2026-04-22T14:30:00Z',
    },
  ])

  // Ações CRUD Consumindo REST API no Backend
  async function fetchNoticias(onlyPublished = false, secretariaId = null) {
    loading.value = true
    try {
      const params = {}
      if (onlyPublished) params.onlyPublished = true
      if (secretariaId) params.secretariaId = secretariaId

      const response = await api.get('/noticias', { params })
      noticias.value = response.data
      return noticias.value
    } catch (error) {
      console.warn('Backend offline ou falha na requisição, mantendo dados reativos.', error)
      return noticias.value
    } finally {
      loading.value = false
    }
  }

  async function createNoticia(payload) {
    loading.value = true
    try {
      const response = await api.post('/noticias', payload)
      noticias.value.unshift(response.data)
      return response.data
    } catch (error) {
      console.warn('Executando fallback de criação de notícia', error)
      const newNoticia = {
        id: String(Date.now()),
        ...payload,
        visualizacoes: 0,
        dataPublicacao: new Date().toISOString(),
      }
      if (newNoticia.destaque) {
        noticias.value.forEach((n) => (n.destaque = false))
      }
      noticias.value.unshift(newNoticia)
      return newNoticia
    } finally {
      loading.value = false
    }
  }

  async function updateNoticia(id, payload) {
    loading.value = true
    try {
      const response = await api.put(`/noticias/${id}`, payload)
      const index = noticias.value.findIndex((n) => n.id === id)
      if (index !== -1) {
        noticias.value[index] = { ...noticias.value[index], ...response.data }
      }
      return response.data
    } catch (error) {
      const index = noticias.value.findIndex((n) => n.id === id)
      if (index !== -1) {
        noticias.value[index] = { ...noticias.value[index], ...payload }
      }
    } finally {
      loading.value = false
    }
  }

  async function toggleStatus(id) {
    try {
      await api.patch(`/noticias/${id}/toggle-status`)
      const item = noticias.value.find((n) => n.id === id)
      if (item) item.publicada = !item.publicada
    } catch (error) {
      const item = noticias.value.find((n) => n.id === id)
      if (item) item.publicada = !item.publicada
    }
  }

  async function toggleDestaque(id) {
    try {
      await api.patch(`/noticias/${id}/toggle-destaque`)
      const item = noticias.value.find((n) => n.id === id)
      if (item) {
        const novoStatus = !item.destaque
        if (novoStatus) {
          noticias.value.forEach((n) => (n.destaque = false))
        }
        item.destaque = novoStatus
      }
    } catch (error) {
      const item = noticias.value.find((n) => n.id === id)
      if (item) {
        const novoStatus = !item.destaque
        if (novoStatus) {
          noticias.value.forEach((n) => (n.destaque = false))
        }
        item.destaque = novoStatus
      }
    }
  }

  async function deleteNoticia(id) {
    loading.value = true
    try {
      await api.delete(`/noticias/${id}`)
      noticias.value = noticias.value.filter((n) => n.id !== id)
    } catch (error) {
      noticias.value = noticias.value.filter((n) => n.id !== id)
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
