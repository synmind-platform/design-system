import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ScoreBar } from '../ScoreBar';

describe('ScoreBar', () => {
  describe('Basic rendering', () => {
    it('renders with a numeric value', () => {
      render(<ScoreBar value={75} />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      expect(screen.getByText('75')).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(<ScoreBar value={75} label="Extraversão" />);
      expect(screen.getByText('Extraversão')).toBeInTheDocument();
      expect(screen.getByText('75')).toBeInTheDocument();
    });

    it('rounds decimal values', () => {
      render(<ScoreBar value={75.7} />);
      expect(screen.getByText('76')).toBeInTheDocument();
    });

    it('hides value when showValue is false', () => {
      render(<ScoreBar value={75} showValue={false} />);
      expect(screen.queryByText('75')).not.toBeInTheDocument();
    });
  });

  describe('Value clamping', () => {
    it('clamps values above 100', () => {
      render(<ScoreBar value={150} />);
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toHaveAttribute(
        'aria-valuenow',
        '100'
      );
    });

    it('clamps values below 0', () => {
      render(<ScoreBar value={-10} />);
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toHaveAttribute(
        'aria-valuenow',
        '0'
      );
    });

    it('handles value of 0', () => {
      render(<ScoreBar value={0} />);
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toHaveAttribute(
        'aria-valuenow',
        '0'
      );
    });

    it('handles value of 100', () => {
      render(<ScoreBar value={100} />);
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toHaveAttribute(
        'aria-valuenow',
        '100'
      );
    });
  });

  describe('Empty state (null value)', () => {
    it('renders dash when value is null', () => {
      render(<ScoreBar value={null} />);
      expect(screen.getByText('-')).toBeInTheDocument();
    });

    it('renders empty state with label', () => {
      render(<ScoreBar value={null} label="Dimensão" />);
      expect(screen.getByText('Dimensão')).toBeInTheDocument();
      expect(screen.getByText('-')).toBeInTheDocument();
    });

    it('renders progressbar without aria-valuenow when null', () => {
      render(<ScoreBar value={null} />);
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).not.toHaveAttribute('aria-valuenow');
    });
  });

  describe('ARIA attributes', () => {
    it('has role="progressbar"', () => {
      render(<ScoreBar value={75} />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('has aria-valuemin and aria-valuemax', () => {
      render(<ScoreBar value={75} />);
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toHaveAttribute('aria-valuemin', '0');
      expect(progressbar).toHaveAttribute('aria-valuemax', '100');
    });

    it('has aria-valuenow with current value', () => {
      render(<ScoreBar value={75} />);
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toHaveAttribute('aria-valuenow', '75');
    });

    it('has aria-label with label', () => {
      render(<ScoreBar value={75} label="Extraversão" />);
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toHaveAttribute(
        'aria-label',
        expect.stringContaining('Extraversão')
      );
    });

    it('has aria-label indicating unavailable when null', () => {
      render(<ScoreBar value={null} label="Extraversão" />);
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toHaveAttribute(
        'aria-label',
        expect.stringContaining('indisponíveis')
      );
    });
  });

  describe('Classification colors', () => {
    it('applies VERY_LOW color', () => {
      const { container } = render(
        <ScoreBar value={15} classification="VERY_LOW" />
      );
      const bar = container.querySelector('.bg-synmind-blue-200');
      expect(bar).toBeInTheDocument();
    });

    it('applies LOW color', () => {
      const { container } = render(
        <ScoreBar value={35} classification="LOW" />
      );
      const bar = container.querySelector('.bg-synmind-blue-400');
      expect(bar).toBeInTheDocument();
    });

    it('applies HIGH color', () => {
      const { container } = render(
        <ScoreBar value={70} classification="HIGH" />
      );
      const bar = container.querySelector('.bg-synmind-orange-400');
      expect(bar).toBeInTheDocument();
    });

    it('applies VERY_HIGH color', () => {
      const { container } = render(
        <ScoreBar value={90} classification="VERY_HIGH" />
      );
      const bar = container.querySelector('.bg-synmind-orange-500');
      expect(bar).toBeInTheDocument();
    });
  });

  describe('Default color based on value', () => {
    it('uses blue-300 for values < 25', () => {
      const { container } = render(<ScoreBar value={20} />);
      const bar = container.querySelector('.bg-synmind-blue-300');
      expect(bar).toBeInTheDocument();
    });

    it('uses blue-500 for values 25-49', () => {
      const { container } = render(<ScoreBar value={40} />);
      const bar = container.querySelector('.bg-synmind-blue-500');
      expect(bar).toBeInTheDocument();
    });

    it('uses orange-400 for values 50-74', () => {
      const { container } = render(<ScoreBar value={60} />);
      const bar = container.querySelector('.bg-synmind-orange-400');
      expect(bar).toBeInTheDocument();
    });

    it('uses orange-500 for values >= 75', () => {
      const { container } = render(<ScoreBar value={80} />);
      const bar = container.querySelector('.bg-synmind-orange-500');
      expect(bar).toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('renders sm size', () => {
      const { container } = render(<ScoreBar value={75} size="sm" />);
      const bar = container.querySelector('.h-1\\.5');
      expect(bar).toBeInTheDocument();
    });

    it('renders md size (default)', () => {
      const { container } = render(<ScoreBar value={75} />);
      const bar = container.querySelector('.h-2\\.5');
      expect(bar).toBeInTheDocument();
    });

    it('renders lg size', () => {
      const { container } = render(<ScoreBar value={75} size="lg" />);
      const bar = container.querySelector('.h-4');
      expect(bar).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('renders default variant', () => {
      const { container } = render(<ScoreBar value={75} variant="default" />);
      // Default variant uses solid color
      const bar = container.querySelector('[style*="width"]');
      expect(bar).toBeInTheDocument();
    });

    it('renders gradient variant', () => {
      const { container } = render(<ScoreBar value={75} variant="gradient" />);
      const bar = container.querySelector('[style*="linear-gradient"]');
      expect(bar).toBeInTheDocument();
    });

    it('renders segmented variant', () => {
      const { container } = render(<ScoreBar value={75} variant="segmented" />);
      // Segmented variant has 4 segments
      const segments = container.querySelectorAll('.flex-1');
      expect(segments.length).toBe(4);
    });

    it('segmented variant fills correct segments for 75%', () => {
      const { container } = render(<ScoreBar value={75} variant="segmented" />);
      // At 75%, segments at 0, 25, 50 should be filled (3 filled)
      const filledBlue = container.querySelectorAll('.bg-synmind-blue-400');
      const filledOrange = container.querySelectorAll('.bg-synmind-orange-400');
      // 0 and 25 thresholds are blue, 50 threshold is orange
      expect(filledBlue.length).toBe(2);
      expect(filledOrange.length).toBe(1);
    });
  });

  describe('Custom className', () => {
    it('merges custom className', () => {
      const { container } = render(
        <ScoreBar value={75} className="custom-class" />
      );
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('custom-class');
    });
  });
});
