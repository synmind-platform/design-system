import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Input } from '../input'

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders with placeholder', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('handles type prop', () => {
    render(<Input type="email" data-testid="email-input" />)
    expect(screen.getByTestId('email-input')).toHaveAttribute('type', 'email')
  })

  it('handles password type', () => {
    render(<Input type="password" data-testid="password-input" />)
    expect(screen.getByTestId('password-input')).toHaveAttribute('type', 'password')
  })

  it('handles value changes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Input onChange={onChange} />)

    await user.type(screen.getByRole('textbox'), 'hello')
    expect(onChange).toHaveBeenCalled()
  })

  it('displays typed text', async () => {
    const user = userEvent.setup()
    render(<Input />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'hello world')
    expect(input).toHaveValue('hello world')
  })

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('does not allow input when disabled', async () => {
    const user = userEvent.setup()
    render(<Input disabled />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'hello')
    expect(input).toHaveValue('')
  })

  it('merges custom className', () => {
    render(<Input className="custom-class" />)
    expect(screen.getByRole('textbox')).toHaveClass('custom-class')
  })

  it('has data-slot attribute', () => {
    render(<Input />)
    expect(screen.getByRole('textbox')).toHaveAttribute('data-slot', 'input')
  })

  it('forwards additional props', () => {
    render(<Input data-testid="test-input" name="test" />)
    const input = screen.getByTestId('test-input')
    expect(input).toHaveAttribute('name', 'test')
  })

  it('supports readonly attribute', () => {
    render(<Input readOnly value="readonly value" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('readonly')
  })

  it('supports aria-label for accessibility', () => {
    render(<Input aria-label="Search" />)
    expect(screen.getByLabelText('Search')).toBeInTheDocument()
  })

  it('supports aria-invalid for error state', () => {
    render(<Input aria-invalid="true" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })
})
