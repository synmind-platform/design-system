/**
 * ProfileChart Accessibility Tests
 *
 * Tests WCAG 2.1 AA compliance for the ProfileChart component.
 * Uses jest-axe for automated accessibility testing.
 */
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ProfileChart } from '../ProfileChart';
import type { SYM4Dimension } from '@/types/psychometric';

expect.extend(toHaveNoViolations);

describe('ProfileChart Accessibility', () => {
  const defaultGraphI: SYM4Dimension = {
    assertive: 75,
    influential: 60,
    stable: 45,
    analytical: 80,
  };

  const defaultGraphII: SYM4Dimension = {
    assertive: 65,
    influential: 70,
    stable: 50,
    analytical: 70,
  };

  describe('Bar Variant', () => {
    it('should have no accessibility violations with default props', async () => {
      const { container } = render(
        <ProfileChart graphI={defaultGraphI} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA attributes on SVG', () => {
      const { container } = render(
        <ProfileChart graphI={defaultGraphI} />
      );

      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('role', 'img');
      expect(svg).toHaveAttribute('aria-labelledby');
    });

    it('should have accessible title and description', () => {
      const { container } = render(
        <ProfileChart graphI={defaultGraphI} />
      );

      const title = container.querySelector('title');
      const desc = container.querySelector('desc');

      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent(/perfil/i);

      expect(desc).toBeInTheDocument();
      expect(desc).toHaveTextContent(/barras/i);
    });

    it('should have no violations with both graphs', async () => {
      const { container } = render(
        <ProfileChart graphI={defaultGraphI} graphII={defaultGraphII} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should include dimension values in description', () => {
      const { container } = render(
        <ProfileChart graphI={defaultGraphI} />
      );

      const desc = container.querySelector('desc');
      expect(desc).toHaveTextContent(/assertivo/i);
      expect(desc).toHaveTextContent(/75/);
    });

    it('should mention adapted profile when graphII is present', () => {
      const { container } = render(
        <ProfileChart graphI={defaultGraphI} graphII={defaultGraphII} />
      );

      const desc = container.querySelector('desc');
      expect(desc).toHaveTextContent(/adaptado/i);
    });
  });

  describe('Diamond Variant', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <ProfileChart graphI={defaultGraphI} variant="diamond" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA attributes on SVG', () => {
      const { container } = render(
        <ProfileChart graphI={defaultGraphI} variant="diamond" />
      );

      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('role', 'img');
      expect(svg).toHaveAttribute('aria-labelledby');
    });

    it('should have accessible title and description for diamond', () => {
      const { container } = render(
        <ProfileChart graphI={defaultGraphI} variant="diamond" />
      );

      const title = container.querySelector('title');
      expect(title).toHaveTextContent(/diamante/i);
    });

    it('should have no violations with both graphs in diamond', async () => {
      const { container } = render(
        <ProfileChart
          graphI={defaultGraphI}
          graphII={defaultGraphII}
          variant="diamond"
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Size Variants', () => {
    const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

    sizes.forEach((size) => {
      it(`should have no violations with size="${size}"`, async () => {
        const { container } = render(
          <ProfileChart graphI={defaultGraphI} size={size} />
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });
    });
  });

  describe('Legend Accessibility', () => {
    it('should render legend when graphII is present', () => {
      const { getByText } = render(
        <ProfileChart
          graphI={defaultGraphI}
          graphII={defaultGraphII}
          showLegend
        />
      );

      // Use more specific pattern to avoid matching desc element
      expect(getByText(/Natural \(I\)/i)).toBeInTheDocument();
      expect(getByText(/Adaptado \(II\)/i)).toBeInTheDocument();
    });

    it('should not render legend without graphII', () => {
      const { queryByText } = render(
        <ProfileChart graphI={defaultGraphI} showLegend />
      );

      expect(queryByText(/Natural \(I\)/i)).not.toBeInTheDocument();
    });
  });
});
