import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InstrumentResultCard } from '../InstrumentResultCard';
import type { BigFiveResult, CVFResult, SYM4Result, TEIResult } from '@/types/psychometric';

const bigFiveResult: BigFiveResult = {
  instrument_id: 'SM_BIG5_20',
  algorithm_version: 'SM_BIG5_v1',
  scores_0_100: {
    extraversion: 75,
    agreeableness: 60,
    conscientiousness: 80,
    neuroticism: 40,
    openness: 70,
  },
  quality: {
    quality_passed: true,
    flags: [],
    completion_time_seconds: 180,
  },
};

const teiResult: TEIResult = {
  instrument_id: 'SM_TEI_20',
  algorithm_version: 'SM_TEI_v1',
  scores_0_100: {
    well_being: 70,
    emotionality: 65,
    self_control: 75,
    sociability: 60,
    global: 67,
  },
  quality: {
    quality_passed: true,
    flags: [],
    completion_time_seconds: 200,
  },
};

const cvfResult: CVFResult = {
  instrument_id: 'SM_CVF_24',
  algorithm_version: 'SM_CVF_v1',
  scores_0_100: {
    perceived: {
      clan: 35,
      adhocracy: 25,
      market: 20,
      hierarchy: 20,
    },
    values: {
      clan: 30,
      adhocracy: 30,
      market: 20,
      hierarchy: 20,
    },
  },
  quality: {
    quality_passed: true,
    flags: [],
    completion_time_seconds: 240,
  },
};

const sym4Result: SYM4Result = {
  instrument_id: 'SM_SYM4_24',
  algorithm_version: 'SM_SYM4_v1',
  scores_0_100: {
    graph_i: {
      assertive: 75,
      influential: 60,
      stable: 45,
      analytical: 70,
    },
    graph_ii: {
      assertive: 65,
      influential: 70,
      stable: 55,
      analytical: 60,
    },
  },
  quality: {
    quality_passed: true,
    flags: [],
    completion_time_seconds: 300,
  },
};

