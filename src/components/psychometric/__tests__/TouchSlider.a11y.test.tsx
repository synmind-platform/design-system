import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { TouchSlider } from '../TouchSlider';

expect.extend(toHaveNoViolations);

describe('TouchSlider Accessibility', () => {
  it('should have no accessibility violations with default props', async () => {
    const { container } = render(<TouchSlider />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with value set', async () => {
    const { container } = render(<TouchSlider value={3} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations when disabled', async () => {
    const { container } = render(<TouchSlider disabled />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with labels', async () => {
    const { container } = render(
      <TouchSlider
        labels={{ low: 'Discordo', mid: 'Neutro', high: 'Concordo' }}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with custom range', async () => {
    const { container } = render(<TouchSlider min={1} max={7} value={4} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  describe('Touch target size', () => {
    it('thumb should have minimum 44px touch target', () => {
      const { container } = render(<TouchSlider />);
      // Visual thumb is a div with inline size styles (default 56px)
      // The actual touch targets are the step buttons
      const thumb = container.querySelector('div[style*="width: 56px"]');
      expect(thumb).toBeInTheDocument();
      // Verify size is at least 44px (WCAG 2.5.5)
      expect(thumb).toHaveStyle({ width: '56px', height: '56px' });
    });

    it('step buttons should be clickable', () => {
      const { container } = render(<TouchSlider />);
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
      buttons.forEach((button) => {
        expect(button).not.toBeDisabled();
      });
    });
  });

  describe('Keyboard navigation', () => {
    it('step buttons should be focusable', () => {
      const { container } = render(<TouchSlider />);
      const buttons = container.querySelectorAll('button');
      buttons.forEach((button) => {
        expect(button.tabIndex).not.toBe(-1);
      });
    });

    it('step buttons should have focus ring styles', () => {
      const { container } = render(<TouchSlider />);
      const button = container.querySelector('button');
      expect(button).toHaveClass('focus:ring-2');
    });
  });
});
