/**
 * ScoreCard Accessibility Tests
 *
 * Tests WCAG 2.1 AA compliance for the ScoreCard component.
 * Uses jest-axe for automated accessibility testing.
 */
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ScoreCard } from '../ScoreCard';

expect.extend(toHaveNoViolations);

describe('ScoreCard Accessibility', () => {
  const defaultProps = {
    dimension: 'extraversion',
    score: 75,
  };

  describe('Automated a11y checks', () => {
    it('should have no accessibility violations with default props', async () => {
      const { container } = render(<ScoreCard {...defaultProps} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with classification', async () => {
      const { container } = render(
        <ScoreCard {...defaultProps} classification="HIGH" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with all classifications', async () => {
      const classifications = ['VERY_LOW', 'LOW', 'HIGH', 'VERY_HIGH'] as const;

      for (const classification of classifications) {
        const { container } = render(
          <ScoreCard {...defaultProps} classification={classification} />
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      }
    });

    it('should have no violations with description', async () => {
      const { container } = render(
        <ScoreCard
          {...defaultProps}
          description="You tend to be outgoing and social."
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with previousScore (trend)', async () => {
      const { container } = render(
        <ScoreCard {...defaultProps} previousScore={65} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations in compact variant', async () => {
      const { container } = render(
        <ScoreCard {...defaultProps} variant="compact" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with null score (empty state)', async () => {
      const { container } = render(
        <ScoreCard {...defaultProps} score={null} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Semantic structure', () => {
    it('should use proper heading hierarchy for dimension', () => {
      render(<ScoreCard {...defaultProps} />);
      const heading = screen.getByRole('heading', { level: 4 });
      expect(heading).toHaveTextContent('Sociabilidade');
    });

    it('should have readable score with proper contrast', () => {
      render(<ScoreCard {...defaultProps} />);
      const score = screen.getByText('75');
      expect(score).toBeInTheDocument();
      // Score should be visually prominent
      expect(score).toHaveClass('text-3xl', 'font-bold');
    });

    it('should provide context for trend changes', () => {
      render(<ScoreCard {...defaultProps} previousScore={65} />);
      // Change indicator should be present
      const changeText = screen.getByText('+10');
      expect(changeText).toBeInTheDocument();
    });
  });

  describe('Visual hierarchy', () => {
    it('should display information in correct hierarchy order', () => {
      render(
        <ScoreCard
          {...defaultProps}
          classification="HIGH"
          previousScore={65}
          description="Test description"
        />
      );

      // All elements should be present in visual hierarchy order:
      // 1. Dimension (heading)
      // 2. Score (large number)
      // 3. Classification
      // 4. Trend
      expect(screen.getByRole('heading', { level: 4 })).toBeInTheDocument();
      expect(screen.getByText('75')).toBeInTheDocument();
      expect(screen.getByText('Alto')).toBeInTheDocument();
      expect(screen.getByText('+10')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
    });
  });

  describe('Empty state accessibility', () => {
    it('should indicate unavailable data accessibly', () => {
      render(<ScoreCard {...defaultProps} score={null} />);
      // Empty state should have an accessible label
      const emptyState = screen.getByRole('status');
      expect(emptyState).toBeInTheDocument();
    });
  });

  describe('Color contrast', () => {
    it('classification text should have semantic color classes', () => {
      render(<ScoreCard {...defaultProps} classification="HIGH" />);
      const classification = screen.getByText('Alto');
      // Using brand colors that meet WCAG AA contrast requirements
      expect(classification).toHaveClass('text-synmind-orange-400');
    });

    it('trend positive should use accessible green', () => {
      render(<ScoreCard {...defaultProps} previousScore={65} />);
      const changeElement = screen.getByText('+10').parentElement;
      expect(changeElement).toHaveClass('text-emerald-500');
    });

    it('trend negative should use accessible red', () => {
      render(<ScoreCard {...defaultProps} score={60} previousScore={75} />);
      const changeElement = screen.getByText('-15').parentElement;
      expect(changeElement).toHaveClass('text-red-500');
    });
  });

  describe('Compact variant accessibility', () => {
    it('should have no violations in compact variant with all props', async () => {
      const { container } = render(
        <ScoreCard
          {...defaultProps}
          variant="compact"
          classification="HIGH"
          previousScore={65}
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should maintain readable score in compact variant', () => {
      render(<ScoreCard {...defaultProps} variant="compact" />);
      const score = screen.getByText('75');
      expect(score).toBeInTheDocument();
      // Compact still needs legible score
      expect(score).toHaveClass('font-bold');
    });
  });
});
