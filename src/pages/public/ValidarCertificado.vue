<template>
  <div
    class="min-h-screen bg-slate-50 flex flex-col justify-between font-sans selection:bg-amber-400 selection:text-slate-900"
  >
    <!-- Header Público -->
    <header class="bg-white border-b border-slate-200 py-4 px-6 shadow-sm">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <router-link to="/landing" class="flex items-center gap-3 group">
          <img
            src="~assets/images/brasao-pmvc-2025.png"
            alt="Brasão PMVC"
            class="h-10 group-hover:scale-105 transition-transform"
          />
          <div>
            <h1 class="text-lg font-extrabold text-[#0F4C81] leading-none">
              AVA <span class="text-[#F2B705]">UniVC</span>
            </h1>
            <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
              Validação Pública de Certificados
            </p>
          </div>
        </router-link>

        <div class="flex items-center gap-3">
          <router-link
            to="/landing"
            class="hidden sm:inline-flex text-xs font-bold text-slate-600 hover:text-[#0F4C81]"
          >
            Portal Institucional
          </router-link>
          <router-link
            to="/login"
            class="text-xs font-bold text-white bg-[#0F4C81] hover:bg-[#0C3B66] px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <q-icon name="login" size="14px" />
            <span>Portal do Servidor</span>
          </router-link>
        </div>
      </div>
    </header>

    <!-- Conteúdo Principal -->
    <main class="max-w-3xl mx-auto w-full px-4 py-12 flex-1 flex flex-col justify-center">
      <div class="text-center mb-8">
        <div
          class="w-16 h-16 bg-blue-100/80 text-[#0F4C81] rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-blue-200"
        >
          <q-icon name="verified_user" size="36px" />
        </div>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Autenticidade de Certificado Oficial
        </h2>
        <p class="text-slate-500 text-xs sm:text-sm mt-2 max-w-lg mx-auto leading-relaxed">
          Digite o código de validação ou hash constante no certificado emitido pela Universidade do
          Servidor Público (PMVC / CETI).
        </p>
      </div>

      <!-- Card de Busca -->
      <div class="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <form @submit.prevent="handleValidate" class="flex flex-col sm:flex-row gap-3">
          <q-input
            outlined
            dense
            v-model="hashInput"
            placeholder="Ex: HASH-8291-SETP-2026 ou código alfanumérico"
            class="flex-1 text-base validator-input"
            hide-bottom-space
            :rules="[(val) => !!val || 'Informe o código hash do certificado']"
          >
            <template v-slot:prepend>
              <q-icon name="qr_code" class="text-[#0F4C81]" />
            </template>
            <template v-slot:append v-if="hashInput">
              <q-icon name="close" class="cursor-pointer text-slate-400" @click="limparBusca" />
            </template>
          </q-input>

          <q-btn
            type="submit"
            label="VERIFICAR"
            color="primary"
            icon="search"
            class="!px-7 !py-3.5 font-extrabold bg-[#0F4C81] text-white rounded-xl shadow-md"
            unelevated
            no-caps
            :loading="certificateStore.loading"
          />
        </form>

        <!-- Resultado Positivo -->
        <div
          v-if="result && (result.isValid || result.valid)"
          class="bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-200 rounded-2xl p-6 sm:p-7 animate-fade-in shadow-sm space-y-6"
        >
          <div class="flex items-center justify-between border-b border-emerald-200/80 pb-4">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow"
              >
                <q-icon name="check" size="24px" />
              </div>
              <div>
                <h3 class="text-lg font-extrabold text-emerald-900 leading-tight">
                  Documento Autêntico e Válido!
                </h3>
                <span class="text-xs text-emerald-700 font-medium">
                  Registro oficial confirmado na base de dados da Prefeitura Municipal
                </span>
              </div>
            </div>
            <span
              class="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-extrabold uppercase"
            >
              Emitido
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700">
            <div class="bg-white/80 p-3.5 rounded-xl border border-emerald-100">
              <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider"
                >Servidor Público</span
              >
              <span class="font-extrabold text-slate-900 text-sm mt-0.5 block">
                {{ result.servidor || result.certificate?.user?.nome || 'Servidor Municipal' }}
              </span>
            </div>

            <div class="bg-white/80 p-3.5 rounded-xl border border-emerald-100">
              <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider"
                >CPF Registrado</span
              >
              <span class="font-extrabold text-slate-900 text-sm mt-0.5 block">
                {{ result.cpfMascarado || formatCpf(result.certificate?.user?.cpf) }}
              </span>
            </div>

            <div class="bg-white/80 p-3.5 rounded-xl border border-emerald-100">
              <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider"
                >Cargo & Lotação</span
              >
              <span class="font-extrabold text-slate-900 text-sm mt-0.5 block">
                {{ result.cargo || result.certificate?.user?.cargo || 'Servidor' }} •
                {{ result.secretaria || 'PMVC' }}
              </span>
            </div>

            <div class="bg-white/80 p-3.5 rounded-xl border border-emerald-100">
              <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider"
                >Curso Concluído</span
              >
              <span class="font-extrabold text-slate-900 text-sm mt-0.5 block">
                {{ result.curso || result.certificate?.course?.titulo }}
              </span>
            </div>

            <div class="bg-white/80 p-3.5 rounded-xl border border-emerald-100">
              <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider"
                >Carga Horária</span
              >
              <span class="font-extrabold text-slate-900 text-sm mt-0.5 block">
                {{ result.cargaHoraria || result.certificate?.course?.cargaHoraria || 20 }} Horas
                Atestadas
              </span>
            </div>

            <div class="bg-white/80 p-3.5 rounded-xl border border-emerald-100">
              <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider"
                >Data de Emissão</span
              >
              <span class="font-extrabold text-slate-900 text-sm mt-0.5 block">
                {{ formatDate(result.issuedAt || result.certificate?.issuedAt) }}
              </span>
            </div>
          </div>

          <div class="p-3.5 bg-emerald-100/50 rounded-xl flex items-center justify-between text-xs">
            <span class="text-emerald-900 font-mono">
              <strong>Hash:</strong> {{ result.codigoValidacao || hashInput }}
            </span>
            <span class="text-emerald-800 text-[11px] font-bold">
              {{ result.emissor || 'PMVC • CETI / SETP' }}
            </span>
          </div>

          <div class="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span class="text-[11px] text-slate-500 text-center sm:text-left">
              Documento emitido digitalmente em conformidade com o Decreto Municipal.
            </span>
          </div>
        </div>

        <!-- Resultado Negativo -->
        <div
          v-else-if="searched && (!result || (!result.isValid && !result.valid))"
          class="bg-rose-50 border-2 border-rose-200 rounded-2xl p-8 animate-fade-in text-center space-y-3"
        >
          <div
            class="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-sm"
          >
            <q-icon name="error_outline" size="36px" />
          </div>
          <h3 class="text-lg font-extrabold text-rose-900">Certificado Não Encontrado</h3>
          <p class="text-xs sm:text-sm text-rose-700 max-w-md mx-auto leading-relaxed">
            O código <strong class="font-mono">{{ hashInput }}</strong> não corresponde a nenhum
            documento válido emitido pela Prefeitura Municipal de Vitória da Conquista.
          </p>
          <p class="text-[11px] text-slate-500">
            Verifique se os caracteres foram digitados corretamente ou se o documento foi revogado
            pela administração.
          </p>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
      Prefeitura Municipal de Vitória da Conquista • Central de TI (CETI) & Secretaria de Gestão e
      Inovação (SETP)
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCertificateStore } from 'src/stores/certificateStore'
import { useQuasar } from 'quasar'

const route = useRoute()
const certificateStore = useCertificateStore()
const $q = useQuasar()

const hashInput = ref('')
const searched = ref(false)
const result = ref(null)

onMounted(() => {
  const code = route.query.hash || route.query.codigo || route.query.passaporte || route.query.q
  if (code) {
    hashInput.value = String(code).trim()
    handleValidate()
  }
})

function limparBusca() {
  hashInput.value = ''
  result.value = null
  searched.value = false
}

const formatCpf = (cpf) => {
  if (!cpf) return '***.***.***-**'
  const clean = cpf.replace(/\D/g, '')
  if (clean.length === 11) {
    return `${clean.substring(0, 3)}.***.***-${clean.substring(9)}`
  }
  return cpf
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'Não registrado'
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

async function handleValidate() {
  if (!hashInput.value || !hashInput.value.trim()) return
  searched.value = true
  result.value = null
  try {
    const data = await certificateStore.validateCertificate(hashInput.value)
    result.value = data
  } catch (err) {
    result.value = { isValid: false, valid: false }
  }
}
</script>

<style scoped>
:deep(.validator-input .q-field__control) {
  border-radius: 0.75rem;
  background-color: #f8fafc;
}
</style>
