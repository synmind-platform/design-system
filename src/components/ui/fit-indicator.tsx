import * as React from "react"
import { CheckCircle2, AlertTriangle, XCircle, Target } from "lucide-react"

import { cn } from "@/lib/utils"

interface FitDimension {
  /** Nome da dimensão */
  name: string
  /** Valor atual/real */
  actual: number
  /** Valor ideal/esperado */
  ideal: number
}

interface FitIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Score de fit geral (0-100) */
  fitScore: number
  /** Dimensões individuais para comparação */
  dimensions?: FitDimension[]
  /** Título do indicador */
  title?: string
  /** Mostrar detalhes das dimensões */
  showDetails?: boolean
  /** Tamanho do indicador principal */
  size?: "sm" | "md" | "lg"
  /** Threshold para "bom" fit */
  goodThreshold?: number
  /** Threshold para "alerta" */
  warningThreshold?: number
}

const sizeConfig = {
  sm: { ring: 80, stroke: 6, text: "text-xl", label: "text-xs" },
  md: { ring: 120, stroke: 8, text: "text-3xl", label: "text-sm" },
  lg: { ring: 160, stroke: 10, text: "text-4xl", label: "text-base" },
}

/**
 * FitIndicator Component
 *
 * Indicador visual de aderência/fit entre perfil real e ideal.
 * Usado para Cultural Fit (CVF), Matcher Score, etc.
 */
export function FitIndicator({
  className,
  fitScore,
  dimensions,
  title = "Fit Score",
  showDetails = true,
  size = "md",
  goodThreshold = 75,
  warningThreshold = 50,
  ...props
}: FitIndicatorProps) {
  const config = sizeConfig[size]
  const radius = (config.ring - config.stroke) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (fitScore / 100) * circumference

  // Determina cor e status baseado no score
  const getStatus = () => {
    if (fitScore >= goodThreshold) {
      return {
        color: "#10b981",
        bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
        textColor: "text-emerald-600",
        label: "Aderência Alta",
        icon: CheckCircle2,
      }
    }
    if (fitScore >= warningThreshold) {
      return {
        color: "#D98D38",
        bgColor: "bg-[#FDF6EE] dark:bg-[#321E0C]/50",
        textColor: "text-[#D98D38]",
        label: "Aderência Moderada",
        icon: AlertTriangle,
      }
    }
    return {
      color: "#ef4444",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      textColor: "text-red-600",
      label: "Aderência Baixa",
      icon: XCircle,
    }
  }

  const status = getStatus()
  const StatusIcon = status.icon

  // Calcula gap para cada dimensão
  const getDimensionGap = (dim: FitDimension) => {
    return Math.abs(dim.actual - dim.ideal)
  }

  return (
    <div
      data-slot="fit-indicator"
      className={cn("rounded-xl border bg-card p-6", className)}
      {...props}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-[#5B7B93]" />
          <h3 className="font-semibold text-foreground">{title}</h3>
        </div>
        <span
          className={cn(
            "text-xs px-2 py-1 rounded-full font-medium",
            status.bgColor,
            status.textColor
          )}
        >
          {status.label}
        </span>
      </div>

      {/* Main indicator */}
      <div className="flex items-center gap-6">
        {/* Ring gauge */}
        <div className="relative flex-shrink-0">
          <svg
            width={config.ring}
            height={config.ring}
            className="transform -rotate-90"
          >
            {/* Background circle */}
            <circle
              cx={config.ring / 2}
              cy={config.ring / 2}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={config.stroke}
              className="text-muted"
            />
            {/* Progress circle */}
            <circle
              cx={config.ring / 2}
              cy={config.ring / 2}
              r={radius}
              fill="none"
              stroke={status.color}
              strokeWidth={config.stroke}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn("font-bold", config.text)} style={{ color: status.color }}>
              {fitScore.toFixed(0)}
            </span>
            <span className={cn("text-muted-foreground", config.label)}>pontos</span>
          </div>
        </div>

        {/* Status info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <StatusIcon className={cn("w-5 h-5", status.textColor)} />
            <span className="text-sm font-medium text-foreground">
              {fitScore >= goodThreshold
                ? "Perfil alinhado"
                : fitScore >= warningThreshold
                  ? "Ajustes recomendados"
                  : "Gap significativo"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {fitScore >= goodThreshold
              ? "O perfil real está bem alinhado com o perfil ideal definido."
              : fitScore >= warningThreshold
                ? "Existem algumas áreas que podem ser desenvolvidas para maior aderência."
                : "Há diferenças significativas entre o perfil real e o ideal esperado."}
          </p>
        </div>
      </div>

      {/* Dimensions detail */}
      {showDetails && dimensions && dimensions.length > 0 && (
        <div className="mt-6 pt-4 border-t">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Detalhamento por Dimensão
          </h4>
          <div className="space-y-3">
            {dimensions.map((dim) => {
              const gap = getDimensionGap(dim)
              const isAligned = gap <= 15

              return (
                <div key={dim.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{dim.name}</span>
                    <span className={cn(
                      "text-xs font-medium",
                      isAligned ? "text-emerald-600" : gap <= 30 ? "text-[#D98D38]" : "text-red-600"
                    )}>
                      Gap: {gap.toFixed(0)} pts
                    </span>
                  </div>

                  {/* Comparison bar */}
                  <div className="relative h-2 bg-muted rounded-full">
                    {/* Ideal marker */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-1 h-4 bg-[#5B7B93] rounded-full z-10"
                      style={{ left: `${dim.ideal}%` }}
                    />
                    {/* Actual bar */}
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        isAligned
                          ? "bg-emerald-500"
                          : gap <= 30
                            ? "bg-[#D98D38]"
                            : "bg-red-500"
                      )}
                      style={{ width: `${dim.actual}%` }}
                    />
                  </div>

                  {/* Values */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Real: {dim.actual.toFixed(0)}</span>
                    <span>Ideal: {dim.ideal.toFixed(0)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default FitIndicator
