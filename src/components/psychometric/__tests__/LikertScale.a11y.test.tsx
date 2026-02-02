import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { LikertScale } from '../LikertScale';

expect.extend(toHaveNoViolations);

const defaultProps = {
  questionId: 'q1',
  question: 'How satisfied are you?',
  scale: 5 as const,
};

describe('LikertScale Accessibility', () => {
  describe('Buttons variant', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<LikertScale {...defaultProps} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations with value selected', async () => {
      const { container } = render(<LikertScale {...defaultProps} value={3} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations when disabled', async () => {
      const { container } = render(<LikertScale {...defaultProps} disabled />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations when readonly', async () => {
      const { container } = render(
        <LikertScale {...defaultProps} readonly value={3} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Touch variant', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <LikertScale {...defaultProps} variant="touch" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations with value', async () => {
      const { container } = render(
        <LikertScale {...defaultProps} variant="touch" value={4} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Auto variant', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <LikertScale {...defaultProps} variant="auto" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Slider variant', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <LikertScale {...defaultProps} variant="slider" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Radio variant', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <LikertScale {...defaultProps} variant="radio" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Keyboard navigation', () => {
    it('buttons variant should have focusable buttons', () => {
      const { container } = render(<LikertScale {...defaultProps} />);
      const buttons = container.querySelectorAll('button');
      buttons.forEach((button) => {
        expect(button.tabIndex).not.toBe(-1);
      });
    });

    it('buttons should have focus ring styles', () => {
      const { container } = render(<LikertScale {...defaultProps} />);
      const button = container.querySelector('button');
      expect(button).toHaveClass('focus:ring-2');
    });
  });

  describe('7-point scale', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <LikertScale {...defaultProps} scale={7} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
