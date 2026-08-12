<template>
  <q-page class="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 font-sans">
    <!-- Cabeçalho da Página -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <q-btn
            flat
            round
            dense
            icon="arrow_back"
            color="primary"
            to="/admin/dashboard"
            class="sm:hidden"
          />
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Gestão de Notícias e Comunicados
          </h1>
        </div>
        <p class="text-sm sm:text-base text-slate-500">
          Publicação de matérias institucionais, novidades e comunicados informativos para os servidores.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <q-btn
          outline
          color="primary"
          icon="newspaper"
          label="Ver Portal de Notícias"
          to="/servidor/noticias"
          class="rounded-xl font-semibold bg-white"
        />
        <q-btn
          unelevated
          color="primary"
          icon="add"
          label="Nova Notícia"
          class="rounded-xl px-4 py-2 font-semibold bg-[#1b4b7f] hover:bg-[#153a63] shadow-md shadow-blue-900/10"
          @click="abrirModalCriar"
        />
      </div>
    </div>

    <!-- Cards de Métricas e Performance Editorial (KPIs) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <!-- Total Publicadas -->
      <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <span class="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Publicadas</span>
          <span class="text-2xl font-bold text-slate-800 block mt-1">{{ totalPublicadas }}</span>
          <span class="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
            <q-icon name="check_circle" size="14px" /> Visíveis no portal
          </span>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <q-icon name="feed" size="26px" />
        </div>
      </div>

      <!-- Rascunhos -->
      <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <span class="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Em Rascunho</span>
          <span class="text-2xl font-bold text-slate-800 block mt-1">{{ totalRascunhos }}</span>
          <span class="text-xs text-amber-600 font-medium flex items-center gap-1 mt-1">
            <q-icon name="edit_note" size="14px" /> Aguardando revisão
          </span>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <q-icon name="drafts" size="26px" />
        </div>
      </div>

      <!-- Total Visualizações -->
      <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <span class="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Leituras Totais</span>
          <span class="text-2xl font-bold text-slate-800 block mt-1">{{ totalVisualizacoes.toLocaleString() }}</span>
          <span class="text-xs text-indigo-600 font-medium flex items-center gap-1 mt-1">
            <q-icon name="visibility" size="14px" /> Acessos dos servidores
          </span>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
          <q-icon name="analytics" size="26px" />
        </div>
      </div>

      <!-- Destaque Atual -->
      <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <span class="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Destaque Banner</span>
          <span class="text-sm font-bold text-slate-800 block mt-1 line-clamp-1 max-w-[140px]">
            {{ noticiaDestaque?.titulo || 'Nenhum' }}
          </span>
          <span class="text-xs text-blue-600 font-medium flex items-center gap-1 mt-1">
            <q-icon name="star" size="14px" /> Banner principal ativo
          </span>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-blue-50 text-[#1b4b7f] flex items-center justify-center shrink-0">
          <q-icon name="stars" size="26px" />
        </div>
      </div>
    </div>

    <!-- Barra de Busca, Filtros e Alternância de Visão -->
    <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <!-- Input de Busca -->
      <div class="w-full md:w-96">
        <q-input
          v-model="filtroTexto"
          placeholder="Buscar por título, conteúdo ou autor..."
          outlined
          dense
          class="rounded-xl"
        >
          <template v-slot:prepend>
            <q-icon name="search" class="text-slate-400" />
          </template>
          <template v-slot:append v-if="filtroTexto">
            <q-icon name="close" class="cursor-pointer" @click="filtroTexto = ''" />
          </template>
        </q-input>
      </div>

      <!-- Filtro Categoria, Status e Visão -->
      <div class="flex flex-wrap items-center justify-between md:justify-end gap-3 w-full md:w-auto">
        <q-select
          v-model="filtroCategoria"
          :options="opcoesCategorias"
          outlined
          dense
          class="w-36"
        />

        <q-select
          v-model="filtroStatus"
          :options="opcoesStatus"
          option-label="label"
          option-value="value"
          emit-value
          map-options
          outlined
          dense
          class="w-40"
        />

        <div class="flex items-center bg-slate-100 p-1 rounded-xl">
          <q-btn
            flat
            dense
            :color="modoVisao === 'tabela' ? 'primary' : 'grey-7'"
            :class="{ 'bg-white shadow-xs font-bold': modoVisao === 'tabela' }"
            icon="view_list"
            class="rounded-lg px-2"
            @click="modoVisao = 'tabela'"
          >
            <q-tooltip>Visão Tabela</q-tooltip>
          </q-btn>
          <q-btn
            flat
            dense
            :color="modoVisao === 'cards' ? 'primary' : 'grey-7'"
            :class="{ 'bg-white shadow-xs font-bold': modoVisao === 'cards' }"
            icon="grid_view"
            class="rounded-lg px-2"
            @click="modoVisao = 'cards'"
          >
            <q-tooltip>Visão Cards</q-tooltip>
          </q-btn>
        </div>
      </div>
    </div>

    <!-- MODO DE VISÃO 1: TABELA EDITORIAL -->
    <div v-if="modoVisao === 'tabela'" class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <q-table
        :rows="noticiasFiltradas"
        :columns="colunasTabela"
        row-key="id"
        :loading="noticiaStore.loading"
        flat
        class="bg-transparent"
        :pagination="paginacao"
        no-data-label="Nenhuma notícia encontrada"
      >
        <!-- Título e Capa -->
        <template v-slot:body-cell-titulo="props">
          <q-td :props="props">
            <div class="flex items-center gap-3 py-1">
              <q-avatar square size="48px" class="rounded-xl overflow-hidden bg-slate-100 shrink-0">
                <img :src="props.row.capaUrl" alt="Capa Notícia" class="object-cover" />
              </q-avatar>
              <div>
                <div class="flex items-center gap-2 mb-0.5">
                  <q-chip
                    v-if="props.row.destaque"
                    dense
                    color="amber-500"
                    text-color="white"
                    size="xs"
                    class="font-bold px-2"
                  >
                    Destaque
                  </q-chip>
                  <q-badge color="blue-1 text-blue-8 border border-blue-200" class="font-semibold text-[10px]">
                    {{ props.row.categoria }}
                  </q-badge>
                </div>
                <span class="font-bold text-slate-800 block text-sm leading-snug line-clamp-1 max-w-md">
                  {{ props.row.titulo }}
                </span>
                <span class="text-xs text-slate-400 block line-clamp-1 max-w-md">
                  {{ props.row.subtitulo || props.row.conteudo }}
                </span>
              </div>
            </div>
          </q-td>
        </template>

        <!-- Alcance / Secretaria Alvo -->
        <template v-slot:body-cell-alcance="props">
          <q-td :props="props">
            <q-chip dense outline color="primary" class="font-medium text-xs">
              <q-icon name="business" class="q-mr-xs" size="14px" />
              {{ props.row.secretariaAlvoSigla || 'Geral (Toda Prefeitura)' }}
            </q-chip>
          </q-td>
        </template>

        <!-- Autor e Data -->
        <template v-slot:body-cell-autorData="props">
          <q-td :props="props">
            <div class="text-xs">
              <span class="font-semibold text-slate-700 block">
                {{ props.row.autorNome || 'Redação UniVC' }}
              </span>
              <span class="text-slate-400 flex items-center gap-1 mt-0.5">
                <q-icon name="event" size="12px" /> {{ formatarDataHora(props.row.dataPublicacao) }}
              </span>
            </div>
          </q-td>
        </template>

        <!-- Leituras / Engajamento -->
        <template v-slot:body-cell-visualizacoes="props">
          <q-td :props="props">
            <div class="flex items-center justify-center gap-1 text-slate-700 font-semibold text-xs">
              <q-icon name="visibility" color="grey-6" size="16px" />
              <span>{{ props.row.visualizacoes }}</span>
            </div>
          </q-td>
        </template>

        <!-- Status Publicação -->
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge
              rounded
              :color="props.row.publicada ? 'emerald-100' : 'amber-100'"
              :class="props.row.publicada ? 'text-emerald-700 border border-emerald-300' : 'text-amber-700 border border-amber-300'"
              class="px-2 py-1 font-semibold text-xs cursor-pointer"
              @click="noticiaStore.toggleStatus(props.row.id)"
            >
              <q-icon :name="props.row.publicada ? 'check_circle' : 'draw'" class="q-mr-xs" />
              {{ props.row.publicada ? 'Publicada' : 'Rascunho' }}
            </q-badge>
          </q-td>
        </template>

        <!-- Ações do Administrador -->
        <template v-slot:body-cell-acoes="props">
          <q-td :props="props" class="text-right">
            <div class="flex items-center justify-end gap-1">
              <q-btn
                flat
                round
                dense
                :color="props.row.destaque ? 'amber-9' : 'grey-5'"
                :icon="props.row.destaque ? 'star' : 'star_outline'"
                @click="noticiaStore.toggleDestaque(props.row.id)"
              >
                <q-tooltip class="bg-slate-800">
                  {{ props.row.destaque ? 'Remover do Destaque Banner' : 'Definir como Destaque Principal' }}
                </q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                color="primary"
                icon="visibility"
                @click="verPreview(props.row)"
              >
                <q-tooltip class="bg-slate-800">Visualizar Prévia</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                color="amber-9"
                icon="edit"
                @click="abrirModalEditar(props.row)"
              >
                <q-tooltip class="bg-slate-800">Editar Notícia</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                color="negative"
                icon="delete_outline"
                @click="confirmarExclusao(props.row)"
              >
                <q-tooltip class="bg-slate-800">Excluir Notícia</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- MODO DE VISÃO 2: CARDS EDITORIAIS -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="item in noticiasFiltradas"
        :key="item.id"
        class="bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-slate-300 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group"
      >
        <div>
          <!-- Capa com Chips -->
          <div class="h-44 bg-slate-100 relative overflow-hidden">
            <img
              :src="item.capaUrl"
              alt="Capa Notícia"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            
            <div class="absolute top-3 left-3 flex gap-1.5 flex-wrap">
              <q-badge color="white text-slate-800 font-bold shadow-sm" class="px-2 py-1">
                {{ item.categoria }}
              </q-badge>
              <q-badge
                v-if="item.destaque"
                color="amber-500 text-white font-bold shadow-sm"
                class="px-2 py-1 flex items-center gap-1"
              >
                <q-icon name="star" size="12px" /> Destaque
              </q-badge>
            </div>

            <q-badge
              rounded
              :color="item.publicada ? 'emerald-500' : 'amber-500'"
              class="absolute top-3 right-3 text-white font-semibold px-2 py-1 text-[11px]"
            >
              {{ item.publicada ? 'Publicada' : 'Rascunho' }}
            </q-badge>

            <div class="absolute bottom-3 left-3 right-3 text-white text-xs flex items-center justify-between font-medium">
              <span class="truncate flex items-center gap-1">
                <q-icon name="business" /> {{ item.secretariaAlvoSigla }}
              </span>
              <span class="flex items-center gap-1">
                <q-icon name="visibility" /> {{ item.visualizacoes }}
              </span>
            </div>
          </div>

          <!-- Corpo do Card -->
          <div class="p-5">
            <div class="text-xs text-slate-400 mb-2 flex items-center gap-1">
              <q-icon name="event" /> {{ formatarData(item.dataPublicacao) }} • Por {{ item.autorNome }}
            </div>
            <h3 class="font-bold text-slate-800 text-base leading-snug mb-2 group-hover:text-pmvc-blue transition-colors line-clamp-2">
              {{ item.titulo }}
            </h3>
            <p class="text-xs text-slate-500 line-clamp-3 leading-relaxed">
              {{ item.subtitulo || item.conteudo }}
            </p>
          </div>
        </div>

        <!-- Rodapé do Card -->
        <div class="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <q-btn
            flat
            dense
            no-caps
            color="primary"
            label="Prévia"
            icon="visibility"
            class="font-semibold text-xs"
            @click="verPreview(item)"
          />
          <div class="flex items-center gap-1">
            <q-btn
              flat
              round
              dense
              :color="item.destaque ? 'amber-9' : 'grey-5'"
              :icon="item.destaque ? 'star' : 'star_outline'"
              size="sm"
              @click="noticiaStore.toggleDestaque(item.id)"
            />
            <q-btn
              flat
              round
              dense
              color="amber-9"
              icon="edit"
              size="sm"
              @click="abrirModalEditar(item)"
            />
            <q-btn
              flat
              round
              dense
              color="negative"
              icon="delete_outline"
              size="sm"
              @click="confirmarExclusao(item)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL: FORMULÁRIO DE NOTÍCIA (CRIAR / EDITAR) -->
    <q-dialog v-model="modalFormulario" persistent>
      <q-card style="min-width: 350px; max-width: 750px" class="w-full rounded-2xl">
        <q-card-section class="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-50 text-[#1b4b7f] flex items-center justify-center font-bold">
              <q-icon :name="isEdicao ? 'edit' : 'newspaper'" size="22px" />
            </div>
            <div>
              <h2 class="text-lg font-bold text-slate-800 leading-tight">
                {{ isEdicao ? 'Editar Notícia' : 'Nova Notícia Institucional' }}
              </h2>
              <p class="text-xs text-slate-500">Cadastre matérias informativas e boletins da UniVC</p>
            </div>
          </div>
          <q-btn flat round dense icon="close" v-close-popup class="text-slate-400" />
        </q-card-section>

        <q-card-section class="p-6 space-y-4">
          <q-form @submit.prevent="salvarNoticia" class="space-y-4">
            <!-- Título Principal -->
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">Título Principal *</label>
              <q-input
                v-model="form.titulo"
                placeholder="Ex: Prefeitura lança novo curso de gestão pública"
                outlined
                dense
                :rules="[(val) => !!val || 'Título é obrigatório']"
              />
            </div>

            <!-- Subtítulo / Linha fina -->
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">Subtítulo (Linha Fina)</label>
              <q-input
                v-model="form.subtitulo"
                placeholder="Breve resumo em uma frase que instigue o leitor..."
                outlined
                dense
              />
            </div>

            <!-- Categorias, Secretaria Alvo e Autor -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-600 mb-1">Categoria *</label>
                <q-select
                  v-model="form.categoria"
                  :options="['Destaque', 'Trilhas', 'Inovação', 'Saúde', 'Educação', 'Plataforma', 'Geral']"
                  outlined
                  dense
                  :rules="[(val) => !!val || 'Selecione uma categoria']"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-600 mb-1">Secretaria Alvo</label>
                <q-select
                  v-model="form.secretariaAlvoObj"
                  :options="opcoesSecretariasAlvo"
                  option-label="sigla"
                  outlined
                  dense
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-600 mb-1">Autor / Editorial</label>
                <q-input
                  v-model="form.autorNome"
                  placeholder="Ex: Assessoria CETI"
                  outlined
                  dense
                />
              </div>
            </div>

            <!-- URL da Imagem de Capa -->
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">URL da Imagem de Capa</label>
              <q-input
                v-model="form.capaUrl"
                placeholder="https://images.unsplash.com/..."
                outlined
                dense
              >
                <template v-slot:append>
                  <q-icon name="image" />
                </template>
              </q-input>
            </div>

            <!-- Conteúdo da Notícia -->
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">Conteúdo da Notícia *</label>
              <q-input
                v-model="form.conteudo"
                type="textarea"
                rows="5"
                placeholder="Escreva a matéria completa..."
                outlined
                dense
                :rules="[(val) => !!val || 'O conteúdo é obrigatório']"
              />
            </div>

            <!-- Opções Editoriais (Switches) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div class="flex items-center justify-between">
                <div>
                  <span class="block text-xs font-bold text-slate-700">Destaque Principal</span>
                  <span class="text-[11px] text-slate-400">Exibir no banner principal do portal</span>
                </div>
                <q-toggle v-model="form.destaque" color="amber-500" />
              </div>

              <div class="flex items-center justify-between border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-4">
                <div>
                  <span class="block text-xs font-bold text-slate-700">Publicar Imediatamente</span>
                  <span class="text-[11px] text-slate-400">Tornar visível aos servidores</span>
                </div>
                <q-toggle v-model="form.publicada" color="emerald-600" />
              </div>
            </div>

            <!-- Botões de Ação -->
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
              <q-btn
                unelevated
                type="submit"
                color="primary"
                :label="isEdicao ? 'Salvar Alterações' : 'Publicar Notícia'"
                class="rounded-xl px-6 bg-[#1b4b7f]"
                :loading="noticiaStore.loading"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- MODAL: PRÉVIA DA NOTÍCIA (COMO O ALUNO/SERVIDOR VÊ) -->
    <q-dialog v-model="modalPreview">
      <q-card style="min-width: 350px; max-width: 700px" class="w-full rounded-2xl overflow-hidden" v-if="noticiaSelecionada">
        <div class="h-64 bg-slate-800 relative overflow-hidden">
          <img :src="noticiaSelecionada.capaUrl" alt="Capa Notícia" class="w-full h-full object-cover opacity-80" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          
          <div class="absolute top-4 right-4">
            <q-btn flat round dense icon="close" v-close-popup text-color="white" class="bg-black/40" />
          </div>

          <div class="absolute bottom-6 left-6 right-6 text-white">
            <div class="flex items-center gap-2 mb-2">
              <q-chip color="amber-500" text-color="white" size="xs" class="font-bold">
                {{ noticiaSelecionada.categoria }}
              </q-chip>
              <span class="text-xs text-slate-200">
                {{ formatarData(noticiaSelecionada.dataPublicacao) }} • Por {{ noticiaSelecionada.autorNome }}
              </span>
            </div>
            <h2 class="text-xl sm:text-2xl font-extrabold leading-tight">
              {{ noticiaSelecionada.titulo }}
            </h2>
          </div>
        </div>

        <q-card-section class="p-6 space-y-4">
          <p v-if="noticiaSelecionada.subtitulo" class="text-base font-semibold text-slate-700 italic border-l-4 border-primary pl-3 py-1">
            {{ noticiaSelecionada.subtitulo }}
          </p>
          
          <div class="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {{ noticiaSelecionada.conteudo }}
          </div>
        </q-card-section>

        <q-card-actions align="right" class="p-4 border-t border-slate-100 bg-slate-50">
          <q-btn flat label="Fechar Prévia" color="grey-7" v-close-popup />
          <q-btn
            unelevated
            color="primary"
            icon="edit"
            label="Editar Notícia"
            class="rounded-xl px-4 bg-[#1b4b7f]"
            @click="abrirModalEditar(noticiaSelecionada); modalPreview = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- DIÁLOGO CONFIRMAÇÃO EXCLUSÃO -->
    <q-dialog v-model="modalExclusao">
      <q-card style="max-width: 400px" class="w-full rounded-2xl">
        <q-card-section class="text-center p-6 space-y-3">
          <div class="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <q-icon name="warning" size="28px" />
          </div>
          <h3 class="text-lg font-bold text-slate-800">Excluir Notícia?</h3>
          <p class="text-xs text-slate-500">
            Você está prestes a remover a publicação <strong>{{ noticiaSelecionada?.titulo }}</strong>. Esta ação não poderá ser desfeita.
          </p>
        </q-card-section>
        <q-card-actions align="center" class="p-4 bg-slate-50 border-t border-slate-100 gap-2">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn
            unelevated
            color="negative"
            label="Confirmar Exclusão"
            class="rounded-xl px-4"
            @click="executarExclusao"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useNoticiaStore } from 'src/stores/noticiaStore'
