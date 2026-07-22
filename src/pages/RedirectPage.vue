<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50">
    <q-spinner-dots color="primary" size="50px" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  await authStore.initSystem();

  if (!authStore.isAuthenticated) {
    router.replace('/login');
    return;
  }

  // Se o servidor ainda não aceitou os termos da LGPD, força a rota /lgpd
  if (authStore.user && authStore.user.lgpdAccepted === false) {
    router.replace('/lgpd');
    return;
  }

  // Redirecionamento baseado no perfil (Role)
  if (authStore.isGestorOrAdmin) {
    router.replace('/gestor/dashboard');
  } else {
    router.replace('/servidor/dashboard');
  }
});
</script>
