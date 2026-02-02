import { memo } from "react";
import { cn } from "@/lib/utils";
import type { ClassificationLabel } from "@/types/psychometric";

interface ScoreBarProps {
  /** Valor do score (0-100) ou null para estado vazio */
  value: number | null;
  /** Label da dimensão */
  label?: string;
  /** Classificação semântica para cor */
  classification?: ClassificationLabel;
  /** Exibir valor numérico */
  showValue?: boolean;
  /** Tamanho da barra */
  size?: "sm" | "md" | "lg";
  /** Estilo visual da barra */
  variant?: "default" | "gradient" | "segmented";
  /** Classes adicionais */
  className?: string;
}

const classificationColors: Record<ClassificationLabel, string> = {
  VERY_LOW: "bg-synmind-blue-200",
  LOW: "bg-synmind-blue-400",
  HIGH: "bg-synmind-orange-400",
  VERY_HIGH: "bg-synmind-orange-500",
};

const sizeClasses = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export const ScoreBar = memo(function ScoreBar({
  value,
  label,
  classification,
  showValue = true,
  size = "md",
  variant = "default",
  className,
}: ScoreBarProps) {
  const isEmptyState = value === null || value === undefined;
  const clampedValue = isEmptyState ? 0 : Math.max(0, Math.min(100, value));

  const getBarColor = () => {
    if (classification) {
      return classificationColors[classification];
    }
    // Default gradient based on value
    if (clampedValue < 25) return "bg-synmind-blue-300";
    if (clampedValue < 50) return "bg-synmind-blue-500";
    if (clampedValue < 75) return "bg-synmind-orange-400";
    return "bg-synmind-orange-500";
  };

  const ariaLabel = label
    ? `${label}: ${isEmptyState ? "dados indisponíveis" : `${Math.round(clampedValue)}%`}`
    : isEmptyState
      ? "Score indisponível"
      : `Score: ${Math.round(clampedValue)}%`;

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-sm font-medium text-foreground">{label}</span>
          )}
          {showValue && (
            <span className="text-sm tabular-nums text-muted-foreground">
              {isEmptyState ? "-" : Math.round(clampedValue)}
            </span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={isEmptyState ? undefined : Math.round(clampedValue)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel}
        className={cn(
          "w-full rounded-full bg-muted overflow-hidden",
          sizeClasses[size]
        )}
      >
        {isEmptyState ? (
          // Empty state: show subtle striped pattern to indicate no data
          <div className="h-full w-full bg-muted" />
        ) : variant === "segmented" ? (
          <div className="flex h-full gap-0.5">
            {[0, 25, 50, 75].map((threshold) => (
              <div
                key={threshold}
                className={cn(
                  "flex-1 transition-colors duration-300",
                  clampedValue > threshold
                    ? threshold < 50
                      ? "bg-synmind-blue-400"
                      : "bg-synmind-orange-400"
                    : "bg-transparent"
                )}
              />
            ))}
          </div>
        ) : variant === "gradient" ? (
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${clampedValue}%`,
              background: `linear-gradient(to right, var(--color-synmind-blue-400), var(--color-synmind-orange-500))`,
            }}
          />
        ) : (
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out",
              getBarColor()
            )}
            style={{ width: `${clampedValue}%` }}
          />
        )}
      </div>
    </div>
  );
});
