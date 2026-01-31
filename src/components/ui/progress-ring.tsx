import * as React from "react"

import { cn } from "@/lib/utils"

interface ProgressRingProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Valor do progresso (0-100) */
  value: number
  /** Tamanho do anel */
  size?: "sm" | "default" | "lg" | "xl"
  /** Espessura do traço */
  strokeWidth?: number
  /** Cor do progresso */
  color?: "primary" | "success" | "warning" | "danger" | "auto"
  /** Mostrar valor no centro */
  showValue?: boolean
  /** Label abaixo do valor */
  label?: string
  /** Sufixo do valor (ex: "%") */
  suffix?: string
}

const sizeMap = {
  sm: 48,
  default: 80,
  lg: 120,
  xl: 160,
}

const strokeWidthMap = {
  sm: 4,
  default: 6,
  lg: 8,
  xl: 10,
}

/**
 * ProgressRing Component
 *
 * Indicador circular de progresso para dashboards B2B.
 * Ideal para mostrar metas, completion rates, scores.
 */
export function ProgressRing({
  className,
  value,
  size = "default",
  strokeWidth,
  color = "auto",
  showValue = true,
  label,
  suffix = "%",
  ...props
}: ProgressRingProps) {
  const diameter = sizeMap[size]
  const stroke = strokeWidth ?? strokeWidthMap[size]
  const radius = (diameter - stroke) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (Math.min(value, 100) / 100) * circumference

  const getColor = () => {
    if (color !== "auto") {
      const colorMap = {
        primary: "#5B7B93",
        success: "#22C55E",
        warning: "#D98D38",
        danger: "#EF4444",
      }
      return colorMap[color]
    }

    // Auto color based on value
    if (value >= 80) return "#22C55E"
    if (value >= 60) return "#5B7B93"
    if (value >= 40) return "#D98D38"
    return "#EF4444"
  }

  const progressColor = getColor()

  return (
    <div
      data-slot="progress-ring"
      className={cn("inline-flex flex-col items-center", className)}
      {...props}
    >
      <div className="relative" style={{ width: diameter, height: diameter }}>
        <svg
          width={diameter}
          height={diameter}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-muted/30"
          />
          {/* Progress circle */}
          <circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            fill="none"
            stroke={progressColor}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {/* Center content */}
        {showValue && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className={cn(
                "font-bold text-foreground",
                size === "sm" && "text-xs",
                size === "default" && "text-lg",
                size === "lg" && "text-2xl",
                size === "xl" && "text-3xl"
              )}
            >
              {Math.round(value)}{suffix}
            </span>
          </div>
        )}
      </div>

      {label && (
        <span className="mt-2 text-sm text-muted-foreground text-center">
          {label}
        </span>
      )}
    </div>
  )
}

export default ProgressRing
