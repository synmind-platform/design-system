/**
 * Score Components Stories
 *
 * Storybook stories for ScoreCard and ScoreBar.
 * Demonstrates all variants, sizes, classifications, and edge cases.
 */
import type { Meta, StoryObj } from '@storybook/react';
import { ScoreCard } from './ScoreCard';
import { ScoreBar } from './ScoreBar';

// ============================================================================
// ScoreCard Stories
// ============================================================================

const scoreCardMeta: Meta<typeof ScoreCard> = {
  title: 'Psychometric/Score/ScoreCard',
  component: ScoreCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Card para exibição de scores psicométricos com dimensão, valor, classificação e tendência. Suporta hierarquia visual clara e estados vazios.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    dimension: {
      control: 'select',
      options: [
        'extraversion',
        'agreeableness',
        'conscientiousness',
        'neuroticism',
        'openness',
        'well_being',
        'emotionality',
        'self_control',
        'sociability',
      ],
      description: 'Dimensão do instrumento',
    },
    score: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Score (0-100) ou null para estado vazio',
    },
    previousScore: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Score anterior para exibir tendência',
    },
    classification: {
      control: 'select',
      options: [undefined, 'VERY_LOW', 'LOW', 'HIGH', 'VERY_HIGH'],
      description: 'Classificação semântica',
    },
    variant: {
      control: 'radio',
      options: ['detailed', 'compact'],
      description: 'Variante visual',
    },
    description: {
      control: 'text',
      description: 'Descrição adicional',
    },
  },
};

export default scoreCardMeta;

type ScoreCardStory = StoryObj<typeof ScoreCard>;

// Default story
export const Default: ScoreCardStory = {
  args: {
    dimension: 'extraversion',
    score: 75,
    variant: 'detailed',
  },
};

// With classification
export const WithClassification: ScoreCardStory = {
  args: {
    dimension: 'extraversion',
    score: 75,
    classification: 'HIGH',
    variant: 'detailed',
  },
};

// All classifications
export const VeryLowClassification: ScoreCardStory = {
  args: {
    dimension: 'neuroticism',
    score: 15,
    classification: 'VERY_LOW',
    variant: 'detailed',
  },
};

export const LowClassification: ScoreCardStory = {
  args: {
    dimension: 'agreeableness',
    score: 35,
    classification: 'LOW',
    variant: 'detailed',
  },
};

export const HighClassification: ScoreCardStory = {
  args: {
    dimension: 'conscientiousness',
    score: 70,
    classification: 'HIGH',
    variant: 'detailed',
  },
};

export const VeryHighClassification: ScoreCardStory = {
  args: {
    dimension: 'openness',
    score: 90,
    classification: 'VERY_HIGH',
    variant: 'detailed',
  },
};

// With trend
export const PositiveTrend: ScoreCardStory = {
  args: {
    dimension: 'extraversion',
    score: 75,
    previousScore: 60,
    classification: 'HIGH',
    variant: 'detailed',
  },
};

export const NegativeTrend: ScoreCardStory = {
  args: {
    dimension: 'extraversion',
    score: 60,
    previousScore: 75,
    classification: 'LOW',
    variant: 'detailed',
  },
};

export const NeutralTrend: ScoreCardStory = {
  args: {
    dimension: 'extraversion',
    score: 65,
    previousScore: 65,
    variant: 'detailed',
  },
};

// With description
export const WithDescription: ScoreCardStory = {
  args: {
    dimension: 'extraversion',
    score: 75,
    classification: 'HIGH',
    description:
      'Alta pontuação indica preferência por interações sociais frequentes e energia em ambientes grupais.',
    variant: 'detailed',
  },
};

// Compact variant
export const Compact: ScoreCardStory = {
  args: {
    dimension: 'extraversion',
    score: 75,
    classification: 'HIGH',
    variant: 'compact',
  },
};

export const CompactWithTrend: ScoreCardStory = {
  args: {
    dimension: 'conscientiousness',
    score: 85,
    previousScore: 70,
    classification: 'VERY_HIGH',
    variant: 'compact',
  },
};

// Empty state
export const EmptyState: ScoreCardStory = {
  args: {
    dimension: 'extraversion',
    score: null,
    variant: 'detailed',
  },
};

export const EmptyStateCompact: ScoreCardStory = {
  args: {
    dimension: 'extraversion',
    score: null,
    variant: 'compact',
  },
};

// Complete example with all props
export const FullExample: ScoreCardStory = {
  args: {
    dimension: 'well_being',
    score: 82,
    previousScore: 74,
    classification: 'VERY_HIGH',
    description:
      'Pontuação elevada em bem-estar indica satisfação geral com a vida e perspectiva positiva.',
    variant: 'detailed',
  },
};

