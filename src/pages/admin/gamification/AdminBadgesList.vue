<template>
  <q-page class="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 font-sans">
    <!-- Cabeçalho -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <router-link to="/admin/dashboard" class="text-slate-400 hover:text-pmvc-blue text-sm flex items-center gap-1 transition-colors">
            <q-icon name="arrow_back" size="16px" />
            <span>Voltar ao Painel</span>
          </router-link>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-pmvc-dark tracking-tight">Gestão de Badges e Conquistas</h1>
        <p class="text-sm sm:text-base text-slate-500">
          Crie, edite e configure as medalhas da gamificação concedidas aos servidores municipais.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <q-btn
          unelevated
          color="primary"
          icon="add"
          label="Nova Conquista"
          class="rounded-xl px-5 py-2.5 font-bold shadow-md bg-[#0F4C81] hover:bg-[#153a63]"
          @click="openCreateModal"
        />
      </div>
    </div>

    <!-- KPIs de Resumo -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <q-icon name="emoji_events" size="26px" />
        </div>
        <div>
          <span class="block text-xs font-medium text-slate-500">Badges Cadastrados</span>
          <span class="text-2xl font-bold text-pmvc-dark leading-tight block mt-0.5">
            {{ gamificationStore.allBadges.length }}
          </span>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
          <q-icon name="stars" size="26px" />
        </div>
        <div>
          <span class="block text-xs font-medium text-slate-500">Total XP em Bônus</span>
          <span class="text-2xl font-bold text-pmvc-dark leading-tight block mt-0.5">
            {{ totalXpDistribuivel }} XP
          </span>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <q-icon name="military_tech" size="26px" />
        </div>
        <div>
          <span class="block text-xs font-medium text-slate-500">Média por Conquista</span>
          <span class="text-2xl font-bold text-pmvc-dark leading-tight block mt-0.5">
            {{ mediaXp }} XP
          </span>
        </div>
      </div>
    </div>

    <!-- Barra de Filtro e Busca -->
    <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
      <q-input
        dense
        outlined
        v-model="filtroBusca"
        placeholder="Buscar conquista por nome ou descrição..."
        class="w-full sm:w-96"
      >
        <template v-slot:prepend>
          <q-icon name="search" color="grey-6" />
        </template>
        <template v-slot:append v-if="filtroBusca">
          <q-icon name="clear" class="cursor-pointer" @click="filtroBusca = ''" />
        </template>
      </q-input>

      <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
        <q-btn-toggle
          v-model="viewMode"
          toggle-color="primary"
          dense
          rounded
          unelevated
          :options="[
            { icon: 'grid_view', value: 'grid' },
            { icon: 'view_list', value: 'table' }
          ]"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="gamificationStore.loading" class="py-16 text-center">
      <q-spinner-dots color="primary" size="48px" />
      <p class="text-sm text-slate-500 mt-2">Carregando conquistas...</p>
    </div>

    <!-- Estado Vazio -->
    <div v-else-if="badgesFiltrados.length === 0" class="bg-white rounded-3xl p-12 text-center border border-slate-200">
      <div class="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <q-icon name="workspace_premium" size="32px" />
      </div>
      <h3 class="text-lg font-bold text-slate-800 mb-1">Nenhuma conquista encontrada</h3>
      <p class="text-sm text-slate-500 max-w-md mx-auto mb-6">
        {{ filtroBusca ? 'Nenhum resultado corresponde à sua pesquisa.' : 'Comece cadastrando os selos e medalhas que seus servidores poderão conquistar.' }}
      </p>
      <q-btn
        unelevated
        color="primary"
        icon="add"
        label="Criar Primeira Conquista"
        class="rounded-xl px-6 py-2.5 font-bold"
        @click="openCreateModal"
      />
    </div>

    <!-- Exibição em Grade (Cards) -->
    <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="badge in badgesFiltrados"
        :key="badge.id"
        class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between group"
      >
        <div>
          <!-- Topo: Avatar do Badge + XP -->
          <div class="flex items-start justify-between gap-3 mb-4">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform overflow-hidden">
              <!-- Se for URL de imagem -->
              <img
                v-if="isImageUrl(badge.icone)"
                :src="getMediaUrl(badge.icone)"
                :alt="badge.nome"
                class="w-full h-full object-cover"
              />
              <!-- Se for ícone Quasar -->
              <q-icon v-else :name="badge.icone || 'military_tech'" size="32px" />
            </div>

            <div class="flex flex-col items-end">
              <span class="px-2.5 py-1 bg-amber-50 text-amber-700 font-extrabold text-xs rounded-full border border-amber-200 shadow-sm flex items-center gap-1">
                <q-icon name="bolt" size="14px" /> +{{ badge.xpBonus || 50 }} XP
              </span>
              <span v-if="badge._count?.userBadges !== undefined" class="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1 font-medium">
                <q-icon name="people" size="13px" /> {{ badge._count.userBadges }} servidores
              </span>
            </div>
          </div>

          <!-- Título e Descrição -->
          <h3 class="text-base font-extrabold text-slate-900 leading-snug mb-1.5 group-hover:text-pmvc-blue transition-colors">
            {{ badge.nome }}
          </h3>
          <p class="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">
            {{ badge.descricao }}
          </p>
        </div>

        <!-- Rodapé com Ações -->
        <div class="pt-4 border-t border-slate-100 flex items-center justify-end mt-auto">
          <div class="flex items-center gap-1">
            <q-btn
              flat
              round
              dense
              color="primary"
              icon="edit"
              size="sm"
              @click="openEditModal(badge)"
            >
              <q-tooltip>Editar Conquista</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              dense
              color="negative"
              icon="delete"
              size="sm"
              @click="confirmDelete(badge)"
            >
              <q-tooltip>Excluir Conquista</q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>
    </div>

    <!-- Exibição em Tabela -->
    <div v-else class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <q-table
        :rows="badgesFiltrados"
        :columns="tableColumns"
        row-key="id"
        flat
        no-data-label="Nenhuma conquista encontrada"
      >
        <!-- Ícone / Capa -->
        <template v-slot:body-cell-icone="props">
          <q-td :props="props" class="w-16">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center shadow-sm overflow-hidden">
              <img
                v-if="isImageUrl(props.row.icone)"
                :src="getMediaUrl(props.row.icone)"
                :alt="props.row.nome"
                class="w-full h-full object-cover"
              />
              <q-icon v-else :name="props.row.icone || 'military_tech'" size="22px" />
            </div>
          </q-td>
        </template>

        <!-- Nome e Descrição -->
        <template v-slot:body-cell-nome="props">
          <q-td :props="props">
            <div class="font-bold text-slate-900 text-sm">{{ props.row.nome }}</div>
            <div class="text-xs text-slate-500 line-clamp-1">{{ props.row.descricao }}</div>
          </q-td>
        </template>

        <!-- XP Bônus -->
        <template v-slot:body-cell-xp="props">
          <q-td :props="props" class="text-center">
            <span class="px-2.5 py-1 bg-amber-50 text-amber-700 font-extrabold text-xs rounded-full border border-amber-200 inline-flex items-center gap-1">
              <q-icon name="bolt" size="13px" /> +{{ props.row.xpBonus || 50 }} XP
            </span>
          </q-td>
        </template>

        <!-- Conquistado por -->
        <template v-slot:body-cell-conquistado="props">
          <q-td :props="props" class="text-center">
            <span class="text-xs font-semibold text-slate-600">
              {{ props.row._count?.userBadges || 0 }} servidores
            </span>
          </q-td>
        </template>

        <!-- Ações -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="text-right">
            <q-btn
              flat
              round
              dense
              color="primary"
              icon="edit"
              size="sm"
              @click="openEditModal(props.row)"
            >
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              dense
              color="negative"
              icon="delete"
              size="sm"
              @click="confirmDelete(props.row)"
            >
              <q-tooltip>Excluir</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- =================================================================== -->
    <!-- MODAL DE CRIAÇÃO / EDIÇÃO DE BADGE -->
    <!-- =================================================================== -->
    <q-dialog v-model="showModal" persistent>
      <q-card style="width: 580px; max-width: 95vw" class="rounded-borders shadow-3">
        <!-- Header do Modal -->
        <q-card-section class="bg-primary text-white row items-center justify-between q-py-sm q-px-md">
          <div class="text-subtitle1 text-weight-bold row items-center">
            <q-icon :name="isEditing ? 'edit' : 'workspace_premium'" class="q-mr-sm" size="22px" />
            {{ isEditing ? 'Editar Conquista' : 'Nova Conquista' }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup class="text-white" />
        </q-card-section>

        <!-- Formulário com Scroll Nativamente Gerenciado pelo Quasar -->
        <q-form @submit.prevent="saveBadge">
          <q-card-section class="q-pa-md scroll" style="max-height: 68vh">
            <div class="space-y-4">
              <!-- Nome -->
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nome da Conquista *
                </label>
                <q-input
                  v-model="form.nome"
                  placeholder="Ex: Servidor Inovador, Mestre em LGPD..."
                  outlined
                  dense
                  autofocus
                  :rules="[val => !!val || 'O nome da conquista é obrigatório']"
                />
              </div>

              <!-- Descrição -->
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Descrição da Conquista *
                </label>
                <q-input
                  v-model="form.descricao"
                  type="textarea"
                  rows="2"
                  placeholder="Ex: Concluiu com excelência todos os cursos da Trilha de Transformação Digital."
                  outlined
                  dense
                  :rules="[val => !!val || 'A descrição é obrigatória']"
                />
              </div>

              <!-- Bônus de XP -->
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Bônus de XP Concedido
                </label>
                <div class="row q-col-gutter-sm items-center">
                  <div class="col-12 col-sm-6">
                    <q-input
                      v-model.number="form.xpBonus"
                      type="number"
                      min="0"
                      step="10"
                      outlined
                      dense
                      prefix="+"
                      suffix="XP"
                    />
                  </div>
                  <!-- Atalhos de XP -->
                  <div class="col-12 col-sm-6 flex items-center gap-1">
                    <q-btn
                      v-for="preset in [50, 100, 250, 500]"
                      :key="preset"
                      dense
                      unelevated
                      size="sm"
                      :color="form.xpBonus === preset ? 'amber-9' : 'grey-3'"
                      :text-color="form.xpBonus === preset ? 'white' : 'dark'"
                      :label="`+${preset}`"
                      class="rounded-lg font-bold px-2 py-1"
                      @click="form.xpBonus = preset"
                    />
                  </div>
                </div>
              </div>

              <!-- Ícone / Imagem -->
              <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div class="flex items-center justify-between">
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Identidade Visual do Badge
                  </label>
                  <q-btn-toggle
                    v-model="iconTab"
                    dense
                    rounded
                    unelevated
                    size="xs"
                    toggle-color="primary"
                    :options="[
                      { label: 'Ícones', value: 'preset' },
                      { label: 'Upload / URL', value: 'custom' }
                    ]"
                  />
                </div>

                <!-- Aba 1: Preset de Ícones -->
                <div v-if="iconTab === 'preset'" class="space-y-2">
                  <div class="grid grid-cols-6 gap-2">
                    <button
                      type="button"
                      v-for="ico in iconPresets"
                      :key="ico"
                      @click="form.icone = ico"
                      class="h-11 rounded-xl flex items-center justify-center transition-all border"
                      :class="form.icone === ico ? 'bg-[#0F4C81] text-white border-[#0F4C81] shadow-md scale-105' : 'bg-white text-slate-600 border-slate-200 hover:bg-blue-50'"
                    >
                      <q-icon :name="ico" size="22px" />
                    </button>
                  </div>
                </div>

                <!-- Aba 2: Upload / URL Customizada -->
                <div v-else class="space-y-3">
                  <div class="row q-col-gutter-sm items-center">
                    <div class="col-12 col-sm-7">
                      <q-input
                        v-model="form.icone"
                        label="URL da Imagem"
                        placeholder="https://exemplo.com/badge.png"
                        outlined
                        dense
                      >
                        <template v-slot:prepend>
                          <q-icon name="link" color="primary" />
                        </template>
                      </q-input>
                    </div>
                    <div class="col-12 col-sm-5">
                      <q-file
                        v-model="badgeImageFile"
                        label="Upload Imagem"
                        outlined
                        dense
                        accept="image/*"
                        :loading="uploadingImage"
                        @update:model-value="handleImageUpload"
                      >
                        <template v-slot:prepend>
                          <q-icon name="cloud_upload" color="primary" />
                        </template>
                      </q-file>
                    </div>
                  </div>
                </div>

                <!-- Live Preview do Badge -->
                <div class="pt-2 border-t border-slate-200 flex items-center gap-4">
                  <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center shadow-md overflow-hidden shrink-0">
                    <img
                      v-if="isImageUrl(form.icone)"
                      :src="getMediaUrl(form.icone)"
                      :alt="form.nome || 'Preview'"
                      class="w-full h-full object-cover"
                    />
                    <q-icon v-else :name="form.icone || 'military_tech'" size="28px" />
                  </div>
                  <div>
                    <div class="text-xs font-extrabold text-slate-800">{{ form.nome || 'Nome da Conquista' }}</div>
                    <div class="text-[11px] text-slate-500 line-clamp-1">{{ form.descricao || 'Descrição da medalha...' }}</div>
                    <span class="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 mt-0.5">
                      <q-icon name="bolt" size="12px" /> +{{ form.xpBonus || 50 }} XP Bônus
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <!-- Ações do Rodapé Fixas -->
          <q-card-actions align="right" class="q-pa-md bg-grey-1">
            <q-btn label="Cancelar" flat color="grey-7" v-close-popup />
            <q-btn
              type="submit"
              :label="isEditing ? 'Salvar Alterações' : 'Criar Conquista'"
              color="primary"
              icon="check"
              unelevated
              :loading="saving"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGamificationStore } from 'src/stores/gamificationStore'
