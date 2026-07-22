<template>
  <q-page class="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 font-sans">
    <!-- Cabecalho -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900">Catálogo de Cursos & Trilhas</h1>
        <p class="text-xs sm:text-sm text-slate-500">Capacitações oficiais da Prefeitura Municipal de Vitória da Conquista</p>
      </div>

      <!-- Busca e Filtros -->
      <div class="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <q-input
          outlined
          dense
          v-model="searchQuery"
          placeholder="Buscar por título ou tema..."
          class="w-full sm:w-64 bg-white"
          hide-bottom-space
          @update:model-value="onSearch"
        >
          <template v-slot:prepend>
            <q-icon name="search" class="text-pmvc-blue" />
          </template>
        </q-input>

        <q-select
          outlined
          dense
          v-model="selectedCategory"
          :options="categories"
          label="Categoria"
          class="w-full sm:w-44 bg-white"
          hide-bottom-space
          @update:model-value="onSearch"
        />
      </div>
    </div>

    <!-- Lista de Cursos -->
    <div v-if="courseStore.loading" class="flex justify-center py-16">
      <q-spinner-dots color="primary" size="50px" />
    </div>

    <div v-else-if="courseStore.courses.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="course in courseStore.courses"
        :key="course.id"
        class="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
      >
        <!-- Header do Card -->
        <div class="p-6 space-y-3">
          <div class="flex items-center justify-between">
            <span class="px-2.5 py-1 bg-blue-50 text-pmvc-blue font-bold text-[10px] uppercase rounded-md tracking-wider">
              {{ course.categoria || 'Geral' }}
            </span>
            <span class="text-xs font-bold text-slate-400 flex items-center gap-1">
              <q-icon name="schedule" /> {{ course.cargaHoraria }}h
            </span>
          </div>

          <h3 class="font-bold text-slate-900 text-lg leading-snug line-clamp-2">
            {{ course.titulo }}
          </h3>

          <p class="text-xs text-slate-500 line-clamp-3 leading-relaxed">
            {{ course.descricao }}
          </p>

          <div v-if="course.secretaria" class="flex items-center gap-1.5 text-xs text-slate-600 font-semibold pt-2">
            <q-icon name="account_balance" class="text-pmvc-blue" />
            <span>Exclusivo: {{ course.secretaria.nome }}</span>
          </div>
        </div>

        <!-- Footer / Acao -->
        <div class="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
          <div>
            <span class="block text-[10px] uppercase font-bold text-slate-400">Recompensa</span>
            <span class="text-xs font-extrabold text-amber-600 flex items-center gap-1">
              <q-icon name="emoji_events" /> +{{ (course.cargaHoraria || 10) * 10 }} XP
            </span>
          </div>

          <router-link
            :to="`/servidor/cursos/${course.id}`"
            class="py-2.5 px-5 bg-pmvc-blue hover:bg-blue-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow"
          >
            ACESSAR CURSO
          </router-link>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
      <q-icon name="search_off" size="56px" class="text-slate-300" />
      <h3 class="font-bold text-slate-700 text-lg">Nenhum curso encontrado</h3>
      <p class="text-xs text-slate-500">Tente ajustar os filtros de busca ou categoria acima.</p>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCourseStore } from 'src/stores/courseStore';

const courseStore = useCourseStore();
const searchQuery = ref('');
const selectedCategory = ref('Todas');

const categories = ['Todas', 'Geral', 'Tecnologia', 'Saúde', 'Educação', 'Gestão Pública', 'LGPD'];

function onSearch() {
  courseStore.fetchCourses({
    search: searchQuery.value,
    categoria: selectedCategory.value,
  });
}

onMounted(() => {
  courseStore.fetchCourses();
});
</script>
