<template>
  <q-page class="p-4 md:p-8 w-full max-w-7xl mx-auto space-y-8 font-sans">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight mb-2">
          Notícias UniVC
        </h1>
        <p class="text-slate-500 text-sm md:text-base">
          Acompanhe novidades, lançamentos e comunicados da Universidade do Servidor Público.
        </p>
      </div>

      <!-- Filtro por Categoria -->
      <div class="flex items-center gap-2">
        <q-select
          v-model="filtroCategoria"
          :options="opcoesCategorias"
          outlined
          dense
          bg-color="white"
          class="w-48 font-medium rounded-xl"
        >
          <template v-slot:prepend>
            <q-icon name="filter_list" class="text-slate-400" />
          </template>
        </q-select>
      </div>
    </div>

    <!-- State Skeleton / Loading -->
    <div v-if="noticiaStore.loading" class="space-y-6">
      <q-skeleton height="300px" class="rounded-3xl" />
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <q-skeleton height="240px" class="rounded-2xl" />
        <q-skeleton height="240px" class="rounded-2xl" />
        <q-skeleton height="240px" class="rounded-2xl" />
      </div>
    </div>

    <template v-else>
      <!-- Destaque Principal (Se existir notícia marcada como Destaque) -->
      <div
        v-if="noticiaDestaque"
        class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md duration-300 flex flex-col md:flex-row cursor-pointer group"
        @click="abrirNoticia(noticiaDestaque)"
      >
        <!-- Imagem/Gradiente Destaque -->
        <div class="md:w-1/2 relative min-h-[280px] sm:min-h-[340px] overflow-hidden bg-slate-900">
          <img
            v-if="noticiaDestaque.capaUrl"
            :src="noticiaDestaque.capaUrl"
            :alt="noticiaDestaque.titulo"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

          <div class="absolute bottom-6 left-6 right-6 text-white z-10 space-y-2">
            <div class="flex items-center gap-2 flex-wrap">
              <q-chip color="amber-500" text-color="white" class="font-bold shadow-sm" size="sm">
                Destaque
              </q-chip>
              <q-badge color="white" text-color="slate-900" class="font-bold">
                {{ noticiaDestaque.categoria }}
              </q-badge>
              <q-badge v-if="noticiaDestaque.secretariaAlvoSigla" color="blue-6" text-color="white" class="font-bold">
                {{ noticiaDestaque.secretariaAlvoSigla }}
              </q-badge>
            </div>

            <h2 class="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-tight drop-shadow-md">
              {{ noticiaDestaque.titulo }}
            </h2>

            <div class="flex items-center text-slate-300 text-xs font-medium gap-4 pt-1">
              <span class="flex items-center gap-1">
                <q-icon name="calendar_today" />
                {{ formatarData(noticiaDestaque.dataPublicacao) }}
              </span>
              <span class="flex items-center gap-1">
                <q-icon name="visibility" />
                {{ noticiaDestaque.visualizacoes }} leituras
              </span>
            </div>
          </div>
        </div>

        <!-- Conteúdo Destaque -->
        <div class="md:w-1/2 p-6 sm:p-10 flex flex-col justify-between space-y-6">
          <div class="space-y-4">
            <p v-if="noticiaDestaque.subtitulo" class="text-slate-700 font-semibold text-base sm:text-lg leading-snug">
              {{ noticiaDestaque.subtitulo }}
            </p>
            <p class="text-slate-500 text-sm leading-relaxed line-clamp-4">
              {{ noticiaDestaque.conteudo }}
            </p>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-slate-100">
            <span class="text-xs text-slate-400 font-medium">
              Por: {{ noticiaDestaque.autorNome || 'Assessoria UniVC' }}
            </span>
            <q-btn
              unelevated
              color="primary"
              label="Ler matéria completa"
              icon-right="arrow_forward"
              class="rounded-xl px-5 font-bold bg-[#1b4b7f] hover:bg-[#153a63]"
              @click.stop="abrirNoticia(noticiaDestaque)"
            />
          </div>
        </div>
      </div>

      <!-- Grid de Notícias Secundárias -->
      <div v-if="outrasNoticias.length > 0" class="space-y-4">
        <h3 class="text-lg font-bold text-slate-800">Mais Notícias e Publicações</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <q-card
            v-for="item in outrasNoticias"
            :key="item.id"
            flat
            class="rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md hover:border-slate-200 transition-all duration-300 cursor-pointer flex flex-col justify-between h-full group bg-white"
            @click="abrirNoticia(item)"
          >
            <div>
              <!-- Capa com Tags -->
              <div class="h-44 bg-slate-100 relative overflow-hidden">
                <img
                  v-if="item.capaUrl"
                  :src="item.capaUrl"
                  :alt="item.titulo"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div v-else class="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                  <q-icon name="newspaper" size="48px" />
                </div>

                <div class="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                  <q-chip color="white" text-color="slate-800" class="font-bold shadow-sm" size="sm">
                    {{ item.categoria }}
                  </q-chip>
                  <q-chip
                    v-if="item.secretariaAlvoSigla && item.secretariaAlvoSigla !== 'Todas as Secretarias'"
                    color="blue-7"
                    text-color="white"
                    class="font-bold shadow-sm"
                    size="sm"
                  >
                    {{ item.secretariaAlvoSigla }}
                  </q-chip>
                </div>
              </div>

              <!-- Conteúdo Card -->
              <q-card-section class="p-5 space-y-2">
                <div class="text-xs text-slate-400 flex items-center gap-3">
                  <span class="flex items-center gap-1">
                    <q-icon name="calendar_today" />
                    {{ formatarData(item.dataPublicacao) }}
                  </span>
                  <span>•</span>
                  <span class="flex items-center gap-1">
                    <q-icon name="visibility" />
                    {{ item.visualizacoes }}
                  </span>
                </div>

                <h4 class="text-base font-bold text-slate-800 leading-snug group-hover:text-pmvc-blue transition-colors line-clamp-2">
                  {{ item.titulo }}
                </h4>

                <p class="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {{ item.subtitulo || item.conteudo }}
                </p>
              </q-card-section>
            </div>

            <q-card-actions class="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
              <span class="text-slate-400 truncate">Por: {{ item.autorNome || 'Redação UniVC' }}</span>
              <span class="text-pmvc-blue font-bold flex items-center gap-0.5">
                Ler mais <q-icon name="chevron_right" />
              </span>
            </q-card-actions>
          </q-card>
        </div>
      </div>

      <!-- Estado Vazio -->
      <div v-else-if="!noticiaDestaque" class="bg-white rounded-2xl p-12 text-center border border-slate-100">
        <q-icon name="newspaper" size="48px" class="text-slate-300 mb-3" />
        <h3 class="text-base font-bold text-slate-700">Nenhuma notícia encontrada</h3>
        <p class="text-xs text-slate-400 mt-1">Não há publicações ativas para o filtro selecionado.</p>
      </div>
    </template>

    <!-- MODAL DE LEITURA COMPLETA DA NOTÍCIA -->
    <q-dialog v-model="modalLeitura">
      <q-card style="min-width: 350px; max-width: 750px" class="w-full rounded-3xl overflow-hidden" v-if="noticiaSelecionada">
        <!-- Header da Matéria -->
        <div class="h-64 sm:h-80 bg-slate-900 relative overflow-hidden">
          <img
            v-if="noticiaSelecionada.capaUrl"
            :src="noticiaSelecionada.capaUrl"
            :alt="noticiaSelecionada.titulo"
            class="w-full h-full object-cover opacity-80"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>

          <div class="absolute top-4 right-4 z-10">
            <q-btn flat round dense icon="close" v-close-popup text-color="white" class="bg-black/40 backdrop-blur-sm" />
          </div>

          <div class="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div class="flex items-center gap-2 flex-wrap">
              <q-chip color="amber-500" text-color="white" size="xs" class="font-bold">
                {{ noticiaSelecionada.categoria }}
              </q-chip>
              <q-badge color="blue-6" text-color="white" class="font-bold">
                {{ noticiaSelecionada.secretariaAlvoSigla }}
              </q-badge>
            </div>
            <h2 class="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-tight">
              {{ noticiaSelecionada.titulo }}
            </h2>
            <div class="text-xs text-slate-300 flex items-center gap-4">
              <span>{{ formatarData(noticiaSelecionada.dataPublicacao) }}</span>
              <span>Por: {{ noticiaSelecionada.autorNome || 'Assessoria UniVC' }}</span>
              <span>{{ noticiaSelecionada.visualizacoes }} leituras</span>
            </div>
          </div>
        </div>

        <!-- Conteúdo Completo -->
        <q-card-section class="p-6 sm:p-8 space-y-6">
          <p v-if="noticiaSelecionada.subtitulo" class="text-base sm:text-lg font-semibold text-slate-700 italic border-l-4 border-[#1b4b7f] pl-4 py-1">
            {{ noticiaSelecionada.subtitulo }}
          </p>

          <div class="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line">
            {{ noticiaSelecionada.conteudo }}
          </div>
        </q-card-section>

        <!-- Rodapé do Modal -->
        <q-card-actions align="right" class="p-4 border-t border-slate-100 bg-slate-50">
          <q-btn flat label="Fechar" color="primary" class="font-bold rounded-xl" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useNoticiaStore } from 'src/stores/noticiaStore'
