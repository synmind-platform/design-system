import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Alert, AlertTitle, AlertDescription } from '../alert'

describe('Alert', () => {
  it('renders children', () => {
    render(<Alert>Alert content</Alert>)
    expect(screen.getByText('Alert content')).toBeInTheDocument()
  })

  it('has role="alert" for accessibility', () => {
    render(<Alert>Alert content</Alert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('has data-slot attribute', () => {
    render(<Alert>Content</Alert>)
    expect(screen.getByRole('alert')).toHaveAttribute('data-slot', 'alert')
  })

  it('shows icon by default', () => {
    render(<Alert>Content</Alert>)
    const alert = screen.getByRole('alert')
    expect(alert.querySelector('svg')).toBeInTheDocument()
  })

  it('hides icon when icon prop is false', () => {
    render(<Alert icon={false}>Content</Alert>)
    const alert = screen.getByRole('alert')
    expect(alert.querySelector('svg.lucide-info')).not.toBeInTheDocument()
  })

  it('renders default variant', () => {
    render(<Alert data-testid="alert">Content</Alert>)
    expect(screen.getByTestId('alert')).toHaveClass('bg-background')
  })

  it('renders info variant with correct styling', () => {
    render(<Alert variant="info" data-testid="alert">Content</Alert>)
    const alert = screen.getByTestId('alert')
    expect(alert).toHaveClass('bg-synmind-blue-50')
  })

  it('renders success variant with correct styling', () => {
    render(<Alert variant="success" data-testid="alert">Content</Alert>)
    const alert = screen.getByTestId('alert')
    expect(alert).toHaveClass('bg-green-50')
  })

  it('renders warning variant with correct styling', () => {
    render(<Alert variant="warning" data-testid="alert">Content</Alert>)
    const alert = screen.getByTestId('alert')
    expect(alert).toHaveClass('bg-synmind-orange-50')
  })

  it('renders destructive variant with correct styling', () => {
    render(<Alert variant="destructive" data-testid="alert">Content</Alert>)
    const alert = screen.getByTestId('alert')
    expect(alert).toHaveClass('bg-red-50')
  })

  it('shows dismiss button when dismissible is true', () => {
    render(<Alert dismissible>Content</Alert>)
    expect(screen.getByLabelText('Dismiss')).toBeInTheDocument()
  })

  it('does not show dismiss button by default', () => {
    render(<Alert>Content</Alert>)
    expect(screen.queryByLabelText('Dismiss')).not.toBeInTheDocument()
  })

  it('calls onDismiss when dismiss button is clicked', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(<Alert dismissible onDismiss={onDismiss}>Content</Alert>)

    await user.click(screen.getByLabelText('Dismiss'))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('merges custom className', () => {
    render(<Alert className="custom-class">Content</Alert>)
    expect(screen.getByRole('alert')).toHaveClass('custom-class')
  })

  it('forwards additional props', () => {
    render(<Alert data-testid="alert" id="test-alert">Content</Alert>)
    expect(screen.getByTestId('alert')).toHaveAttribute('id', 'test-alert')
  })
})

describe('AlertTitle', () => {
  it('renders children', () => {
    render(<AlertTitle>Title text</AlertTitle>)
    expect(screen.getByText('Title text')).toBeInTheDocument()
  })

  it('has data-slot attribute', () => {
    render(<AlertTitle data-testid="title">Title</AlertTitle>)
    expect(screen.getByTestId('title')).toHaveAttribute('data-slot', 'alert-title')
  })

  it('has font-medium class', () => {
    render(<AlertTitle data-testid="title">Title</AlertTitle>)
    expect(screen.getByTestId('title')).toHaveClass('font-medium')
  })

  it('merges custom className', () => {
    render(<AlertTitle className="custom-class" data-testid="title">Title</AlertTitle>)
    expect(screen.getByTestId('title')).toHaveClass('custom-class')
  })

  it('renders as h5 element', () => {
    render(<AlertTitle>Title</AlertTitle>)
    expect(screen.getByRole('heading', { level: 5 })).toBeInTheDocument()
  })
})

describe('AlertDescription', () => {
  it('renders children', () => {
    render(<AlertDescription>Description text</AlertDescription>)
    expect(screen.getByText('Description text')).toBeInTheDocument()
  })

  it('has data-slot attribute', () => {
    render(<AlertDescription data-testid="desc">Description</AlertDescription>)
    expect(screen.getByTestId('desc')).toHaveAttribute('data-slot', 'alert-description')
  })

  it('merges custom className', () => {
    render(<AlertDescription className="custom-class" data-testid="desc">Description</AlertDescription>)
    expect(screen.getByTestId('desc')).toHaveClass('custom-class')
  })
})

describe('Alert composition', () => {
  it('renders a complete alert with title and description', () => {
    render(
      <Alert variant="info">
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>This is an informational message.</AlertDescription>
      </Alert>
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Information')).toBeInTheDocument()
    expect(screen.getByText('This is an informational message.')).toBeInTheDocument()
  })

  it('renders dismissible alert with all parts', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()

    render(
      <Alert variant="warning" dismissible onDismiss={onDismiss}>
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>This action cannot be undone.</AlertDescription>
      </Alert>
    )

    expect(screen.getByText('Warning')).toBeInTheDocument()
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument()

    await user.click(screen.getByLabelText('Dismiss'))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })
})
