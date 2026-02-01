import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Checkbox Component
 *
 * Checkbox estilizado com suporte a estados checked, disabled e indeterminate.
 * Usa input nativo para máxima compatibilidade.
 *
 * @example
 * <Checkbox checked={isChecked} onCheckedChange={setIsChecked} />
 * <Checkbox disabled />
 */
interface CheckboxProps extends Omit<React.ComponentProps<"input">, "type" | "onChange"> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

function Checkbox({
  className,
  checked,
  onCheckedChange,
  disabled,
  ...props
}: CheckboxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCheckedChange?.(e.target.checked)
  }

  return (
    <label
      className={cn(
        "relative inline-flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className="peer sr-only"
        {...props}
      />
      <span
        className={cn(
          "border-input bg-background peer-focus-visible:ring-ring/50 peer-focus-visible:ring-[3px] flex h-4 w-4 items-center justify-center rounded-sm border shadow-xs transition-colors",
          "peer-checked:bg-primary peer-checked:border-primary peer-checked:text-primary-foreground",
          "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
          className
        )}
      >
        {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
      </span>
    </label>
  )
}

export { Checkbox }
export type { CheckboxProps }
