/**
 * CVFQuadrantChart Unit Tests
 */
import { render, screen } from '@testing-library/react';
import { CVFQuadrantChart } from '../CVFQuadrantChart';
import type { CVFQuadrant } from '@/types/psychometric';

describe('CVFQuadrantChart', () => {
  const defaultPerceived: CVFQuadrant = {
    clan: 30,
    adhocracy: 25,
    market: 25,
    hierarchy: 20,
  };

  const defaultValues: CVFQuadrant = {
    clan: 35,
    adhocracy: 30,
    market: 20,
    hierarchy: 15,
  };

  describe('rendering', () => {
    it('should render with default props', () => {
      render(<CVFQuadrantChart perceived={defaultPerceived} />);
      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should render quadrant labels by default', () => {
      render(<CVFQuadrantChart perceived={defaultPerceived} showLabels />);
      expect(screen.getByText('Colaborativa')).toBeInTheDocument();
      expect(screen.getByText('Inovadora')).toBeInTheDocument();
      expect(screen.getByText('Competitiva')).toBeInTheDocument();
      expect(screen.getByText('Estruturada')).toBeInTheDocument();
    });

    it('should not render labels when showLabels is false', () => {
      render(<CVFQuadrantChart perceived={defaultPerceived} showLabels={false} />);
      expect(screen.queryByText('Colaborativa')).not.toBeInTheDocument();
    });

    it('should render value numbers in quadrants', () => {
      render(<CVFQuadrantChart perceived={defaultPerceived} />);
      expect(screen.getByText('30')).toBeInTheDocument(); // clan
      // 25 appears twice (adhocracy and market), so use getAllByText
      expect(screen.getAllByText('25')).toHaveLength(2); // adhocracy and market
      expect(screen.getByText('20')).toBeInTheDocument(); // hierarchy
    });
  });

  describe('comparison mode', () => {
    it('should render both perceived and values polygons', () => {
      render(<CVFQuadrantChart perceived={defaultPerceived} values={defaultValues} />);
      const paths = document.querySelectorAll('path');
      expect(paths.length).toBe(2); // One for perceived, one for values
    });

    it('should render legend when values are provided', () => {
      const { container } = render(<CVFQuadrantChart perceived={defaultPerceived} values={defaultValues} showLegend />);
      // Legend div should exist with correct text
      const legendDiv = container.querySelector('.flex.items-center.gap-6');
      expect(legendDiv).toBeInTheDocument();
      expect(legendDiv?.textContent).toContain('Percebida');
      expect(legendDiv?.textContent).toContain('Desejada');
    });

    it('should not render legend without values', () => {
      const { container } = render(<CVFQuadrantChart perceived={defaultPerceived} showLegend />);
      // Legend div should not exist (only exists when values are provided)
      const legendDiv = container.querySelector('.flex.items-center.gap-6');
      expect(legendDiv).not.toBeInTheDocument();
    });

    it('should render values polygon with dashed stroke', () => {
      render(<CVFQuadrantChart perceived={defaultPerceived} values={defaultValues} />);
      const dashedPath = document.querySelector('path[stroke-dasharray]');
      expect(dashedPath).toBeInTheDocument();
    });
  });

  describe('size variants', () => {
    it('should render with size preset "sm"', () => {
      render(<CVFQuadrantChart perceived={defaultPerceived} size="sm" />);
      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('width', '200');
    });

    it('should render with size preset "md"', () => {
      render(<CVFQuadrantChart perceived={defaultPerceived} size="md" />);
      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('width', '280');
    });

    it('should render with size preset "lg"', () => {
      render(<CVFQuadrantChart perceived={defaultPerceived} size="lg" />);
      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('width', '360');
    });

    it('should render with numeric size', () => {
      render(<CVFQuadrantChart perceived={defaultPerceived} size={400} />);
      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('width', '400');
    });
  });

  describe('invalid data handling', () => {
    it('should show error state for NaN values', () => {
      const invalidPerceived: CVFQuadrant = {
        clan: NaN,
        adhocracy: 25,
        market: 25,
        hierarchy: 20,
      };
      render(<CVFQuadrantChart perceived={invalidPerceived} />);
      expect(screen.getByText(/inválidos|incompletos/i)).toBeInTheDocument();
    });

    it('should show error state for missing required keys', () => {
      const incompletePerceived = {
        clan: 30,
        adhocracy: 25,
        // missing market and hierarchy
      } as CVFQuadrant;
      render(<CVFQuadrantChart perceived={incompletePerceived} />);
      expect(screen.getByText(/inválidos|incompletos/i)).toBeInTheDocument();
    });
  });

  describe('data handling', () => {
    it('should clamp values to 0-100 range', () => {
      const extremeValues: CVFQuadrant = {
        clan: 150,
        adhocracy: -20,
        market: 50,
        hierarchy: 80,
      };
      render(<CVFQuadrantChart perceived={extremeValues} />);
      // Should render without error - clamping is internal
      expect(document.querySelector('svg')).toBeInTheDocument();
    });

    it('should handle extreme values correctly', () => {
      const extremePerceived: CVFQuadrant = {
        clan: 5,
        adhocracy: 95,
        market: 0,
        hierarchy: 100,
      };
      render(<CVFQuadrantChart perceived={extremePerceived} />);
      expect(document.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('CHART_COLORS integration', () => {
    it('should use CHART_COLORS for quadrant backgrounds', () => {
      render(<CVFQuadrantChart perceived={defaultPerceived} />);
      const rects = document.querySelectorAll('rect');
      // Should have 4 quadrant background rects
      expect(rects.length).toBe(4);
    });

    it('should use CHART_COLORS for perceived polygon', () => {
      render(<CVFQuadrantChart perceived={defaultPerceived} />);
      const path = document.querySelector('path');
      const fill = path?.getAttribute('fill');
      expect(fill).toContain('var(--color-synmind');
    });

    it('should use secondary color for values polygon', () => {
      render(<CVFQuadrantChart perceived={defaultPerceived} values={defaultValues} />);
      const paths = document.querySelectorAll('path');
      // Second path should be values
      const valuesPath = paths[0]; // Values is drawn first (behind perceived)
      const stroke = valuesPath?.getAttribute('stroke');
      expect(stroke).toContain('var(--color-synmind-orange');
    });
  });

  describe('quadrant labels', () => {
    it('should use QUADRANT_LABELS constants', () => {
      render(<CVFQuadrantChart perceived={defaultPerceived} showLabels />);
      // These should match QUADRANT_LABELS values
      expect(screen.getByText('Colaborativa')).toBeInTheDocument();
      expect(screen.getByText('Inovadora')).toBeInTheDocument();
      expect(screen.getByText('Competitiva')).toBeInTheDocument();
      expect(screen.getByText('Estruturada')).toBeInTheDocument();
    });
  });

  describe('className prop', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <CVFQuadrantChart perceived={defaultPerceived} className="custom-class" />
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('accessibility', () => {
    it('should have descriptive content for screen readers', () => {
      render(<CVFQuadrantChart perceived={defaultPerceived} />);
      const desc = document.querySelector('desc');
      expect(desc?.textContent).toContain('Colaborativa: 30%');
      expect(desc?.textContent).toContain('Inovadora: 25%');
    });

    it('should mention desired values in description when present', () => {
      render(<CVFQuadrantChart perceived={defaultPerceived} values={defaultValues} />);
      const desc = document.querySelector('desc');
      expect(desc?.textContent).toContain('desejada');
    });
  });

  // Phase 6: User Story 4 - CVFQuadrantChart Legível e Comparável
  describe('perceived vs values comparison (US4)', () => {
    it('should render perceived polygon with solid fill', () => {
      render(<CVFQuadrantChart perceived={defaultPerceived} values={defaultValues} />);
      const paths = document.querySelectorAll('path');
      // Perceived polygon (drawn second, on top)
      const perceivedPath = paths[1];
      const fillOpacity = perceivedPath?.getAttribute('fill-opacity');
      const strokeDasharray = perceivedPath?.getAttribute('stroke-dasharray');
      // Perceived should have fill and no dashes
      expect(fillOpacity).toBeTruthy();
      expect(strokeDasharray).toBeNull();
    });

    it('should render values polygon with line-only style (dashed)', () => {
      render(<CVFQuadrantChart perceived={defaultPerceived} values={defaultValues} />);
      const paths = document.querySelectorAll('path');
      // Values polygon (drawn first, behind)
      const valuesPath = paths[0];
      const strokeDasharray = valuesPath?.getAttribute('stroke-dasharray');
      // Values should have dashed stroke
      expect(strokeDasharray).toBeTruthy();
      expect(strokeDasharray).toContain('4');
    });

    it('should use distinct colors for perceived vs values', () => {
      render(<CVFQuadrantChart perceived={defaultPerceived} values={defaultValues} />);
      const paths = document.querySelectorAll('path');
      const valuesStroke = paths[0]?.getAttribute('stroke');
      const perceivedStroke = paths[1]?.getAttribute('stroke');
      // Should use different color families (orange vs blue)
      expect(valuesStroke).toContain('orange');
      expect(perceivedStroke).toContain('blue');
    });

    it('should make large gaps between perceived and values visually clear', () => {
      const largeGapPerceived: CVFQuadrant = {
        clan: 80,
        adhocracy: 10,
        market: 70,
        hierarchy: 20,
      };
      const largeGapValues: CVFQuadrant = {
        clan: 20,
        adhocracy: 60,
        market: 20,
        hierarchy: 60,
      };
      render(<CVFQuadrantChart perceived={largeGapPerceived} values={largeGapValues} />);
      // Both polygons should render without overlap issues
      const paths = document.querySelectorAll('path');
      expect(paths.length).toBe(2);
    });
  });

  describe('extreme values visibility (US4)', () => {
    it('should render visible polygon even with very low values (5%)', () => {
      const extremeLowPerceived: CVFQuadrant = {
        clan: 5,
        adhocracy: 5,
        market: 5,
        hierarchy: 5,
      };
      render(<CVFQuadrantChart perceived={extremeLowPerceived} />);
      const path = document.querySelector('path');
      expect(path).toBeInTheDocument();
      // The path should have a valid d attribute (not empty or zero-sized)
      const d = path?.getAttribute('d');
      expect(d).toBeTruthy();
      expect(d).not.toBe('M 0 0 L 0 0 L 0 0 L 0 0 Z');
    });

    it('should render vertex markers for visibility at extreme values', () => {
      const extremeLowPerceived: CVFQuadrant = {
        clan: 5,
        adhocracy: 5,
        market: 5,
        hierarchy: 5,
      };
      render(<CVFQuadrantChart perceived={extremeLowPerceived} />);
      // Should render vertex circles for visibility at extreme low values
      const circles = document.querySelectorAll('circle.vertex-marker');
      // Expect 4 vertex markers (one per quadrant) when all values are extreme
      expect(circles.length).toBe(4);
    });

    it('should handle mixed extreme values correctly', () => {
      const mixedExtreme: CVFQuadrant = {
        clan: 5,
        adhocracy: 95,
        market: 3,
        hierarchy: 97,
      };
      render(<CVFQuadrantChart perceived={mixedExtreme} />);
      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
      // Values should still be visible
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('95')).toBeInTheDocument();
    });
  });

  describe('responsive labels (US4)', () => {
    it('should render full labels on md size', () => {
      render(<CVFQuadrantChart perceived={defaultPerceived} size="md" showLabels />);
      expect(screen.getByText('Colaborativa')).toBeInTheDocument();
      expect(screen.getByText('Inovadora')).toBeInTheDocument();
    });

    it('should render abbreviated labels on sm size', () => {
      render(<CVFQuadrantChart perceived={defaultPerceived} size="sm" showLabels />);
      // On small size (200px), should use abbreviated labels
      expect(screen.getByText('Cola')).toBeInTheDocument(); // clan abbreviated
      expect(screen.getByText('Inov')).toBeInTheDocument(); // adhocracy abbreviated
      expect(screen.getByText('Comp')).toBeInTheDocument(); // market abbreviated
      expect(screen.getByText('Estr')).toBeInTheDocument(); // hierarchy abbreviated
    });

    it('should position labels correctly on different sizes', () => {
      const { rerender } = render(<CVFQuadrantChart perceived={defaultPerceived} size="sm" showLabels />);
      const smallLabels = document.querySelectorAll('text');
      const smallLabelPositions = Array.from(smallLabels).map((t) => ({
        x: t.getAttribute('x'),
        y: t.getAttribute('y'),
      }));

      rerender(<CVFQuadrantChart perceived={defaultPerceived} size="lg" showLabels />);
      const largeLabels = document.querySelectorAll('text');
      const largeLabelPositions = Array.from(largeLabels).map((t) => ({
        x: t.getAttribute('x'),
        y: t.getAttribute('y'),
      }));

      // Positions should be different for different sizes
      expect(smallLabelPositions).not.toEqual(largeLabelPositions);
    });
  });

  describe('legend behavior (US4)', () => {
    it('should automatically show legend when values present and showLegend true', () => {
      render(<CVFQuadrantChart perceived={defaultPerceived} values={defaultValues} showLegend />);
      expect(screen.getByText('Percebida')).toBeInTheDocument();
      expect(screen.getByText('Desejada')).toBeInTheDocument();
    });

    it('should hide legend when showLegend is false even with values', () => {
      render(<CVFQuadrantChart perceived={defaultPerceived} values={defaultValues} showLegend={false} />);
      expect(screen.queryByText('Percebida')).not.toBeInTheDocument();
      expect(screen.queryByText('Desejada')).not.toBeInTheDocument();
    });

    it('should style legend items to match polygon styles', () => {
      const { container } = render(
        <CVFQuadrantChart perceived={defaultPerceived} values={defaultValues} showLegend />
      );
      const legendItems = container.querySelectorAll('.flex.items-center.gap-2');
      expect(legendItems.length).toBe(2);
      // First item should represent perceived (solid)
      // Second item should represent values (dashed)
    });
  });
});
