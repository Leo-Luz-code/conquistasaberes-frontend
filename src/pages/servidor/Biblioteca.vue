<template>
  <q-page class="p-4 sm:p-8 max-w-6xl mx-auto space-y-6 font-sans">
    <!-- Cabecalho -->
    <div>
      <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900">Biblioteca</h1>
      <p class="text-xs sm:text-sm text-slate-500">
        Normativos, manuais, cartilhas, boletins e modelos para apoio ao servidor.
      </p>
    </div>

    <!-- Busca -->
    <q-input
      outlined
      dense
      v-model="searchQuery"
      placeholder="Buscar por título, categoria ou palavra-chave..."
      class="bg-white rounded-xl"
      hide-bottom-space
      @update:model-value="onSearch"
    >
      <template v-slot:prepend>
        <q-icon name="search" class="text-pmvc-blue" />
      </template>
    </q-input>

    <!-- Cards de Categoria -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      <div
        v-for="cat in categories"
        :key="cat.id"
        class="bg-white rounded-2xl border border-slate-200 p-5 text-center space-y-2 cursor-pointer transition-all hover:shadow-md hover:border-pmvc-blue/40"
        :class="{ '!border-pmvc-blue !ring-1 !ring-pmvc-blue/30': selectedCategory === cat.id }"
        @click="toggleCategory(cat.id)"
      >
        <div class="w-11 h-11 mx-auto bg-blue-50 text-pmvc-blue rounded-xl flex items-center justify-center">
          <q-icon :name="cat.icon" size="22px" />
        </div>
        <h3 class="font-bold text-slate-800 text-sm leading-snug">{{ cat.nome }}</h3>
        <span class="text-[11px] text-pmvc-blue font-semibold">{{ cat.total }} itens</span>
      </div>
    </div>

    <!-- Materiais em Destaque -->
    <div class="space-y-4 pt-2">
      <h2 class="text-lg font-bold text-slate-800">Materiais em destaque</h2>

      <div v-if="loading" class="flex justify-center py-16">
        <q-spinner-dots color="primary" size="50px" />
      </div>

      <div v-else-if="filteredMaterials.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="material in filteredMaterials"
          :key="material.id"
          class="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all"
        >
          <div
            class="w-11 h-11 shrink-0 rounded-xl flex items-center justify-center font-extrabold text-[10px] uppercase"
            :class="fileTypeStyle(material.tipo).bg"
          >
            <span :class="fileTypeStyle(material.tipo).text">{{ material.tipo }}</span>
          </div>

          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-slate-900 text-sm leading-snug truncate">{{ material.titulo }}</h3>
            <div class="flex items-center gap-2 mt-1">
              <span class="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-semibold rounded-md">
                {{ material.categoria }}
              </span>
              <span class="text-[11px] text-slate-400">{{ material.tamanho }}</span>
            </div>
          </div>

          
          <a :href="material.downloadUrl"
            target="_blank"
            class="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:border-pmvc-blue hover:text-pmvc-blue transition-colors"
          >
            <q-icon name="download" size="18px" />
          </a>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
        <q-icon name="folder_off" size="56px" class="text-slate-300" />
        <h3 class="font-bold text-slate-700 text-lg">Nenhum material encontrado</h3>
        <p class="text-xs text-slate-500">Tente ajustar a busca ou selecionar outra categoria.</p>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
// import { useLibraryStore } from 'src/stores/libraryStore';
// const libraryStore = useLibraryStore();

const loading = ref(false);
const searchQuery = ref('');
const selectedCategory = ref(null);

// ---------------------------------------------------------------------------
// MOCK DATA — substituir por libraryStore.categories / libraryStore.materials
// ---------------------------------------------------------------------------
const categories = ref([
  { id: 'normativos', nome: 'Normativos', icon: 'description', total: 18 },
  { id: 'materiais-aula', nome: 'Materiais de aula', icon: 'menu_book', total: 42 },
  { id: 'guias-rapidos', nome: 'Guias rápidos', icon: 'article', total: 15 },
  { id: 'boletins', nome: 'Boletins técnicos', icon: 'summarize', total: 9 },
  { id: 'modelos', nome: 'Modelos e documentos', icon: 'file_copy', total: 23 },
]);

const materials = ref([
  { id: 1, titulo: 'Guia de Conduta do Servidor', categoria: 'Normativos', tipo: 'PDF', tamanho: '1,2 MB', catId: 'normativos', downloadUrl: '#' },
  { id: 2, titulo: 'Manual de Atendimento ao Cidadão', categoria: 'Guias rápidos', tipo: 'PDF', tamanho: '2,8 MB', catId: 'guias-rapidos', downloadUrl: '#' },
  { id: 3, titulo: 'Cartilha LGPD no Serviço Público', categoria: 'Materiais de aula', tipo: 'PDF', tamanho: '3,4 MB', catId: 'materiais-aula', downloadUrl: '#' },
  { id: 4, titulo: 'Boletim de Governança Municipal — Edição 12', categoria: 'Boletins técnicos', tipo: 'PDF', tamanho: '850 KB', catId: 'boletins', downloadUrl: '#' },
  { id: 5, titulo: 'Modelo de Relatório Técnico', categoria: 'Modelos e documentos', tipo: 'DOCX', tamanho: '120 KB', catId: 'modelos', downloadUrl: '#' },
  { id: 6, titulo: 'Decreto Municipal nº 24.119/2024 — Capacitação', categoria: 'Normativos', tipo: 'PDF', tamanho: '450 KB', catId: 'normativos', downloadUrl: '#' },
]);

const filteredMaterials = computed(() => {
  return materials.value.filter((m) => {
    const matchesCategory = !selectedCategory.value || m.catId === selectedCategory.value;
    const matchesSearch =
      !searchQuery.value ||
      m.titulo.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      m.categoria.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchesCategory && matchesSearch;
  });
});

function toggleCategory(catId) {
  selectedCategory.value = selectedCategory.value === catId ? null : catId;
}

function onSearch() {
  // libraryStore.fetchMaterials({ search: searchQuery.value, categoria: selectedCategory.value });
}

function fileTypeStyle(tipo) {
  const map = {
    PDF: { bg: 'bg-amber-100', text: 'text-amber-700' },
    DOCX: { bg: 'bg-blue-100', text: 'text-pmvc-blue' },
    XLSX: { bg: 'bg-green-100', text: 'text-green-700' },
    PPTX: { bg: 'bg-orange-100', text: 'text-orange-700' },
  };
  return map[tipo] || { bg: 'bg-slate-100', text: 'text-slate-600' };
}
</script>