<template>
  <q-page class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans">

    <!-- ========================================================= -->
    <!-- CABEÇALHO -->
    <!-- ========================================================= -->
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <div
            class="w-8 h-8 rounded-xl bg-pmvc-blue/10 text-pmvc-blue flex items-center justify-center"
          >
            <q-icon name="sports_esports" size="18px" />
          </div>

          <span
            class="text-[10px] font-extrabold uppercase tracking-widest text-pmvc-blue"
          >
            Minha jornada
          </span>
        </div>

        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Gamificação
        </h1>

        <p class="text-xs sm:text-sm text-slate-500 mt-1">
          Acompanhe sua evolução, conquistas e participação na plataforma.
        </p>
      </div>

      <div
        class="inline-flex items-center gap-2 self-start sm:self-auto px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
      >
        <q-icon name="auto_awesome" size="16px" class="text-amber-500" />
        <span class="text-[11px] font-bold text-slate-600">
          Continue evoluindo!
        </span>
      </div>
    </div>


    <!-- ========================================================= -->
    <!-- HERO / MEU NÍVEL -->
    <!-- ========================================================= -->
    <div
      class="relative overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-sm"
    >
      <!-- detalhe decorativo -->
      <div
        class="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-pmvc-blue/5"
      />
      <div
        class="absolute -right-8 -bottom-20 w-40 h-40 rounded-full bg-amber-400/5"
      />

      <div v-if="gamificationStore.loading" class="p-8 flex justify-center">
        <q-spinner-dots color="primary" size="40px" />
      </div>

      <div
        v-else
        class="relative p-5 sm:p-6 lg:p-7"
      >
        <div class="flex flex-col lg:flex-row lg:items-center gap-6">

          <!-- Ícone do nível -->
          <div
            class="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-pmvc-blue/10 text-pmvc-blue flex items-center justify-center shrink-0"
          >
            <q-icon name="workspace_premium" size="46px" />
          </div>

          <!-- Informações -->
          <div class="flex-1 min-w-0">

            <div class="flex flex-wrap items-center gap-2 mb-1">
              <span
                class="px-2.5 py-1 rounded-lg bg-pmvc-blue/10 text-pmvc-blue text-[10px] font-extrabold uppercase tracking-wide"
              >
                Nível {{ gamificationStore.level }}
              </span>

              <span
                class="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 text-[10px] font-extrabold"
              >
                {{ gamificationStore.xpPoints }} XP
              </span>
            </div>

            <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900">
              {{ gamificationStore.levelTitle }}
            </h2>

            <p class="text-xs text-slate-500 mt-1">
              Continue participando para desbloquear novos níveis e conquistas.
            </p>

            <!-- Progress -->
            <div class="mt-5">
              <div class="flex items-center justify-between mb-2">
                <span
                  class="text-[10px] font-bold uppercase tracking-wide text-slate-400"
                >
                  Progresso para o próximo nível
                </span>

                <span class="text-xs font-extrabold text-pmvc-blue">
                  {{ gamificationStore.xpProgress }}%
                </span>
              </div>

              <q-linear-progress
                :value="gamificationStore.xpProgress / 100"
                size="11px"
                rounded
                color="primary"
                track-color="slate-100"
                class="rounded-full"
              />

              <div class="flex justify-between mt-2">
                <span class="text-[10px] text-slate-400">
                  {{ gamificationStore.xpPoints }} XP
                </span>

                <span class="text-[10px] text-slate-400">
                  Próximo nível:
                  <strong class="text-slate-600">
                    {{ gamificationStore.nextLevelXp }} XP
                  </strong>
                </span>
              </div>
            </div>
          </div>

          <!-- Indicador lateral -->
          <div
            class="lg:w-40 shrink-0 lg:border-l lg:border-slate-100 lg:pl-6"
          >
            <p
              class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2"
            >
              Seu desempenho
            </p>

            <div class="flex lg:flex-col items-center lg:items-start gap-3">
              <div>
                <p class="text-2xl font-extrabold text-slate-900">
                  {{ gamificationStore.xpPoints }}
                </p>
                <p class="text-[10px] text-slate-400 font-semibold">
                  pontos acumulados
                </p>
              </div>

              <q-icon
                name="trending_up"
                size="28px"
                class="text-emerald-500"
              />
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- CONQUISTAS + PRÓXIMA CONQUISTA -->
    <!-- ========================================================= -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <!-- Conquistas -->
      <div
        class="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
      >

        <div class="px-5 sm:px-6 py-5 border-b border-slate-100">
          <div class="flex items-center justify-between gap-3">

            <div>
              <div class="flex items-center gap-2">
                <q-icon name="military_tech" class="text-amber-500" />

                <h2 class="text-base font-extrabold text-slate-800">
                  Minhas conquistas
                </h2>
              </div>

              <p class="text-[10px] text-slate-400 mt-1">
                Desbloqueie novas insígnias através da sua participação.
              </p>
            </div>

            <span
              class="shrink-0 text-[10px] font-extrabold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full"
            >
              {{ gamificationStore.earnedBadges.length }}
              /
              {{ gamificationStore.badges.length }}
            </span>

          </div>
        </div>


        <div v-if="gamificationStore.loading" class="flex justify-center py-10">
          <q-spinner-dots color="primary" size="40px" />
        </div>


        <div
          v-else-if="gamificationStore.badges.length === 0"
          class="text-center py-10 text-xs text-slate-400"
        >
          <q-icon name="military_tech" size="36px" class="text-slate-200 mb-2" />
          <p>Nenhuma conquista disponível no momento.</p>
        </div>


        <div
          v-else
          class="p-5 sm:p-6 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3"
        >

          <div
            v-for="badge in gamificationStore.badges"
            :key="badge.id"
            class="group relative p-4 rounded-2xl border text-center transition-all duration-200"
            :class="
              badge.earned
                ? 'bg-gradient-to-b from-amber-50 to-white border-amber-200 hover:border-amber-300 hover:-translate-y-0.5 hover:shadow-sm'
                : 'bg-slate-50 border-slate-200 opacity-50 grayscale'
            "
          >

            <!-- Badge desbloqueada -->
            <div
              class="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 overflow-hidden"
              :class="
                badge.earned
                  ? 'bg-amber-100 text-amber-600'
                  : 'bg-slate-200 text-slate-400'
              "
            >
              <img
                v-if="isImageUrl(badge.icone)"
                :src="getMediaUrl(badge.icone)"
                :alt="badge.nome"
                class="w-full h-full object-cover"
              />
              <q-icon
                v-else
                :name="badge.icone || 'military_tech'"
                size="30px"
              />
            </div>

            <div class="mt-3">
              <h4
                class="font-extrabold text-xs leading-tight"
                :class="
                  badge.earned
                    ? 'text-slate-900'
                    : 'text-slate-500'
                "
              >
                {{ badge.nome }}
              </h4>

              <p
                class="text-[10px] leading-relaxed mt-1.5 line-clamp-2"
                :class="
                  badge.earned
                    ? 'text-slate-500'
                    : 'text-slate-400'
                "
              >
                {{ badge.descricao }}
              </p>
            </div>

            <!-- selo -->
            <div
              v-if="badge.earned"
              class="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center"
            >
              <q-icon name="check" size="12px" />
            </div>

          </div>

        </div>
      </div>


      <!-- Próxima conquista -->
      <div
        class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6"
      >
        <div class="flex items-center gap-2 mb-1">
          <q-icon name="flag" class="text-pmvc-blue" />

          <h3 class="font-extrabold text-slate-800 text-sm">
            Continue sua jornada
          </h3>
        </div>

        <p class="text-[10px] text-slate-400 mb-5">
          Cada participação aproxima você de uma nova conquista.
        </p>

        <div
          class="rounded-2xl bg-gradient-to-br from-pmvc-blue/5 to-slate-50 border border-pmvc-blue/10 p-5 text-center"
        >
          <div
            class="mx-auto w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-pmvc-blue"
          >
            <q-icon name="auto_awesome" size="32px" />
          </div>

          <p class="text-xs font-extrabold text-slate-800 mt-4">
            Próximo nível
          </p>

          <p class="text-lg font-extrabold text-pmvc-blue mt-0.5">
            Nível {{ gamificationStore.level + 1 }}
          </p>

          <div class="mt-4">
            <q-linear-progress
              :value="gamificationStore.xpProgress / 100"
              size="7px"
              rounded
              color="primary"
              track-color="slate-200"
            />
          </div>

          <p class="text-[10px] text-slate-400 mt-2">
            Faltam aproximadamente
            <strong class="text-slate-600">
              {{
                Math.max(
                  0,
                  gamificationStore.nextLevelXp -
                    gamificationStore.xpPoints
                )
              }}
              XP
            </strong>
          </p>
        </div>

        <div class="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-100">
          <div class="flex items-start gap-2">
            <q-icon
              name="lightbulb"
              size="17px"
              class="text-amber-600 mt-0.5"
            />

            <p class="text-[10px] text-amber-800 leading-relaxed">
              Participe dos cursos, atividades e ações disponíveis para
              continuar acumulando XP.
            </p>
          </div>
        </div>
      </div>

    </div>

    <!-- ========================================================= -->
    <!-- RANKING -->
    <!-- ========================================================= -->
    <div
      class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
    >
      <div
        class="px-5 sm:px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <div class="flex items-center gap-2">
            <q-icon name="emoji_events" class="text-amber-500" />

            <h3 class="font-extrabold text-slate-800 text-base">
              Servidores em destaque
            </h3>
          </div>

          <p class="text-[10px] text-slate-400 mt-1">
            Ranking dos servidores com maior pontuação de XP.
          </p>
        </div>

        <span
          class="self-start sm:self-auto text-[9px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg"
        >
          XP acumulado
        </span>
      </div>

      <!-- Loading -->
      <div
        v-if="loadingLeaderboard"
        class="flex justify-center py-12"
      >
        <q-spinner-dots color="primary" size="40px" />
      </div>

      <!-- Vazio -->
      <div
        v-else-if="topUsers.length === 0"
        class="text-center py-12"
      >
        <div
          class="mx-auto w-14 h-14 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center"
        >
          <q-icon name="leaderboard" size="28px" />
        </div>

        <p class="text-xs font-semibold text-slate-500 mt-3">
          Ainda não há servidores pontuando.
        </p>

        <p class="text-[10px] text-slate-400 mt-1">
          O ranking aparecerá conforme os servidores acumularem XP.
        </p>
      </div>

      <!-- Ranking -->
      <div
        v-else
        class="p-4 sm:p-5 space-y-2"
      >
        <div
          v-for="(user, index) in sortedTopUsers"
          :key="user.id || index"
          class="group flex items-center justify-between gap-3 p-3.5 rounded-xl border transition-all"
          :class="
            index === 0
              ? 'bg-amber-50 border-amber-200'
              : index === 1
                ? 'bg-slate-50 border-slate-200'
                : index === 2
                  ? 'bg-orange-50 border-orange-100'
                  : 'border-transparent hover:bg-slate-50 hover:border-slate-100'
          "
        >

          <!-- Esquerda -->
          <div class="flex items-center gap-3 min-w-0">

            <!-- Posição -->
            <div
              class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-extrabold text-[10px]"
              :class="
                index === 0
                  ? 'bg-amber-400 text-slate-900'
                  : index === 1
                    ? 'bg-slate-300 text-slate-800'
                    : index === 2
                      ? 'bg-orange-300 text-slate-900'
                      : 'bg-slate-100 text-slate-500'
              "
            >
              <q-icon
                v-if="index === 0"
                name="emoji_events"
                size="18px"
              />

              <q-icon
                v-else-if="index === 1"
                name="military_tech"
                size="17px"
              />

              <q-icon
                v-else-if="index === 2"
                name="military_tech"
                size="17px"
              />

              <span v-else>
                {{ index + 1 }}º
              </span>
            </div>

            <!-- Avatar -->
            <div
              class="w-10 h-10 rounded-xl bg-pmvc-blue/10 text-pmvc-blue flex items-center justify-center font-extrabold text-xs shrink-0"
            >
              {{ (user.nome || 'S')[0].toUpperCase() }}
            </div>

            <!-- Dados -->
            <div class="min-w-0">
              <h4
                class="font-extrabold text-slate-900 text-xs truncate"
              >
                {{ user.nome }}
              </h4>

              <span
                class="text-[10px] text-slate-400 truncate block"
              >
                {{ user.secretaria?.sigla || 'PMVC' }}

                <span v-if="user.cargo">
                  • {{ user.cargo }}
                </span>
              </span>
            </div>
          </div>

          <!-- Direita -->
          <div class="text-right shrink-0">
            <span
              class="font-extrabold text-amber-600 text-xs block"
            >
              {{ user.xpPoints || 0 }} XP
            </span>

            <span class="text-[9px] text-slate-400">
              Nível {{ user.level || 1 }}
            </span>
          </div>

        </div>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- RODAPÉ -->
    <!-- ========================================================= -->
    <div
      class="flex items-center justify-center gap-2 py-2 text-[10px] text-slate-400"
    >
    </div>

  </q-page>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue'
import { useGamificationStore } from 'src/stores/gamificationStore'
import { getMediaUrl } from 'src/utils/media'

const gamificationStore = useGamificationStore()

const loadingLeaderboard = ref(false)

function isImageUrl(icone) {
  if (!icone) return false
  const trimmed = icone.trim()
  return (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/uploads/') ||
    trimmed.startsWith('uploads/') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  )
}

const topUsers = computed(
  () => gamificationStore.leaderboard?.topUsers || [],
)

const sortedTopUsers = computed(() => {
  return [...topUsers.value].sort(
    (a, b) => (b.xpPoints || 0) - (a.xpPoints || 0)
  )
})

async function loadLeaderboard() {
  loadingLeaderboard.value = true

  try {
    await gamificationStore.fetchLeaderboard()
  } finally {
    loadingLeaderboard.value = false
  }
}

onMounted(() => {
  gamificationStore.fetchMyStatus()
  loadLeaderboard()
})
</script>