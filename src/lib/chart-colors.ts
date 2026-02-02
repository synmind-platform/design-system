/**
 * CHART_COLORS - Constantes de cores padronizadas para gráficos psicométricos
 * Usa CSS variables para suportar dark mode automaticamente
 */
export const CHART_COLORS = {
  // Primary data series (SynMind Blue)
  primary: 'var(--color-synmind-blue-500)',
  primaryLight: 'var(--color-synmind-blue-400)',
  primaryDark: 'var(--color-synmind-blue-600)',

  // Secondary data series - para comparações (SynMind Orange)
  secondary: 'var(--color-synmind-orange-500)',
  secondaryLight: 'var(--color-synmind-orange-400)',
  secondaryDark: 'var(--color-synmind-orange-600)',

  // Semantic score colors (classification)
  veryLow: 'var(--color-synmind-blue-300)',
  low: 'var(--color-synmind-blue-400)',
  high: 'var(--color-synmind-orange-400)',
  veryHigh: 'var(--color-synmind-orange-500)',

  // Grid and axis colors
  grid: 'var(--color-border)',
  axis: 'var(--color-muted-foreground)',

  // CVF Quadrant backgrounds
  quadrants: {
    clan: 'var(--color-synmind-blue-100)',
    adhocracy: 'var(--color-synmind-orange-100)',
    market: 'var(--color-synmind-orange-200)',
    hierarchy: 'var(--color-synmind-blue-200)',
  },

  // Quality badge colors - using CSS variables for dark mode support
  quality: {
    info: 'var(--color-synmind-blue-500)',
    warning: 'var(--color-synmind-orange-400)', // amber-like warning
    critical: 'var(--color-synmind-orange-500)', // orange critical
    invalid: 'var(--color-destructive)', // system destructive for invalid
  },
} as const;

/**
 * Mapeamento de ClassificationLabel para cores
 */
export const CLASSIFICATION_COLORS = {
  VERY_LOW: CHART_COLORS.veryLow,
  LOW: CHART_COLORS.low,
  HIGH: CHART_COLORS.high,
  VERY_HIGH: CHART_COLORS.veryHigh,
} as const;

/**
 * Labels PT-BR dos quadrantes CVF
 */
export const QUADRANT_LABELS = {
  clan: 'Colaborativa',
  adhocracy: 'Inovadora',
  market: 'Competitiva',
  hierarchy: 'Estruturada',
} as const;

export type QuadrantKey = keyof typeof QUADRANT_LABELS;
