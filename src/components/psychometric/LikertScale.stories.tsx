import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { LikertScale } from './LikertScale';

const meta: Meta<typeof LikertScale> = {
  title: 'Psychometric/LikertScale',
  component: LikertScale,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['buttons', 'slider', 'radio', 'touch', 'auto'],
    },
    scale: {
      control: 'select',
      options: [5, 6, 7],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive wrapper for controlled stories
function LikertScaleWrapper(props: React.ComponentProps<typeof LikertScale>) {
  const [value, setValue] = useState<number | undefined>(props.value);
  return (
    <LikertScale
      {...props}
      value={value}
      onChange={(_, v) => setValue(v)}
    />
  );
}

export const Default: Story = {
  args: {
    questionId: 'q1',
    question: 'Eu me considero uma pessoa extrovertida.',
    scale: 5,
  },
  render: (args) => <LikertScaleWrapper {...args} />,
};

export const WithValue: Story = {
  args: {
    questionId: 'q1',
    question: 'Eu me considero uma pessoa extrovertida.',
    scale: 5,
    value: 4,
  },
};

export const SevenPointScale: Story = {
  args: {
    questionId: 'q2',
    question: 'Eu me preocupo frequentemente com o futuro.',
    scale: 7,
  },
  render: (args) => <LikertScaleWrapper {...args} />,
};

export const SixPointScale: Story = {
  args: {
    questionId: 'q3',
    question: 'Eu prefiro trabalhar sozinho(a).',
    scale: 6,
  },
  render: (args) => <LikertScaleWrapper {...args} />,
};

export const TouchVariant: Story = {
  args: {
    questionId: 'q4',
    question: 'Eu me adapto facilmente a mudanças.',
    scale: 5,
    variant: 'touch',
  },
  render: (args) => <LikertScaleWrapper {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Touch variant otimizada para dispositivos móveis com área de toque >= 44px.',
      },
    },
  },
};

export const AutoVariant: Story = {
  args: {
    questionId: 'q5',
    question: 'Eu sou uma pessoa organizada.',
    scale: 5,
    variant: 'auto',
  },
  render: (args) => <LikertScaleWrapper {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Variante "auto" detecta automaticamente se o dispositivo é touch e usa a variante apropriada.',
      },
    },
  },
};

export const SliderVariant: Story = {
  args: {
    questionId: 'q6',
    question: 'Eu gosto de experimentar coisas novas.',
    scale: 7,
    variant: 'slider',
  },
  render: (args) => <LikertScaleWrapper {...args} />,
};

export const RadioVariant: Story = {
  args: {
    questionId: 'q7',
    question: 'Eu me sinto confortável em situações sociais.',
    scale: 5,
    variant: 'radio',
  },
  render: (args) => <LikertScaleWrapper {...args} />,
};

export const CustomLabels: Story = {
  args: {
    questionId: 'q8',
    question: 'Com que frequência você pratica exercícios?',
    scale: 5,
    labels: {
      low: 'Nunca',
      mid: 'Às vezes',
      high: 'Sempre',
    },
  },
  render: (args) => <LikertScaleWrapper {...args} />,
};

export const Disabled: Story = {
  args: {
    questionId: 'q9',
    question: 'Esta questão está desabilitada.',
    scale: 5,
    value: 3,
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    questionId: 'q10',
    question: 'Esta questão está em modo somente leitura.',
    scale: 5,
    value: 4,
    readonly: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Modo readonly exibe o valor selecionado sem permitir interação, útil para revisão de respostas.',
      },
    },
  },
};

export const AllVariantsComparison: Story = {
  render: () => (
    <div className="space-y-8 max-w-xl">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Buttons (default)</h3>
        <LikertScaleWrapper
          questionId="cmp1"
          question="Eu me considero uma pessoa criativa."
          scale={5}
          variant="buttons"
        />
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Touch</h3>
        <LikertScaleWrapper
          questionId="cmp2"
          question="Eu me considero uma pessoa criativa."
          scale={5}
          variant="touch"
        />
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Slider</h3>
        <LikertScaleWrapper
          questionId="cmp3"
          question="Eu me considero uma pessoa criativa."
          scale={5}
          variant="slider"
        />
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Radio</h3>
        <LikertScaleWrapper
          questionId="cmp4"
          question="Eu me considero uma pessoa criativa."
          scale={5}
          variant="radio"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparação lado a lado de todas as variantes disponíveis.',
      },
    },
  },
};

// ============================================================================
// Dark Mode Stories (for visual regression testing)
// ============================================================================

export const ButtonsVariantDarkMode: Story = {
  args: {
    questionId: 'dark1',
    question: 'Eu me considero uma pessoa extrovertida.',
    scale: 5,
    value: 3,
    variant: 'buttons',
  },
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'LikertScale buttons variant in dark mode.',
      },
    },
  },
};

export const TouchVariantDarkMode: Story = {
  args: {
    questionId: 'dark2',
    question: 'Eu me adapto facilmente a mudanças.',
    scale: 5,
    value: 4,
    variant: 'touch',
  },
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'LikertScale touch variant in dark mode with value.',
      },
    },
  },
};

export const RadioVariantDarkMode: Story = {
  args: {
    questionId: 'dark3',
    question: 'Eu me sinto confortável em situações sociais.',
    scale: 5,
    value: 2,
    variant: 'radio',
  },
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'LikertScale radio variant in dark mode with selection.',
      },
    },
  },
};

export const AllVariantsDarkMode: Story = {
  render: () => (
    <div className="space-y-8 max-w-xl">
      <LikertScale
        questionId="dark-cmp1"
        question="Variante Buttons"
        scale={5}
        value={3}
        variant="buttons"
      />
      <LikertScale
        questionId="dark-cmp2"
        question="Variante Touch"
        scale={5}
        value={4}
        variant="touch"
      />
      <LikertScale
        questionId="dark-cmp3"
        question="Variante Radio"
        scale={5}
        value={2}
        variant="radio"
      />
    </div>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'All LikertScale variants in dark mode for visual comparison.',
      },
    },
  },
};
