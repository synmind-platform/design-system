import * as React from "react"
import { cn } from "@/lib/utils"

interface BrandDotProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 1 | 2 | 3
  size?: "sm" | "md" | "lg"
  animated?: boolean
}

const sizeMap = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
}

/**
 * BrandDot Component
 *
 * Elementos pontuais da marca SynMind (Ponto1, Ponto2, Ponto3).
 * Usados como elementos decorativos em interfaces, bullets, ou indicadores.
 *
 * - Variante 1: Dot sólido laranja (ação, destaque)
 * - Variante 2: Dot sólido azul (corporativo, confiança)
 * - Variante 3: Dot com gradiente (premium, conexão)
 */
export function BrandDot({
  variant = 1,
  size = "md",
  animated = false,
  className,
  ...props
}: BrandDotProps) {
  const baseClasses = cn(
    "rounded-full flex-shrink-0",
    sizeMap[size],
    animated && "animate-pulse",
    className
  )

  if (variant === 1) {
    return (
      <div
        className={cn(baseClasses, "bg-synmind-orange")}
        style={{ backgroundColor: "var(--color-synmind-orange-500, #D98D38)" }}
        aria-hidden="true"
        {...props}
      />
    )
  }

  if (variant === 2) {
    return (
      <div
        className={cn(baseClasses, "bg-synmind-blue")}
        style={{ backgroundColor: "var(--color-synmind-blue-500, #5B7B93)" }}
        aria-hidden="true"
        {...props}
      />
    )
  }

  // Variant 3: Gradient
  return (
    <div
      className={baseClasses}
      style={{
        background: "linear-gradient(135deg, var(--color-synmind-orange-500, #D98D38) 0%, var(--color-synmind-blue-500, #5B7B93) 100%)",
      }}
      aria-hidden="true"
      {...props}
    />
  )
}

interface BrandDotsGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  gap?: "tight" | "normal" | "loose"
  animated?: boolean
}

const gapMap = {
  tight: "gap-1",
  normal: "gap-2",
  loose: "gap-3",
}

/**
 * BrandDotsGroup Component
 *
 * Grupo dos três pontos da marca, frequentemente usado como
 * elemento decorativo ou indicador de progresso/loading.
 */
export function BrandDotsGroup({
  size = "md",
  gap = "normal",
  animated = false,
  className,
  ...props
}: BrandDotsGroupProps) {
  return (
    <div
      className={cn("inline-flex items-center", gapMap[gap], className)}
      role="img"
      aria-label="SynMind brand dots"
      {...props}
    >
      <BrandDot
        variant={1}
        size={size}
        animated={animated}
        style={animated ? { animationDelay: "0ms" } : undefined}
      />
      <BrandDot
        variant={3}
        size={size}
        animated={animated}
        style={animated ? { animationDelay: "150ms" } : undefined}
      />
      <BrandDot
        variant={2}
        size={size}
        animated={animated}
        style={animated ? { animationDelay: "300ms" } : undefined}
      />
    </div>
  )
}

export default BrandDot
