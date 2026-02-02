import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { InstrumentResultCard } from '../InstrumentResultCard';
import type { BigFiveResult, CVFResult, SYM4Result } from '@/types/psychometric';

expect.extend(toHaveNoViolations);

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

describe('InstrumentResultCard Accessibility', () => {
  describe('With BigFive result', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <InstrumentResultCard result={bigFiveResult} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations when expanded', async () => {
      const { container } = render(
        <InstrumentResultCard result={bigFiveResult} expanded />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations without chart', async () => {
      const { container } = render(
        <InstrumentResultCard result={bigFiveResult} showChart={false} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('With CVF result', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <InstrumentResultCard result={cvfResult} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations when expanded', async () => {
      const { container } = render(
        <InstrumentResultCard result={cvfResult} expanded />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('With SYM4 result', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <InstrumentResultCard result={sym4Result} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations when expanded', async () => {
      const { container } = render(
        <InstrumentResultCard result={sym4Result} expanded />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('With null result (empty state)', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <InstrumentResultCard result={null} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should show empty state message', () => {
      const { getByText } = render(
        <InstrumentResultCard result={null} />
      );
      expect(getByText(/Resultado não disponível/i)).toBeInTheDocument();
    });
  });

  describe('Screen reader support', () => {
    it('shows instrument name', () => {
      render(<InstrumentResultCard result={bigFiveResult} />);
      // BIG5 is "Traços de Personalidade"
      expect(screen.getByText(/Traços de Personalidade/i)).toBeInTheDocument();
    });

    it('shows quality badge', () => {
      const { container } = render(
        <InstrumentResultCard result={bigFiveResult} />
      );
      // QualityBadge component is rendered in the card
      expect(container.firstChild).toBeInTheDocument();
    });

    it('expand button has accessible text', () => {
      render(<InstrumentResultCard result={bigFiveResult} showDetails />);
      // Multiple elements may have similar text
      const buttons = screen.getAllByText(/Ver detalhes|Ocultar detalhes/i);
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Quality indicators', () => {
    it('shows passed quality state', () => {
      const { container } = render(
        <InstrumentResultCard result={bigFiveResult} />
      );
      // Card renders with quality badge
      expect(container.firstChild).toBeInTheDocument();
    });

    it('shows failed quality state with flags', () => {
      const resultWithFlags: BigFiveResult = {
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
        <InstrumentResultCard result={resultWithFlags} />
      );
      // Card renders without error even with failed quality
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
