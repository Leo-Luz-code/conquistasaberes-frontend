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
            Gestão de Secretarias
          </h1>
        </div>
        <p class="text-sm sm:text-base text-slate-500">
          Cadastro, parametrização e monitoramento dos órgãos municipais integrados à UniVC.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <q-btn
          outline
          color="primary"
          icon="download"
          label="Exportar"
          class="rounded-xl font-semibold bg-white"
          @click="exportarDados"
        />
        <q-btn
          unelevated
          color="primary"
          icon="add"
          label="Nova Secretaria"
          class="rounded-xl px-4 py-2 font-semibold bg-[#1b4b7f] hover:bg-[#153a63] shadow-md shadow-blue-900/10"
          @click="abrirModalCriar"
        />
      </div>
    </div>

    <!-- Cards de Métricas Gerenciais (KPIs) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <!-- Total de Secretarias -->
      <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <span class="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Registradas</span>
          <span class="text-2xl font-bold text-slate-800 block mt-1">{{ totalSecretarias }}</span>
          <span class="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
            <q-icon name="check_circle" size="14px" /> {{ totalAtivas }} ativas na plataforma
          </span>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-blue-50 text-[#1b4b7f] flex items-center justify-center shrink-0">
          <q-icon name="account_balance" size="26px" />
        </div>
      </div>

      <!-- Servidores Vinculados -->
      <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <span class="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Servidores Atendidos</span>
          <span class="text-2xl font-bold text-slate-800 block mt-1">{{ totalServidores.toLocaleString() }}</span>
          <span class="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
            <q-icon name="people" size="14px" /> Em todas as secretarias
          </span>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <q-icon name="badge" size="26px" />
        </div>
      </div>

      <!-- Gestores Cadastrados -->
      <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <span class="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Gestores de Órgão</span>
          <span class="text-2xl font-bold text-slate-800 block mt-1">{{ totalGestores }}</span>
          <span class="text-xs text-amber-600 font-medium flex items-center gap-1 mt-1">
            <q-icon name="admin_panel_settings" size="14px" /> Com acesso ao painel
          </span>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <q-icon name="manage_accounts" size="26px" />
        </div>
      </div>

      <!-- Média de Adesão aos Cursos -->
      <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <span class="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Média de Adesão</span>
          <span class="text-2xl font-bold text-slate-800 block mt-1">{{ mediaAdesao }}%</span>
          <span class="text-xs text-indigo-600 font-medium flex items-center gap-1 mt-1">
            <q-icon name="trending_up" size="14px" /> Engajamento em cursos
          </span>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
          <q-icon name="pie_chart" size="26px" />
        </div>
      </div>
    </div>

    <!-- Barra de Filtros e Busca -->
    <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <!-- Busca Input -->
      <div class="w-full md:w-96">
        <q-input
          v-model="filtroTexto"
          placeholder="Buscar por nome, sigla ou responsável..."
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

      <!-- Controles Adicionais (Filtro por status e modo de visão) -->
      <div class="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
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
            <q-tooltip>Visão em Tabela</q-tooltip>
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
            <q-tooltip>Visão em Cards</q-tooltip>
          </q-btn>
        </div>
      </div>
    </div>

    <!-- CONTEÚDO PRINCIPAL: TABELA DE SECRETARIAS -->
    <div v-if="modoVisao === 'tabela'" class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <q-table
        :rows="secretariasFiltradas"
        :columns="colunasTabela"
        row-key="id"
        :loading="secretariaStore.loading"
        flat
        class="bg-transparent"
        :pagination="paginacao"
        no-data-label="Nenhuma secretaria encontrada"
      >
        <!-- Customização da Sigla e Nome -->
        <template v-slot:body-cell-nome="props">
          <q-td :props="props">
            <div class="flex items-center gap-3 py-1">
              <div
                class="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-white text-xs shadow-xs"
                :style="{ backgroundColor: props.row.corIdentificacao || '#1b4b7f' }"
              >
                {{ props.row.sigla }}
              </div>
              <div>
                <span class="font-bold text-slate-800 block text-sm leading-snug">
                  {{ props.row.nome }}
                </span>
                <span class="text-xs text-slate-400 block line-clamp-1 max-w-md">
                  {{ props.row.descricao || 'Sem descrição cadastrada' }}
                </span>
              </div>
            </div>
          </q-td>
        </template>

        <!-- Responsável e Contato -->
        <template v-slot:body-cell-responsavel="props">
          <q-td :props="props">
            <div class="text-sm">
              <span class="font-medium text-slate-700 block">
                {{ props.row.responsavelNome || 'Não informado' }}
              </span>
              <span class="text-xs text-slate-400 flex items-center gap-1">
                <q-icon name="mail" size="12px" /> {{ props.row.responsavelEmail || '-' }}
              </span>
            </div>
          </q-td>
        </template>

        <!-- Indicadores (Servidores & Cursos) -->
        <template v-slot:body-cell-indicadores="props">
          <q-td :props="props">
            <div class="flex items-center gap-2">
              <q-chip dense outline color="blue-8" class="font-medium text-xs">
                <q-icon name="people" class="q-mr-xs" size="14px" />
                {{ props.row.servidoresCount }} servidores
              </q-chip>
              <q-chip dense outline color="indigo-8" class="font-medium text-xs">
                <q-icon name="school" class="q-mr-xs" size="14px" />
                {{ props.row.cursosOfertadosCount }} cursos
              </q-chip>
            </div>
          </q-td>
        </template>

        <!-- Taxa de Adesão -->
        <template v-slot:body-cell-taxaAdesao="props">
          <q-td :props="props">
            <div class="w-32">
              <div class="flex items-center justify-between text-xs mb-1">
                <span class="font-semibold text-slate-600">{{ props.row.taxaAdesao }}%</span>
                <span class="text-slate-400">meta: 80%</span>
              </div>
              <q-linear-progress
                :value="props.row.taxaAdesao / 100"
                rounded
                size="6px"
                :color="props.row.taxaAdesao >= 80 ? 'positive' : 'warning'"
                class="bg-slate-100"
              />
            </div>
          </q-td>
        </template>

        <!-- Status (Ativa / Inativa) -->
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge
              rounded
              :color="props.row.ativa ? 'emerald-100' : 'slate-100'"
              :class="props.row.ativa ? 'text-emerald-700 border border-emerald-300' : 'text-slate-600 border border-slate-300'"
              class="px-2 py-1 font-semibold text-xs cursor-pointer"
              @click="secretariaStore.toggleStatus(props.row.id)"
            >
              <q-icon :name="props.row.ativa ? 'check_circle' : 'do_not_disturb_on'" class="q-mr-xs" />
              {{ props.row.ativa ? 'Ativa' : 'Inativa' }}
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
                color="primary"
                icon="visibility"
                @click="verDetalhes(props.row)"
              >
                <q-tooltip class="bg-slate-800">Ver Detalhes</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                color="amber-9"
                icon="edit"
                @click="abrirModalEditar(props.row)"
              >
                <q-tooltip class="bg-slate-800">Editar Secretaria</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                color="negative"
                icon="delete_outline"
                @click="confirmarExclusao(props.row)"
              >
                <q-tooltip class="bg-slate-800">Excluir</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- CONTEÚDO ALTERNATIVO: VISÃO EM CARDS -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="item in secretariasFiltradas"
        :key="item.id"
        class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:border-slate-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
      >
        <div>
          <!-- Header do Card -->
          <div class="flex items-start justify-between gap-3 mb-4">
            <div class="flex items-center gap-3">
              <div
                class="w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-white text-sm shadow-md"
                :style="{ backgroundColor: item.corIdentificacao || '#1b4b7f' }"
              >
                {{ item.sigla }}
              </div>
              <div>
                <h3 class="font-bold text-slate-800 text-base leading-tight">{{ item.sigla }}</h3>
                <span class="text-xs text-slate-400 font-medium block">ID: #{{ item.id }}</span>
              </div>
            </div>
            <q-badge
              rounded
              :color="item.ativa ? 'emerald-100' : 'slate-100'"
              :class="item.ativa ? 'text-emerald-700 border border-emerald-200' : 'text-slate-500 border border-slate-200'"
              class="px-2 py-0.5 font-semibold text-[11px]"
            >
              {{ item.ativa ? 'Ativa' : 'Inativa' }}
            </q-badge>
          </div>

          <h4 class="font-semibold text-slate-800 text-sm mb-2 line-clamp-1">{{ item.nome }}</h4>
          <p class="text-xs text-slate-500 mb-4 line-clamp-2 min-h-[36px]">
            {{ item.descricao || 'Nenhuma descrição informada.' }}
          </p>

          <!-- Informações de Contato -->
          <div class="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600 mb-4">
            <div class="flex items-center gap-2">
              <q-icon name="person" color="grey-6" size="16px" />
              <span class="truncate">Resp: <strong>{{ item.responsavelNome || 'Não atribuído' }}</strong></span>
            </div>
            <div class="flex items-center gap-2">
              <q-icon name="email" color="grey-6" size="16px" />
              <span class="truncate text-slate-500">{{ item.responsavelEmail || 'Sem e-mail' }}</span>
            </div>
            <div class="flex items-center gap-2">
              <q-icon name="phone" color="grey-6" size="16px" />
              <span class="text-slate-500">{{ item.telefone || 'Sem telefone' }}</span>
            </div>
          </div>
        </div>

        <!-- Rodapé do Card com Métricas e Ações -->
        <div class="pt-4 border-t border-slate-100 space-y-4">
          <div class="grid grid-cols-2 gap-2 text-center bg-slate-50 p-2 rounded-xl">
            <div>
              <span class="text-[10px] text-slate-400 font-bold uppercase block">Servidores</span>
              <span class="text-sm font-bold text-slate-800">{{ item.servidoresCount }}</span>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 font-bold uppercase block">Cursos</span>
              <span class="text-sm font-bold text-slate-800">{{ item.cursosOfertadosCount }}</span>
            </div>
          </div>

          <div class="flex items-center justify-between gap-2">
            <q-btn
              flat
              dense
              no-caps
              color="primary"
              label="Ver Detalhes"
              icon="visibility"
              class="font-semibold text-xs"
              @click="verDetalhes(item)"
            />
            <div class="flex items-center gap-1">
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
    </div>

    <!-- MODAL: CADASTRO / EDIÇÃO DE SECRETARIA -->
    <q-dialog v-model="modalFormulario" persistent>
      <q-card style="min-width: 350px; max-width: 600px" class="w-full rounded-2xl">
        <q-card-section class="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-5">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-xl bg-blue-50 text-[#1b4b7f] flex items-center justify-center font-bold"
            >
              <q-icon :name="isEdicao ? 'edit' : 'account_balance'" size="22px" />
            </div>
            <div>
              <h2 class="text-lg font-bold text-slate-800 leading-tight">
                {{ isEdicao ? 'Editar Secretaria' : 'Nova Secretaria' }}
              </h2>
              <p class="text-xs text-slate-500">Preencha os dados institucionais do órgão</p>
            </div>
          </div>
          <q-btn flat round dense icon="close" v-close-popup class="text-slate-400" />
        </q-card-section>

        <q-card-section class="p-6 space-y-4">
          <q-form @submit.prevent="salvarSecretaria" class="space-y-4">
            <!-- Sigla e Nome -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-600 mb-1">Sigla *</label>
                <q-input
                  v-model="form.sigla"
                  placeholder="Ex: SMS"
                  outlined
                  dense
                  class="uppercase"
                  :rules="[(val) => !!val || 'Sigla é obrigatória']"
                />
              </div>
              <div class="sm:col-span-2">
                <label class="block text-xs font-bold text-slate-600 mb-1">Nome Completo *</label>
                <q-input
                  v-model="form.nome"
                  placeholder="Ex: Secretaria Municipal de Saúde"
                  outlined
                  dense
                  :rules="[(val) => !!val || 'Nome é obrigatório']"
                />
              </div>
            </div>

            <!-- Descrição -->
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">Descrição / Atribuições</label>
              <q-input
                v-model="form.descricao"
                type="textarea"
                rows="3"
                placeholder="Breve resumo da atuação da secretaria..."
                outlined
                dense
              />
            </div>

            <!-- Dados do Responsável -->
            <div class="pt-2 border-t border-slate-100">
              <span class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Gestão e Contato do Órgão
              </span>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-600 mb-1">Nome do Responsável</label>
                  <q-input
                    v-model="form.responsavelNome"
                    placeholder="Ex: Dra. Ana Paula"
                    outlined
                    dense
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-600 mb-1">E-mail Institucional</label>
                  <q-input
                    v-model="form.responsavelEmail"
                    type="email"
                    placeholder="exemplo@pmvc.ba.gov.br"
                    outlined
                    dense
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-600 mb-1">Telefone de Contato</label>
                  <q-input
                    v-model="form.telefone"
                    placeholder="(77) 3429-0000"
                    outlined
                    dense
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-600 mb-1">Cor Temática no Painel</label>
                  <div class="flex items-center gap-2">
                    <q-input
                      v-model="form.corIdentificacao"
                      outlined
                      dense
                      class="w-full"
                    >
                      <template v-slot:append>
                        <q-icon name="colorize" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-color v-model="form.corIdentificacao" />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>
            </div>

            <!-- Endereço -->
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">Endereço Físico</label>
              <q-input
                v-model="form.endereco"
                placeholder="Av. Maceió, 98 - Brasil, Vitória da Conquista - BA"
                outlined
                dense
              />
            </div>

            <!-- Switch Ativa -->
            <div class="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <span class="block text-sm font-bold text-slate-700">Status Operacional</span>
                <span class="text-xs text-slate-400">Secretarias inativas não recebem novas turmas</span>
              </div>
              <q-toggle v-model="form.ativa" color="emerald-600" />
            </div>

            <!-- Botões de Ação do Form -->
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
              <q-btn
                unelevated
                type="submit"
                color="primary"
                :label="isEdicao ? 'Salvar Alterações' : 'Cadastrar Secretaria'"
                class="rounded-xl px-6 bg-[#1b4b7f]"
                :loading="secretariaStore.loading"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- MODAL: DETALHES DA SECRETARIA -->
    <q-dialog v-model="modalDetalhes">
      <q-card style="min-width: 350px; max-width: 700px" class="w-full rounded-2xl" v-if="secretariaSelecionada">
        <q-card-section
          class="text-white p-6 relative overflow-hidden"
          :style="{ backgroundColor: secretariaSelecionada.corIdentificacao || '#1b4b7f' }"
        >
          <div class="flex items-start justify-between relative z-10">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-extrabold text-2xl border border-white/30">
                {{ secretariaSelecionada.sigla }}
              </div>
              <div>
                <span class="text-xs uppercase tracking-widest text-white/80 font-bold">Órgão Municipal</span>
                <h2 class="text-xl font-bold leading-tight">{{ secretariaSelecionada.nome }}</h2>
                <span class="text-xs text-white/90">Cadastrada em: {{ formatarData(secretariaSelecionada.createdAt) }}</span>
              </div>
            </div>
            <q-btn flat round dense icon="close" v-close-popup text-color="white" />
          </div>
        </q-card-section>

        <q-card-section class="p-6 space-y-6">
          <!-- Visão Geral / Atribuições -->
          <div>
            <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sobre o Órgão</h4>
            <p class="text-sm text-slate-600 leading-relaxed">
              {{ secretariaSelecionada.descricao || 'Nenhuma descrição detalhada foi cadastrada para esta secretaria.' }}
            </p>
          </div>

          <!-- Grade de Indicadores Internos -->
          <div class="grid grid-cols-3 gap-4 text-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <span class="text-xs text-slate-400 font-semibold block">Servidores Vinculados</span>
              <span class="text-xl font-extrabold text-slate-800 mt-1 block">
                {{ secretariaSelecionada.servidoresCount }}
              </span>
            </div>
            <div class="border-x border-slate-200">
              <span class="text-xs text-slate-400 font-semibold block">Gestores Responsáveis</span>
              <span class="text-xl font-extrabold text-slate-800 mt-1 block">
                {{ secretariaSelecionada.gestoresCount }}
              </span>
            </div>
            <div>
              <span class="text-xs text-slate-400 font-semibold block">Cursos Ofertados</span>
              <span class="text-xl font-extrabold text-slate-800 mt-1 block">
                {{ secretariaSelecionada.cursosOfertadosCount }}
              </span>
            </div>
          </div>

          <!-- Contatos do Órgão -->
          <div class="space-y-3">
            <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Contato & Localização</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600">
              <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <q-icon name="person" color="primary" size="20px" />
                <div>
                  <span class="text-xs text-slate-400 block">Gestor Principal</span>
                  <strong class="text-slate-800">{{ secretariaSelecionada.responsavelNome || 'Não informado' }}</strong>
                </div>
              </div>
              <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <q-icon name="email" color="primary" size="20px" />
                <div>
                  <span class="text-xs text-slate-400 block">E-mail Institucional</span>
                  <strong class="text-slate-800">{{ secretariaSelecionada.responsavelEmail || '-' }}</strong>
                </div>
              </div>
              <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <q-icon name="phone" color="primary" size="20px" />
                <div>
                  <span class="text-xs text-slate-400 block">Telefone</span>
                  <strong class="text-slate-800">{{ secretariaSelecionada.telefone || '-' }}</strong>
                </div>
              </div>
              <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <q-icon name="place" color="primary" size="20px" />
                <div>
                  <span class="text-xs text-slate-400 block">Endereço</span>
                  <strong class="text-slate-800 truncate block max-w-[200px]">{{ secretariaSelecionada.endereco || 'Vitória da Conquista - BA' }}</strong>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="p-4 border-t border-slate-100 bg-slate-50">
          <q-btn flat label="Fechar" color="grey-7" v-close-popup />
          <q-btn
            unelevated
            color="primary"
            icon="edit"
            label="Editar Dados"
            class="rounded-xl px-4 bg-[#1b4b7f]"
            @click="abrirModalEditar(secretariaSelecionada); modalDetalhes = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- DIÁLOGO DE CONFIRMAÇÃO DE EXCLUSÃO -->
    <q-dialog v-model="modalExclusao">
      <q-card style="max-width: 400px" class="w-full rounded-2xl">
        <q-card-section class="text-center p-6 space-y-3">
          <div class="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <q-icon name="warning" size="28px" />
          </div>
          <h3 class="text-lg font-bold text-slate-800">Excluir Secretaria?</h3>
          <p class="text-xs text-slate-500">
            Você está prestes a remover a secretaria <strong>{{ secretariaSelecionada?.sigla }} - {{ secretariaSelecionada?.nome }}</strong>. Esta ação não poderá ser desfeita.
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
import { useSecretariaStore } from 'src/stores/secretariaStore'

const $q = useQuasar()
const secretariaStore = useSecretariaStore()

// Estados da Interface
const modoVisao = ref('tabela') // 'tabela' ou 'cards'
const filtroTexto = ref('')
const filtroStatus = ref('todos')
const modalFormulario = ref(false)
const modalDetalhes = ref(false)
const modalExclusao = ref(false)
const isEdicao = ref(false)

const secretariaSelecionada = ref(null)

// Opções de Filtro por Status
const opcoesStatus = [
  { label: 'Todos os Status', value: 'todos' },
  { label: 'Apenas Ativas', value: 'ativas' },
  { label: 'Apenas Inativas', value: 'inativas' },
]

// Formulário Reativo
const form = ref({
  id: null,
  sigla: '',
  nome: '',
  descricao: '',
  responsavelNome: '',
  responsavelEmail: '',
  telefone: '',
  endereco: '',
  corIdentificacao: '#1B4B7F',
  ativa: true,
})

// Configuração da Tabela Quasar
const paginacao = ref({
  rowsPerPage: 10,
})

const colunasTabela = [
  { name: 'nome', label: 'Secretaria / Órgão', field: 'nome', align: 'left', sortable: true },
  { name: 'responsavel', label: 'Responsável Institucional', field: 'responsavelNome', align: 'left' },
  { name: 'indicadores', label: 'Servidores / Cursos', field: 'servidoresCount', align: 'center', sortable: true },
  { name: 'taxaAdesao', label: 'Taxa de Engajamento', field: 'taxaAdesao', align: 'center', sortable: true },
  { name: 'status', label: 'Status', field: 'ativa', align: 'center', sortable: true },
  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'right' },
]

// Propriedades Computadas para KPIs e Filtros
const secretariasFiltradas = computed(() => {
  return secretariaStore.secretarias.filter((item) => {
    // Filtro por Texto
    const busca = filtroTexto.value.toLowerCase()
    const matchTexto =
      !busca ||
      item.nome.toLowerCase().includes(busca) ||
      item.sigla.toLowerCase().includes(busca) ||
      (item.responsavelNome && item.responsavelNome.toLowerCase().includes(busca))

    // Filtro por Status
    let matchStatus = true
    if (filtroStatus.value === 'ativas') matchStatus = item.ativa === true
    if (filtroStatus.value === 'inativas') matchStatus = item.ativa === false

    return matchTexto && matchStatus
  })
})

const totalSecretarias = computed(() => secretariaStore.secretarias.length)
const totalAtivas = computed(() => secretariaStore.secretarias.filter((s) => s.ativa).length)
const totalServidores = computed(() =>
  secretariaStore.secretarias.reduce((acc, s) => acc + (s.servidoresCount || 0), 0)
)
const totalGestores = computed(() =>
  secretariaStore.secretarias.reduce((acc, s) => acc + (s.gestoresCount || 0), 0)
)
const mediaAdesao = computed(() => {
  if (!secretariaStore.secretarias.length) return 0
  const soma = secretariaStore.secretarias.reduce((acc, s) => acc + (s.taxaAdesao || 0), 0)
  return Math.round(soma / secretariaStore.secretarias.length)
})

// Funções de Ação e Manipulação de Dados
function resetForm() {
  form.value = {
    id: null,
    sigla: '',
    nome: '',
    descricao: '',
    responsavelNome: '',
    responsavelEmail: '',
    telefone: '',
    endereco: '',
    corIdentificacao: '#1B4B7F',
    ativa: true,
  }
}

function abrirModalCriar() {
  isEdicao.value = false
  resetForm()
  modalFormulario.value = true
}

function abrirModalEditar(item) {
  isEdicao.value = true
  form.value = { ...item }
  modalFormulario.value = true
}

function verDetalhes(item) {
  secretariaSelecionada.value = item
  modalDetalhes.value = true
}

function confirmarExclusao(item) {
  secretariaSelecionada.value = item
  modalExclusao.value = true
}

async function executarExclusao() {
  if (secretariaSelecionada.value) {
    await secretariaStore.deleteSecretaria(secretariaSelecionada.value.id)
    $q.notify({
      type: 'positive',
      message: 'Secretaria removida com sucesso!',
      position: 'top-right',
    })
    modalExclusao.value = false
    secretariaSelecionada.value = null
  }
}

async function salvarSecretaria() {
  try {
    if (isEdicao.value) {
      await secretariaStore.updateSecretaria(form.value.id, form.value)
      $q.notify({
        type: 'positive',
        message: 'Dados da secretaria atualizados!',
        position: 'top-right',
      })
    } else {
      await secretariaStore.createSecretaria(form.value)
      $q.notify({
        type: 'positive',
        message: 'Nova secretaria cadastrada com sucesso!',
        position: 'top-right',
      })
    }
    modalFormulario.value = false
    resetForm()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao salvar secretaria.',
      position: 'top-right',
    })
  }
}

function exportarDados() {
  $q.notify({
    type: 'info',
    message: 'Exportando relatório de secretarias em formato CSV...',
    position: 'top-right',
    icon: 'download',
  })
}

function formatarData(dataIso) {
  if (!dataIso) return '-'
  return new Date(dataIso).toLocaleDateString('pt-BR')
}

onMounted(() => {
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
</style>
