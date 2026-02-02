import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ForcedChoice } from './ForcedChoice';

const meta: Meta<typeof ForcedChoice> = {
  title: 'Psychometric/ForcedChoice',
  component: ForcedChoice,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['combined', 'separate'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultOptions = [
  { id: 'opt1', text: 'Eu sou determinado e assertivo' },
  { id: 'opt2', text: 'Eu sou sociável e entusiasmado' },
  { id: 'opt3', text: 'Eu sou paciente e colaborativo' },
  { id: 'opt4', text: 'Eu sou analítico e cuidadoso' },
];

// Interactive wrapper for controlled stories
function ForcedChoiceWrapper(props: React.ComponentProps<typeof ForcedChoice>) {
  const [selection, setSelection] = useState({
    most: props.mostSelected ?? null,
    least: props.leastSelected ?? null,
  });

  return (
    <ForcedChoice
      {...props}
      mostSelected={selection.most ?? undefined}
      leastSelected={selection.least ?? undefined}
      onChange={(_, most, least) => setSelection({ most, least })}
    />
  );
}

export const Default: Story = {
  args: {
    questionId: 'tetrad1',
    options: defaultOptions,
  },
  render: (args) => <ForcedChoiceWrapper {...args} />,
};

export const CombinedVariant: Story = {
  args: {
    questionId: 'tetrad2',
    options: defaultOptions,
    variant: 'combined',
  },
  render: (args) => <ForcedChoiceWrapper {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Variante combinada exibe uma tabela com colunas "Mais" e "Menos" lado a lado. Ideal para desktop.',
      },
    },
  },
};

export const SeparateVariant: Story = {
  args: {
    questionId: 'tetrad3',
    options: defaultOptions,
    variant: 'separate',
  },
  render: (args) => <ForcedChoiceWrapper {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Variante separada exibe duas listas distintas para seleção de "Mais" e "Menos". Melhor para mobile.',
      },
    },
  },
};

export const WithSelections: Story = {
  args: {
    questionId: 'tetrad4',
    options: defaultOptions,
    mostSelected: 'opt1',
    leastSelected: 'opt3',
  },
};

export const PartialSelection: Story = {
  args: {
    questionId: 'tetrad5',
    options: defaultOptions,
    mostSelected: 'opt2',
  },
  parameters: {
    docs: {
      description: {
        story: 'Exibe indicador visual quando a seleção está incompleta (falta selecionar "Menos").',
      },
    },
  },
};

export const CustomInstruction: Story = {
  args: {
    questionId: 'tetrad6',
    options: defaultOptions,
    instruction: 'Escolha a afirmação que MAIS e a que MENOS combina com você no ambiente de trabalho',
  },
  render: (args) => <ForcedChoiceWrapper {...args} />,
};

export const Disabled: Story = {
  args: {
    questionId: 'tetrad7',
    options: defaultOptions,
    mostSelected: 'opt1',
    leastSelected: 'opt4',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Estado desabilitado impede interação mas mantém aparência de seleção.',
      },
    },
  },
};

export const ReadOnly: Story = {
  args: {
    questionId: 'tetrad8',
    options: defaultOptions,
    mostSelected: 'opt2',
    leastSelected: 'opt3',
    readonly: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Estado readonly exibe as seleções de forma clara sem permitir interação. Útil para revisão de respostas.',
      },
    },
  },
};

export const ReadOnlySeparate: Story = {
  args: {
    questionId: 'tetrad9',
    options: defaultOptions,
    mostSelected: 'opt1',
    leastSelected: 'opt4',
    readonly: true,
    variant: 'separate',
  },
  parameters: {
    docs: {
      description: {
        story: 'Variante separada em modo readonly.',
      },
    },
  },
};

export const AllVariantsComparison: Story = {
  render: () => (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Combined (default)</h3>
        <ForcedChoiceWrapper
          questionId="cmp1"
          options={defaultOptions}
          variant="combined"
        />
      </div>
      <hr className="border-border" />
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Separate</h3>
        <ForcedChoiceWrapper
          questionId="cmp2"
          options={defaultOptions}
          variant="separate"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparação lado a lado das variantes disponíveis.',
      },
    },
  },
};

export const DarkMode: Story = {
  args: {
    questionId: 'tetrad-dark',
    options: defaultOptions,
  },
  render: (args) => (
    <div className="dark bg-background p-6 rounded-lg">
      <ForcedChoiceWrapper {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Componente em dark mode.',
      },
    },
  },
};

export const DarkModeWithSelections: Story = {
  args: {
    questionId: 'tetrad-dark-selected',
    options: defaultOptions,
    mostSelected: 'opt1',
    leastSelected: 'opt3',
  },
  render: (args) => (
    <div className="dark bg-background p-6 rounded-lg">
      <ForcedChoice {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Dark mode com seleções para verificar contraste.',
      },
    },
  },
};

export const LongTexts: Story = {
  args: {
    questionId: 'tetrad-long',
    options: [
      { id: 'opt1', text: 'Eu tendo a ser muito direto e objetivo nas minhas comunicações, preferindo ir direto ao ponto' },
      { id: 'opt2', text: 'Eu gosto de conhecer novas pessoas e costumo ser visto como uma pessoa animada e extrovertida' },
      { id: 'opt3', text: 'Eu prefiro ambientes calmos e colaborativos onde posso trabalhar em harmonia com os outros' },
      { id: 'opt4', text: 'Eu costumo analisar todos os detalhes antes de tomar uma decisão importante' },
    ],
  },
  render: (args) => <ForcedChoiceWrapper {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Comportamento com textos longos que podem quebrar em múltiplas linhas.',
      },
    },
  },
};
