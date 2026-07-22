<template>
  <div class="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
    <div class="max-w-2xl w-full bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
      <!-- Topo Institucional -->
      <div class="bg-pmvc-blue p-6 text-white text-center">
        <img src="~assets/images/brasao-pmvc-2025.png" alt="Logo PMVC" class="h-16 mx-auto mb-3" />
        <h1 class="text-xl font-bold uppercase tracking-wide">Termo de Consentimento e Privacidade (LGPD)</h1>
        <p class="text-xs text-blue-100 mt-1">Conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018)</p>
      </div>

      <!-- Conteúdo do Termo -->
      <div class="p-6 max-h-[60vh] overflow-y-auto text-sm text-slate-700 space-y-4 border-b border-slate-200">
        <p class="font-bold text-slate-900">Prezado(a) Servidor(a) Municipal,</p>
        
        <p>
          Para garantir a transparência, a segurança das informações e a correta gestão do seu histórico de capacitações e progressão funcional na Prefeitura Municipal de Vitória da Conquista (PMVC), solicitamos o seu aceite aos termos abaixo:
        </p>

        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
          <h2 class="font-bold text-pmvc-blue text-sm uppercase">1. Coleta e Finalidade dos Dados</h2>
          <p>Seus dados pessoais (Nome, CPF, Matrícula, E-mail, Cargo e Secretaria de Lotação) serão utilizados exclusivamente para registro de matrículas, emissão automatizada de certificados com validação pública e contabilização de horas para avaliação de desempenho e progressão de carreira.</p>

          <h2 class="font-bold text-pmvc-blue text-sm uppercase">2. Armazenamento e Auditoria</h2>
          <p>Todas as interações na plataforma (conclusão de aulas, tentativas de quizzes, participação no fórum e geração de certificados) serão devidamente registradas em logs de auditoria imutáveis, garantindo a rastreabilidade e a segurança das operações públicas.</p>

          <h2 class="font-bold text-pmvc-blue text-sm uppercase">3. Compartilhamento Interno</h2>
          <p>Os indicadores agregados de progresso e engajamento serão disponibilizados aos Gestores de Secretaria e ao RH Central da CETI/SETP tão somente para fins de planejamento pedagógico e capacitação contínua.</p>
        </div>

        <div class="flex items-center gap-3 p-3 bg-blue-50 text-blue-900 rounded-xl text-xs font-medium">
          <q-icon name="info" size="20px" class="text-pmvc-blue shrink-0" />
          <span>Ao clicar em "Aceitar e Continuar", você autoriza a PMVC a processar seus dados educacionais conforme descrito.</span>
        </div>
      </div>

      <!-- Acoes -->
      <div class="p-6 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span class="text-xs text-slate-500">Aceite obrigatório para o primeiro acesso ao AVA.</span>
        <q-btn
          label="ACEITAR E CONTINUAR"
          color="primary"
          icon="verified"
          class="w-full sm:w-auto !py-3 !px-6 bg-pmvc-blue text-white font-bold"
          unelevated
          no-caps
          :loading="loading"
          @click="handleAccept"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();
const loading = ref(false);

async function handleAccept() {
  loading.value = true;
  try {
    await authStore.acceptLgpd();
    router.push('/servidor/dashboard');
  } catch (error) {
    console.error('Erro ao aceitar LGPD:', error);
  } finally {
    loading.value = false;
  }
}
</script>
