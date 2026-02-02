# SynMind Design System

Design System completo para o ecossistema SynMind, construído com Design OS.

## Ecossistema de Marca

O sistema suporta três marcas distintas:

| Marca | Foco | Público | Cor Principal |
|-------|------|---------|---------------|
| **SynMind** | Inteligência de Negócios | B2B | Azul #5B7B93 |
| **I_DEAL** | Autoconhecimento | B2C | Laranja #D98D38 |
| **MindScan®** | Base Científica | Técnico | Azul + Laranja |

## Quick Start

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Ver showcase
# Acesse http://localhost:3000/showcase
```

## Componentes Disponíveis

### Componentes de Marca
- `SynMindLogo` - Logo em variantes full/symbol, cores default/white
- `MindScanBadge` - Selo "Powered by MindScan®"
- `BrandDot` / `BrandDotsGroup` - Elementos decorativos da marca

### Componentes Base (UI)
- `Button`, `Badge`, `Card`, `Input`, `Label`
- `Alert`, `Dialog`, `Sheet`, `Tabs`
- `DropdownMenu`, `Table`, `Separator`, `Skeleton`
- `Avatar`, `Collapsible`

### Componentes SynMind
- `FeatureCard` - Card de funcionalidades
- `StatCard` - Card de estatísticas B2B/B2C
- `TestimonialCard` - Depoimentos com rating
- `ProductCard` - Cards de produtos/serviços
- `Navbar` / `Footer` - Navegação e rodapé

### Componentes de Dashboard B2B
- `KPICard` - KPIs com sparklines e targets
- `MetricComparison` - Comparação antes/depois
- `ProgressRing` - Indicador circular de progresso
- `ActivityFeed` - Feed de atividades/timeline
- `DataTable` - Tabela avançada com ordenação e busca
- `DashboardCard` - Container para widgets

### Componentes de Avaliação Psicométrica
Inspirados nos instrumentos SynMind (SM_BIG5_20, SM_TEI_20, SM_CVF_24, SM_ESQ_36, SM_SYM4_24):

**Visualização de Resultados:**
- `RadarChart` - Gráfico radar responsivo (BIG5, TEI) - agora com `size="responsive"`
- `CVFQuadrantChart` - Quadrante CVF com comparação percebido/desejado
- `ProfileChart` - Perfil SYM4/DISC (variantes bar/diamond, Graph I/II)
- `ScoreBar` - Barra de progresso com estados vazios (`value={null}`)
- `ScoreCard` - Card de score com hierarquia visual clara
- `QualityBadge` - Indicador de qualidade do questionário
- `InstrumentResultCard` - Card completo de resultado
- `AssessmentProgress` - Progresso em bateria (variante `auto` responsiva)
- `EmptyState` - Componente reutilizável para estados vazios

**Coleta de Respostas:**
- `LikertScale` - Escala Likert (variantes: buttons, slider, radio, touch, **auto**)
- `TouchSlider` - Slider otimizado para touch (thumbSize mínimo 44px)
- `ForcedChoice` - Tétrade SYM4 (variantes: combined/separate)
- `AllocationSlider` - Alocação de 100 pontos (CVF) com validação visual

## Estrutura do Projeto

```
synmind-design-system/
├── product/                    # Definições do Design System
│   ├── design-system/          # Tokens de design
│   │   ├── colors.json         # Paleta de cores (10 shades cada)
│   │   ├── typography.json     # Fontes e escalas
│   │   └── spacing.json        # Espaçamentos
│   └── product-overview.md     # Visão geral do produto
├── src/
│   ├── components/
│   │   ├── brand/              # Componentes de marca
│   │   │   ├── SynMindLogo.tsx
│   │   │   ├── MindScanBadge.tsx
│   │   │   └── BrandDot.tsx
│   │   ├── ui/                 # Componentes UI (40+)
│   │   └── Showcase.tsx        # Página de demonstração
│   └── index.css               # Design tokens CSS
├── public/
│   └── brand/                  # Assets de marca (PNGs)
│       ├── synmind-logo-*.png
│       └── synmind-symbol-*.png
└── docs/
    ├── brand-guidelines.md
    └── synmind-marketing-analysis.md
```

## Cores da Marca

### SynMind Blue
Representa confiança, profissionalismo e credibilidade.

```css
--color-synmind-blue-500: #5B7B93; /* Cor principal */
```

### SynMind Orange
Representa energia, ação, transformação e calor humano.

```css
--color-synmind-orange-500: #D98D38; /* Cor principal */
```

### Faixas de Score (Avaliações)

| Faixa | Pontos | Descrição |
|-------|--------|-----------|
| Muito Baixo | 0-25 | Traço minimamente expresso |
| Baixo | 26-50 | Abaixo do ponto médio |
| Alto | 51-75 | Acima do ponto médio |
| Muito Alto | 76-100 | Traço fortemente expresso |

## Exemplos de Uso

### Logo

```tsx
import { SynMindLogo } from "@/components/brand"

