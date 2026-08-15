# AVA UniVC - Frontend Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> Given a version number `MAJOR.MINOR.PATCH`, increment the:
>
> 1. MAJOR version when you make incompatible API changes,
> 2. MINOR version when you add functionality in a backwards-compatible manner, and
> 3. PATCH version when you make backwards-compatible bug fixes.
>
> Additional labels for pre-release and build metadata are available as extensions to the `MAJOR.MINOR.PATCH` format.

## Changelog entry snippet

```markdown
## [X.Y.Z] - yyyy-mm-dd

### Added

### Fixed

### Changed

### Removed
```

## Version summary

| Tag                      | Release date |
| ------------------------ | ------------ |
| [1.0.3](#103-2026-08-15) | 2026-08-15   |
| [1.0.2](#102-2026-08-15) | 2026-08-15   |
| [1.0.1](#101-2026-08-14) | 2026-08-14   |
| [1.0.0](#100-2026-08-14) | 2026-08-14   |

## [1.0.3] - 2026-08-15

### Fixed

- **Validador de Certificados (`ValidarCertificado.vue` & `certificateStore.js`):**
  - Correção na checagem da resposta de validação e mapeamento completo dos dados funcionais do servidor, curso, carga horária e hash.

### Added

- **Gestão de Certificados Admin (`AdminGestaoCertificados.vue`):**
  - Adicionado botão de "Validar Certificado" na barra superior e ação de validação pública direta nas linhas da tabela.

## [1.0.2] - 2026-08-15

### Added

- **Landing Page Institucional (`LandingPage.vue`):**
  - Criação de portal público oficial acessível em `/landing`, `/inicio` e `/portal`.
  - Hero institucional com estatísticas de cursos e trilhas, apresentação da Norminha IA e botão de login.
  - Seção dedicada de governança pública e transparência com links oficiais para o **Fala.BR PMVC (CGU)** e **Portal da Transparência de Vitória da Conquista**.

## [1.0.1] - 2026-08-14

### Changed

- **Redesign da Tela de Login (`Login.vue`):**
  - Implementado layout split-screen moderno baseado no padrão visual oficial (`tela.png`).
  - Integração dos cards de métricas (+50 Cursos, 12 Trilhas, 100% Digital) com o endpoint anônimo e seguro `/auth/public-stats`.
  - Formulário à direita com suporte a login institucional, recuperação de acesso e conformidade LGPD.

## [1.0.0] - 2026-08-14

### Added

- **Passaporte Digital do Servidor (`PerfilServidor.vue`):**
  - Nova credencial oficial com identidade visual PMVC, jornada de gamificação, galeria de badges, certificados e QR Code de validação.
  - Aliases de rota adicionados: `/servidor/passaporte` e `/passaporte`.
- **Boot Plugin ApexCharts (`src/boot/apexcharts.js`):**
  - Registro global do componente `VueApexCharts` no Quasar Framework.

### Changed

- **Dashboard do Servidor (`DashboardServidor.vue`):**
  - Integração com dados reais de cursos, progresso da jornada e rotas corrigidas.
- **Dashboard do Gestor (`DashboardGestor.vue`):**
  - Escala do gráfico de conclusão ajustada para iniciar em 0%.
- **Navegação Global (`MainLayout.vue`):**
  - Atualização dos links e menus de perfil para "Passaporte Digital".
