import { cn } from "@/lib/utils";
import { useState, useRef, useCallback } from "react";

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
      <TouchSlider
        questionId={questionId}
        question={question}
        scale={scale}
        labels={scaleLabels}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={className}
      />
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
            const isInRange =
              hoveredValue !== null &&
              ((hoveredValue >= option && option >= 1) ||
                (value !== undefined && option <= value));

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

// Touch-optimized slider component
interface TouchSliderProps {
  questionId: string;
  question: string;
  scale: number;
  labels: { low: string; high: string; mid?: string };
  value?: number;
  onChange?: (questionId: string, value: number) => void;
  disabled?: boolean;
  className?: string;
}

function TouchSlider({
  questionId,
  question,
  scale,
  labels,
  value,
  onChange,
  disabled = false,
  className,
}: TouchSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [tempValue, setTempValue] = useState<number | null>(null);
  const options = Array.from({ length: scale }, (_, i) => i + 1);
  const midpoint = Math.ceil(scale / 2);

  const currentValue = tempValue ?? value ?? midpoint;

  const getValueFromPosition = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return midpoint;
      const rect = trackRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      const rawValue = 1 + percentage * (scale - 1);
      return Math.round(rawValue);
    },
    [scale, midpoint]
  );

  const handleStart = (clientX: number) => {
    if (disabled) return;
    setIsDragging(true);
    const newValue = getValueFromPosition(clientX);
    setTempValue(newValue);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || disabled) return;
    const newValue = getValueFromPosition(clientX);
    setTempValue(newValue);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (tempValue !== null && onChange) {
      onChange(questionId, tempValue);
    }
    setTempValue(null);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    handleMove(e.touches[0].clientX);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const handleMouseUp = () => {
      handleEnd();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handlePointClick = (pointValue: number) => {
    if (disabled) return;
    onChange?.(questionId, pointValue);
  };

  // Calculate thumb position
  const thumbPosition = ((currentValue - 1) / (scale - 1)) * 100;

  return (
    <div className={cn("space-y-4", className)}>
      <p className="text-base font-medium leading-relaxed">{question}</p>

      {/* Value display */}
      <div className="flex justify-center">
        <div
          className={cn(
            "px-4 py-2 rounded-full text-lg font-bold transition-all",
            isDragging
              ? "bg-synmind-blue-500 text-white scale-110"
              : value
                ? "bg-synmind-blue-100 text-synmind-blue-700 dark:bg-synmind-blue-900/40 dark:text-synmind-blue-300"
                : "bg-muted text-muted-foreground"
          )}
        >
          {currentValue}
        </div>
      </div>

      {/* Touch track */}
      <div className="px-4 py-6">
        <div
          ref={trackRef}
          className={cn(
            "relative h-12 cursor-pointer select-none touch-none",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleEnd}
        >
          {/* Track background */}
          <div className="absolute top-1/2 left-0 right-0 h-2 -translate-y-1/2 rounded-full bg-muted" />

          {/* Filled track */}
          <div
            className="absolute top-1/2 left-0 h-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-synmind-blue-400 to-synmind-blue-500 transition-all"
            style={{ width: `${thumbPosition}%` }}
          />

          {/* Step points */}
          {options.map((option) => {
            const position = ((option - 1) / (scale - 1)) * 100;
            const isActive = option <= currentValue;
            const isSelected = option === currentValue;

            return (
              <button
                key={option}
                type="button"
                onClick={() => handlePointClick(option)}
                disabled={disabled}
                className={cn(
                  "absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all",
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                  "focus:outline-none focus:ring-2 focus:ring-synmind-blue-500 focus:ring-offset-2",
                  isSelected
                    ? "w-8 h-8 border-synmind-blue-500 bg-synmind-blue-500 text-white text-xs font-bold"
                    : isActive
                      ? "border-synmind-blue-400 bg-synmind-blue-400"
                      : "border-border bg-background hover:border-synmind-blue-300"
                )}
                style={{ left: `${position}%` }}
              >
                {isSelected && option}
              </button>
            );
          })}

          {/* Draggable thumb */}
          <div
            className={cn(
              "absolute top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform",
              "w-14 h-14 rounded-full",
              "bg-synmind-blue-500 shadow-lg",
              "flex items-center justify-center text-white font-bold text-xl",
              "ring-4 ring-synmind-blue-500/30",
              isDragging && "scale-110 ring-8"
            )}
            style={{ left: `${thumbPosition}%` }}
          >
            {currentValue}
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs text-muted-foreground px-4">
        <span className="max-w-[30%] text-left">{labels.low}</span>
        {labels.mid && <span className="max-w-[30%] text-center">{labels.mid}</span>}
        <span className="max-w-[30%] text-right">{labels.high}</span>
      </div>
    </div>
  );
}