// Grid layout example
export const GridLayout: ScoreCardStory = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 max-w-2xl">
      <ScoreCard
        dimension="extraversion"
        score={75}
        classification="HIGH"
        previousScore={70}
      />
      <ScoreCard
        dimension="agreeableness"
        score={60}
        classification="LOW"
        previousScore={65}
      />
      <ScoreCard
        dimension="conscientiousness"
        score={85}
        classification="VERY_HIGH"
        previousScore={80}
      />
      <ScoreCard
        dimension="neuroticism"
        score={40}
        classification="LOW"
        previousScore={45}
      />
      <ScoreCard dimension="openness" score={70} classification="HIGH" />
    </div>
  ),
};

// Compact grid
export const CompactGrid: ScoreCardStory = {
  render: () => (
    <div className="flex flex-col gap-2 max-w-md">
      <ScoreCard
        dimension="extraversion"
        score={75}
        classification="HIGH"
        variant="compact"
        previousScore={70}
      />
      <ScoreCard
        dimension="agreeableness"
        score={60}
        classification="LOW"
        variant="compact"
      />
      <ScoreCard
        dimension="conscientiousness"
        score={85}
        classification="VERY_HIGH"
        variant="compact"
        previousScore={75}
      />
      <ScoreCard
        dimension="neuroticism"
        score={40}
        classification="LOW"
        variant="compact"
      />
      <ScoreCard
        dimension="openness"
        score={70}
        classification="HIGH"
        variant="compact"
      />
    </div>
  ),
};

// Visual hierarchy demonstration
export const VisualHierarchy: ScoreCardStory = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstra a hierarquia visual clara: 1. Dimensão (título), 2. Score (destaque), 3. Classificação (contexto), 4. Tendência (secundário).',
      },
    },
  },
  args: {
    dimension: 'extraversion',
    score: 78,
    previousScore: 65,
    classification: 'HIGH',
    description: 'Descrição explicativa do significado do score.',
    variant: 'detailed',
  },
};

// ============================================================================
// ScoreBar Stories
// ============================================================================

const scoreBarMeta: Meta<typeof ScoreBar> = {
  title: 'Psychometric/Score/ScoreBar',
  component: ScoreBar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Barra de progresso para visualização de scores 0-100 com suporte a classificações semânticas e estados vazios.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Valor do score (0-100) ou null para estado vazio',
    },
    label: {
      control: 'text',
      description: 'Label da dimensão',
    },
    classification: {
      control: 'select',
      options: [undefined, 'VERY_LOW', 'LOW', 'HIGH', 'VERY_HIGH'],
      description: 'Classificação semântica para cor',
    },
    showValue: {
      control: 'boolean',
      description: 'Exibir valor numérico',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Tamanho da barra',
    },
    variant: {
      control: 'radio',
      options: ['default', 'gradient', 'segmented'],
      description: 'Estilo visual da barra',
    },
  },
};

type ScoreBarStory = StoryObj<typeof ScoreBar>;

// Default
export const ScoreBarDefault: ScoreBarStory = {
  args: {
    value: 75,
    showValue: true,
    size: 'md',
    variant: 'default',
  },
};

// With label
export const ScoreBarWithLabel: ScoreBarStory = {
  args: {
    value: 75,
    label: 'Sociabilidade',
    showValue: true,
    size: 'md',
  },
};

// Classifications
export const ScoreBarVeryLow: ScoreBarStory = {
  args: {
    value: 15,
    label: 'Sensibilidade',
    classification: 'VERY_LOW',
    showValue: true,
    size: 'md',
  },
};

export const ScoreBarLow: ScoreBarStory = {
  args: {
    value: 35,
    label: 'Colaboração',
    classification: 'LOW',
    showValue: true,
    size: 'md',
  },
};

export const ScoreBarHigh: ScoreBarStory = {
  args: {
    value: 70,
    label: 'Organização',
    classification: 'HIGH',
    showValue: true,
    size: 'md',
  },
};

export const ScoreBarVeryHigh: ScoreBarStory = {
  args: {
    value: 90,
    label: 'Abertura',
    classification: 'VERY_HIGH',
    showValue: true,
    size: 'md',
  },
};

// Sizes
export const ScoreBarSmall: ScoreBarStory = {
  args: {
    value: 75,
    label: 'Dimensão',
    showValue: true,
    size: 'sm',
  },
};

export const ScoreBarLarge: ScoreBarStory = {
  args: {
    value: 75,
    label: 'Dimensão',
    showValue: true,
    size: 'lg',
  },
};

// Variants
export const ScoreBarGradient: ScoreBarStory = {
  args: {
    value: 75,
    label: 'Dimensão',
    showValue: true,
    variant: 'gradient',
  },
};

export const ScoreBarSegmented: ScoreBarStory = {
  args: {
    value: 75,
    label: 'Dimensão',
    showValue: true,
    variant: 'segmented',
  },
};

