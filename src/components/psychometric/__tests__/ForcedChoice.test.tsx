import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ForcedChoice } from '../ForcedChoice';

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

describe('ForcedChoice', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<ForcedChoice {...defaultProps} />);

      expect(screen.getByText(/MAIS/)).toBeInTheDocument();
      expect(screen.getByText(/MENOS/)).toBeInTheDocument();
      defaultOptions.forEach(opt => {
        expect(screen.getByText(opt.text)).toBeInTheDocument();
      });
    });

    it('renders custom instruction', () => {
      const customInstruction = 'Custom instruction for the tetrad';
      render(<ForcedChoice {...defaultProps} instruction={customInstruction} />);

      expect(screen.getByText(customInstruction)).toBeInTheDocument();
    });

    it('renders combined variant by default', () => {
      const { container } = render(<ForcedChoice {...defaultProps} />);

      // Combined variant has header with "Afirmação"
      expect(screen.getByText('Afirmação')).toBeInTheDocument();
      // Should have 8 selection buttons (4 for most + 4 for least)
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBe(8);
    });

    it('renders separate variant when specified', () => {
      render(<ForcedChoice {...defaultProps} variant="separate" />);

      expect(screen.getByText('Mais me descreve')).toBeInTheDocument();
      expect(screen.getByText('Menos me descreve')).toBeInTheDocument();
    });
  });

  describe('Selection behavior', () => {
    it('calls onChange when selecting most', () => {
      const handleChange = vi.fn();
      render(<ForcedChoice {...defaultProps} onChange={handleChange} />);

      const buttons = screen.getAllByRole('button');
      // First option's "most" button (index 0)
      fireEvent.click(buttons[0]);

      expect(handleChange).toHaveBeenCalledWith('tetrad1', 'opt1', null);
    });

    it('calls onChange when selecting least', () => {
      const handleChange = vi.fn();
      render(<ForcedChoice {...defaultProps} onChange={handleChange} />);

      const buttons = screen.getAllByRole('button');
      // First option's "least" button (index 1)
      fireEvent.click(buttons[1]);

      expect(handleChange).toHaveBeenCalledWith('tetrad1', null, 'opt1');
    });

    it('allows selecting different options for most and least', () => {
      const handleChange = vi.fn();
      render(
        <ForcedChoice
          {...defaultProps}
          mostSelected="opt1"
          onChange={handleChange}
        />
      );

      const buttons = screen.getAllByRole('button');
      // Third option's "least" button
      fireEvent.click(buttons[5]);

      expect(handleChange).toHaveBeenCalledWith('tetrad1', 'opt1', 'opt3');
    });

    it('allows toggling selection off', () => {
      const handleChange = vi.fn();
      render(
        <ForcedChoice
          {...defaultProps}
          mostSelected="opt1"
          onChange={handleChange}
        />
      );

      const buttons = screen.getAllByRole('button');
      // First option's "most" button - click again to deselect
      fireEvent.click(buttons[0]);

      expect(handleChange).toHaveBeenCalledWith('tetrad1', null, null);
    });
  });

  describe('Conflict prevention (T071)', () => {
    it('prevents selecting same option for both most and least', () => {
      const handleChange = vi.fn();
      render(
        <ForcedChoice
          {...defaultProps}
          mostSelected="opt1"
          onChange={handleChange}
        />
      );

      const buttons = screen.getAllByRole('button');
      // Try to select first option's "least" button (already selected as most)
      fireEvent.click(buttons[1]);

      // Should NOT call onChange
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('prevents selecting same option from least to most', () => {
      const handleChange = vi.fn();
      render(
        <ForcedChoice
          {...defaultProps}
          leastSelected="opt2"
          onChange={handleChange}
        />
      );

      const buttons = screen.getAllByRole('button');
      // Try to select second option's "most" button (already selected as least)
      fireEvent.click(buttons[2]);

      // Should NOT call onChange
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('shows visual feedback when attempting conflicting selection', async () => {
      const { container } = render(
        <ForcedChoice
          {...defaultProps}
          mostSelected="opt1"
        />
      );

      const buttons = screen.getAllByRole('button');

      // Try to select first option's "least" button
      await act(async () => {
        fireEvent.click(buttons[1]);
      });

      // Should show animate-pulse class immediately
      const pulsingElement = container.querySelector('.animate-pulse');
      expect(pulsingElement).toBeInTheDocument();

      // Pulse should disappear after timeout
      await act(async () => {
        vi.advanceTimersByTime(800);
      });

      // Re-query since React may have re-rendered
      expect(container.querySelector('.animate-pulse')).not.toBeInTheDocument();
    });
  });

  describe('Readonly mode (T069)', () => {
    it('displays selections in readonly mode', () => {
      render(
        <ForcedChoice
          {...defaultProps}
          readonly
          mostSelected="opt1"
          leastSelected="opt3"
        />
      );

      // Should show the check and X icons for selected options
      const checkIcons = document.querySelectorAll('.bg-emerald-500');
      const xIcons = document.querySelectorAll('.bg-red-500');
      expect(checkIcons.length).toBeGreaterThan(0);
      expect(xIcons.length).toBeGreaterThan(0);
    });

    it('prevents interaction in readonly mode', () => {
      const handleChange = vi.fn();
      render(
        <ForcedChoice
          {...defaultProps}
          readonly
          mostSelected="opt1"
          leastSelected="opt3"
          onChange={handleChange}
        />
      );

      const buttons = screen.getAllByRole('button');
      fireEvent.click(buttons[0]);

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('hides completion status indicator in readonly mode', () => {
      render(
        <ForcedChoice
          {...defaultProps}
          readonly
          mostSelected="opt1"
          leastSelected="opt3"
        />
      );

      expect(screen.queryByText('Seleção completa')).not.toBeInTheDocument();
    });
  });

  describe('Disabled mode', () => {
    it('prevents interaction when disabled', () => {
      const handleChange = vi.fn();
      render(
        <ForcedChoice
          {...defaultProps}
          disabled
          onChange={handleChange}
        />
      );

      const buttons = screen.getAllByRole('button');
      fireEvent.click(buttons[0]);

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('shows disabled buttons as disabled', () => {
      render(<ForcedChoice {...defaultProps} disabled />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toBeDisabled();
      });
    });
  });

  describe('Incomplete indicator (T072)', () => {
    it('shows incomplete message when nothing selected', () => {
      render(<ForcedChoice {...defaultProps} />);

      expect(screen.getByText(/Selecione uma opção para 'Mais' e uma para 'Menos'/)).toBeInTheDocument();
    });

    it('shows incomplete message when only most selected', () => {
      render(<ForcedChoice {...defaultProps} mostSelected="opt1" />);

      expect(screen.getByText(/Selecione a opção que menos o descreve/)).toBeInTheDocument();
    });

    it('shows incomplete message when only least selected', () => {
      render(<ForcedChoice {...defaultProps} leastSelected="opt2" />);

      expect(screen.getByText(/Selecione a opção que mais o descreve/)).toBeInTheDocument();
    });

    it('shows complete message when both selected', () => {
      render(
        <ForcedChoice
          {...defaultProps}
          mostSelected="opt1"
          leastSelected="opt3"
        />
      );

      expect(screen.getByText('Seleção completa')).toBeInTheDocument();
    });
  });

  describe('Combined variant visual improvements (T070, T073)', () => {
    it('renders header with visual column indicators', () => {
      render(<ForcedChoice {...defaultProps} variant="combined" />);

      // Should have header with "Mais" and "Menos"
      expect(screen.getByText('Mais')).toBeInTheDocument();
      expect(screen.getByText('Menos')).toBeInTheDocument();
    });

    it('has minimum touch target size', () => {
      const { container } = render(<ForcedChoice {...defaultProps} />);

      const buttons = container.querySelectorAll('button');
      buttons.forEach(button => {
        // h-11 = 44px
        expect(button).toHaveClass('h-11');
      });
    });

    it('uses alternating row backgrounds', () => {
      const { container } = render(<ForcedChoice {...defaultProps} />);

      // Check for bg-muted/10 class on alternate rows
      const rows = container.querySelectorAll('.divide-y > div');
      expect(rows[0]).toHaveClass('bg-background');
      expect(rows[1]).toHaveClass('bg-muted/10');
    });
  });

  describe('Separate variant visual improvements (T074)', () => {
    it('renders section headers with icons', () => {
      render(<ForcedChoice {...defaultProps} variant="separate" />);

      expect(screen.getByText('Mais me descreve')).toBeInTheDocument();
      expect(screen.getByText('Menos me descreve')).toBeInTheDocument();
    });

    it('shows indicator when section selection is missing', () => {
      render(<ForcedChoice {...defaultProps} variant="separate" />);

      // Should show "(selecione uma)" for both sections
      expect(screen.getAllByText('(selecione uma)').length).toBe(2);
    });

    it('hides indicator when section is selected', () => {
      render(
        <ForcedChoice
          {...defaultProps}
          variant="separate"
          mostSelected="opt1"
        />
      );

      // Should only show one "(selecione uma)" for the least section
      expect(screen.getAllByText('(selecione uma)').length).toBe(1);
    });

    it('shows hint when option is disabled due to other selection', () => {
      render(
        <ForcedChoice
          {...defaultProps}
          variant="separate"
          mostSelected="opt1"
        />
      );

      // In the "Menos" section, opt1 should show it's already selected as "Mais"
      expect(screen.getByText('(já selecionada como "Mais")')).toBeInTheDocument();
    });

    it('has visual divider between sections', () => {
      render(<ForcedChoice {...defaultProps} variant="separate" />);

      // Should have divider with "ou" text
      expect(screen.getByText('ou')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has aria-label on buttons in combined variant', () => {
      render(<ForcedChoice {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      // Check that buttons have aria-labels
      expect(buttons[0]).toHaveAttribute('aria-label');
      expect(buttons[0].getAttribute('aria-label')).toContain('mais me descreve');
    });

    it('has aria-pressed on selected buttons', () => {
      render(
        <ForcedChoice
          {...defaultProps}
          mostSelected="opt1"
          leastSelected="opt2"
        />
      );

      const buttons = screen.getAllByRole('button');
      // First option's most button should be pressed
      expect(buttons[0]).toHaveAttribute('aria-pressed', 'true');
      // First option's least button should not be pressed
      expect(buttons[1]).toHaveAttribute('aria-pressed', 'false');
    });

    it('has focus ring styles', () => {
      const { container } = render(<ForcedChoice {...defaultProps} />);

      const button = container.querySelector('button');
      expect(button).toHaveClass('focus:ring-2');
    });
  });

  describe('Custom className', () => {
    it('applies custom className', () => {
      const { container } = render(
        <ForcedChoice {...defaultProps} className="custom-class" />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });
});