import { useSecretariaStore } from 'src/stores/secretariaStore'

const $q = useQuasar()
const noticiaStore = useNoticiaStore()
const secretariaStore = useSecretariaStore()

// Estados de Interface
const modoVisao = ref('tabela')
const filtroTexto = ref('')
const filtroCategoria = ref('Todas')
const filtroStatus = ref('todos')

const modalFormulario = ref(false)
const modalPreview = ref(false)
const modalExclusao = ref(false)
const isEdicao = ref(false)

const noticiaSelecionada = ref(null)

const opcoesCategorias = ['Todas', 'Destaque', 'Trilhas', 'Inovação', 'Saúde', 'Educação', 'Plataforma', 'Geral']

const opcoesStatus = [
  { label: 'Todos os Status', value: 'todos' },
  { label: 'Apenas Publicadas', value: 'publicadas' },
  { label: 'Apenas Rascunhos', value: 'rascunhos' },
]

// Formulário Reativo
const form = ref({
  id: null,
  titulo: '',
  subtitulo: '',
  conteudo: '',
  categoria: 'Geral',
  capaUrl: '',
  destaque: false,
  publicada: true,
  autorNome: 'Assessoria CETI',
  secretariaAlvoObj: { id: null, sigla: 'Todas as Secretarias' },
})

