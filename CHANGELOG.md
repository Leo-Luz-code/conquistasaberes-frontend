# AVA UniVC - Frontend Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> Given a version number `MAJOR.MINOR.PATCH`, increment the:
> 1. MAJOR version when you make incompatible API changes,
> 2. MINOR version when you add functionality in a backwards-compatible manner, and
> 3. PATCH version when you make backwards-compatible bug fixes.
>
> Additional labels for pre-release and build metadata are available as extensions to the `MAJOR.MINOR.PATCH` format.

## Changelog entry snippet

``` markdown
## [X.Y.Z] - yyyy-mm-dd

### Added
### Fixed
### Changed
### Removed
```

## Version summary

| Tag                      | Release date |
|--------------------------|--------------|
| [1.0.0](#100-2026-08-14) | 2026-08-14   |


## [1.0.0] - 2026-08-14

### Added
- **Passaporte Digital do Servidor (`PerfilServidor.vue`):**
  - Nova credencial oficial com identidade visual institucional da PMVC e brasão do município.
  - Integração consolidada da jornada formativa: Nível, XP acumulado, posição no ranking geral e progresso para o próximo nível.
  - Grade visual de insígnias e badges de honra (com suporte a ícones e capas de imagem).
  - Galeria de certificados emitidos com hash de autenticidade, carga horária e botões de download de PDF e validação pública.
  - Geração dinâmica de QR Code de Autenticidade Digital para validação do passaporte.
  - Funcionalidade de impressão (`window.print()`) e cópia rápida de ID digital do servidor.
  - Aliases de rota adicionados em `routes.js`: `/servidor/passaporte` e `/passaporte`.
- **Boot Plugin ApexCharts (`src/boot/apexcharts.js`):**
  - Registro global do componente `VueApexCharts` no Quasar Framework para renderização estável dos gráficos.

### Changed
- **Dashboard do Servidor (`DashboardServidor.vue`):**
  - Integração 100% dinâmica com dados reais das Pinia Stores (`courseStore`, `gamificationStore`, `certificateStore`, `authStore`).
  - KPIs reais de *Cursos Disponíveis*, *Cursos em Andamento*, *Cursos Concluídos* e *Certificados Emitidos*.
  - Botão inteligente *"Continuar curso atual"* que direciona diretamente para a última capacitação em andamento do servidor.
  - Progresso Geral da Jornada conectado aos cursos e trilhas matriculados no banco.
  - Atalhos Rápidos com rotas e botões 100% funcionais para *Minhas Trilhas* (`/servidor/trilhas`), *Meus Cursos* (`/servidor/cursos`), *Biblioteca* (`/servidor/biblioteca`), *Fórum* (`/servidor/forum`), *Eventos e Palestras* (`/servidor/eventos`), *Certificados* (`/servidor/certificados`), *Passaporte Digital* (`/perfil`) e *Norminha IA* (`/servidor/norminha`).
- **Dashboard do Gestor (`DashboardGestor.vue`):**
  - Correção da escala do gráfico de conclusão por curso (`yaxis.min: 0, max: 100`), iniciando estritamente em 0% sem valores negativos.
  - Atualização dos rótulos do card de *Trilhas de Aprendizagem* explicitando a taxa de adesão de servidores por trilha.
- **Navegação Global (`MainLayout.vue`):**
  - Atualização dos menus lateral e do avatar de "Meu Perfil" para **"Passaporte Digital"** com ícone de credencial (`badge`).
- **Gestão de Trilhas (`AdminTrilhasList.vue`):**
  - Ajuste na tabela mantendo botão dedicado de visualização de inscritos via modal.
