# SynMind Psychometric Components

Biblioteca de componentes React para visualização e interação com os instrumentos psicométricos da plataforma SynMind.

## Instalação

Os componentes estão disponíveis no diretório `src/components/psychometric/`. Importe diretamente:

```tsx
import {
  ScoreBar,
  RadarChart,
  LikertScale,
  InstrumentResultCard,
  // ...
} from "@/components/psychometric";
```

---

## Componentes de Visualização

### ScoreBar

Barra de progresso para exibir scores de 0-100.

```tsx
import { ScoreBar } from "@/components/psychometric";

<ScoreBar
  value={75}
  label="Extroversão"
  classification="HIGH"
  showValue={true}
  size="md"
  variant="default"
/>
```

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `value` | `number` | - | Score de 0-100 (obrigatório) |
| `label` | `string` | - | Label exibido acima da barra |
| `classification` | `ClassificationLabel` | - | Classificação: VERY_LOW, LOW, HIGH, VERY_HIGH |
| `showValue` | `boolean` | `true` | Exibir valor numérico |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Altura da barra |
| `variant` | `"default" \| "gradient" \| "segmented"` | `"default"` | Estilo visual |

**Variantes:**
- `default` - Cor sólida baseada no valor/classificação
- `gradient` - Gradiente azul para laranja
- `segmented` - Barra dividida em 4 segmentos

---

### RadarChart

Gráfico radar para visualizar múltiplas dimensões (Big Five, TEI).

```tsx
import { RadarChart } from "@/components/psychometric";

<RadarChart
  scores={{
    extraversion: 62,
    agreeableness: 80,
    conscientiousness: 70,
    neuroticism: 38,
    openness: 75,
  }}
  dimensions={["extraversion", "agreeableness", "conscientiousness", "neuroticism", "openness"]}
  size={280}
  showLabels={true}
  showValues={true}
  variant="filled"
/>
```

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `scores` | `Record<string, number>` | - | Scores por dimensão (0-100) |
| `dimensions` | `string[]` | - | Lista de dimensões a exibir |
| `size` | `number` | `280` | Tamanho do gráfico em pixels |
| `showLabels` | `boolean` | `true` | Exibir labels das dimensões |
| `showValues` | `boolean` | `false` | Exibir valores junto aos labels |
| `variant` | `"filled" \| "line"` | `"filled"` | Polígono preenchido ou apenas linha |

---

### CVFQuadrantChart

Gráfico de 4 quadrantes para cultura organizacional (CVF/OCAI).

```tsx
import { CVFQuadrantChart } from "@/components/psychometric";

<CVFQuadrantChart
  perceived={{ clan: 30, adhocracy: 20, market: 35, hierarchy: 15 }}
  values={{ clan: 35, adhocracy: 30, market: 20, hierarchy: 15 }}
  size={300}
  showLabels={true}
  showLegend={true}
/>
```

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `perceived` | `CVFQuadrant` | - | Cultura percebida (obrigatório) |
| `values` | `CVFQuadrant` | - | Valores pessoais/desejados |
| `size` | `number` | `300` | Tamanho do gráfico |
| `showLabels` | `boolean` | `true` | Exibir nomes dos quadrantes |
| `showLegend` | `boolean` | `true` | Exibir legenda (se values fornecido) |

**CVFQuadrant:**
```ts
interface CVFQuadrant {
  clan: number;      // Colaborativa (top-left)
  adhocracy: number; // Inovadora (top-right)
  market: number;    // Competitiva (bottom-right)
  hierarchy: number; // Estruturada (bottom-left)
}
```

---

### ProfileChart

Gráfico de perfil comportamental (SYM4/DISC).

```tsx
import { ProfileChart } from "@/components/psychometric";

<ProfileChart
  graphI={{ assertive: 65, influential: 78, stable: 45, analytical: 52 }}
  graphII={{ assertive: 70, influential: 72, stable: 50, analytical: 58 }}
  size={300}
  variant="bar"
  showLabels={true}
  showLegend={true}
/>
```

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `graphI` | `SYM4Dimension` | - | Perfil natural (obrigatório) |
| `graphII` | `SYM4Dimension` | - | Perfil adaptado |
| `size` | `number` | `300` | Tamanho do gráfico |
| `variant` | `"bar" \| "diamond"` | `"bar"` | Estilo de visualização |
| `showLabels` | `boolean` | `true` | Exibir labels |
| `showLegend` | `boolean` | `true` | Exibir legenda |

**Variantes:**
- `bar` - Barras horizontais com marcadores
- `diamond` - Gráfico radar em formato diamante

---

### ScoreCard

Card individual para exibir score com classificação e tendência.

