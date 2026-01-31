import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from '../card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('has data-slot attribute', () => {
    render(<Card data-testid="card">Content</Card>)
    expect(screen.getByTestId('card')).toHaveAttribute('data-slot', 'card')
  })

  it('merges custom className', () => {
    render(<Card className="custom-class" data-testid="card">Content</Card>)
    expect(screen.getByTestId('card')).toHaveClass('custom-class')
  })

  it('has default styling classes', () => {
    render(<Card data-testid="card">Content</Card>)
    expect(screen.getByTestId('card')).toHaveClass('bg-card', 'rounded-xl', 'border', 'shadow-sm')
  })

  it('forwards additional props', () => {
    render(<Card data-testid="card" role="article">Content</Card>)
    expect(screen.getByTestId('card')).toHaveAttribute('role', 'article')
  })
})

describe('CardHeader', () => {
  it('renders children', () => {
    render(<CardHeader>Header content</CardHeader>)
    expect(screen.getByText('Header content')).toBeInTheDocument()
  })

  it('has data-slot attribute', () => {
    render(<CardHeader data-testid="header">Content</CardHeader>)
    expect(screen.getByTestId('header')).toHaveAttribute('data-slot', 'card-header')
  })

  it('merges custom className', () => {
    render(<CardHeader className="custom-class" data-testid="header">Content</CardHeader>)
    expect(screen.getByTestId('header')).toHaveClass('custom-class')
  })
})

describe('CardTitle', () => {
  it('renders children', () => {
    render(<CardTitle>Title text</CardTitle>)
    expect(screen.getByText('Title text')).toBeInTheDocument()
  })

  it('has data-slot attribute', () => {
    render(<CardTitle data-testid="title">Title</CardTitle>)
    expect(screen.getByTestId('title')).toHaveAttribute('data-slot', 'card-title')
  })

  it('has font-semibold class', () => {
    render(<CardTitle data-testid="title">Title</CardTitle>)
    expect(screen.getByTestId('title')).toHaveClass('font-semibold')
  })

  it('merges custom className', () => {
    render(<CardTitle className="custom-class" data-testid="title">Title</CardTitle>)
    expect(screen.getByTestId('title')).toHaveClass('custom-class')
  })
})

describe('CardDescription', () => {
  it('renders children', () => {
    render(<CardDescription>Description text</CardDescription>)
    expect(screen.getByText('Description text')).toBeInTheDocument()
  })

  it('has data-slot attribute', () => {
    render(<CardDescription data-testid="desc">Description</CardDescription>)
    expect(screen.getByTestId('desc')).toHaveAttribute('data-slot', 'card-description')
  })

  it('has muted text styling', () => {
    render(<CardDescription data-testid="desc">Description</CardDescription>)
    expect(screen.getByTestId('desc')).toHaveClass('text-muted-foreground')
  })

  it('merges custom className', () => {
    render(<CardDescription className="custom-class" data-testid="desc">Description</CardDescription>)
    expect(screen.getByTestId('desc')).toHaveClass('custom-class')
  })
})

describe('CardAction', () => {
  it('renders children', () => {
    render(<CardAction>Action</CardAction>)
    expect(screen.getByText('Action')).toBeInTheDocument()
  })

  it('has data-slot attribute', () => {
    render(<CardAction data-testid="action">Action</CardAction>)
    expect(screen.getByTestId('action')).toHaveAttribute('data-slot', 'card-action')
  })

  it('merges custom className', () => {
    render(<CardAction className="custom-class" data-testid="action">Action</CardAction>)
    expect(screen.getByTestId('action')).toHaveClass('custom-class')
  })
})

describe('CardContent', () => {
  it('renders children', () => {
    render(<CardContent>Content text</CardContent>)
    expect(screen.getByText('Content text')).toBeInTheDocument()
  })

  it('has data-slot attribute', () => {
    render(<CardContent data-testid="content">Content</CardContent>)
    expect(screen.getByTestId('content')).toHaveAttribute('data-slot', 'card-content')
  })

  it('has padding class', () => {
    render(<CardContent data-testid="content">Content</CardContent>)
    expect(screen.getByTestId('content')).toHaveClass('px-6')
  })

  it('merges custom className', () => {
    render(<CardContent className="custom-class" data-testid="content">Content</CardContent>)
    expect(screen.getByTestId('content')).toHaveClass('custom-class')
  })
})

describe('CardFooter', () => {
  it('renders children', () => {
    render(<CardFooter>Footer text</CardFooter>)
    expect(screen.getByText('Footer text')).toBeInTheDocument()
  })

  it('has data-slot attribute', () => {
    render(<CardFooter data-testid="footer">Footer</CardFooter>)
    expect(screen.getByTestId('footer')).toHaveAttribute('data-slot', 'card-footer')
  })

  it('has flex layout', () => {
    render(<CardFooter data-testid="footer">Footer</CardFooter>)
    expect(screen.getByTestId('footer')).toHaveClass('flex', 'items-center')
  })

  it('merges custom className', () => {
    render(<CardFooter className="custom-class" data-testid="footer">Footer</CardFooter>)
    expect(screen.getByTestId('footer')).toHaveClass('custom-class')
  })
})

describe('Card composition', () => {
  it('renders a complete card with all parts', () => {
    render(
      <Card data-testid="card">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description</CardDescription>
          <CardAction>Action</CardAction>
        </CardHeader>
        <CardContent>Main content</CardContent>
        <CardFooter>Footer content</CardFooter>
      </Card>
    )

    expect(screen.getByText('Card Title')).toBeInTheDocument()
    expect(screen.getByText('Card description')).toBeInTheDocument()
    expect(screen.getByText('Action')).toBeInTheDocument()
    expect(screen.getByText('Main content')).toBeInTheDocument()
    expect(screen.getByText('Footer content')).toBeInTheDocument()
  })
})
