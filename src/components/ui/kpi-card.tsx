import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { TrendingUp, TrendingDown, Minus, Info } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const kpiCardVariants = cva(
  "rounded-xl border bg-card p-6 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-border",
        highlight: "border-[#5B7B93]/30 bg-gradient-to-br from-[#F0F4F7] to-white dark:from-[#28363D]/50 dark:to-card",
        success: "border-green-500/30 bg-gradient-to-br from-green-50 to-white dark:from-green-950/30 dark:to-card",
        warning: "border-[#D98D38]/30 bg-gradient-to-br from-[#FDF6EE] to-white dark:from-[#321E0C]/30 dark:to-card",
        danger: "border-red-500/30 bg-gradient-to-br from-red-50 to-white dark:from-red-950/30 dark:to-card",
      },
      size: {
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface KPICardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof kpiCardVariants> {
  /** Título/label do KPI */
  label: string
  /** Valor principal do KPI */
  value: string | number
  /** Valor anterior para comparação */
  previousValue?: string | number
  /** Percentual de mudança */
  change?: number
  /** Texto descrevendo o período da mudança */
  changePeriod?: string
  /** Meta/target do KPI */
  target?: string | number
  /** Progresso em relação à meta (0-100) */
  targetProgress?: number
  /** Ícone do KPI */
  icon?: LucideIcon
  /** Descrição/tooltip do KPI */
  description?: string
  /** Formato do valor (ex: "currency", "percent", "number") */
  format?: "currency" | "percent" | "number" | "custom"
  /** Prefixo do valor */
  prefix?: string
  /** Sufixo do valor */
  suffix?: string
  /** Sparkline data (array de números) */
  sparkline?: number[]
}

/**
 * KPICard Component
 *
 * Card avançado para exibição de KPIs em dashboards B2B.
 * Inclui suporte a:
 * - Comparação com período anterior
 * - Progresso em relação a metas
 * - Sparklines simplificados
 * - Múltiplos formatos de valor
 */
export function KPICard({
  className,
  variant,
  size,
  label,
  value,
  previousValue,
  change,
  changePeriod = "vs. período anterior",
  target,
  targetProgress,
  icon: Icon,
  description,
  prefix,
  suffix,
  sparkline,
  ...props
}: KPICardProps) {
  const isPositive = change !== undefined && change > 0
  const isNegative = change !== undefined && change < 0

  const TrendIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus

  const trendColor = isPositive
    ? "text-green-600 dark:text-green-400"
    : isNegative
      ? "text-red-600 dark:text-red-400"
      : "text-muted-foreground"

  const formatValue = (val: string | number) => {
    if (typeof val === "string") return val
    return val.toLocaleString("pt-BR")
  }

  return (
    <div
      data-slot="kpi-card"
      className={cn(kpiCardVariants({ variant, size }), className)}
      {...props}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className="p-2 rounded-lg bg-[#5B7B93]/10">
              <Icon className="size-4 text-[#5B7B93]" />
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            {description && (
              <button
                className="inline-flex items-center gap-1 text-xs text-muted-foreground/70 hover:text-muted-foreground"
                title={description}
              >
                <Info className="size-3" />
              </button>
            )}
          </div>
        </div>

        {/* Sparkline */}
        {sparkline && sparkline.length > 0 && (
          <SparklineChart data={sparkline} />
        )}
      </div>

      {/* Value */}
      <div className="mb-3">
        <span
          className="text-3xl font-bold tracking-tight text-foreground"
          aria-label={`${label}: ${prefix || ""}${formatValue(value)}${suffix || ""}`}
        >
          {prefix}{formatValue(value)}{suffix}
        </span>
        {previousValue !== undefined && (
          <span className="ml-2 text-sm text-muted-foreground" aria-hidden="true">
            (anterior: {formatValue(previousValue)})
          </span>
        )}
      </div>

      {/* Change indicator */}
      {change !== undefined && (
        <div className="flex items-center gap-2 mb-3">
          <div
            className={cn("flex items-center gap-1", trendColor)}
            aria-label={`Variação de ${Math.abs(change).toFixed(1)}% ${isPositive ? "positiva" : isNegative ? "negativa" : "neutra"} ${changePeriod}`}
          >
            <TrendIcon className="size-4" aria-hidden="true" />
            <span className="text-sm font-medium">
              {isPositive && "+"}{change.toFixed(1)}%
            </span>
          </div>
          <span className="text-xs text-muted-foreground" aria-hidden="true">{changePeriod}</span>
        </div>
      )}

      {/* Target progress */}
      {target !== undefined && targetProgress !== undefined && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Meta: {formatValue(target)}</span>
            <span className="font-medium">{targetProgress.toFixed(0)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                targetProgress >= 100
                  ? "bg-green-500"
                  : targetProgress >= 75
                    ? "bg-[#5B7B93]"
                    : targetProgress >= 50
                      ? "bg-[#D98D38]"
                      : "bg-red-500"
              )}
              style={{ width: `${Math.min(targetProgress, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Simple Sparkline Chart
 */
function SparklineChart({ data }: { data: number[] }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 60
    const y = 20 - ((value - min) / range) * 16
    return `${x},${y}`
  }).join(" ")

  const isUpward = data[data.length - 1] > data[0]
  const trendLabel = isUpward ? "crescente" : "decrescente"

  return (
    <svg
      width="60"
      height="24"
      className="text-muted-foreground"
      role="img"
      aria-label={`Tendência ${trendLabel} ao longo de ${data.length} pontos`}
    >
      <title>Gráfico de tendência</title>
      <polyline
        points={points}
        fill="none"
        stroke={isUpward ? "#22C55E" : "#EF4444"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export { kpiCardVariants }
