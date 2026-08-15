<template>
  <q-page class="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6 font-sans">
    <!-- ========================================================= -->
    <!-- CABEÇALHO DO PASSAPORTE DIGITAL -->
    <!-- ========================================================= -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <div class="w-8 h-8 rounded-xl bg-pmvc-blue/10 text-pmvc-blue flex items-center justify-center font-bold">
            <q-icon name="badge" size="20px" />
          </div>
          <span class="text-[11px] font-extrabold uppercase tracking-widest text-pmvc-blue">
            Identidade Funcional & Jornada Formativa
          </span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
          Passaporte Digital do Servidor
          <span class="text-xs px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold">
            Oficial PMVC
          </span>
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">
          Registro consolidado de certificações, competências, conquistas e evolução na Universidade do Servidor.
        </p>
      </div>

      <!-- Ações do Topo -->
      <div class="flex items-center gap-2 flex-wrap">
        <q-btn
          outline
          color="primary"
          icon="print"
          label="Imprimir Passaporte"
          no-caps
          class="rounded-xl font-bold bg-white text-xs"
          @click="imprimirPassaporte"
        />
        <q-btn
          unelevated
          color="primary"
          icon="share"
          label="Copiar ID Digital"
          no-caps
          class="rounded-xl font-bold text-xs"
          @click="copiarIdPassaporte"
        />
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- CARD PRINCIPAL: O PASSAPORTE DIGITAL (ESTILO CREDENCIAL) -->
    <!-- ========================================================= -->
    <div class="bg-gradient-to-br from-[#0F4C81] via-[#125b9b] to-[#0A3357] rounded-3xl text-white shadow-xl overflow-hidden border border-blue-900/30 relative">
      <!-- Marca D'água Decorativa de Fundo -->
      <div class="absolute right-0 top-0 bottom-0 w-96 opacity-5 pointer-events-none flex items-center justify-center">
        <q-icon name="military_tech" size="380px" />
      </div>

      <!-- Faixa Superior Dourada Oficial -->
      <div class="bg-[#F2B705] text-[#0F4C81] px-6 py-2 flex items-center justify-between font-extrabold text-xs tracking-wider uppercase">
        <div class="flex items-center gap-2">
          <q-icon name="account_balance" size="16px" />
          <span>Prefeitura Municipal de Vitória da Conquista • UniVC</span>
        </div>
        <div class="hidden sm:flex items-center gap-1.5">
          <q-icon name="verified" size="15px" />
          <span>Passaporte Autêntico • CETI / SETP</span>
        </div>
      </div>

      <div class="p-6 sm:p-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <!-- Coluna 1: Avatar e Dados Principais -->
          <div class="lg:col-span-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <!-- Avatar com Borda Dourada -->
            <div class="relative shrink-0">
              <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white text-[#0F4C81] flex items-center justify-center font-extrabold text-4xl shadow-2xl border-4 border-[#F2B705]">
                {{ authStore.userInitial }}
              </div>
              <div class="absolute -bottom-2 -right-2 bg-[#F2B705] text-[#0F4C81] w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md" title="Nível">
                N{{ gamificationStore.level }}
              </div>
            </div>

            <!-- Identificação do Servidor -->
            <div class="flex-1 min-w-0 space-y-1.5">
              <div class="flex items-center gap-2 flex-wrap">
                <h2 class="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  {{ authStore.userName }}
                </h2>
                <span class="px-2.5 py-0.5 rounded-full bg-blue-500/30 border border-blue-400/30 text-blue-100 text-[11px] font-bold">
                  {{ authStore.roleLabel }}
                </span>
              </div>

              <p class="text-sm font-semibold text-blue-200 flex items-center gap-2">
                <q-icon name="work" size="16px" class="text-[#F2B705]" />
                {{ authStore.userCargo || 'Servidor Municipal' }} • {{ authStore.userSecretaria || 'PMVC' }}
              </p>

              <div class="pt-2 flex flex-wrap gap-y-1.5 gap-x-4 text-xs text-blue-100/90 font-mono">
                <div>
                  <span class="text-blue-300">MATRÍCULA:</span>
                  <strong class="text-white ml-1">{{ authStore.user?.matricula || '---' }}</strong>
                </div>
                <div>
                  <span class="text-blue-300">CPF:</span>
                  <strong class="text-white ml-1">{{ formatCpf(authStore.user?.cpf) }}</strong>
                </div>
                <div>
                  <span class="text-blue-300">ID DIGITAL:</span>
                  <strong class="text-[#F2B705] ml-1">VC-{{ (authStore.user?.matricula || '0000').padStart(6, '0') }}</strong>
                </div>
              </div>
            </div>
          </div>

          <!-- Coluna 2: QR Code Oficial de Validação do Passaporte -->
          <div class="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
            <div class="bg-white p-3 rounded-2xl shadow-lg border-2 border-white/20 text-center inline-block">
              <img v-if="qrCodeDataUrl" :src="qrCodeDataUrl" alt="QR Code do Passaporte" class="w-28 h-28 mx-auto" />
              <div v-else class="w-28 h-28 flex items-center justify-center">
                <q-spinner color="primary" size="28px" />
              </div>
              <span class="text-[9px] font-extrabold uppercase tracking-wider text-slate-600 block mt-1">
                Validação Oficial
              </span>
            </div>
            <span class="text-[10px] text-blue-200 mt-1.5 text-center lg:text-right">
              Digitalize para validar o passaporte funcional
            </span>
          </div>
        </div>

        <!-- Barra Inferior de Métricas Rápidas -->
        <div class="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div class="bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
            <span class="text-[11px] text-blue-200 uppercase font-bold block">Nível Atual</span>
            <span class="text-xl font-extrabold text-[#F2B705]">Nível {{ gamificationStore.level }}</span>
            <span class="text-[10px] text-blue-200 block truncate">{{ gamificationStore.levelTitle }}</span>
          </div>

          <div class="bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
            <span class="text-[11px] text-blue-200 uppercase font-bold block">Total de Experiência</span>
            <span class="text-xl font-extrabold text-white">{{ gamificationStore.xpPoints }} <small class="text-xs">XP</small></span>
            <span class="text-[10px] text-emerald-300 block font-semibold">+{{ gamificationStore.xpProgress }}% p/ próx. nível</span>
          </div>

          <div class="bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
            <span class="text-[11px] text-blue-200 uppercase font-bold block">Certificados Emitidos</span>
            <span class="text-xl font-extrabold text-white">{{ certificateStore.certificates.length }}</span>
            <span class="text-[10px] text-blue-200 block">Capacitações concluídas</span>
          </div>

          <div class="bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
            <span class="text-[11px] text-blue-200 uppercase font-bold block">Posição no Ranking</span>
            <span class="text-xl font-extrabold text-[#F2B705]">{{ userRankingPosition }}º Lugar</span>
            <span class="text-[10px] text-blue-200 block">Quadro Geral PMVC</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- SEÇÃO: JORNADA DE EVOLUÇÃO & PROGRESSO DO NÍVEL -->
    <!-- ========================================================= -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
      <div class="flex items-center justify-between gap-3 mb-4">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <q-icon name="bolt" size="20px" />
          </div>
          <div>
            <h2 class="text-base font-extrabold text-slate-800">Evolução do Nível & Experiência</h2>
            <p class="text-[11px] text-slate-400">Progresso contínuo de qualificação funcional</p>
          </div>
        </div>
        <q-btn
          flat
          dense
          color="primary"
          icon="leaderboard"
          label="Ver Ranking Geral"
          no-caps
          to="/servidor/ranking"
          class="text-xs font-bold"
        />
      </div>

      <!-- Barra de Progresso com Marcadores -->
      <div class="space-y-2">
        <div class="flex items-center justify-between text-xs">
          <span class="font-bold text-slate-700">
            Nível {{ gamificationStore.level }} ({{ gamificationStore.levelTitle }})
          </span>
          <span class="font-extrabold text-pmvc-blue">
            {{ gamificationStore.xpProgress }}% do nível concluído
          </span>
        </div>

        <q-linear-progress
          :value="gamificationStore.xpProgress / 100"
          size="14px"
          rounded
          color="primary"
          track-color="slate-100"
          class="rounded-full shadow-inner"
        />

        <div class="flex justify-between text-[11px] text-slate-500 font-medium pt-1">
          <span>{{ gamificationStore.xpPoints }} XP Acumulado</span>
          <span>
            Faltam <strong class="text-pmvc-blue">{{ Math.max(0, gamificationStore.nextLevelXp - gamificationStore.xpPoints) }} XP</strong> para o Nível {{ gamificationStore.level + 1 }}
          </span>
        </div>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- SEÇÃO: CONQUISTAS & BADGES DO PASSAPORTE -->
    <!-- ========================================================= -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
      <div class="flex items-center justify-between gap-3 mb-5 border-b border-slate-100 pb-4">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <q-icon name="military_tech" size="20px" />
          </div>
          <div>
            <h2 class="text-base font-extrabold text-slate-800">Insígnias & Conquistas Desbloqueadas</h2>
            <p class="text-[11px] text-slate-400">Selos de honra e proficiência atribuídos pela Prefeitura</p>
          </div>
        </div>
        <span class="text-xs font-extrabold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
          {{ gamificationStore.earnedBadges.length }} de {{ gamificationStore.badges.length }} Conquistas
        </span>
      </div>

      <div v-if="gamificationStore.badges.length === 0" class="text-center py-8 text-xs text-slate-400">
        Nenhuma insígnia cadastrada no momento.
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="badge in gamificationStore.badges"
          :key="badge.id"
          class="relative p-4 rounded-2xl border text-center transition-all duration-200 flex flex-col justify-between items-center"
          :class="badge.earned
            ? 'bg-gradient-to-b from-amber-50/80 to-white border-amber-200 shadow-sm hover:shadow hover:-translate-y-0.5'
            : 'bg-slate-50 border-slate-200 opacity-50 grayscale'"
        >
          <!-- Selo Conquistado -->
          <div v-if="badge.earned" class="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
            <q-icon name="check" size="12px" />
          </div>

          <!-- Ícone / Capa do Badge -->
          <div
            class="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden mb-2 shadow-inner"
            :class="badge.earned ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-400'"
          >
            <img
              v-if="isImageUrl(badge.icone)"
              :src="getMediaUrl(badge.icone)"
              :alt="badge.nome"
              class="w-full h-full object-cover"
            />
            <q-icon v-else :name="badge.icone || 'military_tech'" size="32px" />
          </div>

          <div class="text-center w-full">
            <h4 class="font-extrabold text-xs text-slate-900 leading-tight">
              {{ badge.nome }}
            </h4>
            <p class="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-tight">
              {{ badge.descricao }}
            </p>
            <span v-if="badge.xpBonus" class="inline-block mt-2 text-[10px] font-bold text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded-md">
              +{{ badge.xpBonus }} XP
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- SEÇÃO: CERTIFICADOS REGISTRADOS NO PASSAPORTE -->
    <!-- ========================================================= -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
      <div class="flex items-center justify-between gap-3 mb-5 border-b border-slate-100 pb-4">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <q-icon name="workspace_premium" size="20px" />
          </div>
          <div>
            <h2 class="text-base font-extrabold text-slate-800">Certificados Oficiais Registrados</h2>
            <p class="text-[11px] text-slate-400">Capacitações com certificado válido e hash de autenticidade</p>
          </div>
        </div>
        <q-btn
          flat
          dense
          color="primary"
          icon="search"
          label="Validar Certificado"
          no-caps
          to="/validar-certificado"
          class="text-xs font-bold"
        />
      </div>

      <div v-if="certificateStore.certificates.length === 0" class="text-center py-10 border border-dashed rounded-2xl border-slate-200 bg-slate-50">
        <q-icon name="workspace_premium" size="48px" class="text-slate-300 mb-2" />
        <p class="text-sm font-bold text-slate-600">Nenhum certificado registrado ainda.</p>
        <p class="text-xs text-slate-400 mt-1">Conclua aulas e quizzes dos cursos para emitir seus certificados automaticamente.</p>
        <q-btn
          unelevated
          color="primary"
          icon="school"
          label="Explorar Cursos"
          to="/servidor/cursos"
          class="mt-4 rounded-xl text-xs font-bold"
          no-caps
        />
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="cert in certificateStore.certificates"
          :key="cert.id"
          class="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-pmvc-blue/30 transition-all shadow-sm flex flex-col justify-between"
        >
          <div>
            <div class="flex items-start justify-between gap-2 mb-2">
              <span class="text-[10px] font-mono text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded">
                HASH: {{ cert.codigoValidacao || cert.id?.substring(0, 12) }}
              </span>
              <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <q-icon name="check_circle" size="12px" />
                Emitido
              </span>
            </div>

            <h3 class="font-extrabold text-sm text-slate-900 leading-snug">
              {{ cert.courseTitle || cert.course?.titulo || 'Capacitação Profissional' }}
            </h3>

            <p class="text-xs text-slate-500 mt-1">
              Carga horária: <strong>{{ cert.course?.cargaHoraria || cert.cargaHoraria || 20 }}h</strong> • Emitido em {{ formatDate(cert.issuedAt || cert.createdAt) }}
            </p>
          </div>

          <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span class="text-[10px] text-slate-400">Prefeitura de Vitória da Conquista</span>
            <div class="flex items-center gap-1">
              <q-btn
                dense
                flat
                size="sm"
                color="primary"
                icon="download"
                label="Baixar PDF"
                no-caps
                class="font-bold"
                @click="baixarCertificado(cert)"
              />
              <q-btn
                dense
                flat
                size="sm"
                color="secondary"
                icon="open_in_new"
                label="Ver Validação"
                no-caps
                class="font-bold"
                :to="`/validar-certificado`"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- SEÇÃO: DADOS CADASTRAIS & CONFORMIDADE LGPD -->
    <!-- ========================================================= -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
      <div class="flex items-center justify-between gap-3 mb-5 border-b border-slate-100 pb-4">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-blue-50 text-pmvc-blue flex items-center justify-center">
            <q-icon name="shield" size="20px" />
          </div>
          <div>
            <h2 class="text-base font-extrabold text-slate-800">Conformidade LGPD & Segurança</h2>
            <p class="text-[11px] text-slate-400">Privacidade de dados e registro de consentimento</p>
          </div>
        </div>
        <div class="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          <q-icon name="verified_user" size="16px" />
          <span>Termo LGPD Aceito</span>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
          <span class="text-[10px] font-bold text-slate-400 uppercase">Nome Completo</span>
          <span class="block font-bold text-slate-900 text-sm mt-0.5 truncate">{{ authStore.userName }}</span>
        </div>

        <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
          <span class="text-[10px] font-bold text-slate-400 uppercase">E-mail Institucional</span>
          <span class="block font-bold text-slate-900 text-sm mt-0.5 truncate">{{ authStore.user?.email || '---' }}</span>
        </div>

        <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
          <span class="text-[10px] font-bold text-slate-400 uppercase">Matrícula Funcional</span>
          <span class="block font-bold text-slate-900 text-sm mt-0.5">{{ authStore.user?.matricula || '---' }}</span>
        </div>

        <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
          <span class="text-[10px] font-bold text-slate-400 uppercase">Data de Aceite LGPD</span>
          <span class="block font-bold text-slate-900 text-sm mt-0.5">{{ formatDate(authStore.user?.lgpdAcceptedAt) }}</span>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
        <span class="text-xs text-slate-400">
          Seus dados são protegidos nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
        </span>
        <q-btn
          label="Sair da Conta"
          color="negative"
          flat
          icon="logout"
          no-caps
          class="font-bold text-xs"
          @click="authStore.logout(); $router.push('/login')"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from 'src/stores/authStore';
import { useGamificationStore } from 'src/stores/gamificationStore';
import { useCertificateStore } from 'src/stores/certificateStore';
import { useQuasar } from 'quasar';
import QRCode from 'qrcode';
import { getMediaUrl, getAppOrigin } from 'src/utils/media';

const $q = useQuasar();
const authStore = useAuthStore();
const gamificationStore = useGamificationStore();
const certificateStore = useCertificateStore();

const qrCodeDataUrl = ref('');

const formatCpf = (cpf) => {
  if (!cpf) return '***.***.***-**';
  const clean = cpf.replace(/\D/g, '');
  if (clean.length === 11) {
    return `${clean.substring(0, 3)}.***.***-${clean.substring(9)}`;
  }
  return cpf;
};

const formatDate = (date) => {
  if (!date) return 'Não registrado';
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

function isImageUrl(icone) {
  if (!icone) return false;
  const trimmed = icone.trim();
  return (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/uploads/') ||
    trimmed.startsWith('uploads/') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  );
}

const userRankingPosition = computed(() => {
  const topUsers = gamificationStore.leaderboard?.topUsers || [];
  const currentUserId = authStore.user?.id;
  if (!currentUserId || topUsers.length === 0) return 1;
  const idx = topUsers.findIndex((u) => u.id === currentUserId);
  return idx >= 0 ? idx + 1 : 1;
});

const generateQrCode = async () => {
  try {
    const origin = getAppOrigin();
    const passportValidationUrl = `${origin}/#/validar-certificado?passaporte=${authStore.user?.matricula || authStore.user?.id || 'pmvc'}`;
    qrCodeDataUrl.value = await QRCode.toDataURL(passportValidationUrl, {
      width: 200,
      margin: 1,
      color: {
        dark: '#0F4C81',
        light: '#FFFFFF',
      },
    });
  } catch (err) {
    console.error('Erro ao gerar QR Code do Passaporte:', err);
  }
};

const imprimirPassaporte = () => {
  window.print();
};

const copiarIdPassaporte = () => {
  const id = `VC-${(authStore.user?.matricula || '0000').padStart(6, '0')}`;
  navigator.clipboard.writeText(id);
  $q.notify({
    color: 'positive',
    icon: 'content_copy',
    message: `ID do Passaporte (${id}) copiado para a área de transferência!`,
  });
};

const baixarCertificado = async (cert) => {
  try {
    await certificateStore.downloadCertificate(cert.id || cert.courseId);
  } catch (e) {
    $q.notify({
      color: 'negative',
      icon: 'error',
      message: 'Erro ao gerar o download do certificado.',
    });
  }
};

onMounted(async () => {
  try {
    await Promise.all([
      authStore.fetchProfile(),
      gamificationStore.fetchMyStatus(),
      gamificationStore.fetchLeaderboard(),
      certificateStore.fetchMyCertificates(),
    ]);
    await generateQrCode();
  } catch (error) {
    console.error('Erro ao carregar dados do passaporte:', error);
  }
});
</script>

<style scoped>
@media print {
  body {
    background: white !important;
  }
  .q-header,
  .q-drawer,
  .q-btn {
    display: none !important;
  }
}
</style>