// Empty state
export const ScoreBarEmpty: ScoreBarStory = {
  args: {
    value: null,
    label: 'Dimensão',
    showValue: true,
    size: 'md',
  },
};

// Edge cases
export const ScoreBarZero: ScoreBarStory = {
  args: {
    value: 0,
    label: 'Score mínimo',
    showValue: true,
  },
};

export const ScoreBarFull: ScoreBarStory = {
  args: {
    value: 100,
    label: 'Score máximo',
    showValue: true,
  },
};

// Multiple bars
export const ScoreBarList: ScoreBarStory = {
  render: () => (
    <div className="flex flex-col gap-3 w-80">
      <ScoreBar
        value={75}
        label="Sociabilidade"
        classification="HIGH"
        showValue
      />
      <ScoreBar
        value={60}
        label="Colaboração"
        classification="LOW"
        showValue
      />
      <ScoreBar
        value={85}
        label="Organização"
        classification="VERY_HIGH"
        showValue
      />
      <ScoreBar
        value={40}
        label="Sensibilidade"
        classification="LOW"
        showValue
      />
      <ScoreBar
        value={70}
        label="Abertura"
        classification="HIGH"
        showValue
      />
    </div>
  ),
};

// All variants comparison
export const VariantComparison: ScoreBarStory = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Default</p>
        <ScoreBar value={75} variant="default" showValue />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Gradient</p>
        <ScoreBar value={75} variant="gradient" showValue />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Segmented</p>
        <ScoreBar value={75} variant="segmented" showValue />
      </div>
    </div>
  ),
};

// Size comparison
export const SizeComparison: ScoreBarStory = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Small</p>
        <ScoreBar value={75} size="sm" showValue />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Medium</p>
        <ScoreBar value={75} size="md" showValue />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Large</p>
        <ScoreBar value={75} size="lg" showValue />
      </div>
    </div>
  ),
};

// Classification color comparison
export const ClassificationColors: ScoreBarStory = {
  render: () => (
    <div className="flex flex-col gap-3 w-80">
      <ScoreBar
        value={15}
        label="Muito Baixo"
        classification="VERY_LOW"
        showValue
      />
      <ScoreBar value={35} label="Baixo" classification="LOW" showValue />
      <ScoreBar value={70} label="Alto" classification="HIGH" showValue />
      <ScoreBar
        value={90}
        label="Muito Alto"
        classification="VERY_HIGH"
        showValue
      />
    </div>
  ),
};

// ============================================================================
// Dark Mode Stories (for visual regression testing)
// ============================================================================

/**
 * Dark mode visual test for ScoreCard.
 */
export const ScoreCardDarkMode: ScoreCardStory = {
  args: {
    dimension: 'extraversion',
    score: 78,
    previousScore: 65,
    classification: 'HIGH',
    description: 'Alta pontuação indica preferência por interações sociais.',
    variant: 'detailed',
  },
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'ScoreCard in dark mode - verifies colors and contrast in dark theme.',
      },
    },
  },
};

/**
 * Dark mode visual test for ScoreCard compact variant.
 */
export const ScoreCardCompactDarkMode: ScoreCardStory = {
  args: {
    dimension: 'conscientiousness',
    score: 85,
    previousScore: 75,
    classification: 'VERY_HIGH',
    variant: 'compact',
  },
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'ScoreCard compact variant in dark mode with trend indicator.',
      },
    },
  },
};

/**
 * Dark mode visual test for ScoreBar with all classifications.
 */
export const ScoreBarClassificationsDarkMode: ScoreBarStory = {
  render: () => (
    <div className="flex flex-col gap-3 w-80">
      <ScoreBar
        value={15}
        label="Muito Baixo"
        classification="VERY_LOW"
        showValue
      />
      <ScoreBar value={35} label="Baixo" classification="LOW" showValue />
      <ScoreBar value={70} label="Alto" classification="HIGH" showValue />
      <ScoreBar
        value={90}
        label="Muito Alto"
        classification="VERY_HIGH"
        showValue
      />
    </div>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'All ScoreBar classifications in dark mode - verifies semantic colors adapt.',
      },
    },
  },
};

/**
 * Dark mode visual test for ScoreCard grid layout.
 */
export const ScoreCardGridDarkMode: ScoreCardStory = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 max-w-2xl">
      <ScoreCard
        dimension="extraversion"
        score={75}
        classification="HIGH"
        previousScore={70}
      />
      <ScoreCard
        dimension="agreeableness"
        score={60}
        classification="LOW"
        previousScore={65}
      />
      <ScoreCard
        dimension="conscientiousness"
        score={85}
        classification="VERY_HIGH"
        previousScore={80}
      />
      <ScoreCard
        dimension="neuroticism"
        score={40}
        classification="LOW"
        previousScore={45}
      />
    </div>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'Grid of ScoreCards in dark mode - verifies consistent appearance.',
      },
    },
  },
};
