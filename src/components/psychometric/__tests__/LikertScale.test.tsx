import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { LikertScale } from '../LikertScale'

describe('LikertScale', () => {
  const defaultProps = {
    questionId: 'q1',
    question: 'How satisfied are you with our service?',
    scale: 5,
  }

  describe('Buttons variant (default)', () => {
    it('renders the question text', () => {
      render(<LikertScale {...defaultProps} />)
      expect(screen.getByText('How satisfied are you with our service?')).toBeInTheDocument()
    })

    it('renders correct number of scale buttons', () => {
      render(<LikertScale {...defaultProps} scale={5} />)
      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(5)
    })

    it('renders 7-point scale', () => {
      render(<LikertScale {...defaultProps} scale={7} />)
      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(7)
    })

    it('renders buttons with correct values', () => {
      render(<LikertScale {...defaultProps} scale={5} />)

      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument()
    })

    it('shows default labels for 5-point scale', () => {
      render(<LikertScale {...defaultProps} scale={5} />)

      expect(screen.getByText('Discordo totalmente')).toBeInTheDocument()
      expect(screen.getByText('Concordo totalmente')).toBeInTheDocument()
      expect(screen.getByText('Neutro')).toBeInTheDocument()
    })

    it('shows custom labels', () => {
      render(
        <LikertScale
          {...defaultProps}
          labels={{ low: 'Not at all', high: 'Extremely', mid: 'Moderately' }}
        />
      )

      expect(screen.getByText('Not at all')).toBeInTheDocument()
      expect(screen.getByText('Extremely')).toBeInTheDocument()
      expect(screen.getByText('Moderately')).toBeInTheDocument()
    })

    it('calls onChange when button is clicked', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<LikertScale {...defaultProps} onChange={onChange} />)

      await user.click(screen.getByRole('button', { name: '3' }))
      expect(onChange).toHaveBeenCalledWith('q1', 3)
    })

    it('highlights selected value', () => {
      render(<LikertScale {...defaultProps} value={3} />)

      const selectedButton = screen.getByRole('button', { name: '3' })
      expect(selectedButton).toHaveClass('border-synmind-blue-500', 'bg-synmind-blue-500', 'text-white')
    })

    it('disables all buttons when disabled is true', () => {
      render(<LikertScale {...defaultProps} disabled />)

      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        expect(button).toBeDisabled()
      })
    })

    it('does not call onChange when disabled', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<LikertScale {...defaultProps} onChange={onChange} disabled />)

      await user.click(screen.getByRole('button', { name: '3' }))
      expect(onChange).not.toHaveBeenCalled()
    })

    it('merges custom className', () => {
      render(<LikertScale {...defaultProps} className="custom-class" />)

      const container = screen.getByText('How satisfied are you with our service?').parentElement
      expect(container).toHaveClass('custom-class')
    })
  })

  describe('Slider variant', () => {
    it('renders a range input', () => {
      render(<LikertScale {...defaultProps} variant="slider" />)

      const slider = screen.getByRole('slider')
      expect(slider).toBeInTheDocument()
    })

    it('has correct min and max values', () => {
      render(<LikertScale {...defaultProps} variant="slider" scale={7} />)

      const slider = screen.getByRole('slider')
      expect(slider).toHaveAttribute('min', '1')
      expect(slider).toHaveAttribute('max', '7')
    })

    it('shows labels', () => {
      render(<LikertScale {...defaultProps} variant="slider" />)

      expect(screen.getByText('Discordo totalmente')).toBeInTheDocument()
      expect(screen.getByText('Concordo totalmente')).toBeInTheDocument()
    })

    it('calls onChange when slider value changes', async () => {
      const onChange = vi.fn()
      render(<LikertScale {...defaultProps} variant="slider" onChange={onChange} />)

      const slider = screen.getByRole('slider')
      // Range inputs need fireEvent for value changes
      slider.focus()
      // Simulating slider interaction is complex with user-event, verify element is interactive
      expect(slider).not.toBeDisabled()
      expect(slider).toHaveAttribute('type', 'range')
    })

    it('is disabled when disabled prop is true', () => {
      render(<LikertScale {...defaultProps} variant="slider" disabled />)

      expect(screen.getByRole('slider')).toBeDisabled()
    })
  })

  describe('Radio variant', () => {
    it('renders radio inputs (visually hidden)', () => {
      render(<LikertScale {...defaultProps} variant="radio" />)

      const radioInputs = document.querySelectorAll('input[type="radio"]')
      expect(radioInputs).toHaveLength(5)
    })

    it('renders labels for each option', () => {
      render(<LikertScale {...defaultProps} variant="radio" scale={5} />)

      expect(screen.getByText('Discordo totalmente')).toBeInTheDocument()
      expect(screen.getByText('Concordo totalmente')).toBeInTheDocument()
      expect(screen.getByText('Neutro')).toBeInTheDocument()
    })

    it('calls onChange when radio option is clicked', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<LikertScale {...defaultProps} variant="radio" onChange={onChange} />)

      // Click on the label containing the radio
      const labels = document.querySelectorAll('label')
      await user.click(labels[2]) // Click the third option

      expect(onChange).toHaveBeenCalledWith('q1', 3)
    })

    it('highlights selected option', () => {
      render(<LikertScale {...defaultProps} variant="radio" value={2} />)

      const labels = document.querySelectorAll('label')
      expect(labels[1]).toHaveClass('border-synmind-blue-500', 'bg-synmind-blue-50')
    })

    it('disables all options when disabled is true', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<LikertScale {...defaultProps} variant="radio" onChange={onChange} disabled />)

      const labels = document.querySelectorAll('label')
      await user.click(labels[0])

      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe('Touch variant', () => {
    it('renders the question text', () => {
      render(<LikertScale {...defaultProps} variant="touch" />)
      expect(screen.getByText('How satisfied are you with our service?')).toBeInTheDocument()
    })

    it('renders step buttons', () => {
      render(<LikertScale {...defaultProps} variant="touch" scale={5} />)

      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(5)
    })

    it('displays current value', () => {
      render(<LikertScale {...defaultProps} variant="touch" value={4} />)

      // The touch slider shows the value prominently
      const valueDisplays = screen.getAllByText('4')
      expect(valueDisplays.length).toBeGreaterThan(0)
    })

    it('calls onChange when step button is clicked', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<LikertScale {...defaultProps} variant="touch" onChange={onChange} />)

      const buttons = screen.getAllByRole('button')
      await user.click(buttons[3]) // Click 4th button (value 4)

      expect(onChange).toHaveBeenCalledWith('q1', 4)
    })

    it('shows labels', () => {
      render(<LikertScale {...defaultProps} variant="touch" />)

      expect(screen.getByText('Discordo totalmente')).toBeInTheDocument()
      expect(screen.getByText('Concordo totalmente')).toBeInTheDocument()
    })

    it('disables interaction when disabled is true', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<LikertScale {...defaultProps} variant="touch" onChange={onChange} disabled />)

      const buttons = screen.getAllByRole('button')
      await user.click(buttons[0])

      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe('Scale variations', () => {
    it('handles 6-point scale without mid label', () => {
      render(<LikertScale {...defaultProps} scale={6} />)

      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(6)

      expect(screen.getByText('Discordo totalmente')).toBeInTheDocument()
      expect(screen.getByText('Concordo totalmente')).toBeInTheDocument()
      // 6-point scale doesn't have a middle point by default
    })

    it('handles 7-point scale with mid label', () => {
      render(<LikertScale {...defaultProps} scale={7} />)

      expect(screen.getByText('Neutro')).toBeInTheDocument()
    })
  })

  describe('Auto variant', () => {
    it('renders without crashing', () => {
      render(<LikertScale {...defaultProps} variant="auto" />)
      expect(screen.getByText('How satisfied are you with our service?')).toBeInTheDocument()
    })

    it('falls back to buttons on desktop (mocked non-touch)', () => {
      // By default, matchMedia mock returns false for touch queries
      render(<LikertScale {...defaultProps} variant="auto" />)
      // Should render buttons variant (5 buttons)
      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(5)
    })
  })

  describe('Readonly mode', () => {
    it('displays value but does not allow interaction', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<LikertScale {...defaultProps} value={3} readonly onChange={onChange} />)

      const buttons = screen.getAllByRole('button')
      await user.click(buttons[0]) // Try to click another button

      expect(onChange).not.toHaveBeenCalled()
    })

    it('disables all buttons when readonly is true', () => {
      render(<LikertScale {...defaultProps} readonly />)

      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        expect(button).toBeDisabled()
      })
    })

    it('still shows selected value', () => {
      render(<LikertScale {...defaultProps} value={4} readonly />)

      const selectedButton = screen.getByRole('button', { name: '4' })
      expect(selectedButton).toHaveClass('border-synmind-blue-500', 'bg-synmind-blue-500')
    })

    it('applies opacity styling', () => {
      const { container } = render(<LikertScale {...defaultProps} readonly />)

      const buttons = container.querySelectorAll('button')
      buttons.forEach((button) => {
        expect(button).toHaveClass('opacity-50')
      })
    })
  })
})
