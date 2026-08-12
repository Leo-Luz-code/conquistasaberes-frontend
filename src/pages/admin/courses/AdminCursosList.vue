<template>
  <q-page class="q-pa-md bg-grey-1">
    <div class="row items-center q-mb-md">
      <div class="col-12 text-h5 text-weight-bold text-primary row items-center">
        <q-icon name="menu_book" class="q-mr-sm" size="28px" />
        Gestão de Catálogo (Cursos, Trilhas e Eixos)
      </div>
    </div>

    <q-card flat bordered class="bg-white rounded-borders">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="left"
        narrow-indicator
      >
        <q-tab name="cursos" icon="school" label="Cursos" />
        <q-tab name="trilhas" icon="alt_route" label="Trilhas de Aprendizagem" />
        <q-tab name="eixos" icon="account_tree" label="Eixos de Conhecimento" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="cursos" class="q-pa-none">
          <AdminCursosTable />
        </q-tab-panel>

        <q-tab-panel name="trilhas" class="q-pa-none">
          <AdminTrilhasList />
        </q-tab-panel>

        <q-tab-panel name="eixos" class="q-pa-none">
          <AdminEixosList />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import AdminCursosTable from './AdminCursosTable.vue';
import AdminTrilhasList from './AdminTrilhasList.vue';
import AdminEixosList from './AdminEixosList.vue';

const tab = ref('cursos');
</script>
