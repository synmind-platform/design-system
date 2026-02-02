import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { RadarChart } from '../RadarChart';
import { ProfileChart } from '../ProfileChart';
import { CVFQuadrantChart } from '../CVFQuadrantChart';

describe('Charts Responsive Behavior', () => {
  describe('RadarChart', () => {
    const defaultProps = {
      scores: {
        extraversion: 70,
        agreeableness: 60,
        conscientiousness: 80,
        neuroticism: 40,
        openness: 75,
      },
      dimensions: [
        'extraversion',
        'agreeableness',
        'conscientiousness',
        'neuroticism',
        'openness',
      ],
    };

    it('renders with size="sm"', () => {
      const { container } = render(<RadarChart {...defaultProps} size="sm" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '200');
    });

    it('renders with size="md"', () => {
      const { container } = render(<RadarChart {...defaultProps} size="md" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '280');
    });

    it('renders with size="lg"', () => {
      const { container } = render(<RadarChart {...defaultProps} size="lg" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '360');
    });

    it('renders with numeric size', () => {
      const { container } = render(<RadarChart {...defaultProps} size={300} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '300');
    });

    it('renders with size="responsive" using default md when no container', () => {
      const { container } = render(
        <RadarChart {...defaultProps} size="responsive" />
      );
      const svg = container.querySelector('svg');
      // Falls back to md (280) when container size is 0
      expect(svg).toHaveAttribute('width', '280');
    });

    it('container has 100% width when size="responsive"', () => {
      const { container } = render(
        <RadarChart {...defaultProps} size="responsive" />
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.width).toBe('100%');
    });

    it('enforces minimum size', () => {
      const { container } = render(<RadarChart {...defaultProps} size={50} />);
      const svg = container.querySelector('svg');
      // Should enforce minimum of 200
      expect(Number(svg?.getAttribute('width'))).toBeGreaterThanOrEqual(200);
    });
  });

  describe('ProfileChart', () => {
    const defaultProps = {
      graphI: {
        assertive: 75,
        influential: 60,
        stable: 45,
        analytical: 70,
      },
    };

    it('renders with size="sm"', () => {
      const { container } = render(<ProfileChart {...defaultProps} size="sm" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '200');
    });

    it('renders with size="md"', () => {
      const { container } = render(<ProfileChart {...defaultProps} size="md" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '280');
    });

    it('renders with size="lg"', () => {
      const { container } = render(<ProfileChart {...defaultProps} size="lg" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '360');
    });

    it('renders with size="responsive" using default md when no container', () => {
      const { container } = render(
        <ProfileChart {...defaultProps} size="responsive" />
      );
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '280');
    });

    it('container has 100% width when size="responsive"', () => {
      const { container } = render(
        <ProfileChart {...defaultProps} size="responsive" />
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.width).toBe('100%');
    });

    it('diamond variant supports responsive size', () => {
      const { container } = render(
        <ProfileChart {...defaultProps} variant="diamond" size="responsive" />
      );
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '280');
    });
  });

  describe('CVFQuadrantChart', () => {
    const defaultProps = {
      perceived: {
        clan: 35,
        adhocracy: 25,
        market: 20,
        hierarchy: 20,
      },
    };

    it('renders with size="sm"', () => {
      const { container } = render(
        <CVFQuadrantChart {...defaultProps} size="sm" />
      );
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '200');
    });

    it('renders with size="md"', () => {
      const { container } = render(
        <CVFQuadrantChart {...defaultProps} size="md" />
      );
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '280');
    });

    it('renders with size="lg"', () => {
      const { container } = render(
        <CVFQuadrantChart {...defaultProps} size="lg" />
      );
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '360');
    });

    it('renders with size="responsive" using default md when no container', () => {
      const { container } = render(
        <CVFQuadrantChart {...defaultProps} size="responsive" />
      );
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '280');
    });

    it('container has 100% width when size="responsive"', () => {
      const { container } = render(
        <CVFQuadrantChart {...defaultProps} size="responsive" />
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.width).toBe('100%');
    });

    it('uses abbreviated labels for small sizes', () => {
      const { getByText, queryByText } = render(
        <CVFQuadrantChart {...defaultProps} size="sm" showLabels />
      );
      // At size=200, should use abbreviated labels
      expect(getByText('Cola')).toBeInTheDocument();
      expect(queryByText('Colaborativa')).not.toBeInTheDocument();
    });

    it('uses full labels for medium and larger sizes', () => {
      const { getByText, queryByText } = render(
        <CVFQuadrantChart {...defaultProps} size="md" showLabels />
      );
      // At size=280, should use full labels
      expect(getByText('Colaborativa')).toBeInTheDocument();
      expect(queryByText('Cola')).not.toBeInTheDocument();
    });
  });

  describe('Size Presets Consistency', () => {
    it('all charts use the same size values for presets', () => {
      const radarSm = render(
        <RadarChart
          scores={{ a: 50, b: 50, c: 50 }}
          dimensions={['a', 'b', 'c']}
          size="sm"
        />
      ).container.querySelector('svg');

      const profileSm = render(
        <ProfileChart
          graphI={{ assertive: 50, influential: 50, stable: 50, analytical: 50 }}
          variant="diamond"
          size="sm"
        />
      ).container.querySelector('svg');

      const cvfSm = render(
        <CVFQuadrantChart
          perceived={{ clan: 25, adhocracy: 25, market: 25, hierarchy: 25 }}
          size="sm"
        />
      ).container.querySelector('svg');

      expect(radarSm?.getAttribute('width')).toBe('200');
      expect(profileSm?.getAttribute('width')).toBe('200');
      expect(cvfSm?.getAttribute('width')).toBe('200');
    });
  });

  describe('Minimum Chart Size', () => {
    it('RadarChart enforces minimum 200px', () => {
      const { container } = render(
        <RadarChart
          scores={{ a: 50, b: 50, c: 50 }}
          dimensions={['a', 'b', 'c']}
          size={100}
        />
      );
      const svg = container.querySelector('svg');
      expect(Number(svg?.getAttribute('width'))).toBeGreaterThanOrEqual(200);
    });

    it('ProfileChart enforces minimum 200px', () => {
      const { container } = render(
        <ProfileChart
          graphI={{ assertive: 50, influential: 50, stable: 50, analytical: 50 }}
          size={100}
        />
      );
      const svg = container.querySelector('svg');
      expect(Number(svg?.getAttribute('width'))).toBeGreaterThanOrEqual(200);
    });

    it('CVFQuadrantChart enforces minimum 200px', () => {
      const { container } = render(
        <CVFQuadrantChart
          perceived={{ clan: 25, adhocracy: 25, market: 25, hierarchy: 25 }}
          size={100}
        />
      );
      const svg = container.querySelector('svg');
      expect(Number(svg?.getAttribute('width'))).toBeGreaterThanOrEqual(200);
    });
  });
});
