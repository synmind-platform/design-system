/**
 * RadarChart Accessibility Tests
 *
 * Tests WCAG 2.1 AA compliance for the RadarChart component.
 * Uses jest-axe for automated accessibility testing.
 */
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { RadarChart } from '../RadarChart';

expect.extend(toHaveNoViolations);

describe('RadarChart Accessibility', () => {
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

  it('should have no accessibility violations with default props', async () => {
    const { container } = render(
      <RadarChart scores={defaultScores} dimensions={defaultDimensions} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper ARIA attributes on SVG', () => {
    const { container } = render(
      <RadarChart scores={defaultScores} dimensions={defaultDimensions} />
    );

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('role', 'img');
    expect(svg).toHaveAttribute('aria-labelledby');
  });

  it('should have accessible title and description', () => {
    const { container } = render(
      <RadarChart scores={defaultScores} dimensions={defaultDimensions} />
    );

    const title = container.querySelector('title');
    const desc = container.querySelector('desc');

    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent(/gráfico radar/i);

    expect(desc).toBeInTheDocument();
    expect(desc).toHaveTextContent(/dimensões/i);
    // Description should include dimension values
    expect(desc).toHaveTextContent(/75/);
  });

  it('should have no violations with variant="line"', async () => {
    const { container } = render(
      <RadarChart
        scores={defaultScores}
        dimensions={defaultDimensions}
        variant="line"
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no violations with showValues enabled', async () => {
    const { container } = render(
      <RadarChart
        scores={defaultScores}
        dimensions={defaultDimensions}
        showValues
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no violations without labels', async () => {
    const { container } = render(
      <RadarChart
        scores={defaultScores}
        dimensions={defaultDimensions}
        showLabels={false}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no violations with different sizes', async () => {
    const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

    for (const size of sizes) {
      const { container } = render(
        <RadarChart
          scores={defaultScores}
          dimensions={defaultDimensions}
          size={size}
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  });

  it('should have no violations with empty state', async () => {
    const { container } = render(
      <RadarChart scores={{}} dimensions={[]} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should include dimension labels in description', () => {
    const { container } = render(
      <RadarChart scores={defaultScores} dimensions={defaultDimensions} />
    );

    const desc = container.querySelector('desc');
    expect(desc).toHaveTextContent(/sociabilidade/i); // extraversion label
  });
});