// Opções de Secretarias Alvo
const opcoesSecretariasAlvo = computed(() => {
  const lista = [{ id: null, sigla: 'Todas as Secretarias' }]
  secretariaStore.secretarias.forEach((s) => {
    lista.push({ id: s.id, sigla: s.sigla })
  })
  return lista
})

// Tabela Quasar Config
const paginacao = ref({ rowsPerPage: 10 })

const colunasTabela = [
  { name: 'titulo', label: 'Matéria / Título', field: 'titulo', align: 'left', sortable: true },
  { name: 'alcance', label: 'Público Alvo', field: 'secretariaAlvoSigla', align: 'left' },
  { name: 'autorData', label: 'Autor / Publicado em', field: 'dataPublicacao', align: 'left', sortable: true },
  { name: 'visualizacoes', label: 'Leituras', field: 'visualizacoes', align: 'center', sortable: true },
  { name: 'status', label: 'Status', field: 'publicada', align: 'center', sortable: true },
  { name: 'acoes', label: 'Ações Editoriais', field: 'acoes', align: 'right' },
]

// Computados
const noticiasFiltradas = computed(() => {
  return noticiaStore.noticias.filter((n) => {
    const busca = filtroTexto.value.toLowerCase()
    const matchTexto =
      !busca ||
      n.titulo.toLowerCase().includes(busca) ||
      (n.subtitulo && n.subtitulo.toLowerCase().includes(busca)) ||
      (n.autorNome && n.autorNome.toLowerCase().includes(busca))

    let matchCat = true
    if (filtroCategoria.value !== 'Todas') {
      matchCat = n.categoria === filtroCategoria.value
    }

    let matchStatus = true
    if (filtroStatus.value === 'publicadas') matchStatus = n.publicada === true
    if (filtroStatus.value === 'rascunhos') matchStatus = n.publicada === false

    return matchTexto && matchCat && matchStatus
  })
})

