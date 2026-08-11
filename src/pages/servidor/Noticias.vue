<template>
  <q-page class="p-4 md:p-8 w-full max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl md:text-4xl font-bold text-pmvc-dark tracking-tight mb-2">Notícias UniVC</h1>
      <p class="text-slate-500 text-sm md:text-base">Acompanhe novidades, lançamentos e marcos da Universidade do Servidor Público.</p>
    </div>

    <!-- Destaque Principal -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8 transition-transform hover:-translate-y-1 hover:shadow-md duration-300 flex flex-col md:flex-row">
      <!-- Imagem/Gradiente Destaque -->
      <div class="md:w-1/2 bg-gradient-to-br from-[#1b4b7f] to-[#38b2ac] p-8 md:p-12 flex flex-col justify-end text-white min-h-[300px] relative overflow-hidden">
        <!-- Abstract shape to make it premium -->
        <div class="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute bottom-10 -left-10 w-40 h-40 bg-teal-300 opacity-10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div class="z-10">
          <q-chip color="amber-500" text-color="white" class="font-bold mb-4 shadow-sm" size="sm">
            Destaque
          </q-chip>
          <h2 class="text-2xl md:text-3xl font-bold leading-tight mb-4 drop-shadow-md">
            Prefeitura lança a Universidade do Servidor Público — UniVC
          </h2>
          <div class="flex items-center text-slate-200 text-sm opacity-90 font-medium">
            <q-icon name="calendar_today" class="mr-2" />
            28 de abril de 2026
          </div>
        </div>
      </div>
      
      <!-- Conteúdo Destaque -->
      <div class="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
        <p class="text-slate-600 text-base md:text-lg leading-relaxed mb-8">
          Iniciativa marca um novo ciclo de valorização e capacitação dos servidores municipais de Vitória da Conquista, com foco em desenvolvimento contínuo.
        </p>
        <div>
          <q-btn
            unelevated
            color="primary"
            label="Ler mais"
            icon-right="arrow_forward"
            class="rounded-lg px-6 font-semibold bg-[#1b4b7f] hover:bg-[#153a63]"
          />
        </div>
      </div>
    </div>

    <!-- Grid de Notícias Secundárias -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Card 1 -->
      <q-card class="rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer flex flex-col h-full group" flat>
        <div class="h-48 bg-amber-50 relative flex items-center justify-center group-hover:bg-amber-100 transition-colors duration-300">
          <q-chip class="absolute top-4 left-4 bg-white text-slate-700 font-bold shadow-sm" size="sm">
            Trilhas
          </q-chip>
          <q-icon name="article" size="64px" class="text-slate-300 group-hover:text-amber-300 transition-colors duration-300" />
          <!-- Mockup hover state icons (view/forward) -->
          <div class="absolute bottom-4 left-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <q-btn dense flat round icon="open_in_new" class="bg-black/40 text-white hover:bg-black/60" size="sm" />
             <q-btn dense flat round icon="play_arrow" class="bg-black/40 text-white hover:bg-black/60" size="sm" />
          </div>
        </div>
        <q-card-section class="flex flex-col flex-grow p-5 bg-white">
          <div class="text-xs text-slate-400 mb-2 flex items-center">
            <q-icon name="calendar_today" class="mr-1" />
            22 de abril de 2026
          </div>
          <h3 class="text-base font-bold text-pmvc-dark mb-2 leading-tight group-hover:text-pmvc-blue transition-colors">Nova trilha de capacitação em atendimento ao cidadão</h3>
          <p class="text-sm text-slate-500 line-clamp-3">Conjunto de cursos voltados ao atendimento humanizado, comunicação não violenta e excelência no serviço público municipal.</p>
        </q-card-section>
      </q-card>

      <!-- Card 2 -->
      <q-card class="rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer flex flex-col h-full group" flat>
        <div class="h-48 bg-slate-50 relative flex items-center justify-center group-hover:bg-slate-100 transition-colors duration-300">
          <q-chip class="absolute top-4 left-4 bg-white text-slate-700 font-bold shadow-sm" size="sm">
            Inovação
          </q-chip>
          <q-icon name="article" size="64px" class="text-slate-300 group-hover:text-slate-400 transition-colors duration-300" />
        </div>
        <q-card-section class="flex flex-col flex-grow p-5 bg-white">
          <div class="text-xs text-slate-400 mb-2 flex items-center">
            <q-icon name="calendar_today" class="mr-1" />
            15 de abril de 2026
          </div>
          <h3 class="text-base font-bold text-pmvc-dark mb-2 leading-tight group-hover:text-pmvc-blue transition-colors">Norminha IA apoiará servidores na busca por orientações e conteúdos</h3>
          <p class="text-sm text-slate-500 line-clamp-3">Assistente virtual da UniVC ajuda o servidor a localizar cursos, certificados, normativos e tirar dúvidas sobre a plataforma.</p>
        </q-card-section>
      </q-card>

      <!-- Card 3 -->
      <q-card class="rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer flex flex-col h-full group" flat>
        <div class="h-48 bg-slate-50 relative flex items-center justify-center group-hover:bg-slate-100 transition-colors duration-300">
          <q-chip class="absolute top-4 left-4 bg-white text-slate-700 font-bold shadow-sm" size="sm">
            Plataforma
          </q-chip>
          <q-icon name="article" size="64px" class="text-slate-300 group-hover:text-slate-400 transition-colors duration-300" />
        </div>
        <q-card-section class="flex flex-col flex-grow p-5 bg-white relative">
          <div class="text-xs text-slate-400 mb-2 flex items-center">
            <q-icon name="calendar_today" class="mr-1" />
            10 de abril de 2026
          </div>
          <h3 class="text-base font-bold text-pmvc-dark mb-2 leading-tight group-hover:text-pmvc-blue transition-colors">Servidores poderão acompanhar sua jornada pelo Passaporte Digital</h3>
          <p class="text-sm text-slate-500 line-clamp-3">O Passaporte Digital concentra cursos concluídos, trilhas, certificados, conquistas e pontuação de aprendizagem.</p>
          
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
</script>

<style scoped>
/* Adicionando cores personalizadas caso não estejam no tailwind.config.js,
   embora as cores da PMVC já devam estar configuradas lá (text-pmvc-dark, bg-pmvc-blue, etc).
   As utilidades Tailwind lidam com o layout principal. */
</style>
