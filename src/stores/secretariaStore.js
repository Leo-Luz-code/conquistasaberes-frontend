import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSecretariaStore = defineStore('secretariaStore', () => {
  const loading = ref(false)

  // Dados mockados iniciais ricos com estatísticas e informações municipais
  const secretarias = ref([
    {
      id: '1',
      nome: 'Secretaria Municipal de Saúde',
      sigla: 'SMS',
      descricao: 'Gestão da rede pública de saúde, vigilância epidemiológica e atenção primária em Vitória da Conquista.',
      responsavelNome: 'Dra. Ana Paula Oliveira',
      responsavelEmail: 'ana.oliveira@pmvc.ba.gov.br',
      telefone: '(77) 3429-7000',
      endereco: 'Av. Maceió, 98 - Brasil, Vitória da Conquista - BA',
      ativa: true,
      servidoresCount: 540,
      gestoresCount: 4,
      cursosOfertadosCount: 18,
      taxaAdesao: 88,
      corIdentificacao: '#10B981',
      createdAt: '2025-01-15T08:00:00Z',
    },
    {
      id: '2',
      nome: 'Secretaria Municipal de Educação',
      sigla: 'SMED',
      descricao: 'Coordenação da rede municipal de ensino infantil e fundamental e formação continuada de educadores.',
      responsavelNome: 'Prof. Carlos Eduardo Santos',
      responsavelEmail: 'carlos.santos@pmvc.ba.gov.br',
      telefone: '(77) 3429-8000',
      endereco: 'Rua Siqueira Campos, 184 - Centro, Vitória da Conquista - BA',
      ativa: true,
      servidoresCount: 620,
      gestoresCount: 5,
      cursosOfertadosCount: 22,
      taxaAdesao: 94,
      corIdentificacao: '#3B82F6',
      createdAt: '2025-01-15T08:30:00Z',
    },
    {
      id: '3',
      nome: 'Secretaria Municipal de Transparência, Controle e Prevenção à Corrupção',
      sigla: 'SETP',
      descricao: 'Promoção da integridade pública, controle interno, ouvidoria e governança participativa.',
      responsavelNome: 'Dr. Roberto Mendes',
      responsavelEmail: 'roberto.mendes@pmvc.ba.gov.br',
      telefone: '(77) 3429-9000',
      endereco: 'Praça Joaquim Correia, 55 - Centro, Vitória da Conquista - BA',
      ativa: true,
      servidoresCount: 85,
      gestoresCount: 2,
      cursosOfertadosCount: 8,
      taxaAdesao: 91,
      corIdentificacao: '#8B5CF6',
      createdAt: '2025-01-16T09:00:00Z',
    },
    {
      id: '4',
      nome: 'Secretaria Municipal de Finanças e Execução Orçamentária',
      sigla: 'SEFIN',
      descricao: 'Administração tributária, arrecadação, contabilidade pública e planejamento financeiro municipal.',
      responsavelNome: 'Mariana Lima Castro',
      responsavelEmail: 'mariana.castro@pmvc.ba.gov.br',
      telefone: '(77) 3429-6500',
      endereco: 'Praça Joaquim Correia, 55 - Centro, Vitória da Conquista - BA',
      ativa: true,
      servidoresCount: 110,
      gestoresCount: 3,
      cursosOfertadosCount: 6,
      taxaAdesao: 82,
      corIdentificacao: '#F59E0B',
      createdAt: '2025-01-18T10:15:00Z',
    },
    {
      id: '5',
      nome: 'Secretaria Municipal de Meio Ambiente',
      sigla: 'SEMMA',
      descricao: 'Preservação de parques municipais, licenciamento ambiental, arborização urbana e educação ambiental.',
      responsavelNome: 'Eng. Fernando Rocha',
      responsavelEmail: 'fernando.rocha@pmvc.ba.gov.br',
      telefone: '(77) 3429-5200',
      endereco: 'Parque de Exposição Teopompo de Almeida, Vitória da Conquista - BA',
      ativa: true,
      servidoresCount: 75,
      gestoresCount: 2,
      cursosOfertadosCount: 4,
      taxaAdesao: 76,
      corIdentificacao: '#059669',
      createdAt: '2025-02-01T11:00:00Z',
    },
    {
      id: '6',
      nome: 'Secretaria Municipal de Mobilidade Urbana',
      sigla: 'SEMOB',
      descricao: 'Gestão do trânsito municipal, transporte público, acessibilidade e planejamento viário.',
      responsavelNome: 'Juliana Barbosa Silva',
      responsavelEmail: 'juliana.silva@pmvc.ba.gov.br',
      telefone: '(77) 3424-2800',
      endereco: 'Rua Coronel Gugé, 400 - Centro, Vitória da Conquista - BA',
      ativa: true,
      servidoresCount: 95,
      gestoresCount: 2,
      cursosOfertadosCount: 5,
      taxaAdesao: 79,
      corIdentificacao: '#EC4899',
      createdAt: '2025-02-10T14:20:00Z',
    },
    {
      id: '7',
      nome: 'Secretaria Municipal de Desenvolvimento Social',
      sigla: 'SEMDES',
      descricao: 'Execução das políticas do SUAS, atendimento a famílias em vulnerabilidade, CRAS e CREAS.',
      responsavelNome: 'Patrícia Alencar',
      responsavelEmail: 'patricia.alencar@pmvc.ba.gov.br',
      telefone: '(77) 3429-8600',
      endereco: 'Av. Juracy Magalhães, 1200 - Felícia, Vitória da Conquista - BA',
      ativa: true,
      servidoresCount: 190,
      gestoresCount: 4,
      cursosOfertadosCount: 11,
      taxaAdesao: 87,
      corIdentificacao: '#F97316',
      createdAt: '2025-02-15T15:45:00Z',
    },
    {
      id: '8',
      nome: 'Coordenação Executiva de Tecnologia da Informação',
      sigla: 'CETI',
      descricao: 'Núcleo de inovação tecnológica, infraestrutura de TIC, desenvolvimento do AVA Conquista Saberes e governança de dados.',
      responsavelNome: 'Gustavo Henrique Vasconcelos',
      responsavelEmail: 'gustavo.ceti@pmvc.ba.gov.br',
      telefone: '(77) 3429-9999',
      endereco: 'Praça Joaquim Correia, 55 - Centro, Vitória da Conquista - BA',
      ativa: true,
      servidoresCount: 42,
      gestoresCount: 3,
      cursosOfertadosCount: 15,
      taxaAdesao: 98,
      corIdentificacao: '#6366F1',
      createdAt: '2025-01-01T00:00:00Z',
    },
  ])

  // Ações de CRUD Mockadas
  async function fetchSecretarias() {
    loading.value = true
    try {
      // Simula delay de rede
      await new Promise((resolve) => setTimeout(resolve, 300))
      return secretarias.value
    } finally {
      loading.value = false
    }
  }

  async function createSecretaria(payload) {
    loading.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 400))
      const newSecretaria = {
        id: String(Date.now()),
        nome: payload.nome,
        sigla: payload.sigla.toUpperCase(),
        descricao: payload.descricao || '',
        responsavelNome: payload.responsavelNome || '',
        responsavelEmail: payload.responsavelEmail || '',
        telefone: payload.telefone || '',
        endereco: payload.endereco || '',
        ativa: payload.ativa !== undefined ? payload.ativa : true,
        corIdentificacao: payload.corIdentificacao || '#1E40AF',
        servidoresCount: 0,
        gestoresCount: 0,
        cursosOfertadosCount: 0,
        taxaAdesao: 0,
        createdAt: new Date().toISOString(),
      }
      secretarias.value.unshift(newSecretaria)
      return newSecretaria
    } finally {
      loading.value = false
    }
  }

  async function updateSecretaria(id, payload) {
    loading.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 400))
      const index = secretarias.value.findIndex((s) => s.id === id)
      if (index !== -1) {
        secretarias.value[index] = {
          ...secretarias.value[index],
          ...payload,
          sigla: payload.sigla ? payload.sigla.toUpperCase() : secretarias.value[index].sigla,
          updatedAt: new Date().toISOString(),
        }
        return secretarias.value[index]
      }
    } finally {
      loading.value = false
    }
  }

  async function toggleStatus(id) {
    const item = secretarias.value.find((s) => s.id === id)
    if (item) {
      item.ativa = !item.ativa
    }
  }

  async function deleteSecretaria(id) {
    loading.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 400))
      secretarias.value = secretarias.value.filter((s) => s.id !== id)
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
