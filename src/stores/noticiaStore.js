import { defineStore } from 'pinia'
import { ref } from 'vue'

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
      secretariaAlvoId: null, // Global
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
    {
      id: '3',
      titulo: 'Norminha IA apoiará servidores na busca por orientações e conteúdos acadêmicos',
      subtitulo: 'Assistente virtual baseada em inteligência artificial entra em operação experimental no AVA.',
      conteudo: 'A assistente virtual Norminha agora responde dúvidas em tempo real sobre normas municipais, navegação nas lições, emissão de certificados e sugestão de cursos compatíveis com a secretaria do servidor.',
      categoria: 'Inovação',
      capaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
      destaque: false,
      publicada: true,
      visualizacoes: 615,
      autorNome: 'Equipe de Tecnologia CETI',
      secretariaAlvoId: null,
      secretariaAlvoSigla: 'Todas as Secretarias',
      dataPublicacao: '2026-04-15T09:15:00Z',
    },
    {
      id: '4',
      titulo: 'Capacitação em Vigilância Epidemiológica para Agentes de Saúde',
      subtitulo: 'Curso específico direcionado aos servidores municipais vinculados à Secretaria de Saúde.',
      conteudo: 'Atualização de protocolos para identificação precoce e manejo de endemias na zona urbana e rural de Vitória da Conquista. Exclusivo para profissionais da SMS.',
      categoria: 'Saúde',
      capaUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=800&auto=format&fit=crop',
      destaque: false,
      publicada: true,
      visualizacoes: 490,
      autorNome: 'Diretoria de Atenção à Saúde',
      secretariaAlvoId: '1',
      secretariaAlvoSigla: 'SMS',
      dataPublicacao: '2026-04-12T11:00:00Z',
    },
    {
      id: '5',
      titulo: 'Abertura das inscrições para o Workshop de Letramento Digital na Educação',
      subtitulo: 'Capacitação prática em metodologias ativas e uso de recursos midiáticos na sala de aula.',
      conteudo: 'A SMED convida professores e coordenadores pedagógicos da rede municipal para o ciclo de formações do segundo trimestre.',
      categoria: 'Educação',
      capaUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop',
      destaque: false,
      publicada: false, // Rascunho
      visualizacoes: 0,
      autorNome: 'Núcleo de Formação SMED',
      secretariaAlvoId: '2',
      secretariaAlvoSigla: 'SMED',
      dataPublicacao: '2026-05-02T16:00:00Z',
    },
  ])

  // Ações CRUD Mockadas
  async function fetchNoticias() {
    loading.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return noticias.value
    } finally {
      loading.value = false
    }
  }

  async function createNoticia(payload) {
    loading.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 400))
      const newNoticia = {
        id: String(Date.now()),
        titulo: payload.titulo,
        subtitulo: payload.subtitulo || '',
        conteudo: payload.conteudo || '',
        categoria: payload.categoria || 'Geral',
        capaUrl: payload.capaUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop',
        destaque: !!payload.destaque,
        publicada: payload.publicada !== undefined ? payload.publicada : true,
        visualizacoes: 0,
        autorNome: payload.autorNome || 'Administrador UniVC',
        secretariaAlvoId: payload.secretariaAlvoId || null,
        secretariaAlvoSigla: payload.secretariaAlvoSigla || 'Todas as Secretarias',
        dataPublicacao: payload.dataPublicacao || new Date().toISOString(),
      }
      
      // Se a nova notícia for cadastrada como destaque, desmarca destaques anteriores se desejado
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
      await new Promise((resolve) => setTimeout(resolve, 400))
      const index = noticias.value.findIndex((n) => n.id === id)
      if (index !== -1) {
        if (payload.destaque) {
          noticias.value.forEach((n) => (n.destaque = false))
        }
        noticias.value[index] = {
          ...noticias.value[index],
          ...payload,
        }
        return noticias.value[index]
      }
    } finally {
      loading.value = false
    }
  }

  async function toggleStatus(id) {
    const item = noticias.value.find((n) => n.id === id)
    if (item) {
      item.publicada = !item.publicada
    }
  }

  async function toggleDestaque(id) {
    const item = noticias.value.find((n) => n.id === id)
    if (item) {
      const novoStatus = !item.destaque
      if (novoStatus) {
        noticias.value.forEach((n) => (n.destaque = false))
      }
      item.destaque = novoStatus
    }
  }

  async function deleteNoticia(id) {
    loading.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 400))
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