```tsx
import { ScoreCard } from "@/components/psychometric";

<ScoreCard
  dimension="extraversion"
  score={62}
  previousScore={55}
  classification="HIGH"
  description="Você tende a buscar interações sociais."
  variant="detailed"
/>
```

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `dimension` | `string` | - | ID da dimensão |
| `score` | `number` | - | Score atual (0-100) |
| `previousScore` | `number` | - | Score anterior (para tendência) |
| `classification` | `ClassificationLabel` | - | Classificação |
| `description` | `string` | - | Texto descritivo |
| `variant` | `"compact" \| "detailed"` | `"detailed"` | Estilo do card |

---

### QualityBadge

Indicador de qualidade do questionário.

```tsx
import { QualityBadge } from "@/components/psychometric";

<QualityBadge
  passed={true}
  flags={[
    { code: "TIME_OK", severity: "info", message: "Tempo adequado" }
  ]}
  showDetails={true}
  size="md"
/>
```

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `passed` | `boolean` | - | Se passou na validação |
| `flags` | `QualityFlag[]` | `[]` | Lista de flags de qualidade |
| `showDetails` | `boolean` | `false` | Exibir detalhes dos flags |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamanho do badge |

**QualityFlag:**
```ts
interface QualityFlag {
  code: string;
  severity: "info" | "warning" | "critical" | "invalid";
  message: string;
}
```

---

## Componentes de Questionário

### LikertScale

Escala Likert para questionários (Big Five, TEI, ESQ).

```tsx
import { LikertScale } from "@/components/psychometric";

<LikertScale
  questionId="q1"
  question="Eu me considero uma pessoa sociável."
  scale={5}
  value={4}
  onChange={(id, value) => console.log(id, value)}
  variant="buttons"
  labels={{
    low: "Discordo totalmente",
    high: "Concordo totalmente",
    mid: "Neutro"
  }}
/>
```

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `questionId` | `string` | - | ID único da questão |
| `question` | `string` | - | Texto da pergunta |
| `scale` | `number` | - | Número de pontos (5, 6, ou 7) |
| `value` | `number` | - | Valor selecionado |
| `onChange` | `(id, value) => void` | - | Callback de mudança |
| `disabled` | `boolean` | `false` | Desabilitar interação |
| `variant` | `"buttons" \| "slider" \| "radio" \| "touch"` | `"buttons"` | Estilo de input |
| `labels` | `{ low, high, mid? }` | Auto | Labels dos extremos |

**Variantes:**

| Variante | Descrição | Uso recomendado |
|----------|-----------|-----------------|
| `buttons` | Botões numerados clicáveis | Desktop, resposta rápida |
| `slider` | Slider nativo do browser | Alternativa simples |
| `radio` | Lista de opções com radio buttons | Acessibilidade, labels longos |
| `touch` | Slider otimizado para touch | **Mobile, tablets** |

A variante `touch` inclui:
- Thumb grande (56px) para fácil arraste
- Snap points visuais clicáveis
- Feedback visual durante arraste
- Suporte completo a touch events

---

### ForcedChoice

Escolha forçada MOST/LEAST para tetrades (SYM4).

```tsx
import { ForcedChoice } from "@/components/psychometric";

<ForcedChoice
  questionId="t1"
  instruction="Selecione a opção que MAIS e a que MENOS descreve você"
  options={[
    { id: "a", text: "Assertivo e direto" },
    { id: "b", text: "Entusiasmado e comunicativo" },
    { id: "c", text: "Paciente e bom ouvinte" },
    { id: "d", text: "Preciso e detalhista" },
  ]}
  mostSelected="b"
  leastSelected="d"
  onChange={(id, most, least) => console.log(id, most, least)}
  variant="combined"
/>
```

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `questionId` | `string` | - | ID da questão |
| `instruction` | `string` | Auto | Instrução exibida |
| `options` | `TetradOption[]` | - | 4 opções da tetrade |
| `mostSelected` | `string` | - | ID da opção "mais" |
| `leastSelected` | `string` | - | ID da opção "menos" |
| `onChange` | `(id, most, least) => void` | - | Callback |
| `variant` | `"combined" \| "separate"` | `"combined"` | Layout |

**Variantes:**
- `combined` - Tabela com colunas MOST/LEAST lado a lado
- `separate` - Duas seções separadas para seleção

---

### AllocationSlider

Alocação ipsativa de 100 pontos (CVF/OCAI).

