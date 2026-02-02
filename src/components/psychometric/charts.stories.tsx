/**
 * Chart Components Stories
 *
 * Storybook stories for RadarChart, ProfileChart, and CVFQuadrantChart.
 * Demonstrates all variants, sizes, and use cases.
 */
import type { Meta, StoryObj } from '@storybook/react';
import { RadarChart } from './RadarChart';
import { ProfileChart } from './ProfileChart';
import { CVFQuadrantChart } from './CVFQuadrantChart';

// ============================================================================
// RadarChart Stories
// ============================================================================

const radarMeta: Meta<typeof RadarChart> = {
  title: 'Psychometric/Charts/RadarChart',
  component: RadarChart,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Gráfico radar para visualização de dimensões psicométricas (BIG5, TEI, ESQ).',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'responsive'],
      description: 'Tamanho do gráfico',
    },
    variant: {
      control: 'radio',
      options: ['filled', 'line'],
      description: 'Estilo visual do polígono',
    },
    showLabels: {
      control: 'boolean',
      description: 'Exibir labels das dimensões',
    },
    showValues: {
      control: 'boolean',
      description: 'Exibir valores numéricos',
    },
  },
};

export default radarMeta;

type RadarStory = StoryObj<typeof RadarChart>;

const big5Scores = {
  extraversion: 75,
  agreeableness: 60,
  conscientiousness: 85,
  neuroticism: 40,
  openness: 70,
};

const big5Dimensions = [
  'extraversion',
  'agreeableness',
  'conscientiousness',
  'neuroticism',
  'openness',
];

export const Default: RadarStory = {
  args: {
    scores: big5Scores,
    dimensions: big5Dimensions,
    size: 'md',
    showLabels: true,
    showValues: false,
    variant: 'filled',
  },
};

export const WithValues: RadarStory = {
  args: {
    ...Default.args,
    showValues: true,
  },
};

export const LineVariant: RadarStory = {
  args: {
    ...Default.args,
    variant: 'line',
  },
};

export const SmallSize: RadarStory = {
  args: {
    ...Default.args,
    size: 'sm',
  },
};

export const LargeSize: RadarStory = {
  args: {
    ...Default.args,
    size: 'lg',
  },
};

export const TEIScores: RadarStory = {
  args: {
    scores: {
      well_being: 68,
      emotionality: 55,
      self_control: 72,
      sociability: 80,
    },
    dimensions: ['well_being', 'emotionality', 'self_control', 'sociability'],
    size: 'md',
    showLabels: true,
    showValues: true,
  },
};

export const ExtremeValues: RadarStory = {
  args: {
    scores: {
      extraversion: 95,
      agreeableness: 10,
      conscientiousness: 50,
      neuroticism: 85,
      openness: 25,
    },
    dimensions: big5Dimensions,
    size: 'md',
    showLabels: true,
    showValues: true,
  },
};

export const EmptyState: RadarStory = {
  args: {
    scores: {},
    dimensions: [],
    size: 'md',
  },
};

// ============================================================================
// ProfileChart Stories
// ============================================================================

const profileMeta: Meta<typeof ProfileChart> = {
  title: 'Psychometric/Charts/ProfileChart',
  component: ProfileChart,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Gráfico de perfil comportamental SYM4/DISC com variantes bar e diamond.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'responsive'],
      description: 'Tamanho do gráfico',
    },
    variant: {
      control: 'radio',
      options: ['bar', 'diamond'],
      description: 'Tipo de visualização',
    },
    showLabels: {
      control: 'boolean',
      description: 'Exibir labels das dimensões',
    },
    showLegend: {
      control: 'boolean',
      description: 'Exibir legenda (quando graphII presente)',
    },
  },
};

type ProfileStory = StoryObj<typeof ProfileChart>;

const graphI = {
  assertive: 75,
  influential: 60,
  stable: 45,
  analytical: 80,
};

const graphII = {
  assertive: 65,
  influential: 70,
  stable: 50,
  analytical: 70,
};

export const ProfileDefault: ProfileStory = {
  args: {
    graphI,
    size: 'md',
    variant: 'bar',
    showLabels: true,
    showLegend: true,
  },
};

