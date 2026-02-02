import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { TouchSlider } from '../TouchSlider'

describe('TouchSlider', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<TouchSlider />)

      // Should render 5 step buttons by default (min=1, max=5)
      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(5)
    })

    it('renders correct number of buttons based on min/max', () => {
      render(<TouchSlider min={1} max={7} />)

      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(7)
    })

    it('renders custom range correctly', () => {
      render(<TouchSlider min={0} max={10} />)

      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(11) // 0 to 10 inclusive
    })

    it('displays current value', () => {
      render(<TouchSlider value={4} />)

      // The slider shows the value prominently
      const valueDisplays = screen.getAllByText('4')
      expect(valueDisplays.length).toBeGreaterThan(0)
    })

    it('displays midpoint when no value is provided', () => {
      render(<TouchSlider min={1} max={5} />)

      // Midpoint of 1-5 is 3
      const valueDisplays = screen.getAllByText('3')
      expect(valueDisplays.length).toBeGreaterThan(0)
    })

    it('renders labels when provided', () => {
      render(
        <TouchSlider
          labels={{ low: 'Low', mid: 'Medium', high: 'High' }}
        />
      )

      expect(screen.getByText('Low')).toBeInTheDocument()
      expect(screen.getByText('Medium')).toBeInTheDocument()
      expect(screen.getByText('High')).toBeInTheDocument()
    })

    it('renders without mid label when not provided', () => {
      render(
        <TouchSlider
          labels={{ low: 'Start', high: 'End' }}
        />
      )

      expect(screen.getByText('Start')).toBeInTheDocument()
      expect(screen.getByText('End')).toBeInTheDocument()
    })

    it('does not render labels section when no labels provided', () => {
      render(<TouchSlider />)

      // No labels section should be rendered
      const labelsSection = screen.queryByText('Low')
      expect(labelsSection).not.toBeInTheDocument()
    })

    it('applies custom className', () => {
      const { container } = render(<TouchSlider className="custom-class" />)

      expect(container.firstChild).toHaveClass('custom-class')
    })
  })

  describe('Interaction', () => {
    it('calls onChange when step button is clicked', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<TouchSlider onChange={onChange} />)

      const buttons = screen.getAllByRole('button')
      await user.click(buttons[3]) // Click 4th button (value 4)

      expect(onChange).toHaveBeenCalledWith(4)
    })

    it('calls onChange with correct value for custom range', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<TouchSlider min={0} max={4} onChange={onChange} />)

      const buttons = screen.getAllByRole('button')
      await user.click(buttons[2]) // Click 3rd button (value 2)

      expect(onChange).toHaveBeenCalledWith(2)
    })

    it('does not call onChange when disabled', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<TouchSlider onChange={onChange} disabled />)

      const buttons = screen.getAllByRole('button')
      await user.click(buttons[0])

      expect(onChange).not.toHaveBeenCalled()
    })

    it('disables all buttons when disabled prop is true', () => {
      render(<TouchSlider disabled />)

      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        expect(button).toBeDisabled()
      })
    })
  })

  describe('Mouse drag interaction', () => {
    it('track element exists and responds to mouse down', () => {
      const { container } = render(<TouchSlider />)

      const track = container.querySelector('.h-12')
      expect(track).toBeInTheDocument()
      expect(track).toHaveClass('cursor-pointer')

      // Verify the element can receive mouse events without error
      fireEvent.mouseDown(track!, { clientX: 100 })
    })

    it('does not respond to drag when disabled', () => {
      const onChange = vi.fn()
      const { container } = render(<TouchSlider onChange={onChange} disabled />)

      const track = container.querySelector('.h-12')
      expect(track).toHaveClass('cursor-not-allowed')

      fireEvent.mouseDown(track!, { clientX: 100 })
      // When disabled, isDragging should not be set, so no onChange call
      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe('Touch interaction', () => {
    it('handles touch start', () => {
      const onChange = vi.fn()
      const { container } = render(<TouchSlider onChange={onChange} />)

      const track = container.querySelector('.h-12')
      expect(track).toBeInTheDocument()

      // Simulate touch
      fireEvent.touchStart(track!, {
        touches: [{ clientX: 100 }],
        preventDefault: vi.fn()
      })

      fireEvent.touchEnd(track!)

      expect(onChange).toHaveBeenCalled()
    })
  })

  describe('Visual states', () => {
    it('shows different style when value is set vs not set', () => {
      const { rerender, container } = render(<TouchSlider />)

      // Without value - should have muted style
      let valueDisplay = container.querySelector('.rounded-full.px-4')
      expect(valueDisplay).toHaveClass('bg-muted')

      // With value - should have blue style
      rerender(<TouchSlider value={3} />)
      valueDisplay = container.querySelector('.rounded-full.px-4')
      expect(valueDisplay).toHaveClass('bg-synmind-blue-100')
    })

    it('applies disabled styling', () => {
      const { container } = render(<TouchSlider disabled />)

      const track = container.querySelector('.h-12')
      expect(track).toHaveClass('opacity-50', 'cursor-not-allowed')
    })
  })

  describe('Accessibility', () => {
    it('enforces minimum thumb size of 44px', () => {
      const { container } = render(<TouchSlider thumbSize={30} />)
      // The thumb should still be at least 44px (enforced by MIN_THUMB_SIZE)
      const thumb = container.querySelector('[aria-hidden="true"]')
      expect(thumb).toHaveStyle({ width: '44px', height: '44px' })
    })

    it('accepts custom thumb size when >= 44px', () => {
      const { container } = render(<TouchSlider thumbSize={60} />)
      const thumb = container.querySelector('[aria-hidden="true"]')
      expect(thumb).toHaveStyle({ width: '60px', height: '60px' })
    })

    it('step buttons have aria-label', () => {
      render(<TouchSlider />)
      const buttons = screen.getAllByRole('button')
      buttons.forEach((button, index) => {
        expect(button).toHaveAttribute('aria-label', `Selecionar valor ${index + 1}`)
      })
    })

    it('step buttons have aria-pressed for selected state', () => {
      render(<TouchSlider value={3} />)
      const buttons = screen.getAllByRole('button')
      buttons.forEach((button, index) => {
        const isSelected = index + 1 === 3
        expect(button).toHaveAttribute('aria-pressed', String(isSelected))
      })
    })

    it('step buttons have minimum touch target size', () => {
      const { container } = render(<TouchSlider />)
      const buttons = container.querySelectorAll('button')
      buttons.forEach((button) => {
        expect(button).toHaveClass('min-w-[44px]', 'min-h-[44px]')
      })
    })
  })

  describe('showDragValue prop', () => {
    it('shows value in thumb when showDragValue is true (default)', () => {
      const { container } = render(<TouchSlider value={3} />)
      const thumb = container.querySelector('[aria-hidden="true"]')
      expect(thumb?.textContent).toBe('3')
    })

    it('hides value in thumb when showDragValue is false', () => {
      const { container } = render(<TouchSlider value={3} showDragValue={false} />)
      const thumb = container.querySelector('[aria-hidden="true"]')
      expect(thumb?.textContent).toBe('')
    })
  })
})