import { useCourseStore } from 'src/stores/courseStore'
import { useQuasar } from 'quasar'
import { getMediaUrl } from 'src/utils/media'

const $q = useQuasar()
const gamificationStore = useGamificationStore()
const courseStore = useCourseStore()

const filtroBusca = ref('')
const viewMode = ref('grid')
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const saving = ref(false)
const iconTab = ref('preset')

const badgeImageFile = ref(null)
const uploadingImage = ref(false)

const form = ref({
  nome: '',
  descricao: '',
  icone: 'workspace_premium',
  xpBonus: 50,
})

const iconPresets = [
  'workspace_premium',
  'emoji_events',
  'military_tech',
  'stars',
  'star',
  'psychology',
  'verified',
  'shield',
  'school',
  'local_fire_department',
  'auto_awesome',
  'diamond',
  'lightbulb',
  'bolt',
  'rocket_launch',
  'favorite',
  'flag',
  'groups',
]

const tableColumns = [
  { name: 'icone', label: 'Visual', align: 'center', field: 'icone' },
  { name: 'nome', label: 'Conquista / Descrição', align: 'left', field: 'nome', sortable: true },
  { name: 'xp', label: 'Bônus de XP', align: 'center', field: 'xpBonus', sortable: true },
  { name: 'conquistado', label: 'Concedido a', align: 'center', field: row => row._count?.userBadges || 0, sortable: true },
  { name: 'actions', label: 'Ações', align: 'right' }
]

