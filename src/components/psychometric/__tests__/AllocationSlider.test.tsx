import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import { AllocationSlider } from '../AllocationSlider';

const defaultOptions = [
  { id: 'clan', label: 'Colaborativa', description: 'Foco em pessoas' },
  { id: 'adhocracy', label: 'Inovadora', description: 'Foco em inovação' },
  { id: 'market', label: 'Competitiva', description: 'Foco em resultados' },
  { id: 'hierarchy', label: 'Estruturada', description: 'Foco em processos' },
];

const equalValues = {
  clan: 25,
  adhocracy: 25,
  market: 25,
  hierarchy: 25,
};

const defaultProps = {
  questionId: 'cvf-q1',
  question: 'Distribua 100 pontos:',
  options: defaultOptions,
  values: equalValues,
};

describe('AllocationSlider', () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  describe('Rendering', () => {
    it('renders question text', () => {
      render(<AllocationSlider {...defaultProps} />);
      expect(screen.getByText('Distribua 100 pontos:')).toBeInTheDocument();
    });

    it('renders all options', () => {
      render(<AllocationSlider {...defaultProps} />);
      expect(screen.getByText('Colaborativa')).toBeInTheDocument();
      expect(screen.getByText('Inovadora')).toBeInTheDocument();
      expect(screen.getByText('Competitiva')).toBeInTheDocument();
      expect(screen.getByText('Estruturada')).toBeInTheDocument();
    });

    it('renders descriptions as tooltips when provided', () => {
      render(<AllocationSlider {...defaultProps} />);
      // Descriptions are shown as title attributes (tooltips) on info icons
      expect(screen.getByTitle('Foco em pessoas')).toBeInTheDocument();
      expect(screen.getByTitle('Foco em inovação')).toBeInTheDocument();
    });

    it('renders percentages for each option', () => {
      render(<AllocationSlider {...defaultProps} />);
      const percentages = screen.getAllByText('25%');
      expect(percentages.length).toBe(4);
    });

    it('hides percentages when showPercentages is false', () => {
      render(<AllocationSlider {...defaultProps} showPercentages={false} />);
      const percentages = screen.queryAllByText('25%');
      expect(percentages.length).toBe(0);
    });

    it('renders sliders for each option', () => {
      const { container } = render(<AllocationSlider {...defaultProps} />);
      const sliders = container.querySelectorAll('input[type="range"]');
      expect(sliders.length).toBe(4);
    });

    it('renders total indicator', () => {
      render(<AllocationSlider {...defaultProps} />);
      expect(screen.getByText('Total')).toBeInTheDocument();
      expect(screen.getByText('100%')).toBeInTheDocument();
    });
  });

  describe('Sliders variant', () => {
    it('renders sliders by default', () => {
      const { container } = render(<AllocationSlider {...defaultProps} />);
      expect(container.querySelectorAll('input[type="range"]').length).toBe(4);
    });

    it('shows green indicator when total equals 100', () => {
      const { container } = render(<AllocationSlider {...defaultProps} />);
      const indicator = container.querySelector('.text-emerald-600');
      expect(indicator).toBeInTheDocument();
    });

    it('shows CheckCircle icon when valid', () => {
      const { container } = render(<AllocationSlider {...defaultProps} />);
      const icon = container.querySelector('.text-emerald-600');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Pie variant', () => {
    it('renders pie chart when variant is pie', () => {
      const { container } = render(
        <AllocationSlider {...defaultProps} variant="pie" />
      );
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders pie slices for each option', () => {
      const { container } = render(
        <AllocationSlider {...defaultProps} variant="pie" />
      );
      // Only count paths inside the pie chart SVG (which has role="img")
      const pieSvg = container.querySelector('svg[role="img"]');
      const paths = pieSvg?.querySelectorAll('path') ?? [];
      expect(paths.length).toBe(4);
    });

    it('shows total in center of pie', () => {
      render(<AllocationSlider {...defaultProps} variant="pie" />);
      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('uses default pieSize of 240', () => {
      const { container } = render(
        <AllocationSlider {...defaultProps} variant="pie" />
      );
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '240');
      expect(svg).toHaveAttribute('height', '240');
    });

    it('accepts custom pieSize', () => {
      const { container } = render(
        <AllocationSlider {...defaultProps} variant="pie" pieSize={300} />
      );
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '300');
    });

    it('has aria-label on SVG', () => {
      const { container } = render(
        <AllocationSlider {...defaultProps} variant="pie" />
      );
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('aria-label');
      expect(svg?.getAttribute('aria-label')).toContain('Colaborativa 25%');
    });
  });

  describe('pieSize validation', () => {
    it('enforces minimum pieSize of 200px', () => {
      const { container } = render(
        <AllocationSlider {...defaultProps} variant="pie" pieSize={100} />
      );
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '200');
    });

    it('logs warning when pieSize is below minimum', () => {
      render(<AllocationSlider {...defaultProps} variant="pie" pieSize={150} />);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('pieSize must be >= 200px')
      );
    });

    it('does not warn when pieSize is valid', () => {
      render(<AllocationSlider {...defaultProps} variant="pie" pieSize={250} />);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
  });

  describe('step prop', () => {
    it('uses default step of 5', () => {
      const { container } = render(<AllocationSlider {...defaultProps} />);
      const slider = container.querySelector('input[type="range"]');
      expect(slider).toHaveAttribute('step', '5');
    });

    it('accepts custom step value', () => {
      const { container } = render(
        <AllocationSlider {...defaultProps} step={10} />
      );
      const slider = container.querySelector('input[type="range"]');
      expect(slider).toHaveAttribute('step', '10');
    });

    it('applies step to all sliders', () => {
      const { container } = render(
        <AllocationSlider {...defaultProps} step={1} />
      );
      const sliders = container.querySelectorAll('input[type="range"]');
      sliders.forEach((slider) => {
        expect(slider).toHaveAttribute('step', '1');
      });
    });

    it('applies step in pie variant', () => {
      const { container } = render(
        <AllocationSlider {...defaultProps} variant="pie" step={2} />
      );
      const slider = container.querySelector('input[type="range"]');
      expect(slider).toHaveAttribute('step', '2');
    });
  });

  describe('Initial values validation', () => {
    it('logs warning when initial values sum does not equal total', () => {
      const invalidValues = { clan: 20, adhocracy: 20, market: 20, hierarchy: 20 };
      render(<AllocationSlider {...defaultProps} values={invalidValues} />);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Initial values sum (80) does not equal total (100)')
      );
    });

    it('does not warn when initial values sum equals total', () => {
      render(<AllocationSlider {...defaultProps} />);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('validates against custom total', () => {
      const values = { a: 30, b: 30 };
      render(
        <AllocationSlider
          questionId="custom"
          options={[{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }]}
          values={values}
          total={50}
        />
      );
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Initial values sum (60) does not equal total (50)')
      );
    });
  });

  describe('Total validation', () => {
    it('shows valid state when total equals 100', () => {
      const { container } = render(<AllocationSlider {...defaultProps} />);
      expect(container.querySelector('.bg-emerald-50')).toBeInTheDocument();
    });

    it('shows invalid state when total is less than 100', () => {
      const lessValues = { clan: 20, adhocracy: 20, market: 20, hierarchy: 20 };
      const { container } = render(
        <AllocationSlider {...defaultProps} values={lessValues} />
      );
      expect(container.querySelector('.bg-destructive\\/10')).toBeInTheDocument();
    });

    it('shows invalid state when total is more than 100', () => {
      const moreValues = { clan: 30, adhocracy: 30, market: 30, hierarchy: 30 };
      const { container } = render(
        <AllocationSlider {...defaultProps} values={moreValues} />
      );
      expect(container.querySelector('.text-destructive')).toBeInTheDocument();
    });

    it('shows difference when total is not 100 (negative)', () => {
      const lessValues = { clan: 20, adhocracy: 20, market: 20, hierarchy: 20 };
      render(<AllocationSlider {...defaultProps} values={lessValues} />);
      expect(screen.getByText('(-20)')).toBeInTheDocument();
    });

    it('shows difference when total is not 100 (positive)', () => {
      const moreValues = { clan: 30, adhocracy: 30, market: 30, hierarchy: 30 };
      render(<AllocationSlider {...defaultProps} values={moreValues} />);
      expect(screen.getByText('(+20)')).toBeInTheDocument();
    });

    it('shows AlertCircle icon when invalid', () => {
      const lessValues = { clan: 20, adhocracy: 20, market: 20, hierarchy: 20 };
      const { container } = render(
        <AllocationSlider {...defaultProps} values={lessValues} />
      );
      const icon = container.querySelector('.text-destructive');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('calls onChange when slider value changes', () => {
      const onChange = vi.fn();
      const { container } = render(
        <AllocationSlider {...defaultProps} onChange={onChange} />
      );
      const slider = container.querySelector('input[type="range"]')!;
      fireEvent.change(slider, { target: { value: '40' } });
      expect(onChange).toHaveBeenCalledWith('cvf-q1', expect.any(Object));
    });

    it('distributes value changes proportionally', () => {
      const onChange = vi.fn();
      const { container } = render(
        <AllocationSlider {...defaultProps} onChange={onChange} />
      );
      const slider = container.querySelector('input[type="range"]')!;
      fireEvent.change(slider, { target: { value: '40' } });

      const newValues = onChange.mock.calls[0][1];
      // First option should be 40
      expect(newValues.clan).toBe(40);
      // Total should still be 100 (proportional redistribution)
      const total = Object.values(newValues).reduce(
        (sum, v) => sum + (v as number),
        0
      );
      expect(total).toBe(100);
    });

    it('does not call onChange when disabled', () => {
      const onChange = vi.fn();
      const { container } = render(
        <AllocationSlider {...defaultProps} onChange={onChange} disabled />
      );
      const slider = container.querySelector('input[type="range"]')!;
      fireEvent.change(slider, { target: { value: '40' } });
      expect(onChange).not.toHaveBeenCalled();
    });

    it('does not call onChange when readonly', () => {
      const onChange = vi.fn();
      const { container } = render(
        <AllocationSlider {...defaultProps} onChange={onChange} readonly />
      );
      const slider = container.querySelector('input[type="range"]')!;
      fireEvent.change(slider, { target: { value: '40' } });
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('Disabled state', () => {
    it('disables all sliders when disabled', () => {
      const { container } = render(
        <AllocationSlider {...defaultProps} disabled />
      );
      const sliders = container.querySelectorAll('input[type="range"]');
      sliders.forEach((slider) => {
        expect(slider).toBeDisabled();
      });
    });

    it('applies opacity class when disabled', () => {
      const { container } = render(
        <AllocationSlider {...defaultProps} disabled />
      );
      const slider = container.querySelector('input[type="range"]');
      expect(slider).toHaveClass('opacity-50');
    });
  });

  describe('Readonly state', () => {
    it('disables all sliders when readonly', () => {
      const { container } = render(
        <AllocationSlider {...defaultProps} readonly />
      );
      const sliders = container.querySelectorAll('input[type="range"]');
      sliders.forEach((slider) => {
        expect(slider).toBeDisabled();
      });
    });

    it('applies opacity class when readonly', () => {
      const { container } = render(
        <AllocationSlider {...defaultProps} readonly />
      );
      const slider = container.querySelector('input[type="range"]');
      expect(slider).toHaveClass('opacity-50');
    });

    it('readonly and disabled behave the same for sliders', () => {
      const { container: disabledContainer } = render(
        <AllocationSlider {...defaultProps} disabled />
      );
      const { container: readonlyContainer } = render(
        <AllocationSlider {...defaultProps} readonly />
      );

      const disabledSliders = disabledContainer.querySelectorAll(
        'input[type="range"]'
      );
      const readonlySliders = readonlyContainer.querySelectorAll(
        'input[type="range"]'
      );

      disabledSliders.forEach((slider) => {
        expect(slider).toBeDisabled();
      });
      readonlySliders.forEach((slider) => {
        expect(slider).toBeDisabled();
      });
    });
  });

  describe('Custom total', () => {
    it('supports custom total value', () => {
      const values = { a: 10, b: 20, c: 20 };
      render(
        <AllocationSlider
          questionId="custom"
          options={[
            { id: 'a', label: 'A' },
            { id: 'b', label: 'B' },
            { id: 'c', label: 'C' },
          ]}
          values={values}
          total={50}
        />
      );
      // Total should show valid since 10+20+20=50
      expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('validates against custom total', () => {
      const values = { a: 10, b: 10, c: 10 };
      const { container } = render(
        <AllocationSlider
          questionId="custom"
          options={[
            { id: 'a', label: 'A' },
            { id: 'b', label: 'B' },
            { id: 'c', label: 'C' },
          ]}
          values={values}
          total={50}
        />
      );
      // 30 !== 50, should show error
      expect(container.querySelector('.text-destructive')).toBeInTheDocument();
    });
  });

  describe('Custom colors', () => {
    it('uses custom colors when provided', () => {
      const options = [
        { id: 'a', label: 'A', color: '#ff0000' },
        { id: 'b', label: 'B', color: '#00ff00' },
      ];
      const { container } = render(
        <AllocationSlider
          questionId="colors"
          options={options}
          values={{ a: 50, b: 50 }}
        />
      );
      const colorDots = container.querySelectorAll('.rounded-full');
      expect(colorDots[0]).toHaveStyle({ backgroundColor: '#ff0000' });
      expect(colorDots[1]).toHaveStyle({ backgroundColor: '#00ff00' });
    });

    it('uses default quadrant colors when no custom color', () => {
      const { container } = render(<AllocationSlider {...defaultProps} />);
      const colorDots = container.querySelectorAll('.rounded-full');
      expect(colorDots.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Pie variant specific', () => {
    it('does not render slice when value is 0', () => {
      const values = { clan: 100, adhocracy: 0, market: 0, hierarchy: 0 };
      const { container } = render(
        <AllocationSlider {...defaultProps} values={values} variant="pie" />
      );
      // Only count paths inside the pie chart SVG (which has role="img")
      const pieSvg = container.querySelector('svg[role="img"]');
      const paths = pieSvg?.querySelectorAll('path') ?? [];
      expect(paths.length).toBe(1);
    });

    it('shows validation message in pie variant', () => {
      const lessValues = { clan: 20, adhocracy: 20, market: 20, hierarchy: 20 };
      render(
        <AllocationSlider {...defaultProps} values={lessValues} variant="pie" />
      );
      expect(screen.getByText(/Total deve ser 100%/)).toBeInTheDocument();
    });

    it('shows difference in center when invalid', () => {
      const lessValues = { clan: 20, adhocracy: 20, market: 20, hierarchy: 20 };
      const { container } = render(
        <AllocationSlider {...defaultProps} values={lessValues} variant="pie" />
      );
      const svg = container.querySelector('svg');
      expect(svg?.textContent).toContain('-20');
    });
  });

  describe('External value updates', () => {
    it('updates internal state when external values change', () => {
      const { rerender } = render(<AllocationSlider {...defaultProps} />);
      const newValues = { clan: 40, adhocracy: 30, market: 20, hierarchy: 10 };
      rerender(<AllocationSlider {...defaultProps} values={newValues} />);
      expect(screen.getByText('40%')).toBeInTheDocument();
      expect(screen.getByText('30%')).toBeInTheDocument();
    });
  });

  describe('Without question', () => {
    it('renders without question text', () => {
      const { container } = render(
        <AllocationSlider
          questionId="no-question"
          options={defaultOptions}
          values={equalValues}
        />
      );
      expect(container.querySelector('p.text-base')).not.toBeInTheDocument();
    });
  });

  describe('Options without descriptions', () => {
    it('renders without descriptions', () => {
      const optionsWithoutDesc = [
        { id: 'a', label: 'Option A' },
        { id: 'b', label: 'Option B' },
      ];
      render(
        <AllocationSlider
          questionId="no-desc"
          options={optionsWithoutDesc}
          values={{ a: 50, b: 50 }}
        />
      );
      expect(screen.getByText('Option A')).toBeInTheDocument();
      expect(screen.getByText('Option B')).toBeInTheDocument();
      // No description elements should exist
      expect(screen.queryByText('Foco em')).not.toBeInTheDocument();
    });
  });
});
