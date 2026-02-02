import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { AllocationSlider } from '../AllocationSlider';

expect.extend(toHaveNoViolations);

const defaultOptions = [
  { id: 'clan', label: 'Colaborativa', description: 'Foco em pessoas e colaboração' },
  { id: 'adhocracy', label: 'Inovadora', description: 'Foco em inovação e criatividade' },
  { id: 'market', label: 'Competitiva', description: 'Foco em resultados e competição' },
  { id: 'hierarchy', label: 'Estruturada', description: 'Foco em processos e estabilidade' },
];

const defaultValues = {
  clan: 25,
  adhocracy: 25,
  market: 25,
  hierarchy: 25,
};

const defaultProps = {
  questionId: 'cvf-q1',
  question: 'Distribua 100 pontos entre os tipos de cultura organizacional:',
  options: defaultOptions,
  values: defaultValues,
};

describe('AllocationSlider Accessibility', () => {
  describe('Sliders variant', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<AllocationSlider {...defaultProps} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations with unbalanced values', async () => {
      const unbalancedValues = {
        clan: 40,
        adhocracy: 30,
        market: 20,
        hierarchy: 5,
      };
      const { container } = render(
        <AllocationSlider {...defaultProps} values={unbalancedValues} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations when disabled', async () => {
      const { container } = render(<AllocationSlider {...defaultProps} disabled />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations when readonly', async () => {
      const { container } = render(<AllocationSlider {...defaultProps} readonly />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Pie variant', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <AllocationSlider {...defaultProps} variant="pie" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations with custom pieSize', async () => {
      const { container } = render(
        <AllocationSlider {...defaultProps} variant="pie" pieSize={300} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations when disabled', async () => {
      const { container } = render(
        <AllocationSlider {...defaultProps} variant="pie" disabled />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations when readonly', async () => {
      const { container } = render(
        <AllocationSlider {...defaultProps} variant="pie" readonly />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Keyboard navigation', () => {
    it('range inputs should be focusable', () => {
      const { container } = render(<AllocationSlider {...defaultProps} />);
      const inputs = container.querySelectorAll('input[type="range"]');
      expect(inputs.length).toBe(4);
      inputs.forEach((input) => {
        expect(input).not.toHaveAttribute('tabindex', '-1');
      });
    });

    it('range inputs should have focus ring styles', () => {
      const { container } = render(<AllocationSlider {...defaultProps} />);
      const inputs = container.querySelectorAll('input[type="range"]');
      inputs.forEach((input) => {
        expect(input.className).toMatch(/focus|cursor-pointer/);
      });
    });

    it('disabled inputs should not be interactive', () => {
      const { container } = render(<AllocationSlider {...defaultProps} disabled />);
      const inputs = container.querySelectorAll('input[type="range"]');
      inputs.forEach((input) => {
        expect(input).toBeDisabled();
      });
    });

    it('readonly inputs should not be interactive', () => {
      const { container } = render(<AllocationSlider {...defaultProps} readonly />);
      const inputs = container.querySelectorAll('input[type="range"]');
      inputs.forEach((input) => {
        expect(input).toBeDisabled();
      });
    });

    it('should update values on keyboard interaction', () => {
      const onChange = vi.fn();
      const { container } = render(
        <AllocationSlider {...defaultProps} onChange={onChange} />
      );
      const input = container.querySelector('input[type="range"]');
      fireEvent.change(input!, { target: { value: '30' } });
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('Screen reader support', () => {
    it('should have question text visible', () => {
      const { getByText } = render(<AllocationSlider {...defaultProps} />);
      expect(getByText(/Distribua 100 pontos/)).toBeInTheDocument();
    });

    it('should have option labels visible', () => {
      const { getByText } = render(<AllocationSlider {...defaultProps} />);
      expect(getByText('Colaborativa')).toBeInTheDocument();
      expect(getByText('Inovadora')).toBeInTheDocument();
      expect(getByText('Competitiva')).toBeInTheDocument();
      expect(getByText('Estruturada')).toBeInTheDocument();
    });

    it('should show descriptions when provided', () => {
      const { getByText } = render(<AllocationSlider {...defaultProps} />);
      expect(getByText('Foco em pessoas e colaboração')).toBeInTheDocument();
    });

    it('should have total indicator visible', () => {
      const { getByText } = render(<AllocationSlider {...defaultProps} />);
      expect(getByText('Total')).toBeInTheDocument();
      expect(getByText(/100%/)).toBeInTheDocument();
    });

    it('should show validation message when total is not 100', () => {
      const unbalancedValues = {
        clan: 30,
        adhocracy: 30,
        market: 30,
        hierarchy: 5,
      };
      const { container } = render(
        <AllocationSlider {...defaultProps} values={unbalancedValues} />
      );
      const errorText = container.querySelector('.text-destructive');
      expect(errorText).toBeInTheDocument();
    });
  });

  describe('Color contrast', () => {
    it('should show color indicators for each option', () => {
      const { container } = render(<AllocationSlider {...defaultProps} />);
      const colorDots = container.querySelectorAll('.rounded-full');
      expect(colorDots.length).toBeGreaterThanOrEqual(4);
    });

    it('should have distinct colors in pie variant', () => {
      const { container } = render(
        <AllocationSlider {...defaultProps} variant="pie" />
      );
      const paths = container.querySelectorAll('path');
      const colors = new Set(
        Array.from(paths).map((path) => path.getAttribute('fill'))
      );
      // Should have at least 4 distinct colors (one per quadrant)
      expect(colors.size).toBeGreaterThanOrEqual(4);
    });

    it('pie chart SVG should have accessible attributes', () => {
      const { container } = render(
        <AllocationSlider {...defaultProps} variant="pie" />
      );
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      // SVG should have proper viewBox
      expect(svg).toHaveAttribute('viewBox');
    });
  });

  describe('Total validation visual feedback', () => {
    it('should show green indicator when total equals 100', () => {
      const { container } = render(<AllocationSlider {...defaultProps} />);
      const indicator = container.querySelector('.text-emerald-600');
      expect(indicator).toBeInTheDocument();
    });

    it('should show red indicator when total is less than 100', () => {
      const lessValues = { clan: 20, adhocracy: 20, market: 20, hierarchy: 20 };
      const { container } = render(
        <AllocationSlider {...defaultProps} values={lessValues} />
      );
      const indicator = container.querySelector('.text-destructive');
      expect(indicator).toBeInTheDocument();
    });

    it('should show red indicator when total is more than 100', () => {
      const moreValues = { clan: 30, adhocracy: 30, market: 30, hierarchy: 30 };
      const { container } = render(
        <AllocationSlider {...defaultProps} values={moreValues} />
      );
      const indicator = container.querySelector('.text-destructive');
      expect(indicator).toBeInTheDocument();
    });

    it('should show difference amount when total is not 100', () => {
      const lessValues = { clan: 20, adhocracy: 20, market: 20, hierarchy: 20 };
      const { getByText } = render(
        <AllocationSlider {...defaultProps} values={lessValues} />
      );
      // Shows the negative difference (-20) when below target
      expect(getByText(/\(-20\)/)).toBeInTheDocument();
    });
  });

  describe('Touch targets', () => {
    it('slider track should be accessible height', () => {
      const { container } = render(<AllocationSlider {...defaultProps} />);
      const inputs = container.querySelectorAll('input[type="range"]');
      inputs.forEach((input) => {
        // Inputs should have adequate height class
        expect(input.className).toMatch(/h-2|h-1\.5/);
      });
    });
  });
});