<SynMindLogo variant="full" size="md" />
<SynMindLogo variant="symbol" colorScheme="white" />
```

### KPI Card

```tsx
import { KPICard } from "@/components/ui"

<KPICard
  label="Receita Mensal"
  value="R$ 847.500"
  change={12.5}
  target="R$ 1.000.000"
  targetProgress={84.75}
  sparkline={[30, 45, 35, 50, 49, 60, 70, 91, 85]}
  variant="highlight"
/>
```

### Score Gauge (Avaliações)

```tsx
import { ScoreGauge } from "@/components/ui"

<ScoreGauge
  label="Extroversão"
  value={72}
  description="Energia social e iniciativa"
  showRanges
/>
```

### Radar Chart (Perfil)

```tsx
import { RadarChart } from "@/components/ui"

<RadarChart
  title="Perfil Big Five"
  data={[
    { label: "Extroversão", shortLabel: "E", value: 72 },
    { label: "Amabilidade", shortLabel: "A", value: 85 },
    { label: "Conscienciosidade", shortLabel: "C", value: 58 },
    { label: "Neuroticismo", shortLabel: "N", value: 32 },
    { label: "Abertura", shortLabel: "O", value: 91 },
  ]}
/>
```

### Fit Indicator

```tsx
import { FitIndicator } from "@/components/ui"

<FitIndicator
  title="Cultural Fit Score"
  fitScore={78}
  dimensions={[
    { name: "Colaboração", actual: 72, ideal: 80 },
    { name: "Inovação", actual: 85, ideal: 75 },
  ]}
/>
```

## Variantes B2B/B2C

Use classes utilitárias para alternar o contexto visual:

```html
<!-- Contexto B2B (SynMind - corporativo) -->
<div class="variant-b2b">
  <button class="bg-primary">Azul como primário</button>
</div>

<!-- Contexto B2C (I_DEAL - consumidor) -->
<div class="variant-b2c">
  <button class="bg-primary">Laranja como primário</button>
</div>
```

## Tipografia

- **Fonte Principal:** DM Sans (Google Fonts)
- **Fonte Mono:** IBM Plex Mono

## Testes

```bash
# Rodar todos os testes
npm run test

# Rodar em modo watch
npm run test:watch

# Cobertura de testes
npm run test:coverage
```

O projeto possui 775 testes automatizados cobrindo componentes UI e psicométricos, incluindo testes de acessibilidade (jest-axe).

## Acessibilidade (WCAG 2.1)

Todos os componentes seguem as diretrizes WCAG 2.1:

- **Tabelas**: Headers com `scope` e `aria-sort` para ordenação
- **Gráficos SVG**: `role="img"` com `<title>` e `<desc>` descritivos
- **KPIs**: `aria-label` em valores e indicadores de tendência
- **Navegação por teclado**: Suporte completo em componentes interativos

## Tecnologias

- React 18 + TypeScript
- Tailwind CSS v4
- Radix UI Primitives
- Vite
- Vitest + React Testing Library
- Design OS Methodology

## Changelog v0.2.0 (Breaking Changes)

### Novos Recursos
- **Gráficos Responsivos**: `size="responsive"` em RadarChart, ProfileChart, CVFQuadrantChart
- **Estados Vazios**: `score={null}` em ScoreCard/ScoreBar, `result={null}` em InstrumentResultCard
- **Variante Auto**: LikertScale com detecção automática de touch devices
- **AssessmentProgress Auto**: Responsivo automático (compact/vertical/horizontal)
- **Modo Readonly**: Props `readonly` em LikertScale, ForcedChoice, AllocationSlider
- **Comparação CVF**: Distinção visual clara percebido (sólido) vs desejado (tracejado)
- **ProfileChart Dual**: Graph I (natural) vs Graph II (adaptado) com legenda

### Breaking Changes
- `ScoreCard.score` agora aceita `number | null` (antes apenas `number`)
- `ScoreBar.value` agora aceita `number | null`
- `InstrumentResultCard.result` agora aceita `PsychometricResult | null`
- Props removidas: `ScoreGauge` renomeado para `ScoreBar`
- CVFQuadrantChart: prop `desired` renomeada para `values`

### Acessibilidade
- Touch targets mínimos de 44px em todos os componentes interativos
- SVGs com `role="img"`, `<title>`, e `<desc>` descritivos
- Navegação por teclado (Tab, Enter, Space, Arrow keys)
- Contraste WCAG AA (>= 4.5:1) verificado

## Licença

MIT

---

Construído com [Design OS](https://buildermethods.com/design-os) para SynMind
