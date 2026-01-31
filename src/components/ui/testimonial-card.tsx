import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Quote } from "lucide-react"

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
            <svg
              key={i}
              className={cn(
                "size-4",
                i < rating ? "text-[#D98D38] fill-[#D98D38]" : "text-stone-300 dark:text-stone-600"
              )}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
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
