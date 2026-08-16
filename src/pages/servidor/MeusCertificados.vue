<template>
  <q-page class="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 font-sans">
    <div>
      <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900">Meus Certificados</h1>
      <p class="text-xs sm:text-sm text-slate-500 mt-1">Todos os certificados emitidos pela Universidade do Servidor Público - UniVC.</p>
    </div>

    <div v-if="loading" class="flex justify-center py-16">
      <q-spinner-dots color="primary" size="50px" />
    </div>

    <div v-else-if="certificates.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="cert in certificates" :key="cert.id" class="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 overflow-hidden">
        
        <!-- Cabeçalho do Card -->
        <div class="flex items-start gap-3 min-w-0">
          <div class="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
            <q-icon name="military_tech" size="26px" />
          </div>
          <div class="min-w-0 flex-1">
            <h3 class="font-bold text-slate-900 text-sm sm:text-base leading-snug break-words">
              {{ cert.courseTitle }}
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">
              Emitido em {{ formatDate(cert.issuedAt) }} · {{ cert.cargaHoraria }}h
            </p>
          </div>
        </div>

        <!-- Código de Validação -->
        <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 min-w-0">
          <span class="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Código de Autenticidade</span>
          <span class="font-mono font-bold text-slate-700 text-xs break-all block mt-0.5">
            {{ cert.codigoValidacao }}
          </span>
        </div>

        <!-- Ações (Responsivas: Empilhadas no mobile, lado a lado no desktop) -->
        <div v-if="cert.status === 'EMITTED'" class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2">
          <router-link 
            :to="`/validar-certificado?hash=${encodeURIComponent(cert.codigoValidacao)}`" 
            target="_blank" 
            class="flex-1 text-center inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-white border border-slate-300 hover:border-pmvc-blue text-slate-700 font-bold rounded-xl text-xs transition-colors"
          >
            <q-icon name="visibility" size="16px" /> Visualizar
          </router-link>
          
          <a 
            :href="urlPdf(cert.codigoValidacao)" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="flex-1 text-center inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-pmvc-blue hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow"
          >
            <q-icon name="download" size="16px" /> Baixar PDF
          </a>
        </div>

        <div v-else class="pt-2">
          <q-badge rounded class="bg-red-50 text-red-600 px-3 py-1.5 normal-case font-medium text-xs">
            Certificado revogado
          </q-badge>
        </div>

      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-2xl border border-dashed border-slate-300 p-8 sm:p-12 text-center space-y-3">
      <q-icon name="workspace_premium" size="56px" class="text-slate-300" />
      <h3 class="font-bold text-slate-700 text-lg">Nenhum certificado emitido ainda</h3>
      <p class="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
        Conclua todas as aulas de um curso no catálogo para gerar automaticamente seu certificado de capacitação com hash de autenticidade.
      </p>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

const $q = useQuasar()
const loading = ref(false)
const certificates = ref([])

async function carregarCertificados() {
  loading.value = true
  try { 
    const { data } = await api.get('/certificates/my-certificates') 
    certificates.value = data 
  } catch (error) { 
    certificates.value = [] 
    const message = error?.response?.data?.message 
    $q.notify({ 
      type: 'negative', 
      message: Array.isArray(message) ? message.join(', ') : message || 'Não foi possível carregar seus certificados.' 
    }) 
  } finally { 
    loading.value = false 
  }
}

function formatDate(dateStr) { 
  return dateStr ? new Date(dateStr).toLocaleDateString('pt-BR') : '—' 
}

function urlPdf(codigoValidacao) { 
  const baseUrl = (api.defaults.baseURL || '').replace(/\/+$/, '') 
  return `${baseUrl}/certificates/download/${encodeURIComponent(codigoValidacao)}` 
}

onMounted(carregarCertificados)
</script>