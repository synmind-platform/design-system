import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Badge } from '../badge'

describe('Badge', () => {
  it('renders with text', () => {
    render(<Badge>New</Badge>)
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('renders as a span by default', () => {
    render(<Badge data-testid="badge">Label</Badge>)
    expect(screen.getByTestId('badge').tagName).toBe('SPAN')
  })

  it('has data-slot attribute', () => {
    render(<Badge data-testid="badge">Label</Badge>)
    expect(screen.getByTestId('badge')).toHaveAttribute('data-slot', 'badge')
  })

  it('applies default variant classes', () => {
    render(<Badge data-testid="badge">Default</Badge>)
    expect(screen.getByTestId('badge')).toHaveClass('bg-primary')
  })

  it('applies secondary variant classes', () => {
    render(<Badge variant="secondary" data-testid="badge">Secondary</Badge>)
    expect(screen.getByTestId('badge')).toHaveClass('bg-secondary')
  })

  it('applies destructive variant classes', () => {
    render(<Badge variant="destructive" data-testid="badge">Destructive</Badge>)
    expect(screen.getByTestId('badge')).toHaveClass('bg-destructive')
  })

  it('applies outline variant classes', () => {
    render(<Badge variant="outline" data-testid="badge">Outline</Badge>)
    expect(screen.getByTestId('badge')).toHaveClass('text-foreground')
  })

  it('has rounded-full styling', () => {
    render(<Badge data-testid="badge">Rounded</Badge>)
    expect(screen.getByTestId('badge')).toHaveClass('rounded-full')
  })

  it('merges custom className', () => {
    render(<Badge className="custom-class" data-testid="badge">Custom</Badge>)
    expect(screen.getByTestId('badge')).toHaveClass('custom-class')
  })

  it('renders as child element when asChild is true', () => {
    render(
      <Badge asChild>
        <a href="/notifications">5 notifications</a>
      </Badge>
    )
    const link = screen.getByRole('link')
    expect(link).toHaveTextContent('5 notifications')
    expect(link).toHaveAttribute('href', '/notifications')
    expect(link).toHaveAttribute('data-slot', 'badge')
  })

  it('forwards additional props', () => {
    render(<Badge data-testid="badge" id="test-badge">Label</Badge>)
    expect(screen.getByTestId('badge')).toHaveAttribute('id', 'test-badge')
  })

  it('renders with children that include SVG', () => {
    render(
      <Badge data-testid="badge">
        <svg data-testid="icon" className="size-3" />
        Status
      </Badge>
    )
    expect(screen.getByTestId('icon')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
  })
})
