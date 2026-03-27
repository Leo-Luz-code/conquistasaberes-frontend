<template>
  <q-page class="q-pa-md q-pa-lg-xl bg-pmvc-bg min-h-screen animate-fade-in-down">
    
    <div class="row q-col-gutter-lg q-mb-xl cards-dashboard-row">
      
      <div 
        v-for="card in infoDashboard" 
        :key="card.title" 
        class="col-12 col-sm-6 col-md-3"
      >
        <CardDashboard
          :amount="card.amount"
          :title="card.title"
          :icon="card.icon"
          :icon-color="card.iconColor"
        />
      </div>

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
    amount: 10,
    icon: 'people',
    iconColor: 'warning', 
    title: 'Usuários',
  },
  {
    amount: 15,
    icon: 'favorite',
    iconColor: 'negative', 
    title: 'Favoritos',
  },
]);
</script>

<style scoped>
@media (min-width: 1024px) and (max-width: 1150px) {
  :deep(.cards-dashboard-row > div) {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

@media (min-width: 1230px) {
  :deep(.cards-dashboard-row > div) {
    flex: 0 0 25%;
    max-width: 25%;
  }
}
</style>