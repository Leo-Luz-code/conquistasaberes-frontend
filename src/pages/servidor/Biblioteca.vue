<template>
  <q-page class="p-4 sm:p-8 max-w-6xl mx-auto space-y-6 font-sans">
    <div><h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900">Biblioteca</h1><p class="text-xs sm:text-sm text-slate-500">Normativos, manuais, cartilhas, boletins e modelos para apoio ao servidor.</p></div>

    <q-input outlined dense v-model="searchQuery" placeholder="Buscar por título, categoria ou palavra-chave..." class="bg-white rounded-xl" hide-bottom-space><template #prepend><q-icon name="search" class="text-pmvc-blue" /></template></q-input>

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      <div v-for="cat in categories" :key="cat.nome" class="bg-white rounded-2xl border border-slate-200 p-5 text-center space-y-2 cursor-pointer transition-all hover:shadow-md hover:border-pmvc-blue/40" :class="{ '!border-pmvc-blue !ring-1 !ring-pmvc-blue/30': selectedCategory === cat.nome }" @click="toggleCategory(cat.nome)">
        <div class="w-11 h-11 mx-auto bg-blue-50 text-pmvc-blue rounded-xl flex items-center justify-center"><q-icon :name="cat.icon" size="22px" /></div><h3 class="font-bold text-slate-800 text-sm leading-snug">{{ cat.nome }}</h3><span class="text-[11px] text-pmvc-blue font-semibold">{{ cat.total }} {{ cat.total === 1 ? 'item' : 'itens' }}</span>
      </div>
    </div>

    <div class="space-y-4 pt-2">
      <h2 class="text-lg font-bold text-slate-800">Materiais em destaque</h2>
      <div v-if="loading" class="flex justify-center py-16"><q-spinner-dots color="primary" size="50px" /></div>
      <div v-else-if="materials.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="material in materials" :key="material.id" class="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
          <div class="w-11 h-11 shrink-0 rounded-xl flex items-center justify-center font-extrabold text-[10px] uppercase" :class="fileTypeStyle(tipoArquivo(material.documentoUrl)).bg"><span :class="fileTypeStyle(tipoArquivo(material.documentoUrl)).text">{{ tipoArquivo(material.documentoUrl) }}</span></div>
          <div class="flex-1 min-w-0"><h3 class="font-bold text-slate-900 text-sm leading-snug truncate">{{ material.titulo }}</h3><div class="flex items-center gap-2 mt-1"><span class="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-semibold rounded-md">{{ material.categoria }}</span></div></div>
          <a :href="urlArquivo(material.documentoUrl)" target="_blank" rel="noopener noreferrer" class="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:border-pmvc-blue hover:text-pmvc-blue transition-colors"><q-icon name="download" size="18px" /></a>
        </div>
      </div>
      <div v-else class="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3"><q-icon name="folder_off" size="56px" class="text-slate-300" /><h3 class="font-bold text-slate-700 text-lg">Nenhum material encontrado</h3><p class="text-xs text-slate-500">Tente ajustar a busca ou selecionar outra categoria.</p></div>
    </div>
  </q-page>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

const $q = useQuasar()
const loading = ref(false)
const searchQuery = ref('')
const selectedCategory = ref(null)
const materials = ref([])
const categories = ref([])
let searchTimer

const iconesCategoria = { Normativos: 'description', 'Materiais de aula': 'menu_book', 'Guias rápidos': 'article', 'Boletins técnicos': 'summarize', 'Modelos e documentos': 'file_copy' }

async function carregarCategorias() {
  try { const { data } = await api.get('/library/categories'); categories.value = data.map((item) => ({ ...item, nome: item.categoria, icon: iconesCategoria[item.categoria] || 'folder' })) }
  catch (error) { notificarErro(error, 'Não foi possível carregar as categorias.') }
}
async function carregarMateriais() {
  loading.value = true
  try { const { data } = await api.get('/library', { params: { page: 1, limit: 100, ...(searchQuery.value.trim() && { search: searchQuery.value.trim() }), ...(selectedCategory.value && { categoria: selectedCategory.value }) } }); materials.value = data.data }
  catch (error) { materials.value = []; notificarErro(error, 'Não foi possível carregar os materiais.') }
  finally { loading.value = false }
}

function toggleCategory(categoria) { selectedCategory.value = selectedCategory.value === categoria ? null : categoria }
watch([searchQuery, selectedCategory], () => { clearTimeout(searchTimer); searchTimer = setTimeout(carregarMateriais, 350) })
onMounted(async () => { await Promise.all([carregarCategorias(), carregarMateriais()]) })
onBeforeUnmount(() => clearTimeout(searchTimer))

function tipoArquivo(url) { const path = String(url || '').split('?')[0]; return path.includes('.') ? path.split('.').pop().toUpperCase() : 'ARQ' }
function urlArquivo(url) { const value = String(url || ''); if (value.startsWith('http://') || value.startsWith('https://')) return value; return `${(api.defaults.baseURL || '').replace(/\/+$/, '')}/${value.replace(/^\/+/, '')}` }
function fileTypeStyle(tipo) { const map = { PDF: { bg: 'bg-amber-100', text: 'text-amber-700' }, DOC: { bg: 'bg-blue-100', text: 'text-pmvc-blue' }, DOCX: { bg: 'bg-blue-100', text: 'text-pmvc-blue' }, XLS: { bg: 'bg-green-100', text: 'text-green-700' }, XLSX: { bg: 'bg-green-100', text: 'text-green-700' } }; return map[tipo] || { bg: 'bg-slate-100', text: 'text-slate-600' } }
function notificarErro(error, fallback) { const message = error?.response?.data?.message; $q.notify({ type: 'negative', message: Array.isArray(message) ? message.join(', ') : message || fallback }) }
</script>