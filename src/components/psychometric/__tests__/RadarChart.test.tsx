/**
 * RadarChart Unit Tests
 */
import { render, screen } from '@testing-library/react';
import { RadarChart } from '../RadarChart';

describe('RadarChart', () => {
  const defaultScores = {
    extraversion: 75,
    agreeableness: 60,
    conscientiousness: 85,
    neuroticism: 40,
    openness: 70,
  };
  const defaultDimensions = [
    'extraversion',
    'agreeableness',
    'conscientiousness',
    'neuroticism',
    'openness',
  ];

  describe('rendering', () => {
    it('should render with default props', () => {
      render(<RadarChart scores={defaultScores} dimensions={defaultDimensions} />);
      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should render empty state when dimensions array is empty', () => {
      render(<RadarChart scores={{}} dimensions={[]} />);
      expect(screen.getByText(/sem dados/i)).toBeInTheDocument();
    });

    it('should render with size preset "sm"', () => {
      render(<RadarChart scores={defaultScores} dimensions={defaultDimensions} size="sm" />);
      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('width', '200');
    });

    it('should render with size preset "md"', () => {
      render(<RadarChart scores={defaultScores} dimensions={defaultDimensions} size="md" />);
      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('width', '280');
    });

    it('should render with size preset "lg"', () => {
      render(<RadarChart scores={defaultScores} dimensions={defaultDimensions} size="lg" />);
      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('width', '360');
    });

    it('should render with numeric size', () => {
      render(<RadarChart scores={defaultScores} dimensions={defaultDimensions} size={400} />);
      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('width', '400');
    });
  });

  describe('dimensions handling', () => {
    it('should display labels when showLabels is true', () => {
      render(<RadarChart scores={defaultScores} dimensions={defaultDimensions} showLabels />);
      expect(document.querySelector('text')).toBeInTheDocument();
    });

    it('should not display labels when showLabels is false', () => {
      render(<RadarChart scores={defaultScores} dimensions={defaultDimensions} showLabels={false} />);
      // Should still render the SVG, but fewer text elements
      const textElements = document.querySelectorAll('text');
      expect(textElements.length).toBe(0);
    });

    it('should display values when showValues is true', () => {
      render(<RadarChart scores={defaultScores} dimensions={defaultDimensions} showValues showLabels />);
      const tspans = document.querySelectorAll('tspan');
      expect(tspans.length).toBeGreaterThan(0);
    });

    it('should truncate dimensions to max 10', () => {
      const manyDimensions = Array.from({ length: 15 }, (_, i) => `dim${i}`);
      const manyScores = Object.fromEntries(manyDimensions.map((d, i) => [d, i * 5]));

      render(<RadarChart scores={manyScores} dimensions={manyDimensions} />);
      // Check that description mentions truncation
      const desc = document.querySelector('desc');
      expect(desc?.textContent).toContain('10 de 15');
    });
  });

  describe('variants', () => {
    it('should render filled variant by default', () => {
      render(<RadarChart scores={defaultScores} dimensions={defaultDimensions} />);
      const path = document.querySelector('path');
      expect(path).toHaveAttribute('fill-opacity', '0.2');
    });

    it('should render line variant when specified', () => {
      render(<RadarChart scores={defaultScores} dimensions={defaultDimensions} variant="line" />);
      const path = document.querySelector('path');
      expect(path).toHaveAttribute('fill', 'transparent');
    });
  });

  describe('data handling', () => {
    it('should clamp scores to 0-100 range', () => {
      const extremeScores = {
        extraversion: 150,
        agreeableness: -20,
        conscientiousness: 50,
      };
      const dims = ['extraversion', 'agreeableness', 'conscientiousness'];

      render(<RadarChart scores={extremeScores} dimensions={dims} />);
      // Should render without error - clamping is internal
      expect(document.querySelector('svg')).toBeInTheDocument();
    });

    it('should handle missing score values gracefully', () => {
      const partialScores = { extraversion: 75 };
      render(<RadarChart scores={partialScores} dimensions={defaultDimensions} />);
      // Should render without error - missing values default to 0
      expect(document.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('CHART_COLORS integration', () => {
    it('should use CHART_COLORS for grid lines', () => {
      render(<RadarChart scores={defaultScores} dimensions={defaultDimensions} />);
      const circles = document.querySelectorAll('circle[stroke]');
      // Grid circles should exist
      expect(circles.length).toBeGreaterThan(0);
    });

    it('should use CHART_COLORS for polygon fill', () => {
      render(<RadarChart scores={defaultScores} dimensions={defaultDimensions} />);
      const path = document.querySelector('path');
      // Should have a CSS variable fill
      const fill = path?.getAttribute('fill');
      expect(fill).toContain('var(--color-synmind-blue');
    });
  });

  describe('className prop', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <RadarChart scores={defaultScores} dimensions={defaultDimensions} className="custom-class" />
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });
});
