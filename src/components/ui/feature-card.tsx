import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const featureCardVariants = cva(
  "relative rounded-xl border p-6 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-card hover:shadow-md",
        b2b: "bg-card border-[#5B7B93]/20 hover:border-[#5B7B93]/40 hover:shadow-md",
        b2c: "bg-card border-[#D98D38]/20 hover:border-[#D98D38]/40 hover:shadow-md",
        highlight: "bg-gradient-to-br from-[#5B7B93]/5 to-[#D98D38]/5 border-[#5B7B93]/30 hover:shadow-lg",
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

interface FeatureCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof featureCardVariants> {
  icon?: LucideIcon
  title: string
  description: string
  badge?: string
}

function FeatureCard({
  className,
  variant,
  size,
  icon: Icon,
  title,
  description,
  badge,
  children,
  ...props
}: FeatureCardProps) {
  const iconColorClass = variant === "b2c"
    ? "text-[#D98D38]"
    : variant === "b2b"
      ? "text-[#5B7B93]"
      : "text-primary"

  return (
    <div
      data-slot="feature-card"
      className={cn(featureCardVariants({ variant, size }), className)}
      {...props}
    >
      {badge && (
        <span className={cn(
          "absolute -top-2 right-4 px-2 py-0.5 text-xs font-medium rounded-full",
          variant === "b2c"
            ? "bg-[#D98D38] text-white"
            : "bg-[#5B7B93] text-white"
        )}>
          {badge}
        </span>
      )}

      {Icon && (
        <div className={cn(
          "inline-flex items-center justify-center w-10 h-10 rounded-lg mb-4",
          variant === "b2c"
            ? "bg-[#D98D38]/10"
            : variant === "b2b"
              ? "bg-[#5B7B93]/10"
              : "bg-primary/10"
        )}>
          <Icon className={cn("size-5", iconColorClass)} />
        </div>
      )}

      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>

      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  )
}

export { FeatureCard, featureCardVariants }
