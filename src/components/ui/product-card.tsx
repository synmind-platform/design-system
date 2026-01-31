import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ArrowRight, Check } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./button"
import { MindScanBadge } from "@/components/brand"

const productCardVariants = cva(
  "relative rounded-xl border bg-card overflow-hidden transition-all duration-300",
  {
    variants: {
      variant: {
        default: "hover:shadow-lg",
        b2b: "border-[#5B7B93]/20 hover:border-[#5B7B93]/40 hover:shadow-lg",
        b2c: "border-[#D98D38]/20 hover:border-[#D98D38]/40 hover:shadow-lg",
        featured: "border-[#D98D38] shadow-lg ring-1 ring-[#D98D38]/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface ProductCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof productCardVariants> {
  name: string
  description: string
  icon?: LucideIcon
  badge?: string
  features?: string[]
  price?: string
  priceNote?: string
  ctaLabel?: string
  ctaHref?: string
  onCtaClick?: () => void
  showMindScanBadge?: boolean
}

/**
 * ProductCard Component
 *
 * Card para exibir produtos do ecossistema SynMind.
 *
 * Produtos B2B (sufixo "Mind"): StrategiMind, MindFit, MindMap, CultureMind
 * Produtos B2C: Leitura Essencial, Relatório de Clareza, etc.
 */
function ProductCard({
  className,
  variant,
  name,
  description,
  icon: Icon,
  badge,
  features,
  price,
  priceNote,
  ctaLabel = "Saiba mais",
  ctaHref,
  onCtaClick,
  showMindScanBadge = true,
  ...props
}: ProductCardProps) {
  const accentColor = variant === "b2c" || variant === "featured"
    ? "#D98D38"
    : "#5B7B93"

  return (
    <div
      data-slot="product-card"
      className={cn(productCardVariants({ variant }), className)}
      {...props}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute top-0 right-0">
          <div
            className="px-3 py-1 text-xs font-medium text-white rounded-bl-lg"
            style={{ backgroundColor: accentColor }}
          >
            {badge}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-6 pb-0">
        {Icon && (
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
            style={{ backgroundColor: `${accentColor}15` }}
          >
            <Icon className="size-6" style={{ color: accentColor }} />
          </div>
        )}

        <h3 className="text-xl font-semibold text-foreground mb-2">{name}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </div>

      {/* Features */}
      {features && features.length > 0 && (
        <div className="px-6 py-4">
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <Check
                  className="size-5 flex-shrink-0 mt-0.5"
                  style={{ color: accentColor }}
                  strokeWidth={2}
                />
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Price */}
      {price && (
        <div className="px-6 py-4 border-t border-border">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">{price}</span>
            {priceNote && (
              <span className="text-sm text-muted-foreground">{priceNote}</span>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-6 pt-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between gap-4">
          {showMindScanBadge && (
            <MindScanBadge variant="inline" />
          )}

          <Button
            variant={variant === "featured" ? "default" : "outline"}
            size="sm"
            className={cn(
              "ml-auto",
              variant === "featured" && "bg-[#D98D38] hover:bg-[#B6722A]"
            )}
            onClick={onCtaClick}
            asChild={!!ctaHref}
          >
            {ctaHref ? (
              <a href={ctaHref}>
                {ctaLabel}
                <ArrowRight className="size-4" />
              </a>
            ) : (
              <>
                {ctaLabel}
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export { ProductCard, productCardVariants }
