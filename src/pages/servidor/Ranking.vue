<template>
  <q-page class="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 font-sans">
    <!-- Cabecalho -->
    <div>
      <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900">Gamificação & Ranking Municipal</h1>
      <p class="text-xs sm:text-sm text-slate-500">Reconhecimento contínuo do engajamento dos servidores de Vitória da Conquista</p>
    </div>

    <!-- Minhas Conquistas (Badges) -->
    <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
          <q-icon name="military_tech" class="text-amber-500" /> Minhas Conquistas & Insígnias
        </h2>
        <span class="text-xs font-extrabold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
          {{ gamificationStore.earnedBadges.length }} / {{ gamificationStore.badges.length }} Conquistados
        </span>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        <div
          v-for="badge in gamificationStore.badges"
          :key="badge.id"
          class="p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center space-y-2"
          :class="badge.earned ? 'bg-gradient-to-b from-amber-50 to-white border-amber-300 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-40 grayscale'"
        >
          <div class="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
            <q-icon :name="badge.icone || 'military_tech'" size="28px" />
          </div>
          <h4 class="font-bold text-slate-900 text-xs leading-tight">{{ badge.nome }}</h4>
          <span class="text-[10px] text-slate-500 line-clamp-2">{{ badge.descricao }}</span>
        </div>
      </div>
    </div>

    <!-- Leaderboard (2 Abas: Servidores vs Secretarias) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Ranking de Servidores -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-slate-900 text-base flex items-center gap-2">
            <q-icon name="emoji_events" class="text-amber-500" /> Top Servidores Mais Engajados
          </h3>
          <span class="text-[10px] font-bold text-slate-400 uppercase">XP Acumulado</span>
        </div>

        <div class="space-y-2">
          <div
            v-for="(user, index) in topUsers"
            :key="user.id || index"
            class="flex items-center justify-between p-3 rounded-xl transition-colors"
            :class="index === 0 ? 'bg-amber-50 border border-amber-200' : index === 1 ? 'bg-slate-100' : index === 2 ? 'bg-orange-50' : 'hover:bg-slate-50'"
          >
            <div class="flex items-center gap-3">
              <span
                class="w-7 h-7 rounded-full font-extrabold text-xs flex items-center justify-center shrink-0"
                :class="index === 0 ? 'bg-amber-400 text-slate-900' : index === 1 ? 'bg-slate-300 text-slate-800' : index === 2 ? 'bg-orange-300 text-slate-900' : 'bg-slate-200 text-slate-600'"
              >
                {{ index + 1 }}º
              </span>
              <div>
                <h4 class="font-bold text-slate-900 text-xs">{{ user.nome }}</h4>
                <span class="text-[10px] text-slate-500">{{ user.secretaria?.sigla || 'PMVC' }} • {{ user.cargo }}</span>
              </div>
            </div>

            <div class="text-right">
              <span class="font-extrabold text-amber-600 text-xs block">{{ user.xpPoints || 0 }} XP</span>
              <span class="text-[10px] text-slate-400">Nível {{ user.level || 1 }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Ranking de Secretarias -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-slate-900 text-base flex items-center gap-2">
            <q-icon name="apartment" class="text-pmvc-blue" /> Ranking Intersecretarial
          </h3>
          <span class="text-[10px] font-bold text-slate-400 uppercase">Total da Secretaria</span>
        </div>

        <div class="space-y-2">
          <div
            v-for="(sec, index) in topSecretarias"
            :key="sec.sigla || index"
            class="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl hover:bg-blue-50/50 transition-colors"
          >
            <div class="flex items-center gap-3">
              <span class="font-bold text-pmvc-blue text-sm">#{{ index + 1 }}</span>
              <div>
                <h4 class="font-bold text-slate-900 text-xs">{{ sec.nome }} ({{ sec.sigla }})</h4>
                <span class="text-[10px] text-slate-500">{{ sec.totalUsers || 0 }} Servidores ativos</span>
              </div>
            </div>

            <span class="font-extrabold text-pmvc-blue text-xs">{{ sec.totalXp || 0 }} XP</span>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useGamificationStore } from 'src/stores/gamificationStore';

const gamificationStore = useGamificationStore();

const topUsers = computed(() => gamificationStore.leaderboard?.topUsers || []);
const topSecretarias = computed(() => gamificationStore.leaderboard?.topSecretarias || []);

onMounted(async () => {
  await Promise.all([
    gamificationStore.fetchMyStatus(),
    gamificationStore.fetchLeaderboard(),
  ]);
});
</script>