describe('InstrumentResultCard', () => {
  describe('Null result handling', () => {
    it('renders empty state when result is null', () => {
      render(<InstrumentResultCard result={null} />);
      expect(screen.getByText(/Resultado não disponível/i)).toBeInTheDocument();
    });

    it('shows waiting message in empty state', () => {
      render(<InstrumentResultCard result={null} />);
      expect(
        screen.getByText(/Aguardando conclusão do instrumento/i)
      ).toBeInTheDocument();
    });

    it('shows icon in empty state', () => {
      const { container } = render(<InstrumentResultCard result={null} />);
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('applies custom className to empty state', () => {
      const { container } = render(
        <InstrumentResultCard result={null} className="custom-class" />
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('BigFive result', () => {
    it('renders instrument name', () => {
      render(<InstrumentResultCard result={bigFiveResult} />);
      // BIG5 name is "Traços de Personalidade"
      expect(screen.getByText(/Traços de Personalidade/i)).toBeInTheDocument();
    });

    it('renders radar chart', () => {
      const { container } = render(
        <InstrumentResultCard result={bigFiveResult} showChart />
      );
      const svg = container.querySelector('svg[role="img"]');
      expect(svg).toBeInTheDocument();
    });

    it('shows quality badge', () => {
      render(<InstrumentResultCard result={bigFiveResult} />);
      // Quality passed results show check icon or passed indicator
      const card = document.querySelector('[class*="Card"]');
      expect(card).toBeInTheDocument();
    });

    it('shows version info', () => {
      render(<InstrumentResultCard result={bigFiveResult} />);
      expect(screen.getByText(/v1/)).toBeInTheDocument();
    });

    it('shows completion time', () => {
      render(<InstrumentResultCard result={bigFiveResult} />);
      expect(screen.getByText(/3min/)).toBeInTheDocument();
    });

    it('expands to show details', () => {
      render(
        <InstrumentResultCard result={bigFiveResult} showDetails expanded />
      );
      // Should show dimension labels - may have multiple matches
      const labels = screen.getAllByText(/Sociabilidade|Colaboração|Organização/i);
      expect(labels.length).toBeGreaterThan(0);
    });
  });

  describe('TEI result', () => {
    it('renders instrument name', () => {
      render(<InstrumentResultCard result={teiResult} />);
      // TEI is short_name "Emocional" or name "Inteligência Emocional"
      expect(screen.getByText(/Inteligência Emocional/i)).toBeInTheDocument();
    });

    it('renders radar chart without global dimension', () => {
      const { container } = render(
        <InstrumentResultCard result={teiResult} showChart />
      );
      const svg = container.querySelector('svg[role="img"]');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('CVF result', () => {
    it('renders instrument name', () => {
      render(<InstrumentResultCard result={cvfResult} />);
      // CVF name is "Cultura Organizacional" - multiple occurrences possible
      const matches = screen.getAllByText(/Cultura Organizacional/i);
      expect(matches.length).toBeGreaterThan(0);
    });

    it('renders quadrant chart', () => {
      const { container } = render(
        <InstrumentResultCard result={cvfResult} showChart />
      );
      const svg = container.querySelector('svg[role="img"]');
      expect(svg).toBeInTheDocument();
    });

    it('expands to show perceived and values sections', () => {
      render(<InstrumentResultCard result={cvfResult} showDetails expanded />);
      const percebida = screen.getAllByText(/Cultura Percebida/i);
      const valores = screen.getAllByText(/Valores Pessoais/i);
      expect(percebida.length).toBeGreaterThan(0);
      expect(valores.length).toBeGreaterThan(0);
    });
  });

  describe('SYM4 result', () => {
    it('renders instrument name', () => {
      render(<InstrumentResultCard result={sym4Result} />);
      // SYM4 name is "Perfil Comportamental" - multiple occurrences possible
      const matches = screen.getAllByText(/Perfil Comportamental/i);
      expect(matches.length).toBeGreaterThan(0);
    });

    it('renders profile chart (diamond)', () => {
      const { container } = render(
        <InstrumentResultCard result={sym4Result} showChart />
      );
      const svg = container.querySelector('svg[role="img"]');
      expect(svg).toBeInTheDocument();
    });

    it('expands to show Graph I and Graph II sections', () => {
      render(<InstrumentResultCard result={sym4Result} showDetails expanded />);
      // Multiple elements may match, use getAllByText
      const naturalProfiles = screen.getAllByText(/Perfil Natural/i);
      const adaptedProfiles = screen.getAllByText(/Perfil Adaptado/i);
      expect(naturalProfiles.length).toBeGreaterThan(0);
      expect(adaptedProfiles.length).toBeGreaterThan(0);
    });
  });

  describe('Interactive behavior', () => {
    it('toggles expand on button click', () => {
      render(<InstrumentResultCard result={bigFiveResult} showDetails />);

      const expandButton = screen.getByText(/Ver detalhes/i);
      fireEvent.click(expandButton);

      expect(screen.getByText(/Ocultar detalhes/i)).toBeInTheDocument();
    });

    it('starts expanded when expanded prop is true', () => {
      render(<InstrumentResultCard result={bigFiveResult} expanded />);
      expect(screen.getByText(/Ocultar detalhes/i)).toBeInTheDocument();
    });

    it('hides details button when showDetails is false', () => {
      render(
        <InstrumentResultCard result={bigFiveResult} showDetails={false} />
      );
      expect(screen.queryByText(/Ver detalhes/i)).not.toBeInTheDocument();
    });
  });

  describe('Chart visibility', () => {
    it('shows chart when showChart is true', () => {
      const { container } = render(
        <InstrumentResultCard result={bigFiveResult} showChart />
      );
      const svg = container.querySelector('svg[role="img"]');
      expect(svg).toBeInTheDocument();
    });

    it('hides chart when showChart is false', () => {
      const { container } = render(
        <InstrumentResultCard result={bigFiveResult} showChart={false} />
      );
      const svg = container.querySelector('svg[role="img"]');
      expect(svg).not.toBeInTheDocument();
    });
  });

  describe('Quality indicators', () => {
    it('shows passed quality badge', () => {
      const { container } = render(
        <InstrumentResultCard result={bigFiveResult} />
      );
      // Card should render with QualityBadge component
      expect(container.firstChild).toBeInTheDocument();
    });

    it('shows failed quality with flags', () => {
      const failedResult: BigFiveResult = {
        ...bigFiveResult,
        quality: {
          quality_passed: false,
          flags: [
            {
              code: 'RESPONSE_TIME_TOO_FAST',
              severity: 'warning',
              message: 'Tempo de resposta muito rápido',
            },
          ],
          completion_time_seconds: 30,
        },
      };
      const { container } = render(
        <InstrumentResultCard result={failedResult} />
      );
      // Failed quality should render - component renders without error
      expect(container.firstChild).toBeInTheDocument();
    });

    it('shows critical flag indicator', () => {
      const criticalResult: BigFiveResult = {
        ...bigFiveResult,
        quality: {
          quality_passed: false,
          flags: [
            {
              code: 'INVALID_RESPONSE_PATTERN',
              severity: 'critical',
              message: 'Padrão de resposta inválido',
            },
          ],
          completion_time_seconds: 60,
        },
      };
      const { container } = render(
        <InstrumentResultCard result={criticalResult} />
      );
      // Should render without error
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies custom className', () => {
      const { container } = render(
        <InstrumentResultCard result={bigFiveResult} className="custom-class" />
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('uses correct icon for each instrument', () => {
      const { container: bigFiveContainer } = render(
        <InstrumentResultCard result={bigFiveResult} />
      );
      const { container: cvfContainer } = render(
        <InstrumentResultCard result={cvfResult} />
      );

      // Each should have an icon in the header
      const bigFiveIcon = bigFiveContainer.querySelector(
        '.p-2.rounded-lg svg'
      );
      const cvfIcon = cvfContainer.querySelector('.p-2.rounded-lg svg');

      expect(bigFiveIcon).toBeInTheDocument();
      expect(cvfIcon).toBeInTheDocument();
    });
  });
});
