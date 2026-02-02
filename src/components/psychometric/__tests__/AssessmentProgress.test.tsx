import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { AssessmentProgress } from '../AssessmentProgress';

const defaultProps = {
  instruments: ['SM_BIG5_20', 'SM_TEI_20', 'SM_CVF_24'],
  completedInstruments: ['SM_BIG5_20'],
  currentInstrument: 'SM_TEI_20',
};

describe('AssessmentProgress', () => {
  describe('Horizontal variant', () => {
    it('renders all instruments', () => {
      render(<AssessmentProgress {...defaultProps} variant="horizontal" />);
      expect(screen.getByText('Personalidade')).toBeInTheDocument();
      expect(screen.getByText('Emocional')).toBeInTheDocument();
      expect(screen.getByText('Cultura')).toBeInTheDocument();
    });

    it('shows completed state correctly', () => {
      const { container } = render(
        <AssessmentProgress {...defaultProps} variant="horizontal" />
      );
      const completedIndicators = container.querySelectorAll('.bg-emerald-500');
      // Completed indicator + possibly connector line (both have emerald-500)
      expect(completedIndicators.length).toBeGreaterThanOrEqual(1);
    });

    it('shows current state with loader', () => {
      const { container } = render(
        <AssessmentProgress {...defaultProps} variant="horizontal" />
      );
      const loader = container.querySelector('.animate-spin');
      expect(loader).toBeInTheDocument();
    });

    it('shows time estimate when enabled', () => {
      render(
        <AssessmentProgress
          {...defaultProps}
          variant="horizontal"
          showEstimatedTime
        />
      );
      expect(screen.getByText(/Tempo estimado restante/i)).toBeInTheDocument();
    });
  });

  describe('Vertical variant', () => {
    it('renders all instruments', () => {
      render(<AssessmentProgress {...defaultProps} variant="vertical" />);
      expect(screen.getByText('Personalidade')).toBeInTheDocument();
      expect(screen.getByText('Emocional')).toBeInTheDocument();
      expect(screen.getByText('Cultura')).toBeInTheDocument();
    });

    it('shows item count', () => {
      render(<AssessmentProgress {...defaultProps} variant="vertical" />);
      // Multiple instruments may have 20 itens, use getAllByText
      const itemCounts = screen.getAllByText(/\d+ itens/);
      expect(itemCounts.length).toBeGreaterThan(0);
    });

    it('shows connector lines between items', () => {
      const { container } = render(
        <AssessmentProgress {...defaultProps} variant="vertical" />
      );
      const connectors = container.querySelectorAll('.min-h-8');
      // Should have connectors between items (n-1 connectors for n items)
      expect(connectors.length).toBe(2);
    });
  });

  describe('Compact variant', () => {
    it('shows progress text', () => {
      render(<AssessmentProgress {...defaultProps} variant="compact" />);
      expect(screen.getByText(/1 de 3 concluídos/)).toBeInTheDocument();
    });

    it('shows progress bar', () => {
      const { container } = render(
        <AssessmentProgress {...defaultProps} variant="compact" />
      );
      const progressBar = container.querySelector('.bg-synmind-blue-500');
      expect(progressBar).toBeInTheDocument();
    });

    it('calculates correct progress percentage', () => {
      const { container } = render(
        <AssessmentProgress
          instruments={['SM_BIG5_20', 'SM_TEI_20']}
          completedInstruments={['SM_BIG5_20']}
          variant="compact"
        />
      );
      const progressBar = container.querySelector('.bg-synmind-blue-500');
      expect(progressBar).toHaveStyle({ width: '50%' });
    });

    it('shows time remaining when enabled', () => {
      render(
        <AssessmentProgress
          {...defaultProps}
          variant="compact"
          showEstimatedTime
        />
      );
      expect(screen.getByText(/restantes/)).toBeInTheDocument();
    });
  });

  describe('Auto variant', () => {
    it('renders without errors', () => {
      // Auto variant should render correctly
      const { container } = render(
        <AssessmentProgress {...defaultProps} variant="auto" />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('applies className correctly', () => {
      const { container } = render(
        <AssessmentProgress
          {...defaultProps}
          variant="auto"
          className="test-class"
        />
      );
      expect(container.firstChild).toHaveClass('test-class');
    });

    it('falls back to horizontal on initial render for large screens', () => {
      // On initial render with large screen (default), uses horizontal
      const { container } = render(
        <AssessmentProgress {...defaultProps} variant="auto" />
      );
      // Horizontal variant has flex-1 connectors or step circles
      const hasConnectors = container.querySelectorAll('.flex-1').length > 0 ||
        container.querySelectorAll('.w-10').length > 0;
      expect(hasConnectors).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('handles empty instruments list', () => {
      const { container } = render(
        <AssessmentProgress
          instruments={[]}
          completedInstruments={[]}
          variant="horizontal"
        />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles all completed', () => {
      const { container } = render(
        <AssessmentProgress
          instruments={['SM_BIG5_20', 'SM_TEI_20']}
          completedInstruments={['SM_BIG5_20', 'SM_TEI_20']}
          variant="horizontal"
        />
      );
      const completedIndicators = container.querySelectorAll('.bg-emerald-500');
      // Each completed item has circle indicator + connector (except last)
      expect(completedIndicators.length).toBeGreaterThanOrEqual(2);
    });

    it('handles no completed', () => {
      const { container } = render(
        <AssessmentProgress
          instruments={['SM_BIG5_20', 'SM_TEI_20']}
          completedInstruments={[]}
          variant="compact"
        />
      );
      const progressBar = container.querySelector('.bg-synmind-blue-500');
      expect(progressBar).toHaveStyle({ width: '0%' });
    });

    it('handles no current instrument', () => {
      const { container } = render(
        <AssessmentProgress
          instruments={['SM_BIG5_20', 'SM_TEI_20']}
          completedInstruments={['SM_BIG5_20']}
          variant="vertical"
        />
      );
      // Should not have loader when no current instrument
      const loader = container.querySelector('.animate-spin');
      expect(loader).not.toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies custom className', () => {
      const { container } = render(
        <AssessmentProgress
          {...defaultProps}
          variant="horizontal"
          className="custom-class"
        />
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('completed items have emerald color', () => {
      const { container } = render(
        <AssessmentProgress {...defaultProps} variant="horizontal" />
      );
      const completedIndicator = container.querySelector('.bg-emerald-500');
      expect(completedIndicator).toBeInTheDocument();
    });

    it('current item has blue accent', () => {
      const { container } = render(
        <AssessmentProgress {...defaultProps} variant="horizontal" />
      );
      const currentIndicator = container.querySelector('.border-synmind-blue-500');
      expect(currentIndicator).toBeInTheDocument();
    });
  });
});
