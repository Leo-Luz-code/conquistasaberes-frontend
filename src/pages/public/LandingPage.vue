<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-amber-400 selection:text-slate-900">
    <!-- ========================================================= -->
    <!-- NAVBAR SUPERIOR FIXA / INSTITUCIONAL -->
    <!-- ========================================================= -->
    <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <!-- Logo e Brasão -->
        <router-link to="/landing" class="flex items-center gap-3 group">
          <img
            src="~assets/images/brasao-pmvc-2025.png"
            alt="Brasão de Vitória da Conquista"
            class="h-11 sm:h-12 w-auto drop-shadow-sm group-hover:scale-105 transition-transform"
          />
          <div class="flex flex-col">
            <span class="text-xl sm:text-2xl font-extrabold text-[#0F4C81] leading-none tracking-tight">
              AVA <span class="text-[#F2B705]">UniVC</span>
            </span>
            <span class="text-[10px] sm:text-[11px] font-bold text-slate-500 tracking-wider uppercase mt-0.5">
              Universidade do Servidor
            </span>
          </div>
        </router-link>

        <!-- Links de Navegação (Desktop) -->
        <nav class="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold text-slate-600">
          <a href="#sobre" class="hover:text-[#0F4C81] transition-colors">Sobre</a>
          <a href="#funcionalidades" class="hover:text-[#0F4C81] transition-colors">Pilares</a>
          <a href="#trilhas" class="hover:text-[#0F4C81] transition-colors">Trilhas</a>
          <a href="#norminha" class="hover:text-[#0F4C81] transition-colors flex items-center gap-1.5 text-[#0F4C81]">
            <q-icon name="auto_awesome" size="14px" class="text-amber-500" />
            Norminha IA
          </a>
          <a href="#transparencia" class="hover:text-[#0F4C81] transition-colors">Transparência</a>
        </nav>

        <!-- Botões de Ação do Header -->
        <div class="flex items-center gap-2 sm:gap-3">
          <router-link
            to="/validar-certificado"
            class="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 hover:text-[#0F4C81] hover:bg-slate-100 rounded-xl transition-all"
          >
            <q-icon name="verified" size="16px" class="text-emerald-600" />
            <span>Validar Certificado</span>
          </router-link>

          <router-link
            to="/login"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F4C81] hover:bg-[#0C3B66] text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <span>Entrar no AVA</span>
            <q-icon name="arrow_forward" size="16px" />
          </router-link>
        </div>
      </div>
    </header>

    <!-- ========================================================= -->
    <!-- HERO SECTION (PRIMEIRA DOBRA) -->
    <!-- ========================================================= -->
    <section class="relative bg-gradient-to-b from-[#0F4C81] via-[#0D416E] to-[#0A2F50] text-white py-16 sm:py-24 overflow-hidden">
      <!-- Elementos Decorativos de Fundo -->
      <div class="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none"></div>
      <div class="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <!-- Textos do Hero -->
          <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#F2B705] text-xs sm:text-sm font-bold shadow-sm">
              <q-icon name="school" size="16px" />
              <span>Plataforma Oficial de Capacitação Municipal • PMVC</span>
            </div>

            <h1 class="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-none text-white">
              Transformando o Conhecimento em <span class="text-[#F2B705]">Excelência</span> no Serviço Público.
            </h1>

            <p class="text-sm sm:text-base lg:text-lg text-blue-100 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              A Universidade do Servidor de Vitória da Conquista unifica cursos, trilhas formativas, emissão de certificados autenticados e inteligência artificial para o desenvolvimento contínuo dos servidores municipais.
            </p>

            <div class="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <router-link
                to="/login"
                class="w-full sm:w-auto px-8 py-4 bg-[#F2B705] hover:bg-amber-400 text-[#0F4C81] font-extrabold text-sm sm:text-base rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Acessar a Plataforma</span>
                <q-icon name="arrow_forward" size="18px" />
              </router-link>

              <router-link
                to="/validar-certificado"
                class="w-full sm:w-auto px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-sm sm:text-base rounded-2xl backdrop-blur-sm transition-colors flex items-center justify-center gap-2"
              >
                <q-icon name="qr_code_scanner" size="18px" />
                <span>Validar Certificado</span>
              </router-link>
            </div>

            <!-- Métricas Rápidas no Hero -->
            <div class="pt-8 grid grid-cols-3 gap-3 sm:gap-6 border-t border-white/15 max-w-lg mx-auto lg:mx-0">
              <div class="bg-white/5 backdrop-blur-md rounded-2xl p-3 sm:p-4 text-center border border-white/10">
                <span class="text-2xl sm:text-3xl font-extrabold text-white block leading-none mb-1">{{ stats.cursosLabel }}</span>
                <span class="text-[11px] sm:text-xs text-blue-200 font-medium">Cursos Ativos</span>
              </div>
              <div class="bg-white/5 backdrop-blur-md rounded-2xl p-3 sm:p-4 text-center border border-white/10">
                <span class="text-2xl sm:text-3xl font-extrabold text-[#F2B705] block leading-none mb-1">{{ stats.trilhasLabel }}</span>
                <span class="text-[11px] sm:text-xs text-blue-200 font-medium">Trilhas de Carreira</span>
              </div>
              <div class="bg-white/5 backdrop-blur-md rounded-2xl p-3 sm:p-4 text-center border border-white/10">
                <span class="text-2xl sm:text-3xl font-extrabold text-emerald-400 block leading-none mb-1">100%</span>
                <span class="text-[11px] sm:text-xs text-blue-200 font-medium">Digital & Gratuito</span>
              </div>
            </div>
          </div>

          <!-- Card Ilustrativo Hero: Passaporte & Norminha Preview -->
          <div class="lg:col-span-5 flex justify-center">
            <div class="relative w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <!-- Header do Mockup -->
              <div class="flex items-center justify-between border-b border-white/15 pb-4">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-2xl bg-white text-[#0F4C81] flex items-center justify-center font-extrabold text-xl shadow-md border-2 border-[#F2B705]">
                    VC
                  </div>
                  <div>
                    <h2 class="font-extrabold text-white text-base leading-tight">Passaporte do Servidor</h2>
                    <span class="text-xs text-[#F2B705] font-semibold">Identidade Digital de Qualificação</span>
                  </div>
                </div>
                <span class="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
                  Ativo
                </span>
              </div>

              <!-- Indicadores do Mockup -->
              <div class="space-y-3">
                <div class="bg-white/10 p-3 rounded-2xl flex items-center justify-between text-xs">
                  <span class="text-blue-200 flex items-center gap-1.5 font-medium">
                    <q-icon name="military_tech" size="16px" class="text-[#F2B705]" />
                    Insígnias & Badges
                  </span>
                  <span class="font-extrabold text-white">4 Conquistadas</span>
                </div>

                <div class="bg-white/10 p-3 rounded-2xl flex items-center justify-between text-xs">
                  <span class="text-blue-200 flex items-center gap-1.5 font-medium">
                    <q-icon name="workspace_premium" size="16px" class="text-amber-400" />
                    Certificados Emitidos
                  </span>
                  <span class="font-extrabold text-white">100% Autenticados</span>
                </div>

                <div class="bg-white/10 p-3 rounded-2xl flex items-center justify-between text-xs">
                  <span class="text-blue-200 flex items-center gap-1.5 font-medium">
                    <q-icon name="smart_toy" size="16px" class="text-cyan-300" />
                    Tutoria com Norminha IA
                  </span>
                  <span class="font-extrabold text-cyan-300">Disponível 24/7</span>
                </div>
              </div>

              <div class="pt-2">
                <router-link
                  to="/login"
                  class="w-full py-3 bg-white hover:bg-slate-100 text-[#0F4C81] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow"
                >
                  <q-icon name="login" size="16px" />
                  <span>Acessar Meu Passaporte Digital</span>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========================================================= -->
    <!-- SEÇÃO: PILARES & FUNCIONALIDADES -->
    <!-- ========================================================= -->
    <section id="funcionalidades" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span class="text-xs font-extrabold uppercase tracking-widest text-[#0F4C81] bg-blue-50 px-3 py-1 rounded-full">
            Inovação em Gestão de Pessoas
          </span>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pilares da Educação Corporativa Municipal
          </h2>
          <p class="text-sm sm:text-base text-slate-500">
            Projetado sob medida para responder a todas as necessidades de capacitação, engajamento e valorização dos servidores de Vitória da Conquista.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Pilar 1: Trilhas de Aprendizagem -->
          <div class="p-6 rounded-3xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#0F4C81]/30 hover:shadow-xl transition-all space-y-4 group">
            <div class="w-12 h-12 rounded-2xl bg-blue-100 text-[#0F4C81] flex items-center justify-center group-hover:scale-110 transition-transform">
              <q-icon name="alt_route" size="26px" />
            </div>
            <h3 class="text-lg font-extrabold text-slate-900">Trilhas por Carreira</h3>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Jornadas formativas organizadas por carreiras e secretarias (Saúde, Educação, Finanças, Serviços Públicos).
            </p>
          </div>

          <!-- Pilar 2: Gamificação & XP -->
          <div class="p-6 rounded-3xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#0F4C81]/30 hover:shadow-xl transition-all space-y-4 group">
            <div class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <q-icon name="emoji_events" size="26px" />
            </div>
            <h3 class="text-lg font-extrabold text-slate-900">Gamificação & Passaporte</h3>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Ganho de pontos de XP, subida de níveis, conquista de badges e ranking intersecretarial que estimulam o engajamento.
            </p>
          </div>

          <!-- Pilar 3: Norminha IA -->
          <div class="p-6 rounded-3xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#0F4C81]/30 hover:shadow-xl transition-all space-y-4 group">
            <div class="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <q-icon name="smart_toy" size="26px" />
            </div>
            <h3 class="text-lg font-extrabold text-slate-900">Embaixadora Norminha IA</h3>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Assistente virtual treinada nas legislações e procedimentos da PMVC para orientar estudos e tirar dúvidas em tempo real.
            </p>
          </div>

          <!-- Pilar 4: Certificados Autenticados -->
          <div class="p-6 rounded-3xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#0F4C81]/30 hover:shadow-xl transition-all space-y-4 group">
            <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <q-icon name="workspace_premium" size="26px" />
            </div>
            <h3 class="text-lg font-extrabold text-slate-900">Certificação com QR Code</h3>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Emissão automática de certificados em PDF com hash único de validação e verificação de autenticidade pública.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ========================================================= -->
    <!-- SEÇÃO: TRILHAS EM DESTAQUE -->
    <!-- ========================================================= -->
    <section id="trilhas" class="py-20 bg-slate-100 border-y border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span class="text-xs font-extrabold uppercase tracking-widest text-[#0F4C81]">Catálogo de Formação</span>
            <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">Trilhas de Aprendizagem em Alta</h2>
            <p class="text-sm text-slate-500 mt-1">Capacitações desenhadas para as demandas reais da administração municipal.</p>
          </div>
          <router-link
            to="/login"
            class="inline-flex items-center gap-2 text-sm font-bold text-[#0F4C81] hover:text-[#0C3B66]"
          >
            <span>Ver todas as trilhas</span>
            <q-icon name="arrow_forward" size="16px" />
          </router-link>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Card Trilha 1 -->
          <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
            <div class="space-y-3">
              <div class="w-10 h-10 rounded-xl bg-blue-50 text-[#0F4C81] flex items-center justify-center">
                <q-icon name="hub" size="22px" />
              </div>
              <span class="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Governo Digital</span>
              <h3 class="text-lg font-extrabold text-slate-900">Inovação e Transformação Digital na PMVC</h3>
              <p class="text-xs text-slate-500 leading-relaxed">
                Fundamentos de serviços digitais, modernização de processos e atendimento ágil ao munícipe.
              </p>
            </div>
            <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span class="text-xs font-bold text-slate-400">Carga: 40h</span>
              <router-link to="/login" class="text-xs font-extrabold text-[#0F4C81] hover:underline">
                Acessar Trilha →
              </router-link>
            </div>
          </div>

          <!-- Card Trilha 2 -->
          <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
            <div class="space-y-3">
              <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <q-icon name="security" size="22px" />
              </div>
              <span class="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Segurança & Conformidade</span>
              <h3 class="text-lg font-extrabold text-slate-900">LGPD Aplicada ao Setor Público Municipal</h3>
              <p class="text-xs text-slate-500 leading-relaxed">
                Boas práticas de proteção de dados dos cidadãos, termos de consentimento e segurança da informação.
              </p>
            </div>
            <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span class="text-xs font-bold text-slate-400">Carga: 30h</span>
              <router-link to="/login" class="text-xs font-extrabold text-[#0F4C81] hover:underline">
                Acessar Trilha →
              </router-link>
            </div>
          </div>

          <!-- Card Trilha 3 -->
          <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
            <div class="space-y-3">
              <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <q-icon name="sentiment_very_satisfied" size="22px" />
              </div>
              <span class="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Atendimento Humanizado</span>
              <h3 class="text-lg font-extrabold text-slate-900">Excelência no Atendimento ao Cidadão Conquistense</h3>
              <p class="text-xs text-slate-500 leading-relaxed">
                Técnicas de comunicação não-violenta, acolhimento humanizado e escuta ativa nos órgãos da prefeitura.
              </p>
            </div>
            <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span class="text-xs font-bold text-slate-400">Carga: 25h</span>
              <router-link to="/login" class="text-xs font-extrabold text-[#0F4C81] hover:underline">
                Acessar Trilha →
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========================================================= -->
    <!-- SEÇÃO: NORMINHA IA (DESTAQUE ESPECIAL) -->
    <!-- ========================================================= -->
    <section id="norminha" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-gradient-to-br from-blue-50 via-indigo-50/50 to-slate-50 rounded-3xl border border-blue-200 p-8 sm:p-12 flex flex-col lg:flex-row items-center gap-10">
          <div class="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden shadow-xl shrink-0 border-4 border-white bg-white">
            <img
              src="~assets/images/norminha_avatar.jpg"
              alt="Norminha - Embaixadora IA"
              class="w-full h-full object-cover object-top"
            />
          </div>

          <div class="flex-1 space-y-4 text-center lg:text-left">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F4C81] text-white text-xs font-bold shadow-sm">
              <q-icon name="auto_awesome" size="14px" />
              <span>Inteligência Artificial Municipal</span>
            </div>

            <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Conheça a Norminha: Sua Tutora e Guia de Aprendizagem
            </h2>

            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Inspirada no espírito de acolhimento e compromisso com o cidadão, a Norminha é a inteligência artificial desenvolvida para auxiliar você durante as aulas, tirar dúvidas conceituais, recomendar trilhas ideais para o seu cargo e acompanhar sua progressão funcional.
            </p>

            <div class="pt-2">
              <router-link
                to="/login"
                class="inline-flex items-center gap-2 px-6 py-3 bg-[#0F4C81] hover:bg-[#0C3B66] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md"
              >
                <span>Conversar com a Norminha no AVA</span>
                <q-icon name="chat" size="16px" />
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========================================================= -->
    <!-- SEÇÃO: TRANSPARÊNCIA, OUVIDORIA E CIDADANIA (LINKS OBRIGATÓRIOS) -->
    <!-- ========================================================= -->
    <section id="transparencia" class="py-20 bg-slate-900 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
            <q-icon name="gavel" size="14px" />
            <span>Governança Pública & Cidadania</span>
          </div>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Transparência, Controle Social e Ouvidoria
          </h2>
          <p class="text-sm text-slate-400">
            A Prefeitura de Vitória da Conquista preza pelo acesso à informação, integridade e diálogo permanente com a sociedade.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <!-- Card 1: Fala.BR PMVC (Ouvidoria e Acesso à Informação) -->
          <a
            href="https://falabr.cgu.gov.br/v2/?uf=BA&municipio=Vit%C3%B3ria+da+Conquista"
            target="_blank"
            rel="noopener noreferrer"
            class="p-8 rounded-3xl bg-slate-800/80 border border-slate-700 hover:border-emerald-500/60 hover:bg-slate-800 transition-all flex flex-col justify-between space-y-6 group"
          >
            <div class="space-y-3">
              <div class="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <q-icon name="record_voice_over" size="26px" />
              </div>
              <h3 class="text-xl font-extrabold text-white group-hover:text-emerald-400 transition-colors">
                Fala.BR • Ouvidoria e e-SIC PMVC
              </h3>
              <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Plataforma Integrada de Ouvidoria e Acesso à Informação da Controladoria-Geral da União (CGU) para o município de Vitória da Conquista. Registre manifestações, elogios e pedidos de informação.
              </p>
            </div>

            <div class="flex items-center gap-2 text-xs font-extrabold text-emerald-400 group-hover:underline">
              <span>Acessar Fala.BR Vitória da Conquista</span>
              <q-icon name="open_in_new" size="16px" />
            </div>
          </a>

          <!-- Card 2: Portal da Transparência PMVC -->
          <a
            href="https://vitoriadaconquista-ba.portaltp.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            class="p-8 rounded-3xl bg-slate-800/80 border border-slate-700 hover:border-[#F2B705]/60 hover:bg-slate-800 transition-all flex flex-col justify-between space-y-6 group"
          >
            <div class="space-y-3">
              <div class="w-12 h-12 rounded-2xl bg-amber-500/20 text-[#F2B705] flex items-center justify-center group-hover:scale-110 transition-transform">
                <q-icon name="account_balance" size="26px" />
              </div>
              <h3 class="text-xl font-extrabold text-white group-hover:text-[#F2B705] transition-colors">
                Portal da Transparência Municipal
              </h3>
              <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Acompanhe em tempo real as receitas, despesas públicas, licitações, contratos e relatórios de gestão fiscal da Prefeitura Municipal de Vitória da Conquista.
              </p>
            </div>

            <div class="flex items-center gap-2 text-xs font-extrabold text-[#F2B705] group-hover:underline">
              <span>Acessar Portal da Transparência</span>
              <q-icon name="open_in_new" size="16px" />
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- ========================================================= -->
    <!-- FOOTER INSTITUCIONAL -->
    <!-- ========================================================= -->
    <footer class="bg-slate-950 text-slate-400 py-12 border-t border-slate-800 text-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Coluna 1: Brasão e Descrição -->
          <div class="md:col-span-2 space-y-3">
            <div class="flex items-center gap-3">
              <img
                src="~assets/images/brasao-pmvc-2025.png"
                alt="Brasão PMVC"
                class="h-10 w-auto"
              />
              <div>
                <span class="font-extrabold text-white text-base">Prefeitura Municipal de Vitória da Conquista</span>
                <span class="block text-slate-500 text-[11px]">AVA UniVC • Universidade do Servidor</span>
              </div>
            </div>
            <p class="text-slate-400 max-w-md leading-relaxed">
              Plataforma desenvolvida para o fortalecimento da gestão pública, capacitação continuada e valorização do servidor municipal através de soluções digitais eficientes.
            </p>
          </div>

          <!-- Coluna 2: Acesso e Serviços -->
          <div class="space-y-2">
            <h4 class="font-bold text-white text-xs uppercase tracking-wider">Acesso e Cursos</h4>
            <ul class="space-y-1.5 text-slate-400">
              <li><router-link to="/login" class="hover:text-white transition-colors">Entrar no Sistema (SSO)</router-link></li>
              <li><router-link to="/validar-certificado" class="hover:text-white transition-colors">Validar Certificados</router-link></li>
              <li><a href="#trilhas" class="hover:text-white transition-colors">Trilhas de Aprendizagem</a></li>
              <li><a href="#norminha" class="hover:text-white transition-colors">Norminha Assistente IA</a></li>
            </ul>
          </div>

          <!-- Coluna 3: Transparência e Suporte -->
          <div class="space-y-2">
            <h4 class="font-bold text-white text-xs uppercase tracking-wider">Transparência & Apoio</h4>
            <ul class="space-y-1.5 text-slate-400">
              <li>
                <a href="https://falabr.cgu.gov.br/v2/?uf=BA&municipio=Vit%C3%B3ria+da+Conquista" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors flex items-center gap-1">
                  Fala.BR Ouvidoria
                  <q-icon name="open_in_new" size="12px" />
                </a>
              </li>
              <li>
                <a href="https://vitoriadaconquista-ba.portaltp.com.br/" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors flex items-center gap-1">
                  Portal da Transparência
                  <q-icon name="open_in_new" size="12px" />
                </a>
              </li>
              <li><span>Coordenação de TI (CETI)</span></li>
              <li><span>Secretaria de Gestão e Inovação (SETP)</span></li>
            </ul>
          </div>
        </div>

        <div class="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© {{ new Date().getFullYear() }} Prefeitura Municipal de Vitória da Conquista - BA. Todos os direitos reservados.</p>
          <p>Conformidade WCAG 2.1 e Lei Geral de Proteção de Dados (LGPD nº 13.709/2018).</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { api } from 'src/boot/axios';

const stats = ref({
  cursosLabel: '+50',
  trilhasLabel: '12',
});

onMounted(async () => {
  try {
    const res = await api.get('/auth/public-stats');
    if (res.data) {
      stats.value.cursosLabel = res.data.cursosLabel || '+50';
      stats.value.trilhasLabel = res.data.trilhasLabel || '12';
    }
  } catch (e) {
    // Fallbacks padrão
  }
});
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}
</style>
