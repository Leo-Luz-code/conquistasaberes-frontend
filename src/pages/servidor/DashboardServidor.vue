<template>
  <q-page class="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 font-sans">
    <!-- Boas-vindas & Perfil Banner -->
    <div class="relative overflow-hidden bg-gradient-to-r from-pmvc-blue via-blue-800 to-indigo-900 rounded-3xl text-white p-6 sm:p-10 shadow-xl">
      <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="space-y-2">
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider text-blue-200">
            <q-icon name="apartment" /> {{ authStore.userSecretaria || 'PMVC' }} • {{ authStore.userCargo || 'Servidor Público' }}
          </div>
          <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Olá, {{ authStore.firstName }}! 👋
          </h1>
          <p class="text-sm sm:text-base text-blue-100 max-w-xl">
            Bem-vindo ao seu portal de desenvolvimento contínuo. Explore novas trilhas, acumule XP e potencialize sua carreira no serviço público municipal.
          </p>
        </div>

        <!-- Widget de Gamificacao Rápido -->
        <div class="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 flex items-center gap-5 min-w-[280px]">
          <div class="w-14 h-14 bg-amber-400 text-slate-900 rounded-xl flex items-center justify-center font-extrabold text-2xl shadow-lg shrink-0">
            {{ gamificationStore.level }}
          </div>
          <div class="flex-1 space-y-1">
            <div class="flex justify-between text-xs font-bold uppercase tracking-wider">
              <span>{{ gamificationStore.levelTitle }}</span>
              <span class="text-amber-300 font-extrabold">{{ gamificationStore.xpPoints }} XP</span>
            </div>
            <q-linear-progress
              :value="gamificationStore.xpProgress / 100"
              color="amber"
              track-color="white-3"
              class="h-3 rounded-full"
            />
            <span class="text-[10px] text-blue-200 block text-right">
              {{ gamificationStore.xpProgress }}% para o próximo nível
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Seção 2 Colunas: Cursos em Andamento & Sugestões de IA -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Cursos em Andamento (2 Colunas) -->
      <div class="lg:col-span-2 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
            <q-icon name="play_circle" class="text-pmvc-blue" /> Meus Cursos em Andamento
          </h2>
          <router-link to="/servidor/cursos" class="text-xs font-bold text-pmvc-blue hover:underline">
            Ver catálogo completo →
          </router-link>
        </div>

        <div v-if="courseStore.loading" class="flex justify-center py-12">
          <q-spinner-dots color="primary" size="40px" />
        </div>

        <div v-else-if="enrolledCourses.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            v-for="course in enrolledCourses"
            :key="course.id"
            class="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div class="flex justify-between items-start mb-2">
                <span class="px-2 py-0.5 bg-blue-50 text-pmvc-blue rounded text-[10px] font-bold uppercase">
                  {{ course.categoria || 'Geral' }}
                </span>
                <span class="text-xs text-slate-400 font-semibold flex items-center gap-1">
                  <q-icon name="schedule" /> {{ course.cargaHoraria }}h
                </span>
              </div>
              <h3 class="font-bold text-slate-900 text-base line-clamp-2 mb-2">{{ course.titulo }}</h3>
              <p class="text-xs text-slate-500 line-clamp-2 mb-4">{{ course.descricao }}</p>
            </div>

            <div class="space-y-3 pt-3 border-t border-slate-100">
              <div class="flex justify-between text-xs text-slate-600 font-bold">
                <span>Progresso</span>
                <span class="text-pmvc-blue">{{ course.userProgress || 0 }}%</span>
              </div>
              <q-linear-progress :value="(course.userProgress || 0) / 100" color="primary" class="h-2 rounded-full" />
              <router-link
                :to="`/servidor/cursos/${course.id}`"
                class="block text-center py-2 px-4 bg-pmvc-blue hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                CONTINUAR ESTUDANDO
              </router-link>
            </div>
          </div>
        </div>

        <div v-else class="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-3">
          <q-icon name="school" size="48px" class="text-slate-300" />
          <h3 class="font-bold text-slate-700">Você ainda não se inscreveu em nenhum curso</h3>
          <p class="text-xs text-slate-500 max-w-md mx-auto">Explore nosso catálogo unificado de capacitações e inscreva-se para começar a pontuar XP!</p>
          <router-link
            to="/servidor/cursos"
            class="inline-block py-2.5 px-6 bg-pmvc-blue text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow"
          >
            Explorar Cursos
          </router-link>
        </div>
      </div>

      <!-- Recomendações Inteligentes IA (1 Coluna) -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
            <q-icon name="auto_awesome" class="text-amber-500" /> Sugestões por IA
          </h2>
        </div>

        <div class="bg-gradient-to-b from-amber-500/5 to-white rounded-2xl border border-amber-200/60 p-5 space-y-4">
          <p class="text-xs text-slate-600">
            Cursos sugeridos com base no seu cargo de <strong>{{ authStore.userCargo }}</strong> e demandas da sua secretaria:
          </p>

          <div class="space-y-3">
            <div
              v-for="rec in recommendations"
              :key="rec.id"
              class="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:border-amber-400 transition-all flex flex-col justify-between gap-2"
            >
              <div class="flex items-center gap-2 text-[10px] font-bold text-amber-700 uppercase">
                <q-icon name="psychology" /> {{ rec.matchReason || 'Recomendado para sua Carreira' }}
              </div>
              <h4 class="font-bold text-slate-900 text-sm leading-tight">{{ rec.titulo }}</h4>
              <div class="flex items-center justify-between pt-2 text-xs">
                <span class="text-slate-500 font-semibold">{{ rec.cargaHoraria }}h</span>
                <router-link :to="`/servidor/cursos/${rec.id}`" class="text-pmvc-blue font-bold hover:underline">
                  Ver Detalhes →
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useAuthStore } from 'src/stores/authStore';
import { useCourseStore } from 'src/stores/courseStore';
import { useGamificationStore } from 'src/stores/gamificationStore';

const authStore = useAuthStore();
const courseStore = useCourseStore();
const gamificationStore = useGamificationStore();

const enrolledCourses = computed(() => {
  return courseStore.courses.filter(c => c.isEnrolled || c.userProgress > 0);
});

const recommendations = computed(() => {
  return courseStore.recommendations.length > 0
    ? courseStore.recommendations
    : courseStore.courses.slice(0, 2);
});

onMounted(async () => {
  await Promise.all([
    courseStore.fetchCourses(),
    courseStore.fetchRecommendations(),
    gamificationStore.fetchMyStatus(),
  ]);
});
</script>
