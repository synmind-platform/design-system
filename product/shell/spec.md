# Application Shell Specification

## Overview
O shell do SynMind Design System é uma interface administrativa para visualização e documentação dos componentes do sistema. Utiliza navegação lateral (sidebar) para acesso às diferentes seções do design system.

## Navigation Structure
- **Foundation** → Design tokens, cores, tipografia, espaçamento
- **Components** → Componentes core do sistema
- **Brand Assets** → Logos, badges, elementos de marca
- **B2B Components** → Componentes específicos para SynMind (corporativo)
- **B2C Components** → Componentes específicos para I_DEAL (consumidor)
- **Documentation** → Guias de uso e exemplos

## User Menu
- **Localização:** Canto superior direito
- **Conteúdo:** Toggle de tema (light/dark), link para documentação externa

## Layout Pattern
**Sidebar Navigation (Desktop):**
- Sidebar fixa à esquerda com 280px de largura
- Logo SynMind no topo da sidebar
- Navegação principal com ícones e labels
- Toggle de tema no rodapé da sidebar
- Área de conteúdo principal à direita

## Responsive Behavior
- **Desktop (>1024px):** Sidebar visível, conteúdo expandido
- **Tablet (768-1024px):** Sidebar colapsível, ícones apenas
- **Mobile (<768px):** Hamburger menu, sidebar como overlay

## Design Notes
- Utilizar as cores da marca SynMind (azul para navegação ativa, laranja para destaques)
- Manter estética profissional mas acolhedora (warm stone palette)
- Suportar light/dark mode com transições suaves
- Incluir breadcrumbs para navegação em seções aninhadas
