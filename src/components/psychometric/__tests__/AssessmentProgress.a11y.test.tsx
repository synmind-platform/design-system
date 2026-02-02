import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { AssessmentProgress } from '../AssessmentProgress';

expect.extend(toHaveNoViolations);

const defaultProps = {
  instruments: ['SM_BIG5_20', 'SM_TEI_20', 'SM_CVF_24'],
  completedInstruments: ['SM_BIG5_20'],
  currentInstrument: 'SM_TEI_20',
};

describe('AssessmentProgress Accessibility', () => {
  describe('Horizontal variant', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <AssessmentProgress {...defaultProps} variant="horizontal" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations with time estimate', async () => {
      const { container } = render(
        <AssessmentProgress
          {...defaultProps}
          variant="horizontal"
          showEstimatedTime
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations when all completed', async () => {
      const { container } = render(
        <AssessmentProgress
          instruments={['SM_BIG5_20', 'SM_TEI_20']}
          completedInstruments={['SM_BIG5_20', 'SM_TEI_20']}
          variant="horizontal"
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Vertical variant', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <AssessmentProgress {...defaultProps} variant="vertical" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations with time estimate', async () => {
      const { container } = render(
        <AssessmentProgress
          {...defaultProps}
          variant="vertical"
          showEstimatedTime
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Compact variant', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <AssessmentProgress {...defaultProps} variant="compact" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations with time estimate', async () => {
      const { container } = render(
        <AssessmentProgress
          {...defaultProps}
          variant="compact"
          showEstimatedTime
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Auto variant', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <AssessmentProgress {...defaultProps} variant="auto" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Screen reader support', () => {
    it('shows progress information', () => {
      const { getByText } = render(
        <AssessmentProgress {...defaultProps} variant="compact" />
      );
      expect(getByText(/1 de 3 concluídos/)).toBeInTheDocument();
    });

    it('shows instrument names', () => {
      const { getByText } = render(
        <AssessmentProgress {...defaultProps} variant="vertical" />
      );
      expect(getByText('Personalidade')).toBeInTheDocument();
      expect(getByText('Emocional')).toBeInTheDocument();
    });

    it('shows time estimate when enabled', () => {
      const { getByText } = render(
        <AssessmentProgress
          {...defaultProps}
          variant="compact"
          showEstimatedTime
        />
      );
      expect(getByText(/restantes/)).toBeInTheDocument();
    });
  });

  describe('Visual indicators', () => {
    it('shows completed state with check icon', () => {
      const { container } = render(
        <AssessmentProgress {...defaultProps} variant="vertical" />
      );
      // Completed items should have emerald background
      const completedIndicators = container.querySelectorAll('.bg-emerald-500');
      expect(completedIndicators.length).toBeGreaterThan(0);
    });

    it('shows current state with loader animation', () => {
      const { container } = render(
        <AssessmentProgress {...defaultProps} variant="vertical" />
      );
      // Current item should have spinning loader
      const loader = container.querySelector('.animate-spin');
      expect(loader).toBeInTheDocument();
    });

    it('shows pending state correctly', () => {
      const { container } = render(
        <AssessmentProgress
          instruments={['SM_BIG5_20', 'SM_TEI_20', 'SM_CVF_24']}
          completedInstruments={[]}
          variant="vertical"
        />
      );
      // Pending items should have border-border
      const pendingIndicators = container.querySelectorAll('.border-border');
      expect(pendingIndicators.length).toBeGreaterThan(0);
    });
  });

  describe('Progress bar (compact variant)', () => {
    it('shows progress bar with correct width', () => {
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

    it('shows 0% when nothing completed', () => {
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

    it('shows 100% when all completed', () => {
      const { container } = render(
        <AssessmentProgress
          instruments={['SM_BIG5_20', 'SM_TEI_20']}
          completedInstruments={['SM_BIG5_20', 'SM_TEI_20']}
          variant="compact"
        />
      );
      const progressBar = container.querySelector('.bg-synmind-blue-500');
      expect(progressBar).toHaveStyle({ width: '100%' });
    });
  });
});
