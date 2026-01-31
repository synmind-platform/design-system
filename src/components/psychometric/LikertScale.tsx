import { cn } from "@/lib/utils";
import { useState } from "react";
import { TouchSlider } from "./TouchSlider";

interface LikertScaleProps {
  questionId: string;
  question: string;
  scale: number; // 5, 6, or 7 point scale
  labels?: {
    low: string;
    high: string;
    mid?: string;
  };
  value?: number;
  onChange?: (questionId: string, value: number) => void;
  disabled?: boolean;
  variant?: "buttons" | "slider" | "radio" | "touch";
  className?: string;
}

const defaultLabels: Record<number, { low: string; high: string; mid?: string }> = {
  5: {
    low: "Discordo totalmente",
    high: "Concordo totalmente",
    mid: "Neutro",
  },
  6: {
    low: "Discordo totalmente",
    high: "Concordo totalmente",
  },
  7: {
    low: "Discordo totalmente",
    high: "Concordo totalmente",
    mid: "Neutro",
  },
};

export function LikertScale({
  questionId,
  question,
  scale,
  labels,
  value,
  onChange,
  disabled = false,
  variant = "buttons",
  className,
}: LikertScaleProps) {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  const scaleLabels = labels || defaultLabels[scale] || defaultLabels[5];
  const options = Array.from({ length: scale }, (_, i) => i + 1);
  const midpoint = Math.ceil(scale / 2);

  const handleSelect = (selectedValue: number) => {
    if (!disabled && onChange) {
      onChange(questionId, selectedValue);
    }
  };

  if (variant === "slider") {
    return (
      <div className={cn("space-y-4", className)}>
        <p className="text-base font-medium leading-relaxed">{question}</p>
        <div className="space-y-2">
          <input
            type="range"
            min={1}
            max={scale}
            step={1}
            value={value || midpoint}
            onChange={(e) => handleSelect(parseInt(e.target.value))}
            disabled={disabled}
            className={cn(
              "w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer",
              "accent-synmind-blue-500",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{scaleLabels.low}</span>
            {scaleLabels.mid && <span>{scaleLabels.mid}</span>}
            <span>{scaleLabels.high}</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "touch") {
    return (
      <div className={cn("space-y-4", className)}>
        <p className="text-base font-medium leading-relaxed">{question}</p>
        <TouchSlider
          value={value}
          onChange={(v) => onChange?.(questionId, v)}
          min={1}
          max={scale}
          labels={scaleLabels}
          disabled={disabled}
        />
      </div>
    );
  }

  if (variant === "radio") {
    return (
      <div className={cn("space-y-4", className)}>
        <p className="text-base font-medium leading-relaxed">{question}</p>
        <div className="space-y-2">
          {options.map((option) => (
            <label
              key={option}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                value === option
                  ? "border-synmind-blue-500 bg-synmind-blue-50 dark:bg-synmind-blue-900/20"
                  : "border-border hover:bg-muted/50",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <input
                type="radio"
                name={questionId}
                value={option}
                checked={value === option}
                onChange={() => handleSelect(option)}
                disabled={disabled}
                className="sr-only"
              />
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                  value === option
                    ? "border-synmind-blue-500 bg-synmind-blue-500"
                    : "border-muted-foreground"
                )}
              >
                {value === option && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <span className="text-sm">
                {option === 1
                  ? scaleLabels.low
                  : option === scale
                    ? scaleLabels.high
                    : option === midpoint && scaleLabels.mid
                      ? scaleLabels.mid
                      : option}
              </span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  // Default: buttons variant
  return (
    <div className={cn("space-y-4", className)}>
      <p className="text-base font-medium leading-relaxed">{question}</p>
      <div className="space-y-2">
        <div className="flex gap-2 justify-center">
          {options.map((option) => {
            const isSelected = value === option;
            const isHovered = hoveredValue === option;

            return (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                onMouseEnter={() => setHoveredValue(option)}
                onMouseLeave={() => setHoveredValue(null)}
                disabled={disabled}
                className={cn(
                  "w-12 h-12 rounded-lg border-2 font-semibold transition-all",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  isSelected
                    ? "border-synmind-blue-500 bg-synmind-blue-500 text-white"
                    : isHovered
                      ? "border-synmind-blue-400 bg-synmind-blue-50 dark:bg-synmind-blue-900/30"
                      : "border-border bg-background hover:border-synmind-blue-300",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground px-1">
          <span>{scaleLabels.low}</span>
          {scaleLabels.mid && <span>{scaleLabels.mid}</span>}
          <span>{scaleLabels.high}</span>
        </div>
      </div>
    </div>
  );
}

