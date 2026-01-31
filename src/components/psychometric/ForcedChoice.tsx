import { cn } from "@/lib/utils";
import { useState } from "react";
import { Check, X } from "lucide-react";

interface TetradOption {
  id: string;
  text: string;
}

interface ForcedChoiceProps {
  questionId: string;
  instruction?: string;
  options: TetradOption[];
  mostSelected?: string;
  leastSelected?: string;
  onChange?: (questionId: string, most: string | null, least: string | null) => void;
  disabled?: boolean;
  variant?: "separate" | "combined";
  className?: string;
}

export function ForcedChoice({
  questionId,
  instruction = "Selecione a opção que MAIS e a que MENOS descreve você",
  options,
  mostSelected,
  leastSelected,
  onChange,
  disabled = false,
  variant = "combined",
  className,
}: ForcedChoiceProps) {
  const [selectingType, setSelectingType] = useState<"most" | "least" | null>(
    null
  );

  const handleSelect = (optionId: string, type: "most" | "least") => {
    if (disabled) return;

    let newMost = mostSelected;
    let newLeast = leastSelected;

    if (type === "most") {
      if (optionId === mostSelected) {
        newMost = undefined;
      } else {
        newMost = optionId;
        if (optionId === leastSelected) {
          newLeast = undefined;
        }
      }
    } else {
      if (optionId === leastSelected) {
        newLeast = undefined;
      } else {
        newLeast = optionId;
        if (optionId === mostSelected) {
          newMost = undefined;
        }
      }
    }

    onChange?.(questionId, newMost ?? null, newLeast ?? null);
  };

  if (variant === "separate") {
    return (
      <div className={cn("space-y-6", className)}>
        <p className="text-sm text-muted-foreground">{instruction}</p>

        {/* MOST selection */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
              <Check className="size-3 text-white" />
            </div>
            Mais me descreve
          </h4>
          <div className="grid gap-2">
            {options.map((option) => (
              <button
                key={`most-${option.id}`}
                type="button"
                onClick={() => handleSelect(option.id, "most")}
                disabled={disabled || option.id === leastSelected}
                className={cn(
                  "w-full p-3 text-left rounded-lg border transition-all",
                  "focus:outline-none focus:ring-2 focus:ring-ring",
                  mostSelected === option.id
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                    : option.id === leastSelected
                      ? "opacity-40 cursor-not-allowed"
                      : "border-border hover:border-emerald-300 hover:bg-emerald-50/50",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <span className="text-sm">{option.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* LEAST selection */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
              <X className="size-3 text-white" />
            </div>
            Menos me descreve
          </h4>
          <div className="grid gap-2">
            {options.map((option) => (
              <button
                key={`least-${option.id}`}
                type="button"
                onClick={() => handleSelect(option.id, "least")}
                disabled={disabled || option.id === mostSelected}
                className={cn(
                  "w-full p-3 text-left rounded-lg border transition-all",
                  "focus:outline-none focus:ring-2 focus:ring-ring",
                  leastSelected === option.id
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                    : option.id === mostSelected
                      ? "opacity-40 cursor-not-allowed"
                      : "border-border hover:border-red-300 hover:bg-red-50/50",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <span className="text-sm">{option.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Combined variant: side-by-side selection
  return (
    <div className={cn("space-y-4", className)}>
      <p className="text-sm text-muted-foreground">{instruction}</p>

      <div className="space-y-2">
        {/* Header */}
        <div className="grid grid-cols-[1fr_auto_auto] gap-2 px-3 text-xs font-medium text-muted-foreground">
          <span>Afirmação</span>
          <span className="w-16 text-center text-emerald-600">Mais</span>
          <span className="w-16 text-center text-red-600">Menos</span>
        </div>

        {/* Options */}
        {options.map((option) => (
          <div
            key={option.id}
            className={cn(
              "grid grid-cols-[1fr_auto_auto] gap-2 items-center p-3 rounded-lg border",
              (mostSelected === option.id || leastSelected === option.id) &&
                "bg-muted/30"
            )}
          >
            <span className="text-sm">{option.text}</span>

            {/* Most button */}
            <button
              type="button"
              onClick={() => handleSelect(option.id, "most")}
              disabled={disabled}
              className={cn(
                "w-16 h-8 rounded-md border-2 flex items-center justify-center transition-all",
                "focus:outline-none focus:ring-2 focus:ring-ring",
                mostSelected === option.id
                  ? "border-emerald-500 bg-emerald-500"
                  : "border-border hover:border-emerald-300",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {mostSelected === option.id && (
                <Check className="size-4 text-white" />
              )}
            </button>

            {/* Least button */}
            <button
              type="button"
              onClick={() => handleSelect(option.id, "least")}
              disabled={disabled}
              className={cn(
                "w-16 h-8 rounded-md border-2 flex items-center justify-center transition-all",
                "focus:outline-none focus:ring-2 focus:ring-ring",
                leastSelected === option.id
                  ? "border-red-500 bg-red-500"
                  : "border-border hover:border-red-300",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {leastSelected === option.id && (
                <X className="size-4 text-white" />
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Validation hint */}
      {(!mostSelected || !leastSelected) && (
        <p className="text-xs text-muted-foreground">
          {!mostSelected && !leastSelected
            ? "Selecione uma opção para 'Mais' e uma para 'Menos'"
            : !mostSelected
              ? "Selecione a opção que mais o descreve"
              : "Selecione a opção que menos o descreve"}
        </p>
      )}
    </div>
  );
}
