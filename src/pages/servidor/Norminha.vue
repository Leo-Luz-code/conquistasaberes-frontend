<template>
  <q-page class="p-4 sm:p-8 max-w-7xl mx-auto font-sans pb-24 sm:pb-8">
    <!-- Cabeçalho -->
    <div class="mb-6">
      <h1 class="text-2xl sm:text-3xl font-extrabold text-pmvc-dark tracking-tight mb-1">
        Norminha IA
      </h1>
      <p class="text-sm sm:text-base text-slate-500">
        Sua assistente virtual da Universidade do Servidor Público.
      </p>
    </div>

    <!-- Apresentação Principal (100% Responsivo no mobile e desktop) -->
    <div
      class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-8 flex flex-col md:flex-row items-center md:items-stretch"
    >
      <!-- Imagem/Avatar da Norminha com tamanho delimitado e responsivo -->
      <div
        class="w-full md:w-1/3 bg-gradient-to-br from-[#1b4b7f] to-blue-500 p-6 sm:p-8 flex items-center justify-center shrink-0"
      >
        <div
          class="w-32 h-32 sm:w-44 sm:h-44 md:w-52 md:h-52 aspect-square rounded-2xl overflow-hidden shadow-xl border-4 border-white/30 bg-white/10 flex-shrink-0"
        >
          <img
            src="~assets/images/norminha_avatar.jpg"
            alt="Avatar da Norminha IA"
            class="w-full h-full object-cover rounded-xl"
          />
        </div>
      </div>

      <!-- Textos e Descrição -->
      <div class="p-6 sm:p-8 md:p-10 flex-1 flex flex-col justify-center min-w-0 w-full">
        <div
          class="mb-3 inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 font-bold text-xs rounded-full self-start"
        >
          <q-icon name="auto_awesome" /> Embaixadora do Conhecimento
        </div>

        <h2 class="text-2xl sm:text-3xl font-extrabold text-pmvc-dark mb-3">
          Olá! Eu sou a Norminha 👋
        </h2>

        <p class="text-slate-600 text-sm sm:text-base leading-relaxed mb-5">
          Estou aqui para ajudar você a aproveitar ao máximo a UniVC. Posso orientar seus estudos,
          apoiar a compreensão dos conteúdos dos cursos e acompanhar sua jornada de desenvolvimento
          profissional. Caso tenha dúvidas sobre a plataforma, também posso ajudar indicando cursos,
          explicando como emitir certificados, localizando normativos e esclarecendo dúvidas de
          navegação.
        </p>

        <!-- Ação Rápida de Chat -->
        <div class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <button
            @click="abrirChat()"
            class="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0F4C81] hover:bg-[#0C3B66] text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            <q-icon name="chat" size="18px" />
            Conversar com a Norminha agora
          </button>
          
          <div class="bg-slate-50 border border-slate-200 rounded-xl p-3 flex gap-2 items-center text-xs text-slate-600">
            <q-icon name="smart_toy" class="text-pmvc-blue text-lg shrink-0" />
            <span>Disponível também no botão flutuante no canto da tela.</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Como posso te ajudar -->
    <div class="mb-8">
      <h3 class="text-lg font-bold text-pmvc-dark mb-4">Como posso te ajudar?</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Ação 1 -->
        <div
          @click="abrirChat('Quais cursos são recomendados para o meu cargo?')"
          class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:border-pmvc-blue hover:shadow-md transition-all cursor-pointer group"
        >
          <div
            class="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 group-hover:bg-blue-50 group-hover:text-pmvc-blue flex items-center justify-center shrink-0 transition-colors"
          >
            <q-icon name="menu_book" size="24px" />
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="font-bold text-pmvc-dark mb-0.5 group-hover:text-pmvc-blue transition-colors">
              Encontrar cursos e trilhas
            </h4>
            <p class="text-xs text-slate-500">
              Receba indicações personalizadas com base no seu perfil.
            </p>
          </div>
          <q-icon name="chevron_right" class="text-slate-300 group-hover:text-pmvc-blue text-lg" />
        </div>

        <!-- Ação 2 -->
        <div
          @click="abrirChat('Como obtenho meu certificado após concluir o curso?')"
          class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:border-pmvc-blue hover:shadow-md transition-all cursor-pointer group"
        >
          <div
            class="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 group-hover:bg-blue-50 group-hover:text-pmvc-blue flex items-center justify-center shrink-0 transition-colors"
          >
            <q-icon name="workspace_premium" size="24px" />
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="font-bold text-pmvc-dark mb-0.5 group-hover:text-pmvc-blue transition-colors">
              Orientações sobre certificados
            </h4>
            <p class="text-xs text-slate-500">
              Saiba como emitir, validar e baixar seus certificados.
            </p>
          </div>
          <q-icon name="chevron_right" class="text-slate-300 group-hover:text-pmvc-blue text-lg" />
        </div>

        <!-- Ação 3 -->
        <div
          @click="abrirChat('Como posso acessar os materiais e normativos da Biblioteca?')"
          class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:border-pmvc-blue hover:shadow-md transition-all cursor-pointer group"
        >
          <div
            class="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 group-hover:bg-blue-50 group-hover:text-pmvc-blue flex items-center justify-center shrink-0 transition-colors"
          >
            <q-icon name="library_books" size="24px" />
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="font-bold text-pmvc-dark mb-0.5 group-hover:text-pmvc-blue transition-colors">
              Buscar materiais e normativos
            </h4>
            <p class="text-xs text-slate-500">Localize rapidamente documentos da Biblioteca.</p>
          </div>
          <q-icon name="chevron_right" class="text-slate-300 group-hover:text-pmvc-blue text-lg" />
        </div>

        <!-- Ação 4 -->
        <div
          @click="abrirChat('Como funciona o Passaporte Digital e os pontos de XP?')"
          class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:border-pmvc-blue hover:shadow-md transition-all cursor-pointer group"
        >
          <div
            class="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 group-hover:bg-blue-50 group-hover:text-pmvc-blue flex items-center justify-center shrink-0 transition-colors"
          >
            <q-icon name="trending_up" size="24px" />
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="font-bold text-pmvc-dark mb-0.5 group-hover:text-pmvc-blue transition-colors">
              Acompanhamento da jornada
            </h4>
            <p class="text-xs text-slate-500">
              Tire dúvidas sobre seu Passaporte Digital e progresso.
            </p>
          </div>
          <q-icon name="chevron_right" class="text-slate-300 group-hover:text-pmvc-blue text-lg" />
        </div>
      </div>
    </div>

    <!-- Aviso (Disclaimer) -->
    <div
      class="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-4 flex gap-3 items-center"
    >
      <q-icon name="chat_bubble_outline" class="text-slate-400 text-xl shrink-0" />
      <span class="text-xs text-slate-500 leading-relaxed">
        As respostas da Norminha são orientativas e baseadas nos conteúdos disponíveis na
        plataforma. Para situações específicas, consulte sua chefia imediata ou a Secretaria de
        Administração.
      </span>
    </div>
  </q-page>
</template>

<script setup>
function abrirChat(pergunta = '') {
  window.dispatchEvent(
    new CustomEvent('open-norminha-chat', {
      detail: { pergunta },
    })
  );
}
</script>

<style scoped>
/* Classes Tailwind utilizadas para a interface */
</style>
