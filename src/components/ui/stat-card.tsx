import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const statCardVariants = cva(
  "rounded-xl border bg-card p-6",
  {
    variants: {
      variant: {
        default: "",
        b2b: "border-[#5B7B93]/20",
        b2c: "border-[#D98D38]/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface StatCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statCardVariants> {
  label: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: LucideIcon
}

function StatCard({
  className,
  variant,
  label,
  value,
  change,
  changeLabel,
  icon: Icon,
  ...props
}: StatCardProps) {
  const isPositive = change !== undefined && change > 0
  const isNegative = change !== undefined && change < 0

  const TrendIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus

  const trendColor = isPositive
    ? "text-green-600 dark:text-green-400"
    : isNegative
      ? "text-red-600 dark:text-red-400"
      : "text-muted-foreground"

  const iconColorClass = variant === "b2c"
    ? "text-[#D98D38]"
    : variant === "b2b"
      ? "text-[#5B7B93]"
      : "text-primary"

  return (
    <div
      data-slot="stat-card"
      className={cn(statCardVariants({ variant }), className)}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
        </div>

        {Icon && (
          <div className={cn(
            "p-2 rounded-lg",
            variant === "b2c"
              ? "bg-[#D98D38]/10"
              : variant === "b2b"
                ? "bg-[#5B7B93]/10"
                : "bg-primary/10"
          )}>
            <Icon className={cn("size-5", iconColorClass)} />
          </div>
        )}
      </div>

      {change !== undefined && (
        <div className="flex items-center gap-1.5 mt-3">
          <TrendIcon className={cn("size-4", trendColor)} />
          <span className={cn("text-sm font-medium", trendColor)}>
            {isPositive && "+"}{change}%
          </span>
          {changeLabel && (
            <span className="text-sm text-muted-foreground">{changeLabel}</span>
          )}
        </div>
      )}
    </div>
  )
}

export { StatCard, statCardVariants }
