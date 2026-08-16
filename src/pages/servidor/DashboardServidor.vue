<template>
  <q-page class="p-3 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6 font-sans overflow-x-hidden w-full">
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full min-w-0">
      <!-- Informações de boas-vindas -->
      <div class="min-w-0 flex-1">
        <p class="text-xs sm:text-sm text-slate-500 font-medium mb-1 truncate">
          {{ dataAtualFormatada }}
        </p>

        <h1 class="text-lg sm:text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight break-words">
          Olá,
          <span class="text-[#0F4C81]">
            {{ authStore.firstName || 'Servidor' }}
          </span>.
          Bem-vindo(a) à UniVC.
        </h1>

        <p class="text-xs sm:text-sm text-slate-500 mt-1 break-words">
          Continue sua jornada de aprendizagem e desenvolvimento profissional.
        </p>
      </div>

      <!-- Ações do Topo -->
      <div class="flex flex-wrap items-center gap-3 w-full sm:w-auto">
        <router-link
          :to="cursoAtualLink"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3 bg-[#0F4C81] hover:bg-[#0C3B66] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md hover:shadow-lg min-w-0"
        >
          <span class="truncate max-w-[260px] sm:max-w-xs">
            {{ cursoEmAndamentoRecente ? 'Continuar: ' + truncarTexto(cursoEmAndamentoRecente.titulo, 18) : 'Explorar Cursos' }}
          </span>
          <q-icon name="arrow_forward" size="18px" class="shrink-0" />
        </router-link>
      </div>
    </div>

    <!-- Banner 1: Destaque Institucional -->
    <div class="relative overflow-hidden bg-gradient-to-r from-[#0F4C81] via-[#0D5B96] to-[#0B7C9E] rounded-2xl sm:rounded-3xl text-white p-5 sm:p-8 md:p-10 shadow-xl">
      <div class="relative z-10 max-w-3xl space-y-3 sm:space-y-4">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-slate-900 text-xs font-bold rounded-full shadow-sm">
          <q-icon name="auto_awesome" size="14px" class="shrink-0" />
          <span class="truncate">Destaque institucional</span>
        </div>

        <h2 class="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight break-words">
          Desenvolva suas competências e fortaleça o serviço público municipal.
        </h2>

        <p class="text-xs sm:text-sm md:text-base text-blue-100 leading-relaxed max-w-2xl break-words">
          Trilhas formativas, cursos certificados e materiais exclusivos selecionados para sua carreira pública na Prefeitura de Vitória da Conquista.
        </p>

        <div class="pt-2 flex flex-wrap items-center gap-2 sm:gap-3">
          <router-link
            to="/servidor/trilhas"
            class="flex-1 min-w-[110px] text-center px-3 sm:px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-md truncate"
          >
            Explorar trilhas
          </router-link>

          <router-link
            to="/servidor/cursos"
            class="flex-1 min-w-[100px] text-center px-3 sm:px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/40 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors backdrop-blur-sm truncate"
          >
            Ver catálogo
          </router-link>

          <router-link
            to="/servidor/eventos"
            class="w-full sm:w-auto text-center px-4 sm:px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/40 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors backdrop-blur-sm truncate"
          >
            Eventos & Palestras
          </router-link>
        </div>
      </div>
    </div>

    <!-- Banner 2: Norminha -->
    <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row items-stretch relative">
      <div class="relative w-full md:w-64 bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 h-48 md:h-auto">
        <div class="absolute top-3 left-3 z-10 px-2.5 py-0.5 bg-[#0F4C81] text-white text-[10px] font-extrabold uppercase rounded-md tracking-wider shadow">
          EMBAIXADORA IA
        </div>
        <img
          src="~assets/images/norminha_avatar.jpg"
          alt="Norminha, Embaixadora do Conhecimento"
          class="w-full h-full object-cover object-top"
        />
      </div>

      <div class="p-4 sm:p-6 md:p-8 flex-1 flex flex-col justify-between space-y-4 min-w-0">
        <div class="space-y-2 min-w-0">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0F4C81] text-white text-xs font-bold rounded-full max-w-full">
            <q-icon name="auto_awesome" size="14px" class="shrink-0" />
            <span class="truncate">Norminha, Embaixadora da UniVC</span>
          </div>

          <h3 class="text-base sm:text-xl md:text-2xl font-bold text-slate-900 leading-snug break-words">
            Sua referência de apoio ao aprendizado dentro da UniVC.
          </h3>

          <p class="text-xs sm:text-sm text-slate-600 italic leading-relaxed pt-1 break-words">
            "Olá! Eu sou a Norminha, sua assistente e tutora virtual na UniVC. Estou disponível para tirar dúvidas em tempo real sobre normas, conteúdos das aulas, quizzes e te guiar nas trilhas de capacitação municipal."
          </p>
        </div>

        <div>
          <router-link
            to="/servidor/norminha"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-blue-50 hover:bg-blue-100 text-[#0F4C81] font-bold text-xs rounded-xl transition-colors"
          >
            <q-icon name="chat" size="16px" class="shrink-0" />
            <span class="truncate">Conversar com a Norminha</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Cards de Métricas e Indicadores -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <router-link
        to="/servidor/cursos"
        class="bg-white rounded-2xl p-3 sm:p-5 border border-slate-200 shadow-sm flex items-center gap-2 sm:gap-4 hover:border-blue-300 transition-all group min-w-0 overflow-hidden"
      >
        <div class="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-50 text-[#0F4C81] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <q-icon name="menu_book" size="20px" class="sm:text-[22px]" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-[10px] sm:text-xs font-medium text-slate-500 truncate">Cursos disponíveis</p>
          <p class="text-lg sm:text-2xl font-extrabold text-slate-900 leading-none my-0.5 truncate">
            {{ totalCursosDisponiveis }}
          </p>
          <p class="text-[9px] sm:text-[11px] text-slate-400 truncate">catálogo geral</p>
        </div>
      </router-link>

      <router-link
        to="/servidor/cursos"
        class="bg-white rounded-2xl p-3 sm:p-5 border border-slate-200 shadow-sm flex items-center gap-2 sm:gap-4 hover:border-amber-300 transition-all group min-w-0 overflow-hidden"
      >
        <div class="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <q-icon name="school" size="20px" class="sm:text-[22px]" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-[10px] sm:text-xs font-medium text-slate-500 truncate">Em andamento</p>
          <p class="text-lg sm:text-2xl font-extrabold text-slate-900 leading-none my-0.5 truncate">
            {{ cursosEmAndamento.length }}
          </p>
          <p class="text-[9px] sm:text-[11px] text-slate-400 truncate">continue de onde parou</p>
        </div>
      </router-link>

      <router-link
        to="/servidor/certificados"
        class="bg-white rounded-2xl p-3 sm:p-5 border border-slate-200 shadow-sm flex items-center gap-2 sm:gap-4 hover:border-emerald-300 transition-all group min-w-0 overflow-hidden"
      >
        <div class="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <q-icon name="emoji_events" size="20px" class="sm:text-[22px]" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-[10px] sm:text-xs font-medium text-slate-500 truncate">Concluídos</p>
          <p class="text-lg sm:text-2xl font-extrabold text-slate-900 leading-none my-0.5 truncate">
            {{ cursosConcluidos.length }}
          </p>
          <p class="text-[9px] sm:text-[11px] text-slate-400 truncate">cursos finalizados</p>
        </div>
      </router-link>

      <router-link
        to="/servidor/certificados"
        class="bg-white rounded-2xl p-3 sm:p-5 border border-slate-200 shadow-sm flex items-center gap-2 sm:gap-4 hover:border-amber-300 transition-all group min-w-0 overflow-hidden"
      >
        <div class="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <q-icon name="workspace_premium" size="20px" class="sm:text-[22px]" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-[10px] sm:text-xs font-medium text-slate-500 truncate">Certificados</p>
          <p class="text-lg sm:text-2xl font-extrabold text-slate-900 leading-none my-0.5 truncate">
            {{ certificateStore.certificates.length }}
          </p>
          <p class="text-[9px] sm:text-[11px] text-slate-400 truncate">emitidos no AVA</p>
        </div>
      </router-link>
    </div>

    <!-- Seção 2 Colunas: Progresso Geral da Jornada & Atalhos Rápidos -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full min-w-0">
      <!-- Coluna Esquerda: Progresso Geral da Jornada -->
      <div class="lg:col-span-2 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6 min-w-0 overflow-hidden">
        <div class="min-w-0">
          <div class="flex items-center justify-between mb-4 gap-2">
            <div class="min-w-0 flex-1">
              <h3 class="text-base sm:text-lg font-extrabold text-slate-900 truncate">Progresso geral da jornada</h3>
              <p class="hidden sm:block text-xs text-slate-500 truncate">Sua evolução em cursos e trilhas ativos.</p>
            </div>
            <div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <q-icon name="trending_up" size="20px" />
            </div>
          </div>

          <!-- Loading Spinner -->
          <div v-if="loadingData" class="py-8 flex justify-center">
            <q-spinner-dots color="primary" size="36px" />
          </div>

          <!-- Lista de Itens de Progresso Reais -->
          <div v-else-if="itensProgressoJornada.length > 0" class="space-y-4 pt-2 min-w-0">
            <div v-for="(item, idx) in itensProgressoJornada" :key="idx" class="space-y-1.5 min-w-0">
              <div class="flex justify-between items-center text-xs font-bold gap-2 min-w-0">
                <span class="text-slate-800 flex items-center gap-1.5 min-w-0 flex-1">
                  <q-icon :name="item.tipo === 'trilha' ? 'alt_route' : 'school'" size="15px" :color="item.tipo === 'trilha' ? 'primary' : 'secondary'" class="shrink-0" />
                  <!-- Função aplicada aqui para evitar estouro de texto nos títulos longos de cursos em mobile -->
                  <span class="truncate">{{ tituloResponsivo(item.titulo) }}</span>
                </span>
                <span class="text-[#0F4C81] shrink-0">{{ Math.round(item.progress) }}%</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  class="bg-[#0F4C81] h-2.5 rounded-full transition-all duration-500"
                  :style="{ width: Math.max(item.progress, 3) + '%' }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Estado Vazio -->
          <div v-else class="py-8 text-center text-xs text-slate-400 border border-dashed rounded-2xl border-slate-200 px-4">
            <q-icon name="school" size="36px" class="text-slate-300 mb-2" />
            <p class="font-bold text-slate-600 break-words">Nenhum curso ou trilha em andamento no momento.</p>
            <p class="text-slate-400 mt-0.5 break-words">Explore o catálogo e inscreva-se para começar a pontuar!</p>
            <router-link
              to="/servidor/cursos"
              class="inline-block mt-3 px-4 py-1.5 bg-[#0F4C81] text-white font-bold text-xs rounded-xl"
            >
              Ver Cursos Disponíveis
            </router-link>
          </div>
        </div>

        <!-- Rodapé do Card de Progresso -->
        <div class="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="min-w-0">
            <p class="hidden sm:block text-[11px] font-medium text-slate-400 truncate">Pontuação de aprendizagem (XP)</p>
            <p class="text-base sm:text-xl font-extrabold text-[#0F4C81] truncate">
              {{ gamificationStore.xpPoints }} <span class="text-xs text-slate-500 font-normal">XP • Nível {{ gamificationStore.level }}</span>
            </p>
          </div>

          <!-- Botão "Ver Passaporte Digital" exclusivo para celular -->
          <router-link
            to="/perfil"
            class="sm:hidden w-full px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-colors text-center flex items-center justify-center gap-1.5 shadow-sm"
          >
            <q-icon name="badge" size="16px" class="text-[#0F4C81] shrink-0" />
            <span class="truncate">Ver Passaporte Digital</span>
          </router-link>
        </div>
      </div>

      <!-- Coluna Direita: Atalhos Rápidos -->
      <div class="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between min-w-0 overflow-hidden">
        <div class="min-w-0">
          <h3 class="text-base sm:text-lg font-extrabold text-slate-900 mb-4 sm:mb-5 truncate">Atalhos rápidos</h3>

          <div class="grid grid-cols-2 gap-2.5 sm:gap-3 min-w-0">
            <!-- Atalho 1 -->
            <router-link
              to="/servidor/trilhas"
              class="p-3 sm:p-4 bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 rounded-2xl flex flex-col items-start space-y-2 transition-all group min-w-0 overflow-hidden"
            >
              <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-100/60 text-[#0F4C81] flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <q-icon name="alt_route" size="20px" />
              </div>
              <span class="text-xs font-bold text-slate-800 group-hover:text-[#0F4C81] truncate w-full">Minhas Trilhas</span>
            </router-link>

            <!-- Atalho 2 -->
            <router-link
              to="/servidor/cursos"
              class="p-3 sm:p-4 bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 rounded-2xl flex flex-col items-start space-y-2 transition-all group min-w-0 overflow-hidden"
            >
              <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-100/60 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <q-icon name="menu_book" size="20px" />
              </div>
              <span class="text-xs font-bold text-slate-800 group-hover:text-emerald-700 truncate w-full">Meus Cursos</span>
            </router-link>

            <!-- Atalho 3 -->
            <router-link
              to="/servidor/biblioteca"
              class="p-3 sm:p-4 bg-slate-50 hover:bg-amber-50 border border-slate-100 hover:border-amber-200 rounded-2xl flex flex-col items-start space-y-2 transition-all group min-w-0 overflow-hidden"
            >
              <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-100/60 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <q-icon name="auto_stories" size="20px" />
              </div>
              <span class="text-xs font-bold text-slate-800 group-hover:text-amber-600 truncate w-full">Biblioteca</span>
            </router-link>

            <!-- Atalho 4 -->
            <router-link
              to="/servidor/forum"
              class="p-3 sm:p-4 bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 rounded-2xl flex flex-col items-start space-y-2 transition-all group min-w-0 overflow-hidden"
            >
              <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-100/60 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <q-icon name="chat" size="20px" />
              </div>
              <span class="text-xs font-bold text-slate-800 group-hover:text-indigo-700 truncate w-full">Fórum</span>
            </router-link>

            <!-- Atalho 5 -->
            <router-link
              to="/perfil"
              class="p-3 sm:p-4 bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 rounded-2xl flex flex-col items-start space-y-2 transition-all group min-w-0 overflow-hidden"
            >
              <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-100/60 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <q-icon name="badge" size="20px" />
              </div>
              <span class="text-xs font-bold text-slate-800 group-hover:text-emerald-600 truncate w-full">Passaporte</span>
            </router-link>

            <!-- Atalho 6 -->
            <router-link
              to="/servidor/certificados"
              class="p-3 sm:p-4 bg-slate-50 hover:bg-amber-50 border border-slate-100 hover:border-amber-200 rounded-2xl flex flex-col items-start space-y-2 transition-all group min-w-0 overflow-hidden"
            >
              <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-100/60 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <q-icon name="workspace_premium" size="20px" />
              </div>
              <span class="text-xs font-bold text-slate-800 group-hover:text-amber-500 truncate w-full">Certificados</span>
            </router-link>

            <!-- Eventos e Palestras (Com subtítulo oculto no celular) -->
            <router-link
              to="/servidor/eventos"
              class="col-span-2 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 border border-purple-200 rounded-2xl flex items-center gap-3 transition-all group min-w-0 overflow-hidden"
            >
              <div class="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <q-icon name="event" size="20px" />
              </div>
              <div class="min-w-0 flex-1">
                <span class="block text-xs font-bold text-slate-900 group-hover:text-purple-900 truncate">Eventos & Palestras</span>
                <span class="hidden sm:block text-[10px] text-slate-500 truncate">Inscrições com presença via QR Code</span>
              </div>
            </router-link>

            <!-- Norminha IA (Com subtítulo oculto no celular) -->
            <router-link
              to="/servidor/norminha"
              class="col-span-2 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border border-blue-200 rounded-2xl flex items-center gap-3 transition-all group min-w-0 overflow-hidden"
            >
              <div class="w-9 h-9 rounded-xl bg-[#0F4C81] text-white flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <q-icon name="smart_toy" size="20px" />
              </div>
              <div class="min-w-0 flex-1">
                <span class="block text-xs font-bold text-slate-900 group-hover:text-[#0F4C81] truncate">Norminha IA</span>
                <span class="hidden sm:block text-[10px] text-slate-500 truncate">Tire dúvidas com a embaixadora</span>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useAuthStore } from 'src/stores/authStore';
import { useCourseStore } from 'src/stores/courseStore';
import { useGamificationStore } from 'src/stores/gamificationStore';
import { useCertificateStore } from 'src/stores/certificateStore';

const authStore = useAuthStore();
const courseStore = useCourseStore();
const gamificationStore = useGamificationStore();
const certificateStore = useCertificateStore();

const loadingData = ref(false);

const dataAtualFormatada = computed(() => {
  const data = new Date();
  const opcoes = { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' };
  const str = data.toLocaleDateString('pt-BR', opcoes);
  return str.charAt(0).toUpperCase() + str.slice(1);
});

const totalCursosDisponiveis = computed(() => {
  return courseStore.courses?.length || 0;
});

const cursosEmAndamento = computed(() => {
  const list = courseStore.myCourses || [];
  return list.filter((c) => (c.progress || 0) < 100 && (c.statusConclusao !== 'CONCLUIDO'));
});

const cursosConcluidos = computed(() => {
  const list = courseStore.myCourses || [];
  return list.filter((c) => (c.progress || 0) >= 100 || c.statusConclusao === 'CONCLUIDO');
});

const cursoEmAndamentoRecente = computed(() => {
  if (cursosEmAndamento.value.length > 0) {
    return cursosEmAndamento.value[0];
  }
  return null;
});

const cursoAtualLink = computed(() => {
  if (cursoEmAndamentoRecente.value?.id) {
    return `/servidor/cursos/${cursoEmAndamentoRecente.value.id}`;
  }
  return '/servidor/cursos';
});

const itensProgressoJornada = computed(() => {
  const items = [];

  (courseStore.learningPaths || []).forEach((trilha) => {
    if (trilha.isEnrolled || (trilha.progress && trilha.progress > 0)) {
      items.push({
        tipo: 'trilha',
        titulo: `Trilha: ${trilha.tituloTrilha}`,
        progress: trilha.progress || 0,
      });
    }
  });

  cursosEmAndamento.value.forEach((curso) => {
    items.push({
      tipo: 'curso',
      titulo: `Curso: ${curso.titulo}`,
      progress: curso.progress || 0,
    });
  });

  if (items.length === 0 && courseStore.myCourses?.length > 0) {
    courseStore.myCourses.slice(0, 3).forEach((c) => {
      items.push({
        tipo: 'curso',
        titulo: `Curso: ${c.titulo}`,
        progress: c.progress || 0,
      });
    });
  }

  return items.slice(0, 4);
});

// Função para truncar strings genéricas
const truncarTexto = (txt, maxLen = 20) => {
  if (!txt) return '';
  return txt.length > maxLen ? txt.substring(0, maxLen - 3) + '...' : txt;
};

// Função específica para limitar os títulos grandes na lista de progresso no mobile
const tituloResponsivo = (txt) => {
  if (!txt) return '';
  // Se estiver em tela mobile estrita, reduz o limite de caracteres para caber perfeitamente na linha com a porcentagem
  const limite = window.innerWidth < 640 ? 25 : 45;
  return txt.length > limite ? txt.substring(0, limite - 3) + '...' : txt;
};

onMounted(async () => {
  loadingData.value = true;
  try {
    await Promise.all([
      authStore.fetchProfile(),
      courseStore.fetchCourses(),
      courseStore.fetchMyCourses(),
      courseStore.fetchLearningPaths(),
      gamificationStore.fetchMyStatus(),
      certificateStore.fetchMyCertificates(),
    ]);
  } catch (error) {
    console.error('Erro ao carregar dados do dashboard do servidor:', error);
  } finally {
    loadingData.value = false;
  }
});
</script>