const totalPublicadas = computed(() => noticiaStore.noticias.filter((n) => n.publicada).length)
const totalRascunhos = computed(() => noticiaStore.noticias.filter((n) => !n.publicada).length)
const totalVisualizacoes = computed(() =>
  noticiaStore.noticias.reduce((acc, n) => acc + (n.visualizacoes || 0), 0)
)
const noticiaDestaque = computed(() => noticiaStore.noticias.find((n) => n.destaque))

// Métodos
function resetForm() {
  form.value = {
    id: null,
    titulo: '',
    subtitulo: '',
    conteudo: '',
    categoria: 'Geral',
    capaUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop',
    destaque: false,
    publicada: true,
    autorNome: 'Assessoria CETI',
    secretariaAlvoObj: { id: null, sigla: 'Todas as Secretarias' },
  }
}

function abrirModalCriar() {
  isEdicao.value = false
  resetForm()
  modalFormulario.value = true
}

function abrirModalEditar(item) {
  isEdicao.value = true
  form.value = {
    ...item,
    secretariaAlvoObj: {
      id: item.secretariaAlvoId || null,
      sigla: item.secretariaAlvoSigla || 'Todas as Secretarias',
    },
  }
  modalFormulario.value = true
}

function verPreview(item) {
  noticiaSelecionada.value = item
  modalPreview.value = true
}

