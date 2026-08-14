<template>
  <q-page class="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 font-sans">
    
    <!-- Cabeçalho -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div>
        <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <q-icon name="workspace_premium" class="text-pmvc-blue" />
          Banco de Talentos
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">
          Encontre servidores que se destacam por competências, áreas de atuação, níveis e pontuação.
        </p>
      </div>
    </div>

    <!-- Filtros de Pesquisa -->
    <div class="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      
      <!-- 1. Pesquisa por Nome -->
      <q-input
        v-model="filtros.search"
        outlined
        dense
        placeholder="Buscar por nome..."
        clearable
        class="bg-slate-50 rounded-xl"
        @update:model-value="carregarTalentos"
      >
        <template v-slot:prepend>
          <q-icon name="search" size="18px" class="text-slate-400" />
        </template>
      </q-input>

      <!-- 2. Filtro por Área -->
      <q-select
        v-model="filtros.area"
        outlined
        dense
        emit-value
        map-options
        :options="areasList"
        placeholder="Filtrar por Área"
        clearable
        class="bg-slate-50 rounded-xl"
        @update:model-value="carregarTalentos"
      >
        <template v-slot:prepend>
          <q-icon name="domain" size="18px" class="text-slate-400" />
        </template>
      </q-select>

      <!-- 3. Filtro por Nível Mínimo -->
      <q-input
        v-model.number="filtros.minLevel"
        type="number"
        outlined
        dense
        placeholder="Nível Mínimo"
        min="1"
        class="bg-slate-50 rounded-xl"
        @update:model-value="carregarTalentos"
      >
        <template v-slot:prepend>
          <q-icon name="trending_up" size="18px" class="text-slate-400" />
        </template>
      </q-input>

      <!-- 4. Filtro por Certificado -->
      <q-select
        v-model="filtros.possuiCertificado"
        outlined
        dense
        emit-value
        map-options
        :options="[
          { label: 'Com Certificado', value: true },
          { label: 'Todos', value: null }
        ]"
        placeholder="Possui Certificado?"
        clearable
        class="bg-slate-50 rounded-xl"
        @update:model-value="carregarTalentos"
      >
        <template v-slot:prepend>
          <q-icon name="verified" size="18px" class="text-slate-400" />
        </template>
      </q-select>

      <!-- Botão Limpar -->
      <div class="flex items-center justify-end">
        <q-btn
          label="Limpar Filtros"
          flat
          dense
          color="primary"
          no-caps
          class="w-full sm:w-auto h-full"
          @click="limparFiltros"
        />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-16">
      <q-spinner-dots color="primary" size="50px" />
    </div>

    <!-- Lista Vazia -->
    <div v-else-if="talentos.length === 0" class="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
      <q-icon name="person_search" size="56px" class="text-slate-300" />
      <h3 class="font-bold text-slate-700 text-lg">Nenhum talento encontrado</h3>
      <p class="text-xs text-slate-500 max-w-md mx-auto">Tente ajustar os termos da busca ou remover os filtros aplicados.</p>
    </div>

    <!-- Grid de Talentos -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="talento in talentos"
        :key="talento.id"
        class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative overflow-hidden"
      >
        <!-- Badge de Score de Destaque -->
        <div class="absolute top-4 right-4 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-xl text-[10px] font-extrabold flex items-center gap-1">
          <q-icon name="star" size="12px" class="text-amber-500" />
          Score: {{ Math.round(talento.scoreDestaque) }}
        </div>

        <!-- Dados Principais -->
        <div class="flex items-start gap-3 pr-16">
          <div class="w-12 h-12 bg-pmvc-blue/10 text-pmvc-blue rounded-2xl flex items-center justify-center font-extrabold text-lg shrink-0">
            {{ talento.nome.charAt(0) }}
          </div>
          <div class="min-w-0 flex-1">
            <h3 class="font-bold text-slate-900 text-base leading-snug truncate">{{ talento.nome }}</h3>
            <p class="text-xs text-slate-500 truncate">{{ talento.cargo || 'Servidor Público' }}</p>
            <q-badge class="mt-1 bg-slate-100 text-slate-700 font-semibold text-[10px]" v-if="talento.secretaria">
              {{ talento.secretaria.sigla || talento.secretaria.nome }}
            </q-badge>
          </div>
        </div>

        <!-- Indicadores -->
        <div class="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
          <div>
            <span class="block text-[9px] font-bold uppercase text-slate-400">Nível</span>
            <span class="font-extrabold text-slate-800 text-xs">{{ talento.level }}</span>
          </div>
          <div>
            <span class="block text-[9px] font-bold uppercase text-slate-400">XP</span>
            <span class="font-extrabold text-amber-600 text-xs">{{ talento.xpPoints }}</span>
          </div>
          <div>
            <span class="block text-[9px] font-bold uppercase text-slate-400">Badges</span>
            <span class="font-extrabold text-emerald-600 text-xs">{{ talento.userBadges.length }}</span>
          </div>
        </div>

        <!-- Skills / Competências -->
        <div>
          <span class="block text-[10px] font-semibold text-slate-400 uppercase mb-1.5">Competências Desenvolvidas</span>
          <div class="flex flex-wrap gap-1">
            <template v-if="talento.userSkills && talento.userSkills.length > 0">
              <span
                v-for="us in talento.userSkills.slice(0, 3)"
                :key="us.id"
                class="px-2 py-0.5 bg-blue-50 text-pmvc-blue text-[10px] font-bold rounded-lg border border-blue-100"
              >
                {{ us.skill.nome }} (Nível {{ us.nivel }})
              </span>
            </template>
            <span v-else class="text-[10px] text-slate-400 italic">Nenhuma competência registrada</span>
          </div>
        </div>

        <!-- Ação -->
        <q-btn
          label="Ver Perfil Completo"
          color="primary"
          flat
          dense
          no-caps
          class="w-full font-bold text-xs bg-pmvc-blue/5 hover:bg-pmvc-blue/10 rounded-xl py-2"
          @click="abrirDetalhes(talento.id)"
        />
      </div>
    </div>

    <!-- Modal Detalhes do Talento -->
    <q-dialog v-model="modalDetalhes">
      <q-card class="rounded-2xl p-4 max-w-lg w-full space-y-4">
        <div v-if="talentoSelecionado" class="space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 class="text-lg font-extrabold text-slate-900">{{ talentoSelecionado.nome }}</h3>
              <p class="text-xs text-slate-500">{{ talentoSelecionado.cargo }} • {{ talentoSelecionado.secretaria?.nome || 'PMVC' }}</p>
            </div>
            <q-btn icon="close" flat round dense v-close-popup />
          </div>

          <!-- Métricas Resumidas -->
          <div class="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
            <div>
              <span class="block text-[9px] font-bold uppercase text-slate-400">Score Geral</span>
              <span class="font-extrabold text-amber-600 text-sm">{{ Math.round(talentoSelecionado.scoreDestaque || 0) }}</span>
            </div>
            <div>
              <span class="block text-[9px] font-bold uppercase text-slate-400">XP Total</span>
              <span class="font-extrabold text-slate-800 text-sm">{{ talentoSelecionado.xpPoints }}</span>
            </div>
            <div>
              <span class="block text-[9px] font-bold uppercase text-slate-400">Certificados</span>
              <span class="font-extrabold text-emerald-600 text-sm">{{ talentoSelecionado.certificates?.length || 0 }}</span>
            </div>
          </div>

          <!-- Habilidades Detalhadas -->
          <div>
            <h4 class="text-xs font-bold uppercase text-slate-400 mb-2">Habilidades e Níveis</h4>
            <div class="space-y-2 max-h-32 overflow-y-auto pr-1">
              <template v-if="talentoSelecionado.userSkills && talentoSelecionado.userSkills.length > 0">
                <div v-for="us in talentoSelecionado.userSkills" :key="us.id" class="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl text-xs border border-slate-100">
                  <span class="font-bold text-slate-700">{{ us.skill.nome }}</span>
                  <span class="text-pmvc-blue font-semibold bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">Nível {{ us.nivel }}</span>
                </div>
              </template>
              <span v-else class="text-[11px] text-slate-400 italic">Nenhuma habilidade registrada</span>
            </div>
          </div>

          <!-- Certificados Detalhados -->
          <div>
            <h4 class="text-xs font-bold uppercase text-slate-400 mb-2">Certificados Obtidos</h4>
            <div class="space-y-2 max-h-32 overflow-y-auto pr-1">
              <template v-if="talentoSelecionado.certificates && talentoSelecionado.certificates.length > 0">
                <div v-for="cert in talentoSelecionado.certificates" :key="cert.id" class="flex items-center gap-2 bg-emerald-50/50 p-2.5 rounded-xl text-xs border border-emerald-100">
                  <q-icon name="verified" size="16px" class="text-emerald-600 shrink-0" />
                  <span class="font-bold text-slate-700 truncate">
                    {{ cert.nome || cert.titulo || cert.name || cert.curso?.titulo || cert.course?.titulo || 'Certificado Oficial' }}
                  </span>
                </div>
              </template>
              <span v-else class="text-[11px] text-slate-400 italic">Nenhum certificado registrado</span>
            </div>
          </div>

        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

