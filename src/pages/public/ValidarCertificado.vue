<template>
  <div class="min-h-screen bg-slate-50 flex flex-col justify-between font-sans">
    <!-- Header Publico -->
    <header class="bg-white border-b border-slate-200 py-4 px-6 shadow-sm">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img src="~assets/images/brasao-pmvc-2025.png" alt="Brasao PMVC" class="h-10" />
          <div>
            <h1 class="text-lg font-bold text-pmvc-blue leading-none">CONQUISTA SABERES</h1>
            <p class="text-xs text-pmvc-gray uppercase tracking-wider">Portal Público de Validação de Certificados</p>
          </div>
        </div>
        <router-link to="/login" class="text-sm font-semibold text-pmvc-blue hover:underline flex items-center gap-1">
          <q-icon name="login" /> Portal do Servidor
        </router-link>
      </div>
    </header>

    <!-- Conteudo Principal -->
    <main class="max-w-3xl mx-auto w-full px-4 py-12 flex-1 flex flex-col justify-center">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-blue-100 text-pmvc-blue rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
          <q-icon name="verified_user" size="36px" />
        </div>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-800">Autenticidade de Certificado</h2>
        <p class="text-slate-500 text-sm mt-2 max-w-lg mx-auto">
          Digite abaixo o código hash constante no certificado emitido pelo Ambiente Virtual de Aprendizagem da Prefeitura Municipal de Vitória da Conquista.
        </p>
      </div>

      <!-- Card de Busca -->
      <div class="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8">
        <form @submit.prevent="handleValidate" class="flex flex-col sm:flex-row gap-3">
          <q-input
            outlined
            dense
            v-model="hashInput"
            placeholder="Ex: HASH-8291-SETP-2026"
            class="flex-1 text-base"
            hide-bottom-space
            :rules="[val => !!val || 'Informe o código hash']"
          >
            <template v-slot:prepend>
              <q-icon name="qr_code" class="text-pmvc-blue" />
            </template>
          </q-input>
          <q-btn
            type="submit"
            label="VERIFICAR"
            color="primary"
            icon="search"
            class="!px-6 !py-3 font-bold bg-pmvc-blue text-white"
            unelevated
            no-caps
            :loading="certificateStore.loading"
          />
        </form>

        <!-- Resultado Positivo -->
        <div v-if="result && result.valid" class="mt-8 bg-emerald-50 border border-emerald-200 rounded-xl p-6 animate-fade-in">
          <div class="flex items-center gap-3 text-emerald-800 font-bold text-lg mb-4">
            <q-icon name="check_circle" size="28px" class="text-emerald-600" />
            <span>Certificado Válido & Autêntico!</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700">
            <div>
              <span class="block text-xs font-semibold text-slate-400 uppercase">Servidor Municipal</span>
              <span class="font-bold text-slate-900">{{ result.certificate?.user?.nome }}</span>
            </div>
            <div>
              <span class="block text-xs font-semibold text-slate-400 uppercase">CPF / Matrícula</span>
              <span class="font-bold text-slate-900">{{ result.certificate?.user?.cpf }}</span>
            </div>
            <div>
              <span class="block text-xs font-semibold text-slate-400 uppercase">Curso de Capacitação</span>
              <span class="font-bold text-slate-900">{{ result.certificate?.course?.titulo }}</span>
            </div>
            <div>
              <span class="block text-xs font-semibold text-slate-400 uppercase">Carga Horária</span>
              <span class="font-bold text-slate-900">{{ result.certificate?.course?.cargaHoraria }} Horas</span>
            </div>
            <div>
              <span class="block text-xs font-semibold text-slate-400 uppercase">Data de Emissão</span>
              <span class="font-bold text-slate-900">{{ formatDate(result.certificate?.issuedAt) }}</span>
            </div>
            <div>
              <span class="block text-xs font-semibold text-slate-400 uppercase">Código de Validação</span>
              <span class="font-mono font-bold text-pmvc-blue">{{ result.certificate?.codigoValidacao }}</span>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-emerald-200 flex justify-end">
            <a
              :href="certificateStore.getDownloadUrl(result.certificate?.codigoValidacao)"
              target="_blank"
              class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors shadow"
            >
              <q-icon name="download" /> Download Oficial (PDF)
            </a>
          </div>
        </div>

        <!-- Resultado Negativo -->
        <div v-else-if="searched && (!result || !result.valid)" class="mt-8 bg-rose-50 border border-rose-200 rounded-xl p-6 animate-fade-in text-center">
          <q-icon name="error" size="48px" class="text-rose-500 mb-2" />
          <h3 class="text-lg font-bold text-rose-800">Certificado Não Encontrado</h3>
          <p class="text-xs text-rose-600 mt-1">O código inserido não corresponde a nenhum documento válido emitido pela CETI / PMVC.</p>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-slate-200 py-4 text-center text-xs text-pmvc-gray">
      Prefeitura Municipal de Vitória da Conquista • Central de TI (CETI)
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCertificateStore } from 'src/stores/certificateStore';

const route = useRoute();
const certificateStore = useCertificateStore();

const hashInput = ref('');
const searched = ref(false);
const result = ref(null);

onMounted(() => {
  if (route.query.hash) {
    hashInput.value = route.query.hash;
    handleValidate();
  }
});

async function handleValidate() {
  if (!hashInput.value) return;
  searched.value = true;
  try {
    const data = await certificateStore.validateCertificate(hashInput.value);
    result.value = data;
  } catch {
    result.value = { valid: false };
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('pt-BR');
}
</script>
