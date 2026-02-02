import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { AllocationSlider } from './AllocationSlider';

const meta = {
  title: 'Psychometric/AllocationSlider',
  component: AllocationSlider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'AllocationSlider permite ao respondente distribuir um total de pontos (geralmente 100) entre múltiplas opções. Usado principalmente no instrumento CVF para capturar cultura percebida e desejada.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['sliders', 'pie'],
      description: 'Variante visual do componente',
    },
    disabled: {
      control: 'boolean',
      description: 'Desabilita interação',
    },
    readonly: {
      control: 'boolean',
      description: 'Modo somente leitura (visual diferente de disabled)',
    },
    showPercentages: {
      control: 'boolean',
      description: 'Exibe porcentagens ao lado das opções',
    },
    pieSize: {
      control: { type: 'number', min: 200, max: 400, step: 20 },
      description: 'Tamanho do pie chart (mínimo 200px)',
    },
  },
} satisfies Meta<typeof AllocationSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

const cvfOptions = [
  {
    id: 'clan',
    label: 'Colaborativa',
    description: 'Foco em pessoas, trabalho em equipe e desenvolvimento',
  },
  {
    id: 'adhocracy',
    label: 'Inovadora',
    description: 'Foco em criatividade, empreendedorismo e adaptação',
  },
  {
    id: 'market',
    label: 'Competitiva',
    description: 'Foco em resultados, competição e conquistas',
  },
  {
    id: 'hierarchy',
    label: 'Estruturada',
    description: 'Foco em processos, estabilidade e eficiência',
  },
];

const equalValues = {
  clan: 25,
  adhocracy: 25,
  market: 25,
  hierarchy: 25,
};

const dominantClanValues = {
  clan: 45,
  adhocracy: 20,
  market: 15,
  hierarchy: 20,
};

const invalidValues = {
  clan: 30,
  adhocracy: 30,
  market: 20,
  hierarchy: 10,
};

/**
 * Variante padrão com sliders para cada opção
 */
export const Default: Story = {
  args: {
    questionId: 'cvf-q1',
    question: 'Distribua 100 pontos entre os tipos de cultura organizacional:',
    options: cvfOptions,
    values: equalValues,
    variant: 'sliders',
  },
};

/**
 * Variante com pie chart para visualização gráfica
 */
export const PieVariant: Story = {
  args: {
    ...Default.args,
    variant: 'pie',
    pieSize: 240,
  },
};

/**
 * Com distribuição desbalanceada (cultura dominante Clã)
 */
export const DominantCulture: Story = {
  args: {
    ...Default.args,
    values: dominantClanValues,
  },
};

/**
 * Total inválido (não soma 100)
 */
export const InvalidTotal: Story = {
  args: {
    ...Default.args,
    values: invalidValues,
  },
};

/**
 * Estado desabilitado
 */
export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

/**
 * Estado somente leitura
 */
export const Readonly: Story = {
  args: {
    ...Default.args,
    readonly: true,
  },
};

/**
 * Pie variant desabilitado
 */
export const PieDisabled: Story = {
  args: {
    ...Default.args,
    variant: 'pie',
    disabled: true,
  },
};

/**
 * Pie variant somente leitura
 */
export const PieReadonly: Story = {
  args: {
    ...Default.args,
    variant: 'pie',
    readonly: true,
  },
};

/**
 * Sem descrições nas opções
 */
export const WithoutDescriptions: Story = {
  args: {
    questionId: 'cvf-q2',
    question: 'Como você descreveria a cultura da sua organização?',
    options: cvfOptions.map(({ id, label }) => ({ id, label })),
    values: equalValues,
    variant: 'sliders',
  },
};

/**
 * Sem exibir porcentagens
 */
export const HidePercentages: Story = {
  args: {
    ...Default.args,
    showPercentages: false,
  },
};

/**
 * Pie com tamanho grande
 */
export const LargePie: Story = {
  args: {
    ...Default.args,
    variant: 'pie',
    pieSize: 320,
    values: dominantClanValues,
  },
};

/**
 * Pie com tamanho mínimo
 */
export const MinimumPieSize: Story = {
  args: {
    ...Default.args,
    variant: 'pie',
    pieSize: 200,
  },
};

/**
 * Total customizado (50 pontos)
 */
export const CustomTotal: Story = {
  args: {
    questionId: 'custom-total',
    question: 'Distribua 50 pontos entre as opções:',
    options: [
      { id: 'a', label: 'Opção A' },
      { id: 'b', label: 'Opção B' },
      { id: 'c', label: 'Opção C' },
    ],
    values: { a: 20, b: 15, c: 15 },
    total: 50,
    variant: 'sliders',
  },
};

/**
 * Cores customizadas por opção
 */
export const CustomColors: Story = {
  args: {
    questionId: 'custom-colors',
    question: 'Distribua os pontos:',
    options: [
      { id: 'red', label: 'Vermelho', color: '#ef4444' },
      { id: 'green', label: 'Verde', color: '#22c55e' },
      { id: 'blue', label: 'Azul', color: '#3b82f6' },
      { id: 'yellow', label: 'Amarelo', color: '#eab308' },
    ],
    values: { red: 30, green: 25, blue: 25, yellow: 20 },
    variant: 'pie',
    pieSize: 280,
  },
};

/**
 * Interativo - com estado controlado
 */
export const Interactive: Story = {
  render: function Render() {
    const [values, setValues] = useState(equalValues);

    return (
      <div className="w-[500px] space-y-4">
        <AllocationSlider
          questionId="interactive"
          question="Distribua 100 pontos entre os tipos de cultura organizacional:"
          options={cvfOptions}
          values={values}
          onChange={(_id, newValues) => setValues(newValues)}
          variant="sliders"
        />
        <div className="text-sm text-muted-foreground">
          <p>Valores atuais:</p>
          <pre className="mt-2 p-2 bg-muted rounded text-xs">
            {JSON.stringify(values, null, 2)}
          </pre>
        </div>
      </div>
    );
  },
};

/**
 * Interativo com pie chart
 */
export const InteractivePie: Story = {
  render: function Render() {
    const [values, setValues] = useState(equalValues);

    return (
      <div className="w-[600px] space-y-4">
        <AllocationSlider
          questionId="interactive-pie"
          question="Distribua 100 pontos entre os tipos de cultura organizacional:"
          options={cvfOptions}
          values={values}
          onChange={(_id, newValues) => setValues(newValues)}
          variant="pie"
          pieSize={240}
        />
        <div className="text-sm text-muted-foreground">
          <p>Valores atuais:</p>
          <pre className="mt-2 p-2 bg-muted rounded text-xs">
            {JSON.stringify(values, null, 2)}
          </pre>
        </div>
      </div>
    );
  },
};

/**
 * Dark mode
 */
export const DarkMode: Story = {
  args: {
    ...Default.args,
    values: dominantClanValues,
  },
  decorators: [
    (Story) => (
      <div className="dark bg-background p-6 rounded-lg">
        <Story />
      </div>
    ),
  ],
};

/**
 * Dark mode com pie
 */
export const DarkModePie: Story = {
  args: {
    ...Default.args,
    variant: 'pie',
    values: dominantClanValues,
    pieSize: 240,
  },
  decorators: [
    (Story) => (
      <div className="dark bg-background p-6 rounded-lg">
        <Story />
      </div>
    ),
  ],
};