import { useAuthStore } from 'src/stores/authStore'

const noticiaStore = useNoticiaStore()
const authStore = useAuthStore()

const filtroCategoria = ref('Todas')
const modalLeitura = ref(false)
const noticiaSelecionada = ref(null)

const opcoesCategorias = ['Todas', 'Destaque', 'Trilhas', 'Inovação', 'Saúde', 'Educação', 'Plataforma', 'Geral']

// Notícias Filtradas
const noticiasPublicadas = computed(() => {
  return noticiaStore.noticias.filter((n) => {
    if (!n.publicada) return false
    if (filtroCategoria.value !== 'Todas' && n.categoria !== filtroCategoria.value) return false
    return true
  })
})

const noticiaDestaque = computed(() => {
  return noticiasPublicadas.value.find((n) => n.destaque) || noticiasPublicadas.value[0]
})

const outrasNoticias = computed(() => {
  if (!noticiaDestaque.value) return noticiasPublicadas.value
  return noticiasPublicadas.value.filter((n) => n.id !== noticiaDestaque.value.id)
})

function abrirNoticia(item) {
  noticiaSelecionada.value = item
  modalLeitura.value = true
  // Incrementa contador na store se necessário
  item.visualizacoes = (item.visualizacoes || 0) + 1
}

function formatarData(dataIso) {
  if (!dataIso) return '-'
  return new Date(dataIso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

onMounted(() => {
  // Passa apenas publicadas true e o ID da secretaria do usuário logado (se houver)
  const secretariaId = authStore.user?.secretariaId || null
  noticiaStore.fetchNoticias(true, secretariaId)
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
