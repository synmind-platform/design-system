import * as React from "react"
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react"

import { cn } from "@/lib/utils"

interface MetricComparisonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Título da comparação */
  title: string
  /** Valor inicial/antes */
  beforeValue: string | number
  /** Label do valor inicial */
  beforeLabel?: string
  /** Valor final/depois */
  afterValue: string | number
  /** Label do valor final */
  afterLabel?: string
  /** Se a mudança é positiva (verde) ou negativa (vermelho) */
  isPositiveChange?: boolean
  /** Percentual de mudança */
  changePercent?: number
  /** Mostrar seta de direção */
  showArrow?: boolean
  /** Tamanho do componente */
  size?: "sm" | "default" | "lg"
}

/**
 * MetricComparison Component
 *
 * Exibe comparação visual entre dois valores (antes/depois, meta/atual).
 * Útil para dashboards B2B mostrando evolução de métricas.
 */
export function MetricComparison({
  className,
  title,
  beforeValue,
  beforeLabel = "Antes",
  afterValue,
  afterLabel = "Depois",
  isPositiveChange = true,
  changePercent,
  showArrow = true,
  size = "default",
  ...props
}: MetricComparisonProps) {
  const sizeClasses = {
    sm: {
      container: "p-4",
      title: "text-xs",
      value: "text-lg",
      label: "text-xs",
    },
    default: {
      container: "p-6",
      title: "text-sm",
      value: "text-2xl",
      label: "text-xs",
    },
    lg: {
      container: "p-8",
      title: "text-base",
      value: "text-3xl",
      label: "text-sm",
    },
  }

  const classes = sizeClasses[size]
  const changeColor = isPositiveChange
    ? "text-green-600 dark:text-green-400"
    : "text-red-600 dark:text-red-400"

  const formatValue = (val: string | number) => {
    if (typeof val === "string") return val
    return val.toLocaleString("pt-BR")
  }

  return (
    <div
      data-slot="metric-comparison"
      className={cn(
        "rounded-xl border bg-card",
        classes.container,
        className
      )}
      {...props}
    >
      {/* Title */}
      <p className={cn("font-medium text-muted-foreground mb-4", classes.title)}>
        {title}
      </p>

      {/* Comparison */}
      <div className="flex items-center justify-between gap-4">
        {/* Before */}
        <div className="flex-1 text-center">
          <p className={cn("font-bold text-muted-foreground/70", classes.value)}>
            {formatValue(beforeValue)}
          </p>
          <p className={cn("text-muted-foreground mt-1", classes.label)}>
            {beforeLabel}
          </p>
        </div>

        {/* Arrow */}
        {showArrow && (
          <div className="flex flex-col items-center gap-1 px-4">
            <ArrowRight className={cn("size-5", changeColor)} />
            {changePercent !== undefined && (
              <div className={cn("flex items-center gap-0.5 text-xs font-medium", changeColor)}>
                {isPositiveChange ? (
                  <TrendingUp className="size-3" />
                ) : (
                  <TrendingDown className="size-3" />
                )}
                {changePercent > 0 && "+"}{changePercent.toFixed(1)}%
              </div>
            )}
          </div>
        )}

        {/* After */}
        <div className="flex-1 text-center">
          <p className={cn("font-bold text-foreground", classes.value)}>
            {formatValue(afterValue)}
          </p>
          <p className={cn("text-muted-foreground mt-1", classes.label)}>
            {afterLabel}
          </p>
        </div>
      </div>
    </div>
  )
}

export default MetricComparison