function isImageUrl(icone) {
  if (!icone) return false
  const trimmed = icone.trim()
  return (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/uploads/') ||
    trimmed.startsWith('uploads/') ||
    trimmed.startsWith('data:')
  )
}

const badgesFiltrados = computed(() => {
  if (!filtroBusca.value) return gamificationStore.allBadges
  const term = filtroBusca.value.toLowerCase()
  return gamificationStore.allBadges.filter(b =>
    b.nome.toLowerCase().includes(term) ||
    b.descricao.toLowerCase().includes(term)
  )
})

const totalXpDistribuivel = computed(() => {
  return gamificationStore.allBadges.reduce((acc, b) => acc + (b.xpBonus || 0), 0)
})

const mediaXp = computed(() => {
  const count = gamificationStore.allBadges.length
  if (count === 0) return 0
  return Math.round(totalXpDistribuivel.value / count)
})

function openCreateModal() {
  isEditing.value = false
  editingId.value = null
  iconTab.value = 'preset'
  badgeImageFile.value = null
  form.value = {
    nome: '',
    descricao: '',
    icone: 'workspace_premium',
    xpBonus: 50,
  }
  showModal.value = true
}

function openEditModal(badge) {
  isEditing.value = true
  editingId.value = badge.id
  iconTab.value = isImageUrl(badge.icone) ? 'custom' : 'preset'
  badgeImageFile.value = null
  form.value = {
    nome: badge.nome,
    descricao: badge.descricao,
    icone: badge.icone || 'workspace_premium',
    xpBonus: badge.xpBonus || 50,
  }
  showModal.value = true
}