function confirmarExclusao(item) {
  noticiaSelecionada.value = item
  modalExclusao.value = true
}

async function executarExclusao() {
  if (noticiaSelecionada.value) {
    await noticiaStore.deleteNoticia(noticiaSelecionada.value.id)
    $q.notify({
      type: 'positive',
      message: 'Notícia removida com sucesso!',
      position: 'top-right',
    })
    modalExclusao.value = false
    noticiaSelecionada.value = null
  }
}

async function salvarNoticia() {
  try {
    const payload = {
      ...form.value,
      secretariaAlvoId: form.value.secretariaAlvoObj?.id || null,
      secretariaAlvoSigla: form.value.secretariaAlvoObj?.sigla || 'Todas as Secretarias',
    }

    if (isEdicao.value) {
      await noticiaStore.updateNoticia(form.value.id, payload)
      $q.notify({
        type: 'positive',
        message: 'Notícia atualizada!',
        position: 'top-right',
      })
    } else {
      await noticiaStore.createNoticia(payload)
      $q.notify({
        type: 'positive',
        message: 'Nova notícia publicada com sucesso!',
        position: 'top-right',
      })
    }
    modalFormulario.value = false
    resetForm()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao salvar notícia.',
      position: 'top-right',
    })
  }
}

function formatarData(dataIso) {
  if (!dataIso) return '-'
  return new Date(dataIso).toLocaleDateString('pt-BR')
}

function formatarDataHora(dataIso) {
  if (!dataIso) return '-'
  return new Date(dataIso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(() => {
  noticiaStore.fetchNoticias()
  secretariaStore.fetchSecretarias()
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
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
</style>
