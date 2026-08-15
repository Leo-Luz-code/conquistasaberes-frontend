<template>
  <div class="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white font-sans">
    <!-- ========================================================= -->
    <!-- COLUNA ESQUERDA: HERO INSTITUCIONAL (AZUL PMVC) -->
    <!-- ========================================================= -->
    <div
      class="lg:col-span-6 xl:col-span-7 bg-gradient-to-br from-[#0F4C81] via-[#0D416E] to-[#0A2F50] text-white p-6 sm:p-10 lg:p-14 flex flex-col justify-between relative overflow-hidden"
    >
      <!-- Efeito sutil de background -->
      <div
        class="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none"
      ></div>

      <!-- Topo: Brasão e Nome Oficial -->
      <router-link to="/landing" class="relative z-10 flex items-center gap-3 group w-fit">
        <img
          src="~assets/images/brasao-pmvc-2025.png"
          alt="Brasão PMVC"
          class="h-12 sm:h-14 drop-shadow-md group-hover:scale-105 transition-transform"
        />
        <div class="flex flex-col">
          <span class="font-extrabold text-white text-base sm:text-lg leading-tight tracking-tight">
            Prefeitura Municipal
          </span>
          <span class="text-xs sm:text-sm text-blue-200 font-medium group-hover:text-amber-300 transition-colors">
            Vitória da Conquista - BA • Portal Institucional
          </span>
        </div>
      </router-link>

      <!-- Centro: Título, Badge e Descrição -->
      <div class="relative z-10 my-10 lg:my-0 max-w-xl space-y-4">
        <!-- Badge Plataforma Institucional -->
        <div
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2B705]/15 border border-[#F2B705]/40 text-[#F2B705] text-xs font-bold shadow-sm"
        >
          <q-icon name="school" size="14px" />
          <span>Plataforma Institucional</span>
        </div>

        <!-- Headline AVA UniVC -->
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none">
          AVA <span class="text-[#F2B705]">UniVC</span>
        </h1>

        <!-- Subtítulo -->
        <h2 class="text-lg sm:text-xl font-bold text-white leading-snug">
          Universidade do Servidor Público de Vitória da Conquista
        </h2>

        <!-- Parágrafo -->
        <p class="text-xs sm:text-sm sm:leading-relaxed text-blue-100/90 max-w-lg">
          Acesse sua jornada de desenvolvimento profissional na Universidade do Servidor Público.
          Cursos, trilhas, certificados e a assistente Norminha - tudo em um só lugar.
        </p>
      </div>

      <!-- Rodapé da Coluna Hero: 3 Cards de Métricas -->
      <div class="relative z-10 grid grid-cols-3 gap-3 sm:gap-4 max-w-md">
        <div
          class="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 text-center border border-white/15 shadow-sm"
        >
          <span class="text-xl sm:text-2xl font-extrabold text-white block leading-none mb-1">{{
            stats.cursosLabel
          }}</span>
          <span class="text-[11px] sm:text-xs text-blue-200 font-medium">Cursos</span>
        </div>

        <div
          class="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 text-center border border-white/15 shadow-sm"
        >
          <span class="text-xl sm:text-2xl font-extrabold text-white block leading-none mb-1">{{
            stats.trilhasLabel
          }}</span>
          <span class="text-[11px] sm:text-xs text-blue-200 font-medium">Trilhas</span>
        </div>

        <div
          class="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 text-center border border-white/15 shadow-sm"
        >
          <span class="text-xl sm:text-2xl font-extrabold text-white block leading-none mb-1">{{
            stats.modalidadeLabel
          }}</span>
          <span class="text-[11px] sm:text-xs text-blue-200 font-medium">Digital</span>
        </div>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- COLUNA DIREITA: FORMULÁRIO DE LOGIN -->
    <!-- ========================================================= -->
    <div class="lg:col-span-6 xl:col-span-5 bg-white flex items-center justify-center p-6 sm:p-12">
      <div class="w-full max-w-md space-y-6">
        <!-- Cabeçalho do Form -->
        <div class="space-y-1">
          <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Bem-vindo(a) de volta
          </h2>
          <p class="text-xs sm:text-sm text-slate-500">
            Faça login com sua matrícula ou e-mail institucional.
          </p>
        </div>

        <!-- Formulário -->
        <q-form @submit.prevent.stop="login" class="space-y-4">
          <!-- Campo 1: Matrícula ou E-mail -->
          <div>
            <label class="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              Matrícula ou e-mail institucional
            </label>
            <q-input
              outlined
              dense
              v-model="data.login"
              placeholder="maria.oliveira@pmvc.ba.gov.br"
              class="login-input"
              :rules="[(val) => !!val || 'Campo obrigatório']"
              lazy-rules
              hide-bottom-space
            />
          </div>

          <!-- Campo 2: Senha -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="text-xs sm:text-sm font-semibold text-slate-700"> Senha </label>
              <button
                type="button"
                @click="abrirEsqueciSenha"
                class="text-xs font-semibold text-[#0F4C81] hover:underline focus:outline-none"
              >
                Esqueci minha senha
              </button>
            </div>
            <q-input
              outlined
              dense
              v-model="data.senha"
              :type="isPwdVisible ? 'text' : 'password'"
              placeholder="••••••••"
              class="login-input"
              :rules="[(val) => !!val || 'Campo obrigatório']"
              lazy-rules
              hide-bottom-space
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwdVisible ? 'visibility' : 'visibility_off'"
                  class="cursor-pointer text-slate-400 hover:text-slate-600 transition-colors"
                  @click="isPwdVisible = !isPwdVisible"
                  size="18px"
                />
              </template>
            </q-input>
          </div>

          <!-- Botão Entrar -->
          <div class="pt-2">
            <q-btn
              type="submit"
              :loading="loading"
              unelevated
              no-caps
              class="w-full !py-3.5 text-sm font-extrabold text-white !bg-[#0F4C81] hover:!bg-[#0C3B66] shadow-md transition-all active:scale-[0.99] rounded-xl flex items-center justify-center gap-2"
            >
              <span>Entrar no AVA</span>
              <q-icon name="arrow_forward" size="18px" />
              <template v-slot:loading>
                <q-spinner-dots class="on-left" />
                Autenticando...
              </template>
            </q-btn>
          </div>

          <!-- Divisor OU -->
          <div class="relative flex py-2 items-center">
            <div class="flex-grow border-t border-slate-200"></div>
            <span
              class="flex-shrink mx-4 text-xs font-medium text-slate-400 uppercase tracking-wider"
              >OU</span
            >
            <div class="flex-grow border-t border-slate-200"></div>
          </div>

          <!-- Botão Conta Institucional (SSO) -->
          <div>
            <q-btn
              outline
              no-caps
              @click="loginInstitucional"
              class="w-full !py-3 text-xs sm:text-sm font-bold text-slate-700 border-slate-200 hover:bg-slate-50 transition-colors rounded-xl flex items-center justify-center gap-2"
            >
              <q-icon name="apartment" size="18px" class="text-slate-600" />
              <span>Acessar com conta institucional</span>
            </q-btn>
          </div>
        </q-form>

        <!-- Termo / Rodapé LGPD -->
        <div class="pt-4 text-center">
          <p class="text-[11px] text-slate-400 leading-relaxed max-w-sm mx-auto">
            Ao continuar, você concorda com a Política de Uso da plataforma e com a Lei Geral de
            Proteção de Dados (LGPD).
          </p>
        </div>
      </div>
    </div>

    <!-- Modal Esqueci Minha Senha -->
    <q-dialog v-model="modalEsqueciSenha">
      <q-card class="p-6 rounded-2xl max-w-md w-full font-sans">
        <div class="flex items-center gap-3 mb-4">
          <div
            class="w-10 h-10 rounded-xl bg-blue-50 text-[#0F4C81] flex items-center justify-center"
          >
            <q-icon name="lock_reset" size="22px" />
          </div>
          <div>
            <h3 class="text-base font-extrabold text-slate-900">Recuperação de Acesso</h3>
            <p class="text-xs text-slate-500">Suporte Técnico UniVC • CETI</p>
          </div>
        </div>

        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
          Para redefinir sua senha de acesso ou atualizar seus dados funcionais, entre em contato
          com a equipe de suporte da Coordenação de TI (CETI):
        </p>

        <div
          class="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-xs text-slate-700 mb-6"
        >
          <div class="flex items-center gap-2">
            <q-icon name="mail" size="16px" class="text-[#0F4C81]" />
            <span><strong>E-mail:</strong> suporte.ceti@pmvc.ba.gov.br</span>
          </div>
          <div class="flex items-center gap-2">
            <q-icon name="phone" size="16px" class="text-[#0F4C81]" />
            <span><strong>Ramal Interno:</strong> 2100 / 2105</span>
          </div>
        </div>

        <div class="flex justify-end">
          <q-btn
            unelevated
            label="Entendi"
            color="primary"
            class="rounded-xl font-bold text-xs"
            v-close-popup
            no-caps
          />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const $q = useQuasar()

const isPwdVisible = ref(false)
const loading = ref(false)
const modalEsqueciSenha = ref(false)

const stats = ref({
  cursosLabel: '+50',
  trilhasLabel: '12',
  modalidadeLabel: '100%',
})

const data = ref({
  login: '',
  senha: '',
})

async function carregarEstatisticasPublicas() {
  try {
    const res = await api.get('/auth/public-stats')
    if (res.data) {
      stats.value.cursosLabel = res.data.cursosLabel || '+50'
      stats.value.trilhasLabel = res.data.trilhasLabel || '12'
      stats.value.modalidadeLabel = res.data.modalidadeLabel || '100%'
    }
  } catch (err) {
    // Mantém os fallbacks padrão
  }
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/')
  }
  carregarEstatisticasPublicas()
})

function abrirEsqueciSenha() {
  modalEsqueciSenha.value = true
}

function loginInstitucional() {
  $q.notify({
    color: 'primary',
    icon: 'info',
    message: 'Insira sua matrícula ou e-mail institucional e senha acima para login integrado.',
  })
}

async function login() {
  loading.value = true
  try {
    await authStore.doLogin(data.value)
    const toPath = route.query.to || '/'
    router.push(toPath)
  } catch (error) {
    console.error('Erro no login:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
:deep(.login-input .q-field__control) {
  border-radius: 0.75rem;
  background-color: #f8fafc;
  border-color: #e2e8f0;
  transition: all 0.2s ease;
}

:deep(.login-input .q-field__control:hover) {
  border-color: #cbd5e1;
}

:deep(.login-input.q-field--focused .q-field__control) {
  background-color: #ffffff;
  border-color: #0f4c81 !important;
  box-shadow: 0 0 0 3px rgba(15, 76, 129, 0.1);
}
</style>