```tsx
import { AllocationSlider } from "@/components/psychometric";

<AllocationSlider
  questionId="cvf1"
  question="Distribua 100 pontos entre os tipos de cultura:"
  options={[
    { id: "clan", label: "Colaborativa", description: "Foco em pessoas" },
    { id: "adhocracy", label: "Inovadora", description: "Foco em mudança" },
    { id: "market", label: "Competitiva", description: "Foco em resultados" },
    { id: "hierarchy", label: "Estruturada", description: "Foco em processos" },
  ]}
  values={{ clan: 25, adhocracy: 25, market: 25, hierarchy: 25 }}
  total={100}
  onChange={(id, values) => console.log(id, values)}
  variant="sliders"
/>
```

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `questionId` | `string` | - | ID da questão |
| `question` | `string` | - | Texto da pergunta |
| `options` | `AllocationOption[]` | - | Opções para alocar |
| `values` | `Record<string, number>` | Auto | Valores alocados |
| `total` | `number` | `100` | Total a ser distribuído |
| `onChange` | `(id, values) => void` | - | Callback |
| `variant` | `"sliders" \| "pie"` | `"sliders"` | Estilo visual |

**Variantes:**
- `sliders` - Sliders verticais com descrições
- `pie` - Gráfico de pizza interativo com sliders

---

## Componentes de Resultado

### InstrumentResultCard

Card completo de resultado para um instrumento.

```tsx
import { InstrumentResultCard } from "@/components/psychometric";

<InstrumentResultCard
  result={bigFiveResult}
  expanded={false}
  showChart={true}
  showDetails={true}
/>
```

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `result` | `InstrumentResult` | - | Resultado do instrumento |
| `expanded` | `boolean` | `false` | Iniciar expandido |
| `showChart` | `boolean` | `true` | Exibir gráfico |
| `showDetails` | `boolean` | `true` | Permitir expandir detalhes |

Detecta automaticamente o tipo de instrumento e renderiza o gráfico apropriado:
- SM_BIG5_20 → RadarChart
- SM_TEI_20 → RadarChart
- SM_CVF_24 → CVFQuadrantChart
- SM_SYM4_24 → ProfileChart (diamond)

---

### AssessmentProgress

Indicador de progresso do assessment.

```tsx
import { AssessmentProgress } from "@/components/psychometric";

<AssessmentProgress
  instruments={["SM_BIG5_20", "SM_TEI_20", "SM_CVF_24", "SM_SYM4_24"]}
  completedInstruments={["SM_BIG5_20", "SM_TEI_20"]}
  currentInstrument="SM_CVF_24"
  variant="horizontal"
  showEstimatedTime={true}
/>
```

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `instruments` | `string[]` | - | IDs dos instrumentos |
| `completedInstruments` | `string[]` | - | IDs já completados |
| `currentInstrument` | `string` | - | ID do instrumento atual |
| `variant` | `"horizontal" \| "vertical" \| "compact"` | `"horizontal"` | Layout |
| `showEstimatedTime` | `boolean` | `false` | Exibir tempo estimado |

**Variantes:**
- `horizontal` - Steps horizontais com conectores
- `vertical` - Timeline vertical
- `compact` - Apenas barra de progresso

---

## Tipos TypeScript

### Tipos Principais

```ts
// Severidade de flags de qualidade
type QualitySeverity = "info" | "warning" | "critical" | "invalid";

// Classificação de scores
type ClassificationLabel = "VERY_LOW" | "LOW" | "HIGH" | "VERY_HIGH";

// Status do assessment
type AssessmentStatus = "pending" | "in_progress" | "completed" | "expired";
```

### Tipos de Instrumentos

```ts
// Big Five
interface BigFiveScores {
  extraversion: number;
  agreeableness: number;
  conscientiousness: number;
  neuroticism: number;
  openness: number;
}

// Inteligência Emocional
interface TEIScores {
  well_being: number;
  emotionality: number;
  self_control: number;
  sociability: number;
  global: number;
}

// CVF Quadrantes
interface CVFQuadrant {
  clan: number;
  adhocracy: number;
  market: number;
  hierarchy: number;
}

// SYM4 Dimensões
interface SYM4Dimension {
  assertive: number;
  influential: number;
  stable: number;
  analytical: number;
}
```

### Metadados dos Instrumentos

```ts
import { INSTRUMENTS, DIMENSION_LABELS } from "@/components/psychometric";

// Acessar metadados
const bigFive = INSTRUMENTS["SM_BIG5_20"];
// { id, name, short_name, description, item_count, estimated_time_minutes, dimensions }

// Labels amigáveis (não expõe nomes técnicos)
const label = DIMENSION_LABELS["extraversion"]; // "Sociabilidade"
```

---

## Cores da Marca

Os componentes utilizam as cores da marca SynMind:

| Token | Valor | Uso |
|-------|-------|-----|
| `synmind-blue-500` | #5B7B93 | Primary, gráficos, elementos principais |
| `synmind-orange-500` | #D98D38 | Accent, CTAs, destaques |
| `chart-1` a `chart-5` | Variações | Paleta de gráficos |

Suporte completo a dark mode através das variáveis CSS.

---

## Demo

Acesse `/psychometric` na aplicação para ver todos os componentes em ação.
