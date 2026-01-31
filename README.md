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

- `ScoreGauge` - Barra de score 0-100 com faixas descritivas
- `RadarChart` - Gráfico radar para perfis multidimensionais
- `QuadrantChart` - Quadrante CVF (Clã/Adhocracia/Mercado/Hierarquia)
- `ProfileCard` - Card de perfil psicométrico completo
- `AssessmentProgress` - Progresso em bateria de avaliações
- `FitIndicator` - Indicador de aderência/fit cultural
- `DimensionComparison` - Comparação lado a lado de dimensões

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

## Tecnologias

- React 18 + TypeScript
- Tailwind CSS v4
- Radix UI Primitives
- Vite
- Design OS Methodology

## Licença

MIT

---

Construído com [Design OS](https://buildermethods.com/design-os) para SynMind
