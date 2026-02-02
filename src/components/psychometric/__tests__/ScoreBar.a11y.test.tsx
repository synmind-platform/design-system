/**
 * ScoreBar Accessibility Tests
 *
 * Tests WCAG 2.1 AA compliance for the ScoreBar component.
 * Uses jest-axe for automated accessibility testing.
 */
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ScoreBar } from '../ScoreBar';

expect.extend(toHaveNoViolations);

describe('ScoreBar Accessibility', () => {
  describe('Automated a11y checks', () => {
    it('should have no accessibility violations with default props', async () => {
      const { container } = render(<ScoreBar value={75} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with label', async () => {
      const { container } = render(<ScoreBar value={75} label="Extraversão" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with all classifications', async () => {
      const classifications = ['VERY_LOW', 'LOW', 'HIGH', 'VERY_HIGH'] as const;

      for (const classification of classifications) {
        const { container } = render(
          <ScoreBar value={75} classification={classification} />
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      }
    });

    it('should have no violations with all variants', async () => {
      const variants = ['default', 'gradient', 'segmented'] as const;

      for (const variant of variants) {
        const { container } = render(<ScoreBar value={75} variant={variant} />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      }
    });

    it('should have no violations with all sizes', async () => {
      const sizes = ['sm', 'md', 'lg'] as const;

      for (const size of sizes) {
        const { container } = render(<ScoreBar value={75} size={size} />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      }
    });

    it('should have no violations without showValue', async () => {
      const { container } = render(<ScoreBar value={75} showValue={false} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with null value (empty state)', async () => {
      const { container } = render(<ScoreBar value={null} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('ARIA attributes', () => {
    it('should have progressbar role', () => {
      render(<ScoreBar value={75} />);
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toBeInTheDocument();
    });

    it('should have correct aria-valuenow', () => {
      render(<ScoreBar value={75} />);
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toHaveAttribute('aria-valuenow', '75');
    });

    it('should have aria-valuemin and aria-valuemax', () => {
      render(<ScoreBar value={75} />);
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toHaveAttribute('aria-valuemin', '0');
      expect(progressbar).toHaveAttribute('aria-valuemax', '100');
    });

    it('should have aria-label with dimension', () => {
      render(<ScoreBar value={75} label="Extraversão" />);
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toHaveAttribute(
        'aria-label',
        expect.stringContaining('Extraversão')
      );
    });
  });

  describe('Empty state accessibility', () => {
    it('should indicate unavailable data when value is null', () => {
      render(<ScoreBar value={null} label="Extraversão" />);
      // Should show empty indicator
      expect(screen.getByText('-')).toBeInTheDocument();
    });

    it('should have accessible empty state', () => {
      render(<ScoreBar value={null} />);
      const progressbar = screen.queryByRole('progressbar');
      // When null, aria-valuenow should be undefined or show empty state
      if (progressbar) {
        expect(progressbar).not.toHaveAttribute('aria-valuenow');
      }
    });
  });

  describe('Visual indicators', () => {
    it('should display value when showValue is true', () => {
      render(<ScoreBar value={75} showValue={true} />);
      expect(screen.getByText('75')).toBeInTheDocument();
    });

    it('should display label when provided', () => {
      render(<ScoreBar value={75} label="Extraversão" />);
      expect(screen.getByText('Extraversão')).toBeInTheDocument();
    });

    it('should apply semantic colors for classifications', () => {
      const { container } = render(
        <ScoreBar value={75} classification="HIGH" />
      );
      // The progress bar should use the correct semantic color
      const bar = container.querySelector('.bg-synmind-orange-400');
      expect(bar).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should handle value at 0', async () => {
      const { container } = render(<ScoreBar value={0} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();

      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toHaveAttribute('aria-valuenow', '0');
    });

    it('should handle value at 100', async () => {
      const { container } = render(<ScoreBar value={100} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();

      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toHaveAttribute('aria-valuenow', '100');
    });

    it('should clamp values above 100', () => {
      render(<ScoreBar value={150} />);
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toHaveAttribute('aria-valuenow', '100');
    });

    it('should clamp values below 0', () => {
      render(<ScoreBar value={-10} />);
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toHaveAttribute('aria-valuenow', '0');
    });
  });
});
