<template>
  <q-page class="p-4 sm:p-8 max-w-7xl mx-auto font-sans">
    
    <!-- Cabeçalho -->
    <div class="mb-6">
      <h1 class="text-2xl sm:text-3xl font-extrabold text-pmvc-dark tracking-tight mb-1">Norminha IA</h1>
      <p class="text-sm sm:text-base text-slate-500">Sua assistente virtual da Universidade do Servidor Público.</p>
    </div>

    <!-- Apresentação Principal -->
    <div class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-8 flex flex-col md:flex-row">
      <!-- Imagem/Avatar -->
      <div class="md:w-1/3 bg-gradient-to-br from-[#1b4b7f] to-blue-400 p-6 flex items-center justify-center">
        <q-img 
          src="~assets/images/norminha-avatar.png" 
          alt="Avatar da Norminha" 
          class="rounded-2xl max-w-xs md:max-w-full shadow-lg border-4 border-white/20"
          :ratio="1"
        />
      </div>
      
      <!-- Textos -->
      <div class="p-6 md:p-10 flex-1 flex flex-col justify-center">
        <div class="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 font-bold text-xs rounded-full self-start">
          <q-icon name="auto_awesome" /> Embaixadora do Conhecimento
        </div>
        
        <h2 class="text-2xl sm:text-3xl font-extrabold text-pmvc-dark mb-4">Olá! Eu sou a Norminha 👋</h2>
        
        <p class="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
          Estou aqui para ajudar você a aproveitar ao máximo a UniVC. Posso orientar seus estudos, apoiar a compreensão dos conteúdos dos cursos e acompanhar sua jornada de desenvolvimento profissional. Caso tenha dúvidas sobre a plataforma, também posso ajudar indicando cursos, explicando como emitir certificados, localizando normativos e esclarecendo dúvidas de navegação.
        </p>

        <!-- Dica do Botão -->
        <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-3 items-start">
          <q-icon name="smart_toy" class="text-pmvc-blue text-xl mt-0.5" />
          <span class="text-sm text-slate-700 font-medium">
            Clique no botão flutuante no canto inferior direito da tela para conversar comigo a qualquer momento.
          </span>
        </div>
      </div>
    </div>

    <!-- Como posso te ajudar -->
    <div class="mb-8">
      <h3 class="text-lg font-bold text-pmvc-dark mb-4">Como posso te ajudar?</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Ação 1 -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:border-pmvc-blue transition-colors cursor-pointer">
          <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <q-icon name="menu_book" size="24px" />
          </div>
          <div>
            <h4 class="font-bold text-pmvc-dark mb-0.5">Encontrar cursos e trilhas</h4>
            <p class="text-xs text-slate-500">Receba indicações personalizadas com base no seu perfil.</p>
          </div>
        </div>

        <!-- Ação 2 -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:border-pmvc-blue transition-colors cursor-pointer">
          <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <q-icon name="workspace_premium" size="24px" />
          </div>
          <div>
            <h4 class="font-bold text-pmvc-dark mb-0.5">Orientações sobre certificados</h4>
            <p class="text-xs text-slate-500">Saiba como emitir, validar e baixar seus certificados.</p>
          </div>
        </div>

        <!-- Ação 3 -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:border-pmvc-blue transition-colors cursor-pointer">
          <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <q-icon name="library_books" size="24px" />
          </div>
          <div>
            <h4 class="font-bold text-pmvc-dark mb-0.5">Buscar materiais e normativos</h4>
            <p class="text-xs text-slate-500">Localize rapidamente documentos da Biblioteca.</p>
          </div>
        </div>

        <!-- Ação 4 -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:border-pmvc-blue transition-colors cursor-pointer">
          <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <q-icon name="trending_up" size="24px" />
          </div>
          <div>
            <h4 class="font-bold text-pmvc-dark mb-0.5">Acompanhamento da jornada</h4>
            <p class="text-xs text-slate-500">Tire dúvidas sobre seu Passaporte Digital e progresso.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Aviso (Disclaimer) -->
    <div class="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-4 flex gap-3 items-center">
      <q-icon name="chat_bubble_outline" class="text-slate-400 text-xl" />
      <span class="text-xs text-slate-500">
        As respostas da Norminha são orientativas e baseadas nos conteúdos disponíveis na plataforma. Para situações específicas, consulte sua chefia imediata ou a Secretaria de Administração.
      </span>
    </div>

  </q-page>
</template>

<script setup>
// Componente estático de apresentação da Norminha
</script>

<style scoped>
/* Classes Tailwind utilizadas para a interface */
</style>