export const ProfileWithComparison: ProfileStory = {
  args: {
    graphI,
    graphII,
    size: 'md',
    variant: 'bar',
    showLabels: true,
    showLegend: true,
  },
};

export const ProfileDiamond: ProfileStory = {
  args: {
    graphI,
    size: 'md',
    variant: 'diamond',
    showLabels: true,
  },
};

export const ProfileDiamondWithComparison: ProfileStory = {
  args: {
    graphI,
    graphII,
    size: 'md',
    variant: 'diamond',
    showLabels: true,
    showLegend: true,
  },
};

export const ProfileSmall: ProfileStory = {
  args: {
    ...ProfileDefault.args,
    size: 'sm',
  },
};

export const ProfileLarge: ProfileStory = {
  args: {
    ...ProfileDefault.args,
    size: 'lg',
  },
};

export const HighDominance: ProfileStory = {
  args: {
    graphI: {
      assertive: 95,
      influential: 30,
      stable: 20,
      analytical: 40,
    },
    size: 'md',
    variant: 'bar',
    showLabels: true,
  },
};

export const HighInfluence: ProfileStory = {
  args: {
    graphI: {
      assertive: 45,
      influential: 90,
      stable: 35,
      analytical: 25,
    },
    size: 'md',
    variant: 'bar',
    showLabels: true,
  },
};

// ============================================================================
// CVFQuadrantChart Stories
// ============================================================================

const cvfMeta: Meta<typeof CVFQuadrantChart> = {
  title: 'Psychometric/Charts/CVFQuadrantChart',
  component: CVFQuadrantChart,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Gráfico de quadrantes para cultura organizacional (Competing Values Framework).',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'responsive'],
      description: 'Tamanho do gráfico',
    },
    showLabels: {
      control: 'boolean',
      description: 'Exibir labels dos quadrantes',
    },
    showLegend: {
      control: 'boolean',
      description: 'Exibir legenda (quando values presente)',
    },
  },
};

type CVFStory = StoryObj<typeof CVFQuadrantChart>;

const perceived = {
  clan: 30,
  adhocracy: 25,
  market: 25,
  hierarchy: 20,
};

const values = {
  clan: 35,
  adhocracy: 30,
  market: 20,
  hierarchy: 15,
};

export const CVFDefault: CVFStory = {
  args: {
    perceived,
    size: 'md',
    showLabels: true,
    showLegend: true,
  },
};

export const CVFWithComparison: CVFStory = {
  args: {
    perceived,
    values,
    size: 'md',
    showLabels: true,
    showLegend: true,
  },
};

export const CVFSmall: CVFStory = {
  args: {
    ...CVFDefault.args,
    size: 'sm',
  },
};

export const CVFLarge: CVFStory = {
  args: {
    ...CVFDefault.args,
    size: 'lg',
  },
};

export const CVFClanDominant: CVFStory = {
  args: {
    perceived: {
      clan: 50,
      adhocracy: 20,
      market: 15,
      hierarchy: 15,
    },
    size: 'md',
    showLabels: true,
  },
};

export const CVFMarketDominant: CVFStory = {
  args: {
    perceived: {
      clan: 15,
      adhocracy: 15,
      market: 55,
      hierarchy: 15,
    },
    size: 'md',
    showLabels: true,
  },
};

export const CVFBalanced: CVFStory = {
  args: {
    perceived: {
      clan: 25,
      adhocracy: 25,
      market: 25,
      hierarchy: 25,
    },
    size: 'md',
    showLabels: true,
  },
};

export const CVFExtremeGap: CVFStory = {
  args: {
    perceived: {
      clan: 15,
      adhocracy: 15,
      market: 50,
      hierarchy: 20,
    },
    values: {
      clan: 45,
      adhocracy: 35,
      market: 10,
      hierarchy: 10,
    },
    size: 'md',
    showLabels: true,
    showLegend: true,
  },
};

export const CVFWithoutLabels: CVFStory = {
  args: {
    ...CVFDefault.args,
    showLabels: false,
  },
};

export const CVFMinimalValues: CVFStory = {
  args: {
    perceived: {
      clan: 5,
      adhocracy: 5,
      market: 5,
      hierarchy: 5,
    },
    size: 'md',
    showLabels: true,
  },
};

// New Phase 6 stories demonstrating improved comparison features

