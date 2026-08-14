<template>
  <q-layout view="lHh Lpr lFf" class="bg-slate-50 font-sans">
    <q-header
      class="bg-white text-pmvc-dark border-b border-slate-200 h-20 flex items-center shadow-none"
    >
      <q-toolbar class="!px-3 sm:px-8 flex justify-between">
        <div class="flex items-center gap-4">
          <q-btn
            flat
            dense
            round
            icon="menu"
            class="text-pmvc-blue hover:bg-slate-100"
            @click="leftDrawerOpen = !leftDrawerOpen"
          />
          <!-- Barra de Busca Mockup -->
          <div
            class="hidden md:flex items-center bg-slate-50 border border-slate-200 rounded-full px-4 py-2 w-96"
          >
            <q-icon name="search" class="text-slate-400 mr-2" size="20px" />
            <input
              type="text"
              placeholder="Buscar cursos, trilhas, materiais..."
              class="bg-transparent outline-none w-full text-sm text-slate-700"
            />
          </div>
        </div>

        <div class="flex items-center gap-3 sm:gap-5">
          <div class="flex items-center gap-3">
            <!-- Botões TTS Globais -->
            <div class="flex items-center">
              <div
                v-if="ouvindo"
                class="flex items-center gap-1 bg-slate-100 rounded-full p-1 mr-2"
              >
                <!-- Pausar -->
                <q-btn
                  v-if="!pausado"
                  @click="pausarLeitura"
                  round
                  flat
                  dense
                  icon="pause"
                  class="text-amber-600 bg-white shadow-sm hover:bg-amber-50 transition-colors"
                  size="sm"
                >
                  <q-tooltip class="bg-amber-600">Pausar Leitura</q-tooltip>
                </q-btn>
                <!-- Continuar -->
                <q-btn
                  v-else
                  @click="continuarLeitura"
                  round
                  flat
                  dense
                  icon="play_arrow"
                  class="text-emerald-600 bg-white shadow-sm hover:bg-emerald-50 transition-colors"
                  size="sm"
                >
                  <q-tooltip class="bg-emerald-600">Continuar Leitura</q-tooltip>
                </q-btn>
                <!-- Parar -->
                <q-btn
                  @click="pararLeitura"
                  round
                  flat
                  dense
                  icon="stop"
                  class="text-red-500 bg-white shadow-sm hover:bg-red-50 transition-colors"
                  size="sm"
                >
                  <q-tooltip class="bg-red-600">Parar Leitura</q-tooltip>
                </q-btn>
              </div>
              <q-btn
                v-else
                @click="ouvirPagina"
                round
                flat
                dense
                icon="record_voice_over"
                class="text-pmvc-blue mr-2 hover:bg-slate-100"
              >
                <q-tooltip class="bg-pmvc-blue">Ouvir página (Acessibilidade)</q-tooltip>
              </q-btn>
            </div>
            <div class="flex flex-col items-end gt-xs">
              <span class="text-pmvc-blue font-semibold text-sm leading-none mb-1">
                {{ userName }}
              </span>
              <span class="text-xs text-pmvc-gray capitalize">
                {{ acesso }}
              </span>
            </div>
            <q-btn round flat dense class="text-none user-avatar-btn">
              <div
                class="h-10 w-10 bg-pmvc-blue rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm hover:bg-pmvc-lightBlue transition-colors"
              >
                {{ getUserInitial(userName) }}
              </div>
              <q-menu
                anchor="bottom right"
                self="top right"
                class="shadow-xl border border-slate-100 rounded-xl mt-2"
              >
                <q-list style="min-width: 150px">
                  <q-item
                    clickable
                    v-close-popup
                    @click="profile"
                    class="text-pmvc-dark hover:text-pmvc-blue hover:bg-slate-50"
                  >
                    <q-item-section avatar>
                      <q-icon name="person_outline" size="xs" />
                    </q-item-section>
                    <q-item-section>Meu Perfil</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="280"
      class="bg-[#0F4C81] text-white"
    >
      <div class="flex flex-col h-full">
        <!-- Logo Area -->
        <div class="p-6 flex items-center gap-3 mb-2">
          <q-img src="~assets/images/brasao-pmvc-2025.png" alt="Logo PMVC" class="w-10 h-12" />
          <div class="flex flex-col">
            <span class="font-extrabold text-white text-lg leading-tight">AVA UniVC</span>
            <span class="text-[11px] text-blue-200">Universidade do Servidor</span>
          </div>
        </div>

        <!-- Scrollable Links -->
        <q-scroll-area class="flex-1">
          <q-list class="space-y-1">
            <router-link
              v-for="link in links"
              :key="link.title"
              :to="link.link"
              class="flex items-center px-4 py-3 mx-4 rounded-xl text-blue-100 transition-all duration-200 group hover:bg-white/10 hover:text-white"
              exact-active-class="!bg-[#F2B705] !text-[#0F4C81] font-bold shadow-md"
            >
              <q-icon
                :name="link.icon"
                size="20px"
                class="mr-3 opacity-80 group-hover:opacity-100 transition-opacity"
                :class="{ '!opacity-100 !text-[#0F4C81]': isActivePath(link.link) }"
              />
              <span class="text-sm">{{ link.title }}</span>
            </router-link>
          </q-list>
        </q-scroll-area>

        <!-- Footer Area -->
        <div class="mt-auto px-6 pb-6 pt-4 border-t border-white/10">
          <q-btn
            flat
            no-caps
            class="w-full justify-start px-0 text-blue-100 hover:text-white mb-4"
            @click="requestLogout"
          >
            <q-icon name="logout" size="20px" class="mr-3" />
            <span class="text-sm font-semibold">Sair</span>
          </q-btn>

          <p class="text-[10px] text-blue-300 m-0 leading-tight">
            © Prefeitura Municipal de Vitória da Conquista
          </p>
        </div>
      </div>
    </q-drawer>

    <LogoutModal v-model="showModal" @confirm="logout" />

    <q-page-container class="bg-slate-50">
      <router-view />
    </q-page-container>

    <!-- Assistente Flutuante da Norminha IA -->
    <NorminhaFloating />
  </q-layout>
