# Changelog

Get notified of major releases by subscribing here:
https://buildermethods.com/design-os

## [0.3.0] - 2026-01-31

### Added - Documentação JSDoc
- **Button**: Documentação completa com exemplos de uso e props (variant, size, asChild)
- **Input**: JSDoc descrevendo suporte a validação e tipos de input
- **Alert**: Documentação do componente principal e sub-componentes (AlertTitle, AlertDescription)
- **Navbar**: Documentação completa com interface NavItem e todas as props documentadas

### Improved
- Criada interface `ButtonProps` explícita para melhor intellisense no IDE
- Documentação segue padrão estabelecido em DataTable e DashboardCard

---

## [0.2.0] - 2026-01-31

### Added
- **Testing Infrastructure**: Vitest + React Testing Library configurados
- 217 testes automatizados cobrindo componentes UI e psicométricos
- Testes de acessibilidade para verificar atributos ARIA

### Improved - Acessibilidade (WCAG 2.1)
- **DataTable**: Headers com `scope="col"`, `aria-sort` para ordenação, botões acessíveis por teclado
- **RadarChart**: SVG com `role="img"`, `<title>` e `<desc>` descrevendo dados
- **CVFQuadrantChart**: SVG acessível com descrição de cultura percebida/desejada
- **KPICard**: `aria-label` em valores, indicadores de tendência e sparklines
- **ProfileChart**: Ambas variantes (bar/diamond) com descrições acessíveis

### Fixed
- Erros de TypeScript em componentes psicométricos
- Build funcionando corretamente

## [0.1.2] - 2025-12-19

- Fixed errors related to importing google fonts out of order.
- Handled sections that use '&' in their name.

## [0.1.1] - 2025-12-18

- In the export package, consolidated '01-foundation' and '02-shell' into one.
- Updated README.md tips that come in the export.

## [0.1] - 2025-12-16

- Initial release
