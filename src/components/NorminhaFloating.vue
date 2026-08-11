<template>
  <div class="fixed bottom-4 right-6 z-[9999] flex flex-col items-end pointer-events-auto">
    <!-- Modal/Dialog de Conversa com Norminha -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0 translate-y-4"
      enter-to-class="transform scale-100 opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform scale-100 opacity-100 translate-y-0"
      leave-to-class="transform scale-95 opacity-0 translate-y-4"
    >
      <div
        v-if="isOpen"
        class="mb-4 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        style="max-height: 500px;"
      >
        <!-- Header do Chat -->
        <div class="bg-gradient-to-r from-[#0F4C81] to-[#0A3459] p-4 text-white flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="relative w-10 h-10 rounded-full overflow-hidden border-2 border-amber-400 bg-white shrink-0">
              <img
                src="~assets/images/norminha_avatar.jpg"
                alt="Norminha IA"
                class="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 class="font-bold text-sm leading-tight flex items-center gap-1.5">
                Norminha IA
                <span class="px-1.5 py-0.2 bg-amber-400 text-slate-900 text-[10px] font-extrabold rounded">IA</span>
              </h3>
              <p class="text-[11px] text-blue-200">Embaixadora do Conhecimento UniVC</p>
            </div>
          </div>
          <button
            @click="isOpen = false"
            class="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <q-icon name="close" size="20px" />
          </button>
        </div>

        <!-- Conteúdo / Mensagens -->
        <div class="p-4 space-y-3 overflow-y-auto flex-1 bg-slate-50 text-xs">
          <!-- Mensagem de Boas-Vindas da Norminha -->
          <div class="flex gap-2.5 items-start">
            <div class="w-7 h-7 rounded-full overflow-hidden border border-amber-400 bg-white shrink-0">
              <img src="~assets/images/norminha_avatar.jpg" alt="Norminha" class="w-full h-full object-cover" />
            </div>
            <div class="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm text-slate-700 space-y-1.5 max-w-[85%]">
              <p class="font-bold text-slate-900 text-xs">Olá, Servidor! 👋</p>
              <p>Eu sou a Norminha, sua assistente virtual de aprendizagem na UniVC.</p>
              <p>Como posso apoiar seu desenvolvimento profissional hoje?</p>
            </div>
          </div>

          <!-- Sugestões Rápidas -->
          <div class="pt-2 space-y-1.5">
            <p class="text-[11px] text-slate-400 font-semibold px-1">Perguntas frequentes:</p>
            <button
              v-for="(sug, idx) in sugestoes"
              :key="idx"
              @click="selecionarSugestao(sug)"
              class="w-full text-left p-2 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-xs font-semibold text-slate-700 transition-colors"
            >
              🔹 {{ sug.pergunta }}
            </button>
          </div>

          <!-- Mensagem Selecionada (Resposta) -->
          <div v-if="respostaAtual" class="pt-2 space-y-2">
            <div class="flex gap-2.5 items-start">
              <div class="w-7 h-7 rounded-full overflow-hidden border border-amber-400 bg-white shrink-0">
                <img src="~assets/images/norminha_avatar.jpg" alt="Norminha" class="w-full h-full object-cover" />
              </div>
              <div class="bg-blue-50 border border-blue-200 p-3 rounded-2xl rounded-tl-none shadow-sm text-slate-800 text-xs space-y-1">
                <p class="font-bold text-[#0F4C81]">{{ respostaAtual.pergunta }}</p>
                <p>{{ respostaAtual.resposta }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Input Footer -->
        <div class="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            v-model="inputMsg"
            type="text"
            placeholder="Digite sua dúvida para a Norminha..."
            class="flex-1 bg-slate-100 text-xs rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 border border-transparent"
            @keyup.enter="enviarMensagem"
          />
          <button
            @click="enviarMensagem"
            class="p-2 bg-[#0F4C81] hover:bg-[#0C3B66] text-white rounded-xl transition-colors shrink-0"
          >
            <q-icon name="send" size="16px" />
          </button>
        </div>
      </div>
    </transition>

    <!-- Botão Flutuante Circular da Norminha -->
    <button
      @click="isOpen = !isOpen"
      class="group relative flex items-center justify-center w-14 h-14 rounded-full bg-white border-2 border-amber-400 shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-200 cursor-pointer overflow-visible"
      title="Norminha IA - Assistente de Conhecimento"
    >
      <!-- Badge 'IA' no topo esquerdo do avatar -->
      <span
        class="absolute -top-1 -left-1 px-1.5 py-0.5 bg-[#0F4C81] text-white text-[9px] font-black rounded-full shadow-md border border-amber-300 z-10"
      >
        IA
      </span>

      <!-- Foto Avatar da Norminha -->
      <div class="w-full h-full rounded-full overflow-hidden p-0.5">
        <img
          src="~assets/images/norminha_avatar.jpg"
          alt="Norminha IA"
          class="w-full h-full object-cover rounded-full"
        />
      </div>

      <!-- Pulse Effect -->
      <span class="absolute inset-0 rounded-full bg-amber-400/30 animate-ping pointer-events-none -z-10"></span>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isOpen = ref(false);
const inputMsg = ref('');
const respostaAtual = ref(null);

const sugestoes = [
  {
    pergunta: 'Quais cursos são recomendados para o meu cargo?',
    resposta: 'Com base no seu perfil, recomendamos as trilhas de "Integração ao Serviço Público Municipal" e "Gestão e Liderança".',
  },
  {
    pergunta: 'Como obtenho meu certificado após concluir o curso?',
    resposta: 'Assim que concluir 100% das aulas e passar no quiz final, seu certificado PDF será gerado automaticamente na aba "Certificados" com Hash de Autenticidade.',
  },
  {
    pergunta: 'Como funciona o Passaporte Digital e os pontos de XP?',
    resposta: 'Cada aula concluída soma XP ao seu perfil. Conforme acumula pontos, você sobe de nível e ganha Badges Institucionais!',
  },
];

function selecionarSugestao(sug) {
  respostaAtual.value = sug;
}

function enviarMensagem() {
  if (!inputMsg.value.trim()) return;
  respostaAtual.value = {
    pergunta: inputMsg.value,
    resposta: 'Estou processando sua pergunta com base nas diretrizes da Prefeitura de Vitória da Conquista. Para mais detalhes, confira a aba de Cursos ou Trilhas!',
  };
  inputMsg.value = '';
}
</script>