/**
 * US4: Clear comparison between perceived and desired culture.
 * This story demonstrates the visual distinction between:
 * - Perceived culture (solid blue polygon with fill)
 * - Desired culture (dashed orange line)
 */
export const CVFPerceivedVsDesired: CVFStory = {
  args: {
    perceived: {
      clan: 20,
      adhocracy: 15,
      market: 45,
      hierarchy: 20,
    },
    values: {
      clan: 35,
      adhocracy: 35,
      market: 20,
      hierarchy: 10,
    },
    size: 'lg',
    showLabels: true,
    showLegend: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates clear visual distinction between perceived (solid blue) and desired (dashed orange) organizational culture, making comparison intuitive.',
      },
    },
  },
};

/**
 * US4: Extreme values visibility.
 * Shows vertex markers at extreme low values for better visibility.
 */
export const CVFExtremeValuesWithMarkers: CVFStory = {
  args: {
    perceived: {
      clan: 5,
      adhocracy: 90,
      market: 3,
      hierarchy: 2,
    },
    values: {
      clan: 8,
      adhocracy: 10,
      market: 75,
      hierarchy: 7,
    },
    size: 'lg',
    showLabels: true,
    showLegend: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows vertex markers at extreme low values (≤15%) ensuring all data points are visible even at small percentages.',
      },
    },
  },
};

/**
 * US4: Responsive labels on small size.
 * Shows abbreviated labels on small chart size.
 */
export const CVFSmallWithAbbreviatedLabels: CVFStory = {
  args: {
    perceived,
    values,
    size: 'sm',
    showLabels: true,
    showLegend: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'On small sizes (200px), labels are automatically abbreviated for better fit: Cola, Inov, Comp, Estr.',
      },
    },
  },
};

/**
 * US4: Side-by-side comparison view.
 * Demonstrates how to display perceived and desired side by side.
 */
export const CVFSideBySideComparison: CVFStory = {
  render: () => (
    <div className="flex gap-8 items-start">
      <div className="text-center">
        <CVFQuadrantChart
          perceived={{
            clan: 20,
            adhocracy: 15,
            market: 45,
            hierarchy: 20,
          }}
          size="md"
          showLabels={true}
        />
        <p className="mt-2 text-sm font-medium text-muted-foreground">Cultura Atual</p>
      </div>
      <div className="text-center">
        <CVFQuadrantChart
          perceived={{
            clan: 35,
            adhocracy: 35,
            market: 20,
            hierarchy: 10,
          }}
          size="md"
          showLabels={true}
        />
        <p className="mt-2 text-sm font-medium text-muted-foreground">Cultura Desejada</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Alternative visualization: two separate charts side by side for direct comparison.',
      },
    },
  },
};

// ============================================================================
// Dark Mode Stories (for visual regression testing)
// ============================================================================

/**
 * Dark mode visual test for RadarChart.
 */
export const RadarChartDarkMode: RadarStory = {
  args: {
    scores: big5Scores,
    dimensions: big5Dimensions,
    size: 'md',
    showLabels: true,
    showValues: true,
  },
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'RadarChart in dark mode - verifies colors adapt correctly via CSS variables.',
      },
    },
  },
};

/**
 * Dark mode visual test for ProfileChart (bar variant).
 */
export const ProfileChartBarDarkMode: ProfileStory = {
  args: {
    graphI,
    graphII,
    size: 'md',
    variant: 'bar',
    showLabels: true,
    showLegend: true,
  },
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'ProfileChart bar variant in dark mode with both graphs.',
      },
    },
  },
};

/**
 * Dark mode visual test for ProfileChart (diamond variant).
 */
export const ProfileChartDiamondDarkMode: ProfileStory = {
  args: {
    graphI,
    graphII,
    size: 'md',
    variant: 'diamond',
    showLabels: true,
    showLegend: true,
  },
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'ProfileChart diamond variant in dark mode with both graphs.',
      },
    },
  },
};

/**
 * Dark mode visual test for CVFQuadrantChart.
 */
export const CVFQuadrantChartDarkMode: CVFStory = {
  args: {
    perceived,
    values,
    size: 'md',
    showLabels: true,
    showLegend: true,
  },
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'CVFQuadrantChart in dark mode with comparison - verifies contrast and readability.',
      },
    },
  },
};