const $q = useQuasar()
const loading = ref(false)
const talentos = ref([])
const skillsList = ref([])
const areasList = ref(['Tecnologia', 'Gestão', 'Atendimento', 'Educação', 'Saúde'])

const filtros = reactive({
  search: '',
  categoria: null,
  skillId: null,
  minLevel: null
})

const modalDetalhes = ref(false)
const talentoSelecionado = ref(null)

async function carregarTalentos() {
  loading.value = true
  try {
    const params = {}
    if (filtros.search) params.search = filtros.search
    if (filtros.categoria) params.categoria = filtros.categoria
    if (filtros.skillId) params.skillId = filtros.skillId
    if (filtros.minLevel) params.minLevel = filtros.minLevel

    const { data } = await api.get('/talentos', { params })
    talentos.value = data
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Erro ao buscar talentos.' })
  } finally {
    loading.value = false
  }
}

async function carregarSkills() {
  try {
    const { data } = await api.get('/skills')
    skillsList.value = data
  } catch (e) {
    skillsList.value = []
  }
}

async function abrirDetalhes(id) {
  try {
    const { data } = await api.get(`/talentos/${id}`)
    talentoSelecionado.value = data
    modalDetalhes.value = true
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Erro ao carregar perfil detalhado.' })
  }
}

function limparFiltros() {
  filtros.search = ''
  filtros.categoria = null
  filtros.skillId = null
  filtros.minLevel = null
  carregarTalentos()
}

onMounted(() => {
  carregarTalentos()
  carregarSkills()
})
</script>