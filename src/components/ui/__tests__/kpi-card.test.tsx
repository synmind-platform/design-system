import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { KPICard } from '../kpi-card'
import { TrendingUp } from 'lucide-react'

describe('KPICard', () => {
  it('renders label and value', () => {
    render(<KPICard label="Revenue" value={1000} />)

    expect(screen.getByText('Revenue')).toBeInTheDocument()
    expect(screen.getByText('1.000')).toBeInTheDocument()
  })

  it('renders string value as-is', () => {
    render(<KPICard label="Status" value="Active" />)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('has data-slot attribute', () => {
    render(<KPICard label="Test" value={100} data-testid="kpi" />)
    expect(screen.getByTestId('kpi')).toHaveAttribute('data-slot', 'kpi-card')
  })

  it('applies default variant', () => {
    render(<KPICard label="Test" value={100} data-testid="kpi" />)
    expect(screen.getByTestId('kpi')).toHaveClass('border-border')
  })

  it('applies highlight variant', () => {
    render(<KPICard label="Test" value={100} variant="highlight" data-testid="kpi" />)
    expect(screen.getByTestId('kpi')).toHaveClass('border-[#5B7B93]/30')
  })

  it('applies success variant', () => {
    render(<KPICard label="Test" value={100} variant="success" data-testid="kpi" />)
    expect(screen.getByTestId('kpi')).toHaveClass('border-green-500/30')
  })

  it('applies warning variant', () => {
    render(<KPICard label="Test" value={100} variant="warning" data-testid="kpi" />)
    expect(screen.getByTestId('kpi')).toHaveClass('border-[#D98D38]/30')
  })

  it('applies danger variant', () => {
    render(<KPICard label="Test" value={100} variant="danger" data-testid="kpi" />)
    expect(screen.getByTestId('kpi')).toHaveClass('border-red-500/30')
  })

  describe('Size variants', () => {
    it('applies small size', () => {
      render(<KPICard label="Test" value={100} size="sm" data-testid="kpi" />)
      expect(screen.getByTestId('kpi')).toHaveClass('p-4')
    })

    it('applies default size', () => {
      render(<KPICard label="Test" value={100} size="default" data-testid="kpi" />)
      expect(screen.getByTestId('kpi')).toHaveClass('p-6')
    })

    it('applies large size', () => {
      render(<KPICard label="Test" value={100} size="lg" data-testid="kpi" />)
      expect(screen.getByTestId('kpi')).toHaveClass('p-8')
    })
  })

  describe('Change indicator', () => {
    it('shows positive change with plus sign', () => {
      render(<KPICard label="Revenue" value={1000} change={15.5} />)
      expect(screen.getByText('+15.5%')).toBeInTheDocument()
    })

    it('shows negative change without plus sign', () => {
      render(<KPICard label="Revenue" value={1000} change={-10.2} />)
      expect(screen.getByText('-10.2%')).toBeInTheDocument()
    })

    it('shows zero change', () => {
      render(<KPICard label="Revenue" value={1000} change={0} />)
      expect(screen.getByText('0.0%')).toBeInTheDocument()
    })

    it('shows change period text', () => {
      render(<KPICard label="Revenue" value={1000} change={10} />)
      expect(screen.getByText('vs. período anterior')).toBeInTheDocument()
    })

    it('shows custom change period text', () => {
      render(<KPICard label="Revenue" value={1000} change={10} changePeriod="vs. last month" />)
      expect(screen.getByText('vs. last month')).toBeInTheDocument()
    })

    it('applies green color for positive change', () => {
      render(<KPICard label="Revenue" value={1000} change={15} />)
      const changeElement = screen.getByText('+15.0%').parentElement
      expect(changeElement).toHaveClass('text-green-600')
    })

    it('applies red color for negative change', () => {
      render(<KPICard label="Revenue" value={1000} change={-15} />)
      const changeElement = screen.getByText('-15.0%').parentElement
      expect(changeElement).toHaveClass('text-red-600')
    })
  })

  describe('Previous value', () => {
    it('shows previous value when provided', () => {
      render(<KPICard label="Revenue" value={1000} previousValue={800} />)
      expect(screen.getByText('(anterior: 800)')).toBeInTheDocument()
    })

    it('formats previous value with locale', () => {
      render(<KPICard label="Revenue" value={1000} previousValue={8000} />)
      expect(screen.getByText('(anterior: 8.000)')).toBeInTheDocument()
    })
  })

  describe('Target progress', () => {
    it('shows target and progress bar when provided', () => {
      render(<KPICard label="Revenue" value={750} target={1000} targetProgress={75} />)

      expect(screen.getByText('Meta: 1.000')).toBeInTheDocument()
      expect(screen.getByText('75%')).toBeInTheDocument()
    })

    it('caps progress bar at 100%', () => {
      render(<KPICard label="Revenue" value={1200} target={1000} targetProgress={120} data-testid="kpi" />)

      const progressBar = screen.getByTestId('kpi').querySelector('[style*="width"]')
      expect(progressBar).toHaveStyle({ width: '100%' })
    })
  })

  describe('Icon', () => {
    it('renders icon when provided', () => {
      render(<KPICard label="Revenue" value={1000} icon={TrendingUp} />)

      const iconContainer = document.querySelector('.p-2.rounded-lg')
      expect(iconContainer).toBeInTheDocument()
      expect(iconContainer?.querySelector('svg')).toBeInTheDocument()
    })
  })

  describe('Description', () => {
    it('shows info button when description is provided', () => {
      render(<KPICard label="Revenue" value={1000} description="Total revenue this month" />)

      const infoButton = document.querySelector('button[title="Total revenue this month"]')
      expect(infoButton).toBeInTheDocument()
    })
  })

  describe('Prefix and suffix', () => {
    it('renders prefix before value', () => {
      render(<KPICard label="Revenue" value={1000} prefix="R$ " />)
      expect(screen.getByText(/R\$ 1\.000/)).toBeInTheDocument()
    })

    it('renders suffix after value', () => {
      render(<KPICard label="Growth" value={25} suffix="%" />)
      expect(screen.getByText(/25%/)).toBeInTheDocument()
    })

    it('renders both prefix and suffix', () => {
      render(<KPICard label="Revenue" value={1000} prefix="R$ " suffix=" BRL" />)
      expect(screen.getByText(/R\$ 1\.000 BRL/)).toBeInTheDocument()
    })
  })

  describe('Sparkline', () => {
    it('renders sparkline SVG when data provided', () => {
      render(<KPICard label="Revenue" value={1000} sparkline={[10, 20, 15, 25, 30]} />)

      const svg = document.querySelector('svg[width="60"]')
      expect(svg).toBeInTheDocument()
      expect(svg?.querySelector('polyline')).toBeInTheDocument()
    })

    it('does not render sparkline when data is empty', () => {
      render(<KPICard label="Revenue" value={1000} sparkline={[]} />)

      const svg = document.querySelector('svg[width="60"]')
      expect(svg).not.toBeInTheDocument()
    })

    it('applies green stroke for upward trend', () => {
      render(<KPICard label="Revenue" value={1000} sparkline={[10, 15, 20, 25, 30]} />)

      const polyline = document.querySelector('polyline')
      expect(polyline).toHaveAttribute('stroke', '#22C55E')
    })

    it('applies red stroke for downward trend', () => {
      render(<KPICard label="Revenue" value={1000} sparkline={[30, 25, 20, 15, 10]} />)

      const polyline = document.querySelector('polyline')
      expect(polyline).toHaveAttribute('stroke', '#EF4444')
    })
  })

  it('merges custom className', () => {
    render(<KPICard label="Test" value={100} className="custom-class" data-testid="kpi" />)
    expect(screen.getByTestId('kpi')).toHaveClass('custom-class')
  })

  it('forwards additional props', () => {
    render(<KPICard label="Test" value={100} data-testid="kpi" id="test-kpi" />)
    expect(screen.getByTestId('kpi')).toHaveAttribute('id', 'test-kpi')
  })
})