</template>

<script setup>
import { onMounted, onBeforeUnmount, computed, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from 'src/stores/authStore'
import LogoutModal from 'src/components/modals/ConfirmLogout.vue'
import NorminhaFloating from 'src/components/NorminhaFloating.vue'

const props = defineProps({
  isOpen: Boolean,
})

const emit = defineEmits(['update:isOpen'])

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const leftDrawerOpen = ref(false)
const showModal = ref(false)

const acesso = ref('')
const userName = ref('')
const links = ref([])

const getUserInitial = (name) => {
  return name ? name.charAt(0).toUpperCase() : 'U'
}

const isActivePath = (link) => {
  const normalizedPath = route.path.replace(/\/$/, '') || '/'
  const normalizedLink = link.replace(/\/$/, '') || '/'
  return normalizedPath === normalizedLink
}

const configurarMenu = () => {
  userName.value = authStore.firstName || 'Servidor'
  acesso.value = authStore.roleLabel || 'Servidor Municipal'

  if (authStore.isAdmin) {
    links.value = [
      { title: 'Administração', icon: 'dashboard', link: '/admin/dashboard' },
      { title: 'Painel Executivo', icon: 'analytics', link: '/gestor/dashboard' },
      { title: 'Catálogo de Cursos', icon: 'school', link: '/servidor/cursos' },
      { title: 'Fórum', icon: 'forum', link: '/servidor/forum' },
      { title: 'Meu Perfil', icon: 'person', link: '/perfil' },
    ]
  } else if (authStore.isGestor) {
    links.value = [
      { title: 'Painel Executivo', icon: 'analytics', link: '/gestor/dashboard' },
      { title: 'Gestão de Cursos', icon: 'edit_note', link: '/admin/cursos' },
      { title: 'Trilhas de Aprendizagem', icon: 'alt_route', link: '/servidor/trilhas' },
      { title: 'Catálogo de Cursos', icon: 'school', link: '/servidor/cursos' },
      { title: 'Meus Certificados', icon: 'workspace_premium', link: '/servidor/certificados' },
      { title: 'Notícias UniVC', icon: 'newspaper', link: '/servidor/noticias' },
      { title: 'Fórum', icon: 'forum', link: '/servidor/forum' },
      { title: 'Meu Perfil', icon: 'person', link: '/perfil' },
    ]
  } else {
    links.value = [
      { title: 'Início', icon: 'home', link: '/servidor/dashboard' },
      { title: 'Trilhas de Aprendizagem', icon: 'alt_route', link: '/servidor/trilhas' },
      { title: 'Cursos', icon: 'school', link: '/servidor/cursos' },
      { title: 'Eventos e Palestras', icon: 'event', link: '/servidor/eventos' },
      { title: 'Biblioteca', icon: 'menu_book', link: '/servidor/biblioteca' },
      { title: 'Passaporte Digital', icon: 'badge', link: '/servidor/passaporte' },
      { title: 'Fórum', icon: 'forum', link: '/servidor/forum' },
      { title: 'Certificados', icon: 'workspace_premium', link: '/servidor/certificados' },
      { title: 'Notícias UniVC', icon: 'newspaper', link: '/servidor/noticias' },
      { title: 'Norminha', icon: 'star', link: '/servidor/norminha' },
      { title: 'Ranking & XP', icon: 'emoji_events', link: '/servidor/ranking' },
      { title: 'Meu Perfil', icon: 'person', link: '/perfil' },
    ]
  }
}

const modelValue = computed({
  get: () => props.isOpen,
  set: (val) => {
    if (val === false) {
      requestLogout()
    } else {
      emit('update:isOpen', val)
    }
  },
})

const profile = () => {
  router.push('/perfil')
}

function requestLogout() {
  showModal.value = true
}

function confirmClose() {
  emit('update:isOpen', false)
}

const logout = () => {
  authStore.logout()
  router.replace('/login')
}

onMounted(() => {
  configurarMenu()
})

watch([() => authStore.user, () => route.path], () => {
  configurarMenu()
})

// ==========================================
// Acessibilidade TTS (Text-to-Speech)
// ==========================================
const ouvindo = ref(false)
const pausado = ref(false)

function ouvirPagina() {
  if (!('speechSynthesis' in window)) {
    alert('Seu navegador não suporta leitura de texto.')
    return
  }

  window.speechSynthesis.cancel()

  const container = document.querySelector('.q-page-container')
  const texto = container ? container.innerText : document.body.innerText

  if (!texto || texto.trim().length === 0) {
    alert('Não há conteúdo legível nesta página.')
    return
  }

  const fala = new SpeechSynthesisUtterance(texto)
  fala.lang = 'pt-BR'
  fala.rate = 1.1

  fala.onstart = () => {
    ouvindo.value = true
    pausado.value = false
  }
  fala.onend = () => {
    ouvindo.value = false
    pausado.value = false
  }
  fala.onerror = () => {
    ouvindo.value = false
    pausado.value = false
  }

  window.speechSynthesis.speak(fala)
}

function pausarLeitura() {
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.pause()
    pausado.value = true
  }
}

function continuarLeitura() {
  window.speechSynthesis.resume()
  pausado.value = false
}

function pararLeitura() {
  window.speechSynthesis.cancel()
  ouvindo.value = false
  pausado.value = false
}

watch(route, () => {
  if (ouvindo.value) {
    pararLeitura()
  }
})

onBeforeUnmount(() => {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
})
</script>
