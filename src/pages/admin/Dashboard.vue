<template>
  <q-page padding>
    <div class="row flex justify-around">
      <CardDashboard :infoDashboard="infoDashboard" />
    </div>
  </q-page>
</template>

<script setup>
import CardDashboard from 'src/components/dashboard/CardDashboard.vue';
import { ref } from 'vue';

const infoDashboard = ref([
  {
    amount: 10,
    icon: 'home',
    iconColor: 'positive', 
    title: 'Início',
  },
  {
    amount: 5,
    icon: 'settings',
    iconColor: 'primary', 
    title: 'Administradores',
  },
  {
    amount: 15,
    icon: 'favorite',
    iconColor: 'negative', 
    title: 'Favoritos',
  },
]);
</script>

<style scoped></style>
