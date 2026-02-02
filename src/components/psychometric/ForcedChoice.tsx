import { cn } from "@/lib/utils";
import { useState, useCallback } from "react";
import { Check, X, AlertCircle } from "lucide-react";

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
  readonly?: boolean;
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
  readonly = false,
  variant = "combined",
  className,
}: ForcedChoiceProps) {
  const [conflictFeedback, setConflictFeedback] = useState<string | null>(null);

  const handleSelect = useCallback((optionId: string, type: "most" | "least") => {
    if (disabled || readonly) return;

    // Check for conflict: trying to select same option for both
    if (type === "most" && optionId === leastSelected) {
      setConflictFeedback("least");
      setTimeout(() => setConflictFeedback(null), 800);
      return;
    }
    if (type === "least" && optionId === mostSelected) {
      setConflictFeedback("most");
      setTimeout(() => setConflictFeedback(null), 800);
      return;
    }

    let newMost = mostSelected;
    let newLeast = leastSelected;

    if (type === "most") {
      newMost = optionId === mostSelected ? undefined : optionId;
    } else {
      newLeast = optionId === leastSelected ? undefined : optionId;
    }

    onChange?.(questionId, newMost ?? null, newLeast ?? null);
  }, [disabled, readonly, mostSelected, leastSelected, onChange, questionId]);

  const isComplete = mostSelected && leastSelected;
  const isInteractive = !disabled && !readonly;

  // Calculate what's missing for accessibility
  const getMissingText = () => {
    if (isComplete) return null;
    if (!mostSelected && !leastSelected) {
      return "Selecione uma opção para 'Mais' e uma para 'Menos'";
    }
    if (!mostSelected) {
      return "Selecione a opção que mais o descreve";
    }
    return "Selecione a opção que menos o descreve";
  };

  if (variant === "separate") {
    return (
      <div className={cn("space-y-8", className)}>
        <p className="text-sm text-muted-foreground">{instruction}</p>

        {/* MOST selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                mostSelected
                  ? "bg-emerald-500"
                  : "bg-emerald-100 dark:bg-emerald-900/40 border-2 border-dashed border-emerald-400"
              )}
            >
              <Check className={cn("size-4", mostSelected ? "text-white" : "text-emerald-500")} />
            </div>
            <h4 className="text-base font-semibold text-emerald-700 dark:text-emerald-400">
              Mais me descreve
            </h4>
            {!mostSelected && (
              <span className="text-xs text-muted-foreground ml-auto">
                (selecione uma)
              </span>
            )}
          </div>
          <div className="grid gap-3 pl-11">
            {options.map((option) => {
              const isSelected = mostSelected === option.id;
              const isOtherSelected = leastSelected === option.id;

              return (
                <button
                  key={`most-${option.id}`}
                  type="button"
                  onClick={() => handleSelect(option.id, "most")}
                  disabled={!isInteractive || isOtherSelected}
                  className={cn(
                    "w-full p-3 min-h-[44px] text-left rounded-lg border-2 transition-all",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    isSelected
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30"
                      : isOtherSelected
                        ? "border-border bg-muted/30 opacity-40 cursor-not-allowed"
                        : isInteractive
                          ? "border-border hover:border-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20"
                          : "border-border opacity-50 cursor-not-allowed"
                  )}
                >
                  <span className="text-sm">{option.text}</span>
                  {isOtherSelected && (
                    <span className="text-xs text-muted-foreground block mt-1">
                      (já selecionada como "Menos")
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">ou</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* LEAST selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                leastSelected
                  ? "bg-red-500"
                  : "bg-red-100 dark:bg-red-900/40 border-2 border-dashed border-red-400"
              )}
            >
              <X className={cn("size-4", leastSelected ? "text-white" : "text-red-500")} />
            </div>
            <h4 className="text-base font-semibold text-red-700 dark:text-red-400">
              Menos me descreve
            </h4>
            {!leastSelected && (
              <span className="text-xs text-muted-foreground ml-auto">
                (selecione uma)
              </span>
            )}
          </div>
          <div className="grid gap-3 pl-11">
            {options.map((option) => {
              const isSelected = leastSelected === option.id;
              const isOtherSelected = mostSelected === option.id;

              return (
                <button
                  key={`least-${option.id}`}
                  type="button"
                  onClick={() => handleSelect(option.id, "least")}
                  disabled={!isInteractive || isOtherSelected}
                  className={cn(
                    "w-full p-3 min-h-[44px] text-left rounded-lg border-2 transition-all",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    isSelected
                      ? "border-red-500 bg-red-50 dark:bg-red-900/30"
                      : isOtherSelected
                        ? "border-border bg-muted/30 opacity-40 cursor-not-allowed"
                        : isInteractive
                          ? "border-border hover:border-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20"
                          : "border-border opacity-50 cursor-not-allowed"
                  )}
                >
                  <span className="text-sm">{option.text}</span>
                  {isOtherSelected && (
                    <span className="text-xs text-muted-foreground block mt-1">
                      (já selecionada como "Mais")
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Completion status */}
        {!readonly && (
          <div
            className={cn(
              "flex items-center gap-2 p-3 rounded-lg text-sm",
              isComplete
                ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                : "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
            )}
          >
            {isComplete ? (
              <>
                <Check className="size-4" />
                <span>Seleção completa</span>
              </>
            ) : (
              <>
                <AlertCircle className="size-4" />
                <span>{getMissingText()}</span>
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  // Combined variant: table layout with improved spacing and visual differentiation
  return (
    <div className={cn("space-y-4", className)}>
      <p className="text-sm text-muted-foreground">{instruction}</p>

      <div className="space-y-3">
        {/* Header with improved visual distinction */}
        <div className="grid grid-cols-[1fr_auto_auto] gap-3 px-4 py-2 bg-muted/30 rounded-t-lg border border-b-0 border-border">
          <span className="text-sm font-medium text-foreground">Afirmação</span>
          <div className="w-14 flex flex-col items-center gap-1">
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
              <Check className="size-3 text-white" />
            </div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Mais</span>
          </div>
          <div className="w-14 flex flex-col items-center gap-1">
            <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
              <X className="size-3 text-white" />
            </div>
            <span className="text-xs font-semibold text-red-600 dark:text-red-400">Menos</span>
          </div>
        </div>

        {/* Options with improved spacing */}
        <div className="border border-border rounded-b-lg divide-y divide-border">
          {options.map((option, index) => {
            const isMostSelected = mostSelected === option.id;
            const isLeastSelected = leastSelected === option.id;
            // Show conflict on the "most" button when user tried to select this option as "least" but it's already "most"
            const showMostConflict = conflictFeedback === "most" && mostSelected === option.id;
            // Show conflict on the "least" button when user tried to select this option as "most" but it's already "least"
            const showLeastConflict = conflictFeedback === "least" && leastSelected === option.id;

            return (
              <div
                key={option.id}
                className={cn(
                  "grid grid-cols-[1fr_auto_auto] gap-3 items-center px-4 py-4",
                  index % 2 === 0 ? "bg-background" : "bg-muted/10",
                  (isMostSelected || isLeastSelected) && "bg-muted/20"
                )}
              >
                <span className="text-sm text-foreground">{option.text}</span>

                {/* Most button */}
                <button
                  type="button"
                  onClick={() => handleSelect(option.id, "most")}
                  disabled={!isInteractive}
                  className={cn(
                    "w-14 h-11 rounded-lg border-2 flex items-center justify-center transition-all",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    isMostSelected
                      ? "border-emerald-500 bg-emerald-500"
                      : isLeastSelected
                        ? "border-border bg-muted/50 opacity-40"
                        : isInteractive
                          ? "border-border hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                          : "border-border opacity-50",
                    showLeastConflict && "animate-pulse border-red-400 bg-red-50 dark:bg-red-900/30",
                    !isInteractive && "cursor-not-allowed"
                  )}
                  aria-label={`Selecionar "${option.text}" como mais me descreve`}
                  aria-pressed={isMostSelected}
                >
                  {isMostSelected && <Check className="size-5 text-white" />}
                </button>

                {/* Least button */}
                <button
                  type="button"
                  onClick={() => handleSelect(option.id, "least")}
                  disabled={!isInteractive}
                  className={cn(
                    "w-14 h-11 rounded-lg border-2 flex items-center justify-center transition-all",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    isLeastSelected
                      ? "border-red-500 bg-red-500"
                      : isMostSelected
                        ? "border-border bg-muted/50 opacity-40"
                        : isInteractive
                          ? "border-border hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                          : "border-border opacity-50",
                    showMostConflict && "animate-pulse border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30",
                    !isInteractive && "cursor-not-allowed"
                  )}
                  aria-label={`Selecionar "${option.text}" como menos me descreve`}
                  aria-pressed={isLeastSelected}
                >
                  {isLeastSelected && <X className="size-5 text-white" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completion status */}
      {!readonly && (
        <div
          className={cn(
            "flex items-center gap-2 p-3 rounded-lg text-sm",
            isComplete
              ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
              : "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
          )}
        >
          {isComplete ? (
            <>
              <Check className="size-4" />
              <span>Seleção completa</span>
            </>
          ) : (
            <>
              <AlertCircle className="size-4" />
              <span>{getMissingText()}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
