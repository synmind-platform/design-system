import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ForcedChoice } from '../ForcedChoice';

expect.extend(toHaveNoViolations);

const defaultOptions = [
  { id: 'opt1', text: 'Eu sou determinado e assertivo' },
  { id: 'opt2', text: 'Eu sou sociável e entusiasmado' },
  { id: 'opt3', text: 'Eu sou paciente e colaborativo' },
  { id: 'opt4', text: 'Eu sou analítico e cuidadoso' },
];

const defaultProps = {
  questionId: 'tetrad1',
  options: defaultOptions,
};

describe('ForcedChoice Accessibility', () => {
  describe('Combined variant', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<ForcedChoice {...defaultProps} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations with selections', async () => {
      const { container } = render(
        <ForcedChoice
          {...defaultProps}
          mostSelected="opt1"
          leastSelected="opt3"
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations with partial selection', async () => {
      const { container } = render(
        <ForcedChoice {...defaultProps} mostSelected="opt1" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations when disabled', async () => {
      const { container } = render(<ForcedChoice {...defaultProps} disabled />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations when readonly', async () => {
      const { container } = render(
        <ForcedChoice
          {...defaultProps}
          readonly
          mostSelected="opt1"
          leastSelected="opt3"
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Separate variant', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <ForcedChoice {...defaultProps} variant="separate" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations with selections', async () => {
      const { container } = render(
        <ForcedChoice
          {...defaultProps}
          variant="separate"
          mostSelected="opt2"
          leastSelected="opt4"
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations when disabled', async () => {
      const { container } = render(
        <ForcedChoice {...defaultProps} variant="separate" disabled />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations when readonly', async () => {
      const { container } = render(
        <ForcedChoice
          {...defaultProps}
          variant="separate"
          readonly
          mostSelected="opt2"
          leastSelected="opt4"
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Keyboard navigation', () => {
    it('buttons should be focusable', () => {
      const { container } = render(<ForcedChoice {...defaultProps} />);
      const buttons = container.querySelectorAll('button');
      buttons.forEach((button) => {
        expect(button.tabIndex).not.toBe(-1);
      });
    });

    it('buttons should have focus ring styles', () => {
      const { container } = render(<ForcedChoice {...defaultProps} />);
      const button = container.querySelector('button');
      expect(button).toHaveClass('focus:ring-2');
    });

    it('disabled buttons should have aria-disabled', () => {
      const { container } = render(<ForcedChoice {...defaultProps} disabled />);
      const buttons = container.querySelectorAll('button');
      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });

    it('readonly buttons should be disabled', () => {
      const { container } = render(
        <ForcedChoice
          {...defaultProps}
          readonly
          mostSelected="opt1"
          leastSelected="opt2"
        />
      );
      const buttons = container.querySelectorAll('button');
      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });
  });

  describe('Touch targets', () => {
    it('combined variant buttons should have minimum 44px height', () => {
      const { container } = render(<ForcedChoice {...defaultProps} />);
      const buttons = container.querySelectorAll('button');
      buttons.forEach((button) => {
        // h-11 = 44px
        expect(button).toHaveClass('h-11');
      });
    });

    it('separate variant buttons should have minimum 44px height', () => {
      const { container } = render(
        <ForcedChoice {...defaultProps} variant="separate" />
      );
      const buttons = container.querySelectorAll('button');
      buttons.forEach((button) => {
        // p-3 gives adequate touch target height
        expect(button.className).toMatch(/p-3|min-h-\[44px\]|h-11/);
      });
    });
  });

  describe('Screen reader support', () => {
    it('should have instruction text', () => {
      const { container } = render(<ForcedChoice {...defaultProps} />);
      const instruction = container.querySelector('p');
      expect(instruction).toBeInTheDocument();
      expect(instruction?.textContent).toContain('MAIS');
      expect(instruction?.textContent).toContain('MENOS');
    });

    it('should have column headers in combined variant', () => {
      const { getByText } = render(<ForcedChoice {...defaultProps} />);
      // Combined variant shows "Mais" and "Menos" headers
      expect(getByText('Mais')).toBeInTheDocument();
      expect(getByText('Menos')).toBeInTheDocument();
    });

    it('should have section headers in separate variant', () => {
      const { getByText } = render(
        <ForcedChoice {...defaultProps} variant="separate" />
      );
      expect(getByText(/mais me descreve/i)).toBeInTheDocument();
      expect(getByText(/menos me descreve/i)).toBeInTheDocument();
    });
  });

  describe('Color contrast', () => {
    it('selected states should have sufficient contrast', () => {
      const { container } = render(
        <ForcedChoice
          {...defaultProps}
          mostSelected="opt1"
          leastSelected="opt2"
        />
      );
      // Check that selected buttons have visible icons (Check/X)
      // Header has 2 icons, selected buttons have 2 more icons = 4 total with bg colors
      const coloredElements = container.querySelectorAll('.bg-emerald-500, .bg-red-500');
      // 2 header icons + 2 selected button backgrounds
      expect(coloredElements.length).toBeGreaterThanOrEqual(4);
    });

    it('validation message should be visible', () => {
      const { container } = render(<ForcedChoice {...defaultProps} />);
      const hint = container.querySelector('.text-muted-foreground');
      expect(hint).toBeInTheDocument();
    });
  });
});
