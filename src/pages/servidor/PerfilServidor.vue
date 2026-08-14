<template>
  <q-page class="p-4 sm:p-8 max-w-5xl mx-auto space-y-6 font-sans">

    <!-- ===================================================== -->
    <!-- CABEÇALHO DO PERFIL -->
    <!-- ===================================================== -->
    <div
      class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
    >
      <!-- faixa superior -->
      <div class="h-24 bg-gradient-to-r from-pmvc-blue/10 via-pmvc-blue/5 to-transparent" />

      <div class="px-6 sm:px-8 pb-6">
        <div class="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">

          <!-- Avatar -->
          <div
            class="w-20 h-20 rounded-2xl bg-pmvc-blue text-white flex items-center justify-center font-extrabold text-2xl shadow-md border-4 border-white shrink-0"
          >
            {{ authStore.userInitial }}
          </div>

          <!-- Identificação -->
          <div class="flex-1 min-w-0">
            <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900">
              {{ authStore.userName }}
            </h1>

            <p
              class="text-xs text-pmvc-blue font-bold uppercase tracking-wider mt-1"
            >
              {{ authStore.roleLabel }}
              <span class="text-slate-300 mx-1">•</span>
              {{ authStore.userSecretaria || 'PMVC' }}
            </p>
          </div>

          <!-- Status -->
          <div
            class="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-extrabold"
          >
            <q-icon name="verified_user" size="15px" />
            Conta ativa
          </div>

        </div>
      </div>
    </div>


    <!-- ===================================================== -->
    <!-- DADOS FUNCIONAIS -->
    <!-- ===================================================== -->
    <div
      class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8"
    >

      <div class="mb-5">
        <div class="flex items-center gap-2">
          <q-icon name="badge" class="text-pmvc-blue" />

          <h2 class="text-base font-extrabold text-slate-800">
            Dados funcionais
          </h2>
        </div>

        <p class="text-[10px] text-slate-400 mt-1">
          Informações vinculadas ao seu cadastro institucional.
        </p>
      </div>


      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <!-- CPF -->
        <div
          class="bg-slate-50 p-4 rounded-xl border border-slate-100"
        >
          <span class="text-[10px] font-semibold text-slate-400 uppercase">
            CPF
          </span>

          <span class="block font-bold text-slate-900 text-sm mt-1">
            {{ authStore.user?.cpf || '---' }}
          </span>
        </div>


        <!-- Matrícula -->
        <div
          class="bg-slate-50 p-4 rounded-xl border border-slate-100"
        >
          <span class="text-[10px] font-semibold text-slate-400 uppercase">
            Matrícula Funcional
          </span>

          <span class="block font-bold text-slate-900 text-sm mt-1">
            {{ authStore.user?.matricula || '---' }}
          </span>
        </div>


        <!-- E-mail -->
        <div
          class="bg-slate-50 p-4 rounded-xl border border-slate-100"
        >
          <span class="text-[10px] font-semibold text-slate-400 uppercase">
            E-mail Institucional
          </span>

          <span class="block font-bold text-slate-900 text-sm mt-1 break-all">
            {{ authStore.user?.email || '---' }}
          </span>
        </div>


        <!-- Cargo -->
        <div
          class="bg-slate-50 p-4 rounded-xl border border-slate-100"
        >
          <span class="text-[10px] font-semibold text-slate-400 uppercase">
            Cargo / Função
          </span>

          <span class="block font-bold text-slate-900 text-sm mt-1">
            {{ authStore.userCargo || '---' }}
          </span>
        </div>

      </div>

    </div>


    <!-- ===================================================== -->
    <!-- MINHA EVOLUÇÃO -->
    <!-- SOMENTE SERVIDOR -->
    <!-- ===================================================== -->
    <div
      v-if="authStore.isServidor"
      class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7"
    >

      <div class="flex items-center justify-between gap-3 mb-6">

        <div>
          <div class="flex items-center gap-2">
            <q-icon name="workspace_premium" class="text-amber-500" />

            <h2 class="text-base font-extrabold text-slate-800">
              Minha evolução
            </h2>
          </div>

          <p class="text-[10px] text-slate-400 mt-1">
            Acompanhe seu nível, experiência e conquistas.
          </p>
        </div>

        <q-btn
          flat
          round
          dense
          icon="sports_esports"
          color="primary"
          to="/gamificacao"
        >
          <q-tooltip>
            Ver gamificação
          </q-tooltip>
        </q-btn>

      </div>


      <!-- Cards de evolução -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">

        <!-- Nível -->
        <div
          class="rounded-xl bg-pmvc-blue/5 border border-pmvc-blue/10 p-4"
        >
          <div class="flex items-center gap-2 mb-3">
            <div
              class="w-8 h-8 rounded-lg bg-pmvc-blue/10 text-pmvc-blue flex items-center justify-center"
            >
              <q-icon name="military_tech" size="18px" />
            </div>

            <span class="text-[10px] font-bold uppercase text-slate-400">
              Nível
            </span>
          </div>

          <p class="text-2xl font-extrabold text-slate-900">
            {{ gamificationStore.level }}
          </p>

          <p class="text-[10px] text-slate-500 mt-0.5">
            {{ gamificationStore.levelTitle }}
          </p>
        </div>


        <!-- XP -->
        <div
          class="rounded-xl bg-amber-50 border border-amber-100 p-4"
        >
          <div class="flex items-center gap-2 mb-3">
            <div
              class="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center"
            >
              <q-icon name="bolt" size="18px" />
            </div>

            <span class="text-[10px] font-bold uppercase text-slate-400">
              Experiência
            </span>
          </div>

          <p class="text-2xl font-extrabold text-slate-900">
            {{ gamificationStore.xpPoints }}
          </p>

          <p class="text-[10px] text-slate-500 mt-0.5">
            XP acumulado
          </p>
        </div>


        <!-- Conquistas -->
        <div
          class="rounded-xl bg-emerald-50 border border-emerald-100 p-4"
        >
          <div class="flex items-center gap-2 mb-3">
            <div
              class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center"
            >
              <q-icon name="emoji_events" size="18px" />
            </div>

            <span class="text-[10px] font-bold uppercase text-slate-400">
              Conquistas
            </span>
          </div>

          <p class="text-2xl font-extrabold text-slate-900">
            {{ gamificationStore.earnedBadges.length }}
          </p>

          <p class="text-[10px] text-slate-500 mt-0.5">
            de {{ gamificationStore.badges.length }} disponíveis
          </p>
        </div>

      </div>


      <!-- Barra de XP -->
      <div class="mt-6">

        <div class="flex items-center justify-between mb-2">
          <span class="text-[10px] font-bold uppercase text-slate-400">
            Progresso para o nível {{ gamificationStore.level + 1 }}
          </span>

          <span class="text-[10px] font-extrabold text-pmvc-blue">
            {{ gamificationStore.xpProgress }}%
          </span>
        </div>

        <q-linear-progress
          :value="gamificationStore.xpProgress / 100"
          size="10px"
          rounded
          color="primary"
          track-color="slate-100"
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

    <!-- ===================================================== -->
    <!-- HISTÓRICO DE CERTIFICADOS -->
    <!-- ===================================================== -->
    <div
      v-if="authStore.isServidor"
      class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7"
    >

      <div class="mb-5">
        <div class="flex items-center gap-2">
          <q-icon name="workspace_premium" class="text-emerald-500" />

          <h2 class="text-base font-extrabold text-slate-800">
            Histórico de certificados
          </h2>
        </div>

        <p class="text-[10px] text-slate-400 mt-1">
          Certificados que você já conquistou.
        </p>
      </div>


      <!-- Nenhum certificado -->
      <div
        v-if="certificateStore.certificates.length === 0"
        class="text-center py-8"
      >
        <q-icon
          name="workspace_premium"
          size="40px"
          class="text-slate-200"
        />

        <p class="text-xs text-slate-400 mt-2">
          Você ainda não possui certificados.
        </p>
      </div>


      <!-- Lista de certificados -->
      <div
        v-else
        class="space-y-2"
      >
        <div
          v-for="certificate in certificateStore.certificates"
          :key="certificate.id"
          class="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3"
        >

          <div
            class="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0"
          >
            <q-icon
              name="workspace_premium"
              size="20px"
            />
          </div>

          <p class="text-xs font-bold text-slate-800">
            {{ certificate.courseTitle || 'Certificado' }}
          </p>

        </div>
      </div>

    </div>

    <!-- ===================================================== -->
    <!-- SEGURANÇA / CONTA -->
    <!-- ===================================================== -->
    <div
      class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8"
    >

      <div class="mb-5">
        <div class="flex items-center gap-2">
          <q-icon name="security" class="text-emerald-500" />

          <h2 class="text-base font-extrabold text-slate-800">
            Segurança e conta
          </h2>
        </div>

        <p class="text-[10px] text-slate-400 mt-1">
          Informações relacionadas à sua conta e privacidade.
        </p>
      </div>


      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >

        <div
          class="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200"
        >
          <q-icon name="verified_user" />

          Termo LGPD aceito em
          {{ formatDate(authStore.user?.lgpdAcceptedAt) }}
        </div>


        <q-btn
          label="Sair da Conta"
          color="negative"
          flat
          icon="logout"
          no-caps
          @click="authStore.logout(); $router.push('/login')"
        />

      </div>

    </div>

  </q-page>
</template>


<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from 'src/stores/authStore';
import { useGamificationStore } from 'src/stores/gamificationStore';
import { useCertificateStore } from 'src/stores/certificateStore';

const authStore = useAuthStore();
const gamificationStore = useGamificationStore();
const certificateStore = useCertificateStore();

const formatDate = (date) => {
  if (!date) return '---';

  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

onMounted(async () => {
  try {
    await authStore.fetchProfile();

    if (authStore.isServidor) {
      await certificateStore.fetchMyCertificates();
    }
  } catch (error) {
    console.error('Erro ao carregar perfil:', error);
  }
});
</script>