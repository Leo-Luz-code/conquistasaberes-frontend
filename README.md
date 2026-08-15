<div align="center">

# 💻 AVA UniVC — Front-end SPA
### *Portal do Aluno e Painel de Gestão da Universidade do Servidor Público (PMVC)*

[![Vue.js 3](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Quasar Framework](https://img.shields.io/badge/Quasar-v2-1976D2?style=for-the-badge&logo=quasar&logoColor=white)](https://quasar.dev/)
[![Pinia](https://img.shields.io/badge/Pinia-Store-FFE564?style=for-the-badge&logo=vuedotjs&logoColor=black)](https://pinia.vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![ApexCharts](https://img.shields.io/badge/ApexCharts-Analytics-008FFB?style=for-the-badge&logo=chartdotjs&logoColor=white)](https://apexcharts.com/)
[![WCAG 2.1](https://img.shields.io/badge/Acessibilidade-WCAG_2.1_AA-059669?style=for-the-badge&logo=w3c&logoColor=white)](#)

</div>

---

## 📌 Sobre o Projeto

O **AVA UniVC (Front-end)** é a Single Page Application (SPA) oficial da Prefeitura Municipal de Vitória da Conquista voltada à capacitação contínua, gestão de trilhas formativas e valorização funcional dos servidores públicos municipais.

Desenvolvido com **Vue 3 (Composition API & `<script setup>`)** e componentes de alta performance do **Quasar Framework**, o sistema conta com design institucional moderno, responsividade multiplataforma e recursos avançados de acessibilidade.

---

## 🌟 Principais Telas & Funcionalidades

- 🏛️ **Landing Page Institucional:** Portal público oficial com apresentação dos eixos de capacitação, estatísticas em tempo real, apresentação da Norminha IA e links para o Portal da Transparência e Fala.BR (CGU).
- 🔑 **Login Institucional & SSO:** Interface split-screen moderna com acesso por CPF/Matrícula e aceite obrigatório das diretrizes de privacidade (LGPD).
- 🎖️ **Passaporte Digital do Servidor:** Credencial unificada do servidor com saldo de XP, nível atual, galeria de badges conquistadas, carteira de certificados e QR Code de autenticação.
- 🎓 **Player Interativo de Cursos:** Ambiente de estudos imersivo com leitor de PDFs, player de vídeo, materiais complementares, quizzes avaliativos e fórum de dúvidas lateral.
- 🔍 **Portal Público de Validação de Certificados:** Consulta instantânea da autenticidade de qualquer certificado emitido pela PMVC através do código hash ou QR Code.
- 📈 **Dashboard Executivo do Gestor / RH:** Painel analítico com gráficos ApexCharts (conclusão por curso, adesão por trilha, engajamento mensal e ranking geral).
- ⚙️ **Área Administrativa:** Gestão completa de cursos, módulos, aulas, secretarias, eventos e emissão/revogação de certificados.

---

## 🎨 Identidade Visual Institucional

A paleta de cores foi desenvolvida com base no padrão oficial da **Prefeitura Municipal de Vitória da Conquista**:

| Elemento | Código HEX | Amostra |
|---|---|---|
| **Azul Institucional PMVC** | `#0F4C81` | ![#0F4C81](https://via.placeholder.com/15/0F4C81/000000?text=+) |
| **Amarelo Destaque** | `#F2B705` | ![#F2B705](https://via.placeholder.com/15/F2B705/000000?text=+) |
| **Verde Sucesso / Conclusão** | `#10B981` | ![#10B981](https://via.placeholder.com/15/10B981/000000?text=+) |
| **Fundo & Superfícies** | `#F8FAFC` | ![#F8FAFC](https://via.placeholder.com/15/F8FAFC/000000?text=+) |

---

## ⚡ Como Executar o Projeto

### Pré-requisitos
- **Node.js:** Versão 18 ou superior
- **Quasar CLI** instalado globalmente ou executado via `npx`

### 1. Clonar e Instalar Dependências
```bash
cd conquistasaberes-frontend
npm install
```

### 2. Configurar Variáveis de Ambiente (Opcional)
Crie o arquivo `.env` caso deseje sobrescrever a URL padrão da API (`http://localhost:3001/`):
```env
API_BASE_URL="http://localhost:3001/"
```

### 3. Iniciar Servidor de Desenvolvimento
```bash
npx quasar dev
```
O frontend estará acessível no navegador em: `http://localhost:8080` (ou porta dinâmica configurada).

### 4. Gerar Build de Produção
```bash
npx quasar build
```
Os arquivos otimizados para produção serão gerados no diretório `/dist/spa`.

---

## ♿ Acessibilidade & Inclusão (WCAG 2.1)

- Suporte completo a navegação por teclado (Tab, Shift+Tab, Enter e Espaço).
- Tags semânticas HTML5 e atributos ARIA em modais e formulários.
- Relação de contraste de cores testada e aprovada para leitura confortável.

---

## 🏛️ Prefeitura Municipal de Vitória da Conquista
**Central de Tecnologia da Informação (CETI)**  
*Secretaria Municipal de Transparência, Controle e Governança (SETP)*