async function handleImageUpload(file) {
  if (!file) return
  uploadingImage.value = true
  try {
    const res = await courseStore.uploadFile(file)
    if (res?.url) {
      form.value.icone = res.url
      $q.notify({ color: 'positive', icon: 'check', message: 'Imagem do badge carregada com sucesso!' })
    }
  } catch (error) {
    console.error('Erro ao fazer upload da imagem do badge:', error)
  } finally {
    uploadingImage.value = false
  }
}

async function saveBadge() {
  saving.value = true
  try {
    if (isEditing.value) {
      await gamificationStore.updateBadge(editingId.value, form.value)
    } else {
      await gamificationStore.createBadge(form.value)
    }
    showModal.value = false
  } catch (error) {
    console.error('Erro ao salvar badge:', error)
  } finally {
    saving.value = false
  }
}

function confirmDelete(badge) {
  $q.dialog({
    title: 'Excluir Conquista',
    message: `Tem certeza de que deseja excluir o badge "${badge.nome}"? Servidores que já o conquistaram manterão o registro histórico.`,
    cancel: { label: 'Cancelar', flat: true, color: 'grey-7' },
    ok: { label: 'Excluir', unelevated: true, color: 'negative' },
    persistent: true,
  }).onOk(async () => {
    try {
      await gamificationStore.deleteBadge(badge.id)
    } catch (error) {
      console.error('Erro ao excluir badge:', error)
    }
  })
}

onMounted(() => {
  gamificationStore.fetchAllBadges()
})
</script>
