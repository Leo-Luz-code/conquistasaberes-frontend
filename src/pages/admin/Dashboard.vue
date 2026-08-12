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
        <!-- Area 1 -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-slate-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between items-start h-full group">
          <div class="mb-6">
            <h3 class="font-bold text-pmvc-dark mb-1 group-hover:text-pmvc-blue transition-colors">Gestão de servidores</h3>
            <p class="text-sm text-slate-500">Cadastro, vínculos e perfis</p>
          </div>
          <q-btn outline color="grey-4" text-color="primary" label="Acessar" size="sm" class="font-semibold px-4 py-1 hover:bg-blue-50" />
        </div>

        <!-- Area 2 -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-slate-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between items-start h-full group">
          <div class="mb-6">
            <h3 class="font-bold text-pmvc-dark mb-1 group-hover:text-pmvc-blue transition-colors">Catálogo de cursos</h3>
            <p class="text-sm text-slate-500">Criar, editar e publicar cursos</p>
          </div>
          <q-btn outline color="grey-4" text-color="primary" label="Acessar" size="sm" class="font-semibold px-4 py-1 hover:bg-blue-50" />
        </div>

        <!-- Area 3 -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-slate-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between items-start h-full group">
          <div class="mb-6">
            <h3 class="font-bold text-pmvc-dark mb-1 group-hover:text-pmvc-blue transition-colors">Trilhas formativas</h3>
            <p class="text-sm text-slate-500">Montar percursos por cargo</p>
          </div>
          <q-btn outline color="grey-4" text-color="primary" label="Acessar" size="sm" class="font-semibold px-4 py-1 hover:bg-blue-50" />
        </div>

        <!-- Area 4 -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-slate-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between items-start h-full group">
          <div class="mb-6">
            <h3 class="font-bold text-pmvc-dark mb-1 group-hover:text-pmvc-blue transition-colors">Gestão de tutores</h3>
            <p class="text-sm text-slate-500">Cadastro e atribuições</p>
          </div>
          <q-btn outline color="grey-4" text-color="primary" label="Acessar" size="sm" class="font-semibold px-4 py-1 hover:bg-blue-50" />
        </div>

        <!-- Area 5: Notícias -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-slate-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between items-start h-full group">
          <div class="mb-6">
            <h3 class="font-bold text-pmvc-dark mb-1 group-hover:text-pmvc-blue transition-colors">Gestão de Notícias</h3>
            <p class="text-sm text-slate-500">Publicar matérias e comunicados</p>
          </div>
          <q-btn to="/admin/noticias" outline color="grey-4" text-color="primary" label="Acessar" size="sm" class="font-semibold px-4 py-1 hover:bg-blue-50" />
        </div>

        <!-- Area 6: Secretarias -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-slate-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between items-start h-full group">
          <div class="mb-6">
            <h3 class="font-bold text-pmvc-dark mb-1 group-hover:text-pmvc-blue transition-colors">Gestão de Secretarias</h3>
            <p class="text-sm text-slate-500">Órgãos, siglas, gestores e contatos</p>
          </div>
          <q-btn to="/admin/secretarias" outline color="grey-4" text-color="primary" label="Acessar" size="sm" class="font-semibold px-4 py-1 hover:bg-blue-50" />
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