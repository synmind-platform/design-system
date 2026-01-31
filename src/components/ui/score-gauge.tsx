import * as React from "react"

import { cn } from "@/lib/utils"

interface ScoreGaugeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Valor do score (0-100) */
  value: number
  /** Label do fator/dimensão */
  label: string
  /** Descrição adicional */
  description?: string
  /** Mostrar faixas de classificação */
  showRanges?: boolean
  /** Tamanho do gauge */
  size?: "sm" | "md" | "lg"
  /** Mostrar valor numérico */
  showValue?: boolean
  /** Cor customizada (usa cor baseada na faixa por padrão) */
  color?: string
}

const ranges = [
  { min: 0, max: 25, label: "Muito Baixo", color: "bg-slate-400" },
  { min: 26, max: 50, label: "Baixo", color: "bg-[#5B7B93]" },
  { min: 51, max: 75, label: "Alto", color: "bg-[#D98D38]" },
  { min: 76, max: 100, label: "Muito Alto", color: "bg-emerald-500" },
]

function getRange(value: number) {
  return ranges.find((r) => value >= r.min && value <= r.max) || ranges[0]
}

/**
 * ScoreGauge Component
 *
 * Visualização de scores psicométricos no formato 0-100.
 * Inspirado no sistema de avaliação SynMind.
 */
export function ScoreGauge({
  className,
  value,
  label,
  description,
  showRanges = true,
  size = "md",
  showValue = true,
  color,
  ...props
}: ScoreGaugeProps) {
  const range = getRange(value)
  const barColor = color || range.color

  const sizeClasses = {
    sm: { bar: "h-2", text: "text-xs", value: "text-lg" },
    md: { bar: "h-3", text: "text-sm", value: "text-2xl" },
    lg: { bar: "h-4", text: "text-base", value: "text-3xl" },
  }

  return (
    <div
      data-slot="score-gauge"
      className={cn("space-y-2", className)}
      {...props}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className={cn("font-medium text-foreground", sizeClasses[size].text)}>
            {label}
          </span>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        {showValue && (
          <div className="text-right">
            <span className={cn("font-bold text-foreground", sizeClasses[size].value)}>
              {value.toFixed(0)}
            </span>
            <span className="text-xs text-muted-foreground ml-1">pts</span>
          </div>
        )}
      </div>

      {/* Gauge Bar */}
      <div className="relative">
        <div className={cn("w-full bg-muted rounded-full overflow-hidden", sizeClasses[size].bar)}>
          <div
            className={cn("h-full rounded-full transition-all duration-500", barColor)}
            style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          />
        </div>

        {/* Range markers */}
        {showRanges && (
          <div className="absolute inset-0 flex">
            {[25, 50, 75].map((mark) => (
              <div
                key={mark}
                className="absolute top-0 h-full border-l border-background/50"
                style={{ left: `${mark}%` }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Range Label */}
      {showRanges && (
        <div className="flex items-center justify-between">
          <span className={cn("text-xs font-medium", range.color.replace("bg-", "text-"))}>
            {range.label}
          </span>
          <div className="flex gap-1 text-[10px] text-muted-foreground">
            {ranges.map((r) => (
              <span
                key={r.label}
                className={cn(
                  "px-1.5 py-0.5 rounded",
                  value >= r.min && value <= r.max
                    ? "bg-muted font-medium text-foreground"
                    : ""
                )}
              >
                {r.min}-{r.max}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ScoreGauge
