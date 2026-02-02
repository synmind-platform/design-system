/**
 * CVFQuadrantChart Accessibility Tests
 *
 * Tests WCAG 2.1 AA compliance for the CVFQuadrantChart component.
 * Uses jest-axe for automated accessibility testing.
 */
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { CVFQuadrantChart } from '../CVFQuadrantChart';
import type { CVFQuadrant } from '@/types/psychometric';

expect.extend(toHaveNoViolations);

describe('CVFQuadrantChart Accessibility', () => {
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

  it('should have no accessibility violations with default props', async () => {
    const { container } = render(
      <CVFQuadrantChart perceived={defaultPerceived} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper ARIA attributes on SVG', () => {
    const { container } = render(
      <CVFQuadrantChart perceived={defaultPerceived} />
    );

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('role', 'img');
    expect(svg).toHaveAttribute('aria-labelledby');
  });

  it('should have accessible title and description', () => {
    const { container } = render(
      <CVFQuadrantChart perceived={defaultPerceived} />
    );

    const title = container.querySelector('title');
    const desc = container.querySelector('desc');

    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent(/cultura/i);

    expect(desc).toBeInTheDocument();
    expect(desc).toHaveTextContent(/quadrantes/i);
  });

  it('should include quadrant values in description', () => {
    const { container } = render(
      <CVFQuadrantChart perceived={defaultPerceived} />
    );

    const desc = container.querySelector('desc');
    expect(desc).toHaveTextContent(/colaborativa/i); // clan label
    expect(desc).toHaveTextContent(/30/);
  });

  it('should have no violations with comparison data', async () => {
    const { container } = render(
      <CVFQuadrantChart perceived={defaultPerceived} values={defaultValues} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should include desired values in description when present', () => {
    const { container } = render(
      <CVFQuadrantChart perceived={defaultPerceived} values={defaultValues} />
    );

    const desc = container.querySelector('desc');
    expect(desc).toHaveTextContent(/desejada/i);
  });

  it('should have no violations with different sizes', async () => {
    const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

    for (const size of sizes) {
      const { container } = render(
        <CVFQuadrantChart perceived={defaultPerceived} size={size} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  });

  it('should have no violations without labels', async () => {
    const { container } = render(
      <CVFQuadrantChart perceived={defaultPerceived} showLabels={false} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should render quadrant labels when showLabels is true', () => {
    const { container } = render(
      <CVFQuadrantChart perceived={defaultPerceived} showLabels />
    );

    const text = container.textContent;
    expect(text).toContain('Colaborativa');
    expect(text).toContain('Inovadora');
    expect(text).toContain('Competitiva');
    expect(text).toContain('Estruturada');
  });

  it('should render legend when values are present and showLegend is true', () => {
    const { container } = render(
      <CVFQuadrantChart
        perceived={defaultPerceived}
        values={defaultValues}
        showLegend
      />
    );

    // Legend should be present with both labels
    const legendDiv = container.querySelector('.flex.items-center.gap-6');
    expect(legendDiv).toBeInTheDocument();
    expect(legendDiv?.textContent).toContain('Percebida');
    expect(legendDiv?.textContent).toContain('Desejada');
  });

  it('should not render legend without values', () => {
    const { container } = render(
      <CVFQuadrantChart perceived={defaultPerceived} showLegend />
    );

    // Legend div should not exist when no values are provided
    const legendDiv = container.querySelector('.flex.items-center.gap-6');
    expect(legendDiv).not.toBeInTheDocument();
  });

  it('should handle invalid data gracefully', async () => {
    const invalidPerceived = {
      clan: NaN,
      adhocracy: 25,
      market: 25,
      hierarchy: 20,
    };

    const { container, getByText } = render(
      <CVFQuadrantChart perceived={invalidPerceived} />
    );

    // Should show error state
    expect(getByText(/inválidos|incompletos/i)).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no violations with extreme values', async () => {
    const extremeValues: CVFQuadrant = {
      clan: 5, // Very low
      adhocracy: 95, // Very high
      market: 0,
      hierarchy: 100,
    };

    const { container } = render(
      <CVFQuadrantChart perceived={extremeValues} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
