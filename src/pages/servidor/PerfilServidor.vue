<template>
  <q-page class="p-4 sm:p-8 max-w-4xl mx-auto space-y-6 font-sans">
    <div class="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div class="flex items-center gap-4 pb-6 border-b border-slate-100">
        <div class="w-16 h-16 bg-pmvc-blue text-white rounded-2xl flex items-center justify-center font-extrabold text-2xl shadow-md">
          {{ authStore.userInitial }}
        </div>
        <div>
          <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900">{{ authStore.userName }}</h1>
          <p class="text-xs text-pmvc-blue font-bold uppercase tracking-wider">
            {{ authStore.roleLabel }} • {{ authStore.userSecretaria || 'PMVC' }}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-slate-700">
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
          <span class="text-xs font-semibold text-slate-400 uppercase">CPF</span>
          <span class="block font-bold text-slate-900">{{ authStore.user?.cpf || '---' }}</span>
        </div>

        <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
          <span class="text-xs font-semibold text-slate-400 uppercase">Matrícula Funcional</span>
          <span class="block font-bold text-slate-900">{{ authStore.user?.matricula || '---' }}</span>
        </div>

        <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
          <span class="text-xs font-semibold text-slate-400 uppercase">E-mail Institucional</span>
          <span class="block font-bold text-slate-900">{{ authStore.user?.email || '---' }}</span>
        </div>

        <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
          <span class="text-xs font-semibold text-slate-400 uppercase">Cargo / Função</span>
          <span class="block font-bold text-slate-900">{{ authStore.userCargo || '---' }}</span>
        </div>
      </div>

      <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div class="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          <q-icon name="verified_user" /> Termo LGPD Aceito em {{ formatDate(authStore.user?.lgpdAcceptedAt) }}
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
import { useAuthStore } from 'src/stores/authStore';

const authStore = useAuthStore();

function formatDate(dateStr) {
  if (!dateStr) return 'Recente';
  return new Date(dateStr).toLocaleDateString('pt-BR');
}
</script>
