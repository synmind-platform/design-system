import * as React from "react"
import { cn } from "@/lib/utils"

interface MindScanBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "compact" | "inline"
  colorScheme?: "default" | "blue" | "light" | "dark"
}

/**
 * MindScan Badge Component
 *
 * Selo "Powered by MindScan" para indicar que um produto/feature
 * utiliza a tecnologia científica proprietária da SynMind.
 *
 * MindScan é a "Integration Engine" - a base científica que sustenta
 * todos os produtos do ecossistema.
 *
 * Tagline: "A Ciência da Precisão Humana"
 */
export function MindScanBadge({
  variant = "default",
  colorScheme = "default",
  className,
  ...props
}: MindScanBadgeProps) {
  const baseClasses = "inline-flex items-center gap-2 font-medium"

  const variantClasses = {
    default: "px-4 py-2 rounded-lg border text-sm",
    compact: "px-3 py-1.5 rounded-md border text-xs",
    inline: "text-xs",
  }

  const colorClasses = {
    default: "bg-white/80 backdrop-blur-sm border-stone-200 text-stone-700 dark:bg-stone-800/80 dark:border-stone-700 dark:text-stone-300",
    blue: "bg-[#F0F4F7] border-[#5B7B93]/20 text-[#5B7B93] dark:bg-[#28363D] dark:border-[#5B7B93]/30 dark:text-[#96B1C4]",
    light: "bg-white border-stone-200 text-stone-600",
    dark: "bg-stone-900 border-stone-700 text-stone-200",
  }

  if (variant === "inline") {
    return (
      <span
        className={cn(
          baseClasses,
          variantClasses[variant],
          colorScheme === "dark" ? "text-stone-400" : "text-stone-500",
          className
        )}
        {...props}
      >
        <MindScanIcon className="w-4 h-4" colorScheme={colorScheme} />
        <span>Powered by MindScan<sup>®</sup></span>
      </span>
    )
  }

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        colorClasses[colorScheme],
        className
      )}
      {...props}
    >
      <MindScanIcon
        className={variant === "compact" ? "w-4 h-4" : "w-5 h-5"}
        colorScheme={colorScheme}
      />
      <div className="flex flex-col">
        <span className="leading-tight">
          Powered by <strong>MindScan</strong><sup className="text-[0.6em]">®</sup>
        </span>
        {variant === "default" && (
          <span className="text-[0.7em] opacity-70">A Ciência da Precisão Humana</span>
        )}
      </div>
    </div>
  )
}

interface MindScanIconProps extends React.SVGProps<SVGSVGElement> {
  colorScheme?: "default" | "blue" | "light" | "dark"
}

export function MindScanIcon({ colorScheme = "default", className, ...props }: MindScanIconProps) {
  const colors = {
    default: { primary: "#5B7B93", secondary: "#D98D38" },
    blue: { primary: "#5B7B93", secondary: "#7497B1" },
    light: { primary: "#57534E", secondary: "#78716C" },
    dark: { primary: "#A8A29E", secondary: "#D6D3D1" },
  }

  const { primary, secondary } = colors[colorScheme]

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("mindscan-icon", className)}
      aria-hidden="true"
      {...props}
    >
      {/* Brain/Mind scan representation */}
      <circle cx="12" cy="12" r="10" stroke={primary} strokeWidth="1.5" fill="none" />
      <path
        d="M8 12C8 9.5 9.5 8 12 8C14.5 8 16 9.5 16 12C16 14.5 14.5 16 12 16"
        stroke={secondary}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="12" cy="12" r="2" fill={primary} />
      {/* Scan lines */}
      <path d="M12 2V5" stroke={primary} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 19V22" stroke={primary} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M2 12H5" stroke={primary} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M19 12H22" stroke={primary} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export default MindScanBadge
