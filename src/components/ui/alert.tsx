import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from "lucide-react"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        info: "border-[#5B7B93]/30 bg-[#F0F4F7] text-[#394D5A] dark:border-[#5B7B93]/40 dark:bg-[#28363D] dark:text-[#B9CBD8] [&>svg]:text-[#5B7B93]",
        success: "border-green-500/30 bg-green-50 text-green-800 dark:border-green-500/40 dark:bg-green-950 dark:text-green-200 [&>svg]:text-green-600 dark:[&>svg]:text-green-400",
        warning: "border-[#D98D38]/30 bg-[#FDF6EE] text-[#8A5620] dark:border-[#D98D38]/40 dark:bg-[#321E0C] dark:text-[#F5D5AE] [&>svg]:text-[#D98D38]",
        destructive: "border-destructive/30 bg-red-50 text-red-800 dark:border-destructive/40 dark:bg-red-950 dark:text-red-200 [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const alertIcons = {
  default: Info,
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  destructive: AlertCircle,
}

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  icon?: boolean
  dismissible?: boolean
  onDismiss?: () => void
}

function Alert({
  className,
  variant = "default",
  icon = true,
  dismissible = false,
  onDismiss,
  children,
  ...props
}: AlertProps) {
  const IconComponent = alertIcons[variant || "default"]

  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {icon && <IconComponent />}
      <div className="flex-1">{children}</div>
      {dismissible && (
        <button
          onClick={onDismiss}
          className="absolute right-2 top-2 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          aria-label="Dismiss"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"h5">) {
  return (
    <h5
      data-slot="alert-title"
      className={cn("font-medium leading-none tracking-tight", className)}
      {...props}
    />
  )
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn("text-sm opacity-90 [&_p]:leading-relaxed", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, alertVariants }
