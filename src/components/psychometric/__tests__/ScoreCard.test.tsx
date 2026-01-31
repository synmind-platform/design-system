import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ScoreCard } from '../ScoreCard'

describe('ScoreCard', () => {
  const defaultProps = {
    dimension: 'extraversion',
    score: 75,
  }

  describe('Detailed variant (default)', () => {
    it('renders the dimension label', () => {
      render(<ScoreCard {...defaultProps} />)
      // "extraversion" maps to "Sociabilidade" in DIMENSION_LABELS
      expect(screen.getByText('Sociabilidade')).toBeInTheDocument()
    })

    it('renders the score value', () => {
      render(<ScoreCard {...defaultProps} score={75} />)
      expect(screen.getByText('75')).toBeInTheDocument()
    })

    it('rounds the score value', () => {
      render(<ScoreCard {...defaultProps} score={75.7} />)
      expect(screen.getByText('76')).toBeInTheDocument()
    })

    it('renders with Card wrapper', () => {
      render(<ScoreCard {...defaultProps} />)
      const card = document.querySelector('[data-slot="card"]')
      expect(card).toBeInTheDocument()
    })

    it('shows classification label when provided', () => {
      render(<ScoreCard {...defaultProps} classification="HIGH" />)
      expect(screen.getByText('Alto')).toBeInTheDocument()
    })

    it('shows VERY_LOW classification', () => {
      render(<ScoreCard {...defaultProps} classification="VERY_LOW" />)
      expect(screen.getByText('Muito Baixo')).toBeInTheDocument()
    })

    it('shows LOW classification', () => {
      render(<ScoreCard {...defaultProps} classification="LOW" />)
      expect(screen.getByText('Baixo')).toBeInTheDocument()
    })

    it('shows VERY_HIGH classification', () => {
      render(<ScoreCard {...defaultProps} classification="VERY_HIGH" />)
      expect(screen.getByText('Muito Alto')).toBeInTheDocument()
    })

    it('applies correct color for HIGH classification', () => {
      render(<ScoreCard {...defaultProps} classification="HIGH" />)
      const classificationText = screen.getByText('Alto')
      expect(classificationText).toHaveClass('text-synmind-orange-400')
    })

    it('applies correct color for LOW classification', () => {
      render(<ScoreCard {...defaultProps} classification="LOW" />)
      const classificationText = screen.getByText('Baixo')
      expect(classificationText).toHaveClass('text-synmind-blue-500')
    })

    it('renders description when provided', () => {
      render(<ScoreCard {...defaultProps} description="You tend to be outgoing and social." />)
      expect(screen.getByText('You tend to be outgoing and social.')).toBeInTheDocument()
    })

    it('renders ScoreBar component', () => {
      render(<ScoreCard {...defaultProps} />)
      // ScoreBar renders with bg-muted class
      const scoreBar = document.querySelector('.bg-muted.rounded-full')
      expect(scoreBar).toBeInTheDocument()
    })
  })

  describe('Change indicator', () => {
    it('shows positive change', () => {
      render(<ScoreCard {...defaultProps} previousScore={65} />)
      // Score is 75, previous is 65, so change is +10
      expect(screen.getByText('+10')).toBeInTheDocument()
    })

    it('shows negative change', () => {
      render(<ScoreCard {...defaultProps} score={60} previousScore={75} />)
      // Score is 60, previous is 75, so change is -15
      expect(screen.getByText('-15')).toBeInTheDocument()
    })

    it('applies green color for positive change', () => {
      render(<ScoreCard {...defaultProps} previousScore={65} />)
      const changeElement = screen.getByText('+10').parentElement
      expect(changeElement).toHaveClass('text-emerald-500')
    })

    it('applies red color for negative change', () => {
      render(<ScoreCard {...defaultProps} score={60} previousScore={75} />)
      const changeElement = screen.getByText('-15').parentElement
      expect(changeElement).toHaveClass('text-red-500')
    })

    it('applies muted color for zero change', () => {
      render(<ScoreCard {...defaultProps} score={75} previousScore={75} />)
      // Change is 0, should be muted
      const changeElements = document.querySelectorAll('.text-muted-foreground')
      expect(changeElements.length).toBeGreaterThan(0)
    })

    it('does not show change when previousScore is not provided', () => {
      render(<ScoreCard {...defaultProps} />)
      expect(screen.queryByText(/\+/)).not.toBeInTheDocument()
      expect(screen.queryByText(/-/)).not.toBeInTheDocument()
    })
  })

  describe('Trend icons', () => {
    it('shows TrendingUp icon for significant positive change in compact mode', () => {
      render(<ScoreCard {...defaultProps} variant="compact" previousScore={65} />)
      // Change of 10 is > 5, should show TrendingUp in compact mode
      const svg = document.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('shows TrendingDown icon for significant negative change in compact mode', () => {
      render(<ScoreCard {...defaultProps} variant="compact" score={60} previousScore={70} />)
      // Change of -10 is < -5, should show TrendingDown in compact mode
      const svg = document.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('Compact variant', () => {
    it('renders in compact mode', () => {
      render(<ScoreCard {...defaultProps} variant="compact" />)
      // Compact variant doesn't use Card wrapper
      const card = document.querySelector('[data-slot="card"]')
      expect(card).not.toBeInTheDocument()
    })

    it('renders dimension label in compact mode', () => {
      render(<ScoreCard {...defaultProps} variant="compact" />)
      expect(screen.getByText('Sociabilidade')).toBeInTheDocument()
    })

    it('renders score value in compact mode', () => {
      render(<ScoreCard {...defaultProps} variant="compact" />)
      expect(screen.getByText('75')).toBeInTheDocument()
    })

    it('renders ScoreBar in compact mode', () => {
      render(<ScoreCard {...defaultProps} variant="compact" />)
      const scoreBar = document.querySelector('.bg-muted.rounded-full')
      expect(scoreBar).toBeInTheDocument()
    })

    it('shows trend icon for significant change in compact mode', () => {
      render(<ScoreCard {...defaultProps} variant="compact" previousScore={60} />)
      const svg = document.querySelector('.size-5')
      expect(svg).toBeInTheDocument()
    })

    it('has compact styling', () => {
      render(<ScoreCard {...defaultProps} variant="compact" />)
      // Compact variant uses a div with flex, p-3, rounded-lg, bg-muted/50
      const outerContainer = screen.getByText('Sociabilidade').closest('.p-3')
      expect(outerContainer).toBeInTheDocument()
      expect(outerContainer).toHaveClass('rounded-lg')
    })
  })

  describe('Dimension labels', () => {
    it('maps extraversion to Sociabilidade', () => {
      render(<ScoreCard dimension="extraversion" score={50} />)
      expect(screen.getByText('Sociabilidade')).toBeInTheDocument()
    })

    it('maps agreeableness to Colaboração', () => {
      render(<ScoreCard dimension="agreeableness" score={50} />)
      expect(screen.getByText('Colaboração')).toBeInTheDocument()
    })

    it('maps conscientiousness to Organização', () => {
      render(<ScoreCard dimension="conscientiousness" score={50} />)
      expect(screen.getByText('Organização')).toBeInTheDocument()
    })

    it('maps neuroticism to Sensibilidade', () => {
      render(<ScoreCard dimension="neuroticism" score={50} />)
      expect(screen.getByText('Sensibilidade')).toBeInTheDocument()
    })

    it('maps openness to Abertura', () => {
      render(<ScoreCard dimension="openness" score={50} />)
      expect(screen.getByText('Abertura')).toBeInTheDocument()
    })

    it('uses dimension key as fallback for unknown dimensions', () => {
      render(<ScoreCard dimension="unknown_dimension" score={50} />)
      expect(screen.getByText('unknown_dimension')).toBeInTheDocument()
    })
  })

  it('merges custom className', () => {
    render(<ScoreCard {...defaultProps} className="custom-class" />)
    const card = document.querySelector('[data-slot="card"]')
    expect(card).toHaveClass('custom-class')
  })

  it('merges custom className in compact mode', () => {
    render(<ScoreCard {...defaultProps} variant="compact" className="custom-class" />)
    const container = screen.getByText('Sociabilidade').closest('.custom-class')
    expect(container).toBeInTheDocument()
  })
})
