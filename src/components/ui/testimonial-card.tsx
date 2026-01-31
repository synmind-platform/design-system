import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Quote, Star } from "lucide-react"

import { cn } from "@/lib/utils"
import { MindScanBadge } from "@/components/brand"

const testimonialCardVariants = cva(
  "relative rounded-xl border bg-card p-6",
  {
    variants: {
      variant: {
        default: "",
        b2b: "border-[#5B7B93]/20",
        b2c: "border-[#D98D38]/20",
        featured: "border-[#D98D38]/30 bg-gradient-to-br from-[#FDF6EE] to-white dark:from-[#321E0C]/20 dark:to-card",
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

interface TestimonialCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof testimonialCardVariants> {
  quote: string
  author: string
  role?: string
  company?: string
  avatarUrl?: string
  rating?: number
  showMindScanBadge?: boolean
}

function TestimonialCard({
  className,
  variant,
  size,
  quote,
  author,
  role,
  company,
  avatarUrl,
  rating,
  showMindScanBadge = false,
  ...props
}: TestimonialCardProps) {
  const quoteColor = variant === "b2c" || variant === "featured"
    ? "text-[#D98D38]/20"
    : variant === "b2b"
      ? "text-[#5B7B93]/20"
      : "text-primary/20"

  return (
    <div
      data-slot="testimonial-card"
      className={cn(testimonialCardVariants({ variant, size }), className)}
      {...props}
    >
      <Quote className={cn("absolute top-4 right-4 size-8", quoteColor)} />

      {rating !== undefined && (
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "size-4",
                i < rating ? "text-[#D98D38] fill-[#D98D38]" : "text-stone-300 dark:text-stone-600"
              )}
            />
          ))}
        </div>
      )}

      <blockquote className="text-foreground leading-relaxed mb-6">
        "{quote}"
      </blockquote>

      <div className="flex items-center gap-3">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={author}
            className="size-10 rounded-full object-cover"
          />
        ) : (
          <div className={cn(
            "size-10 rounded-full flex items-center justify-center font-medium text-white",
            variant === "b2c" || variant === "featured"
              ? "bg-[#D98D38]"
              : variant === "b2b"
                ? "bg-[#5B7B93]"
                : "bg-primary"
          )}>
            {author.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate">{author}</p>
          {(role || company) && (
            <p className="text-sm text-muted-foreground truncate">
              {role}{role && company && " · "}{company}
            </p>
          )}
        </div>
      </div>

      {showMindScanBadge && (
        <div className="mt-4 pt-4 border-t border-border">
          <MindScanBadge variant="inline" />
        </div>
      )}
    </div>
  )
}

export { TestimonialCard, testimonialCardVariants }
