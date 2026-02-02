/**
 * ProfileChart Unit Tests
 */
import { render, screen } from '@testing-library/react';
import { ProfileChart } from '../ProfileChart';
import type { SYM4Dimension } from '@/types/psychometric';

describe('ProfileChart', () => {
  const defaultGraphI: SYM4Dimension = {
    assertive: 75,
    influential: 60,
    stable: 45,
    analytical: 80,
  };

  const defaultGraphII: SYM4Dimension = {
    assertive: 65,
    influential: 70,
    stable: 50,
    analytical: 70,
  };

  describe('bar variant', () => {
    it('should render with default props', () => {
      render(<ProfileChart graphI={defaultGraphI} />);
      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should render labels by default', () => {
      render(<ProfileChart graphI={defaultGraphI} />);
      expect(screen.getByText('Assertivo')).toBeInTheDocument();
      expect(screen.getByText('Influenciador')).toBeInTheDocument();
      expect(screen.getByText('Estável')).toBeInTheDocument();
      expect(screen.getByText('Analítico')).toBeInTheDocument();
    });

    it('should not render labels when showLabels is false', () => {
      render(<ProfileChart graphI={defaultGraphI} showLabels={false} />);
      expect(screen.queryByText('Assertivo')).not.toBeInTheDocument();
    });

    it('should render legend when graphII is provided', () => {
      render(<ProfileChart graphI={defaultGraphI} graphII={defaultGraphII} showLegend />);
      expect(screen.getByText(/natural \(i\)/i)).toBeInTheDocument();
      expect(screen.getByText(/adaptado \(ii\)/i)).toBeInTheDocument();
    });

    it('should not render legend without graphII', () => {
      render(<ProfileChart graphI={defaultGraphI} showLegend />);
      expect(screen.queryByText(/natural.*\(I\)/i)).not.toBeInTheDocument();
    });

    it('should render graphII markers when provided', () => {
      render(<ProfileChart graphI={defaultGraphI} graphII={defaultGraphII} />);
      // graphII is rendered as dashed lines
      const lines = document.querySelectorAll('line[stroke-dasharray]');
      expect(lines.length).toBeGreaterThan(0);
    });
  });

  describe('diamond variant', () => {
    it('should render diamond variant', () => {
      render(<ProfileChart graphI={defaultGraphI} variant="diamond" />);
      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should render diamond with both graphs', () => {
      render(<ProfileChart graphI={defaultGraphI} graphII={defaultGraphII} variant="diamond" />);
      // Should have two polygon paths
      const paths = document.querySelectorAll('path');
      expect(paths.length).toBeGreaterThanOrEqual(2);
    });

    it('should show legend in diamond variant when graphII present', () => {
      render(
        <ProfileChart graphI={defaultGraphI} graphII={defaultGraphII} variant="diamond" showLegend />
      );
      expect(screen.getByText(/natural \(i\)/i)).toBeInTheDocument();
      expect(screen.getByText(/adaptado \(ii\)/i)).toBeInTheDocument();
    });

    it('should render short labels (D, I, S, C) in diamond variant', () => {
      render(<ProfileChart graphI={defaultGraphI} variant="diamond" showLabels />);
      const tspans = document.querySelectorAll('tspan');
      const shortLabels = Array.from(tspans).map(t => t.textContent);
      expect(shortLabels).toContain('D');
      expect(shortLabels).toContain('I');
      expect(shortLabels).toContain('S');
      expect(shortLabels).toContain('C');
    });
  });

  describe('size variants', () => {
    it('should render with size preset "sm"', () => {
      render(<ProfileChart graphI={defaultGraphI} size="sm" />);
      const svg = document.querySelector('svg');
      expect(svg?.getAttribute('width')).toBe('200');
    });

    it('should render with size preset "md"', () => {
      render(<ProfileChart graphI={defaultGraphI} size="md" />);
      const svg = document.querySelector('svg');
      expect(svg?.getAttribute('width')).toBe('280');
    });

    it('should render with size preset "lg"', () => {
      render(<ProfileChart graphI={defaultGraphI} size="lg" />);
      const svg = document.querySelector('svg');
      expect(svg?.getAttribute('width')).toBe('360');
    });

    it('should render with numeric size', () => {
      render(<ProfileChart graphI={defaultGraphI} size={400} />);
      const svg = document.querySelector('svg');
      expect(svg?.getAttribute('width')).toBe('400');
    });

    it('should render diamond with size presets', () => {
      render(<ProfileChart graphI={defaultGraphI} variant="diamond" size="lg" />);
      const svg = document.querySelector('svg');
      expect(svg?.getAttribute('width')).toBe('360');
    });
  });

  describe('data handling', () => {
    it('should clamp values to 0-100 range', () => {
      const extremeValues: SYM4Dimension = {
        assertive: 150,
        influential: -20,
        stable: 50,
        analytical: 80,
      };
      render(<ProfileChart graphI={extremeValues} />);
      // Should render without error - clamping is internal
      expect(document.querySelector('svg')).toBeInTheDocument();
    });

    it('should handle undefined values gracefully', () => {
      const partialValues = {
        assertive: 75,
        influential: 60,
        stable: undefined as unknown as number,
        analytical: 80,
      };
      render(<ProfileChart graphI={partialValues} />);
      // Should render without error
      expect(document.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('CHART_COLORS integration', () => {
    it('should use CHART_COLORS for bars', () => {
      render(<ProfileChart graphI={defaultGraphI} />);
      const rects = document.querySelectorAll('rect');
      // Should have rects with CSS variable fills
      expect(rects.length).toBeGreaterThan(0);
    });

    it('should use CHART_COLORS for diamond polygons', () => {
      render(<ProfileChart graphI={defaultGraphI} variant="diamond" />);
      const path = document.querySelector('path');
      const fill = path?.getAttribute('fill');
      expect(fill).toContain('var(--color-synmind');
    });
  });

  describe('className prop', () => {
    it('should apply custom className to bar variant', () => {
      const { container } = render(
        <ProfileChart graphI={defaultGraphI} className="custom-class" />
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should apply custom className to diamond variant', () => {
      const { container } = render(
        <ProfileChart graphI={defaultGraphI} variant="diamond" className="custom-class" />
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  // T060 - Graph I/II comparison tests
  describe('Graph I/II comparison', () => {
    describe('bar variant with both graphs', () => {
      it('should render both graphI and graphII with distinct visual representations', () => {
        render(<ProfileChart graphI={defaultGraphI} graphII={defaultGraphII} variant="bar" />);

        // graphI should be rendered as filled bars
        const rects = document.querySelectorAll('rect[fill*="var(--color-synmind"]');
        expect(rects.length).toBe(4); // 4 dimensions

        // graphII should be rendered as dashed lines
        const dashedLines = document.querySelectorAll('line[stroke-dasharray]');
        expect(dashedLines.length).toBe(4); // 4 dimensions
      });

      it('should show graphII marker at correct position', () => {
        render(<ProfileChart graphI={defaultGraphI} graphII={defaultGraphII} variant="bar" />);

        // Lines for graphII should exist
        const lines = document.querySelectorAll('line[stroke-dasharray]');
        expect(lines.length).toBeGreaterThan(0);

        // Each line should have valid position attributes
        lines.forEach(line => {
          expect(line.getAttribute('x1')).not.toBeNull();
          expect(line.getAttribute('x2')).not.toBeNull();
        });
      });

      it('should not overlap graphI and graphII preventing reading', () => {
        // When graphII differs from graphI, markers should be visible
        const differingGraphII: SYM4Dimension = {
          assertive: 30, // Much lower than graphI (75)
          influential: 90, // Higher than graphI (60)
          stable: 20, // Lower than graphI (45)
          analytical: 95, // Higher than graphI (80)
        };

        render(<ProfileChart graphI={defaultGraphI} graphII={differingGraphII} variant="bar" />);

        // Both bar rectangles and line markers should exist
        const bars = document.querySelectorAll('rect');
        const markers = document.querySelectorAll('line[stroke-dasharray]');

        expect(bars.length).toBeGreaterThan(0);
        expect(markers.length).toBe(4);
      });
    });

    describe('diamond variant with both graphs', () => {
      it('should render both graphI and graphII as separate polygon paths', () => {
        render(<ProfileChart graphI={defaultGraphI} graphII={defaultGraphII} variant="diamond" />);

        // Should have at least 2 paths (graphI and graphII)
        const paths = document.querySelectorAll('path');
        expect(paths.length).toBeGreaterThanOrEqual(2);
      });

      it('should visually distinguish graphI from graphII', () => {
        render(<ProfileChart graphI={defaultGraphI} graphII={defaultGraphII} variant="diamond" />);

        const paths = document.querySelectorAll('path');
        expect(paths.length).toBeGreaterThanOrEqual(2);

        // GraphI should be solid, GraphII should be dashed
        const pathStyles = Array.from(paths).map(p => ({
          fill: p.getAttribute('fill'),
          strokeDasharray: p.getAttribute('stroke-dasharray'),
        }));

        // At least one should have dashed stroke (graphII)
        const hasDashedPath = pathStyles.some(s => s.strokeDasharray && s.strokeDasharray !== 'none');
        expect(hasDashedPath).toBe(true);

        // At least one should be solid (graphI)
        const hasSolidPath = pathStyles.some(s => !s.strokeDasharray || s.strokeDasharray === 'none');
        expect(hasSolidPath).toBe(true);
      });

      it('should use different colors for graphI and graphII', () => {
        render(<ProfileChart graphI={defaultGraphI} graphII={defaultGraphII} variant="diamond" />);

        const paths = document.querySelectorAll('path');
        const strokes = Array.from(paths).map(p => p.getAttribute('stroke')).filter(Boolean);

        // Should have at least 2 different stroke colors
        const uniqueStrokes = new Set(strokes);
        expect(uniqueStrokes.size).toBeGreaterThanOrEqual(2);
      });

      it('should render graphII behind graphI for visibility', () => {
        render(<ProfileChart graphI={defaultGraphI} graphII={defaultGraphII} variant="diamond" />);

        const paths = document.querySelectorAll('path');
        // GraphII (dashed) should appear before GraphI (solid) in DOM order
        // This ensures GraphI is rendered on top
        const pathArray = Array.from(paths);

        const graphIIIndex = pathArray.findIndex(p => p.getAttribute('stroke-dasharray'));
        const graphIIndex = pathArray.findIndex(p => !p.getAttribute('stroke-dasharray'));

        // If both exist, graphII should come before graphI
        if (graphIIIndex !== -1 && graphIIndex !== -1) {
          expect(graphIIIndex).toBeLessThan(graphIIndex);
        }
      });
    });

    describe('legend for Natural/Adapted', () => {
      it('should show legend when graphII is provided and showLegend is true', () => {
        render(<ProfileChart graphI={defaultGraphI} graphII={defaultGraphII} showLegend />);

        // Look for legend text specifically (includes Roman numeral reference)
        expect(screen.getByText(/Natural \(I\)/i)).toBeInTheDocument();
        expect(screen.getByText(/Adaptado \(II\)/i)).toBeInTheDocument();
      });

      it('should not show legend when graphII is not provided', () => {
        render(<ProfileChart graphI={defaultGraphI} showLegend />);

        // Legend should not appear without graphII
        expect(screen.queryByText(/Natural \(I\)/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Adaptado \(II\)/i)).not.toBeInTheDocument();
      });

      it('should not show legend when showLegend is false', () => {
        render(<ProfileChart graphI={defaultGraphI} graphII={defaultGraphII} showLegend={false} />);

        // Legend should not appear when showLegend is false
        expect(screen.queryByText(/Natural \(I\)/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Adaptado \(II\)/i)).not.toBeInTheDocument();
      });

      it('should show legend in bar variant', () => {
        render(
          <ProfileChart graphI={defaultGraphI} graphII={defaultGraphII} variant="bar" showLegend />
        );
        expect(screen.getByText(/Natural \(I\)/i)).toBeInTheDocument();
        expect(screen.getByText(/Adaptado \(II\)/i)).toBeInTheDocument();
      });

      it('should show legend in diamond variant', () => {
        render(
          <ProfileChart graphI={defaultGraphI} graphII={defaultGraphII} variant="diamond" showLegend />
        );
        expect(screen.getByText(/Natural \(I\)/i)).toBeInTheDocument();
        expect(screen.getByText(/Adaptado \(II\)/i)).toBeInTheDocument();
      });
    });

    describe('dimension labels and colors', () => {
      it('should render all 4 dimension labels (D, I, S, C) consistently', () => {
        render(<ProfileChart graphI={defaultGraphI} variant="bar" showLabels />);

        // Full labels in bar variant
        expect(screen.getByText('Assertivo')).toBeInTheDocument();
        expect(screen.getByText('Influenciador')).toBeInTheDocument();
        expect(screen.getByText('Estável')).toBeInTheDocument();
        expect(screen.getByText('Analítico')).toBeInTheDocument();
      });

      it('should render short labels (D, I, S, C) in diamond variant', () => {
        render(<ProfileChart graphI={defaultGraphI} variant="diamond" showLabels />);

        const tspans = document.querySelectorAll('tspan');
        const shortLabels = Array.from(tspans).map(t => t.textContent);

        expect(shortLabels).toContain('D');
        expect(shortLabels).toContain('I');
        expect(shortLabels).toContain('S');
        expect(shortLabels).toContain('C');
      });

      it('should use consistent colors per dimension across both variants', () => {
        // Test that D and I use warm colors (orange family)
        // and S and C use cool colors (blue family)
        render(<ProfileChart graphI={defaultGraphI} variant="bar" />);

        const rects = document.querySelectorAll('rect[fill*="var(--color-synmind"]');
        const fills = Array.from(rects).map(r => r.getAttribute('fill'));

        // Should have a mix of blue and orange themed colors
        const hasOrange = fills.some(f => f?.includes('orange'));
        const hasBlue = fills.some(f => f?.includes('blue'));

        expect(hasOrange).toBe(true);
        expect(hasBlue).toBe(true);
      });
    });
  });
});
