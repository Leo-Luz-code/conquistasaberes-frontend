<template>
  <q-page class="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 font-sans">
    <!-- Cabeçalho -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-pmvc-dark tracking-tight mb-1">Administração</h1>
        <p class="text-sm sm:text-base text-slate-500">Painel de gestão da plataforma UniVC. Acesso restrito à equipe gestora.</p>
      </div>
      <div>
        <q-btn
          unelevated
          color="primary"
          icon="add"
          label="Novo curso"
          class="rounded-lg px-4 py-2 font-semibold bg-[#1b4b7f] hover:bg-[#153a63]"
        />
      </div>
    </div>

    <!-- KPIs -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- KPI 1: Servidores -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <q-icon name="groups" size="24px" />
        </div>
        <div>
          <span class="block text-xs font-medium text-slate-500">Servidores</span>
          <span class="text-2xl font-bold text-pmvc-dark leading-tight block mt-1">1.482</span>
        </div>
      </div>

      <!-- KPI 2: Cursos publicados -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <q-icon name="menu_book" size="24px" />
        </div>
        <div>
          <span class="block text-xs font-medium text-slate-500">Cursos publicados</span>
          <span class="text-2xl font-bold text-pmvc-dark leading-tight block mt-1">48</span>
        </div>
      </div>

      <!-- KPI 3: Gestores ativos -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
          <q-icon name="admin_panel_settings" size="24px" />
        </div>
        <div>
          <span class="block text-xs font-medium text-slate-500">Gestores ativos</span>
          <span class="text-2xl font-bold text-pmvc-dark leading-tight block mt-1">12</span>
        </div>
      </div>

      <!-- KPI 4: Secretarias -->
      <router-link to="/admin/secretarias" class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-300 hover:shadow-md transition-all flex items-center gap-4 cursor-pointer">
        <div class="w-12 h-12 rounded-xl bg-blue-50 text-[#1b4b7f] flex items-center justify-center shrink-0">
          <q-icon name="account_balance" size="24px" />
        </div>
        <div>
          <span class="block text-xs font-medium text-slate-500">Secretarias</span>
          <span class="text-2xl font-bold text-pmvc-dark leading-tight block mt-1">18</span>
        </div>
      </router-link>
    </div>

    <!-- Áreas Administrativas -->
    <div class="pt-2">
      <h2 class="text-lg font-bold text-pmvc-dark mb-4">Áreas administrativas</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Servidores -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-slate-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between items-start h-full group">
          <div class="mb-6">
            <div class="flex items-center gap-2 mb-2">
              <q-icon name="people" size="20px" class="text-pmvc-blue" />
              <h3 class="font-bold text-pmvc-dark group-hover:text-pmvc-blue transition-colors">Gestão de Servidores</h3>
            </div>
            <p class="text-sm text-slate-500">Cadastro, vínculos e perfis dos servidores e gestores municipais.</p>
          </div>
          <q-btn to="/admin/usuarios" outline color="grey-4" text-color="primary" label="Acessar" size="sm" class="font-semibold px-4 py-1 hover:bg-blue-50" />
        </div>

        <!-- Cursos -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-slate-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between items-start h-full group">
          <div class="mb-6">
            <div class="flex items-center gap-2 mb-2">
              <q-icon name="edit_note" size="20px" class="text-pmvc-blue" />
              <h3 class="font-bold text-pmvc-dark group-hover:text-pmvc-blue transition-colors">Gestão de Cursos</h3>
            </div>
            <p class="text-sm text-slate-500">Criar, editar e organizar os cursos e trilhas formativas do AVA.</p>
          </div>
          <q-btn to="/admin/cursos" outline color="grey-4" text-color="primary" label="Acessar" size="sm" class="font-semibold px-4 py-1 hover:bg-blue-50" />
        </div>

        <!-- Secretarias -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-slate-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between items-start h-full group">
          <div class="mb-6">
            <div class="flex items-center gap-2 mb-2">
              <q-icon name="account_balance" size="20px" class="text-pmvc-blue" />
              <h3 class="font-bold text-pmvc-dark group-hover:text-pmvc-blue transition-colors">Gestão de Secretarias</h3>
            </div>
            <p class="text-sm text-slate-500">Administrar os órgãos, siglas e estrutura do município.</p>
          </div>
          <q-btn to="/admin/secretarias" outline color="grey-4" text-color="primary" label="Acessar" size="sm" class="font-semibold px-4 py-1 hover:bg-blue-50" />
        </div>

        <!-- Notícias -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-slate-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between items-start h-full group">
          <div class="mb-6">
            <div class="flex items-center gap-2 mb-2">
              <q-icon name="newspaper" size="20px" class="text-pmvc-blue" />
              <h3 class="font-bold text-pmvc-dark group-hover:text-pmvc-blue transition-colors">Gestão de Notícias</h3>
            </div>
            <p class="text-sm text-slate-500">Publicar comunicados, informes e editais para os servidores.</p>
          </div>
          <q-btn to="/admin/noticias" outline color="grey-4" text-color="primary" label="Acessar" size="sm" class="font-semibold px-4 py-1 hover:bg-blue-50" />
        </div>

        <!-- Eventos -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-slate-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between items-start h-full group">
          <div class="mb-6">
            <div class="flex items-center gap-2 mb-2">
              <q-icon name="event" size="20px" class="text-pmvc-blue" />
              <h3 class="font-bold text-pmvc-dark group-hover:text-pmvc-blue transition-colors">Gestão de Eventos</h3>
            </div>
            <p class="text-sm text-slate-500">Agendar palestras, cerimônias e eventos presenciais/online.</p>
          </div>
          <q-btn to="/admin/eventos" outline color="grey-4" text-color="primary" label="Acessar" size="sm" class="font-semibold px-4 py-1 hover:bg-blue-50" />
        </div>

        <!-- Biblioteca -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-slate-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between items-start h-full group">
          <div class="mb-6">
            <div class="flex items-center gap-2 mb-2">
              <q-icon name="menu_book" size="20px" class="text-pmvc-blue" />
              <h3 class="font-bold text-pmvc-dark group-hover:text-pmvc-blue transition-colors">Gestão de Biblioteca</h3>
            </div>
            <p class="text-sm text-slate-500">Acervo digital de e-books, manuais e legislações da PMVC.</p>
          </div>
          <q-btn to="/admin/biblioteca" outline color="grey-4" text-color="primary" label="Acessar" size="sm" class="font-semibold px-4 py-1 hover:bg-blue-50" />
        </div>

        <!-- Certificados -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-slate-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between items-start h-full group">
          <div class="mb-6">
            <div class="flex items-center gap-2 mb-2">
              <q-icon name="workspace_premium" size="20px" class="text-pmvc-blue" />
              <h3 class="font-bold text-pmvc-dark group-hover:text-pmvc-blue transition-colors">Gestão de Certificados</h3>
            </div>
            <p class="text-sm text-slate-500">Emitir, validar e revogar certificados de conclusão de curso.</p>
          </div>
          <q-btn to="/admin/certificados" outline color="grey-4" text-color="primary" label="Acessar" size="sm" class="font-semibold px-4 py-1 hover:bg-blue-50" />
        </div>

      </div>
    </div>
  </q-page>
</template>

<script setup>
// Sem necessidade de scripts complexos nesta tela estática no momento.
</script>

<style scoped>
/* Utilizando classes utilitárias do TailwindCSS para gerenciar a interface. */
</style>