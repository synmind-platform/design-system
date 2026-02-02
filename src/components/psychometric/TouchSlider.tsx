import { cn } from "@/lib/utils";
import { useState, useRef, useCallback } from "react";

/** Minimum touch target size for accessibility (WCAG 2.5.5) */
const MIN_THUMB_SIZE = 44;

export interface TouchSliderProps {
  /** Current value */
  value?: number;
  /** Callback when value changes */
  onChange?: (value: number) => void;
  /** Minimum value (default: 1) */
  min?: number;
  /** Maximum value (default: 5) */
  max?: number;
  /** Labels for the scale */
  labels?: {
    low?: string;
    mid?: string;
    high?: string;
  };
  /** Whether the slider is disabled */
  disabled?: boolean;
  /** Size of the thumb in pixels (minimum 44px for accessibility) */
  thumbSize?: number;
  /** Show value tooltip during drag */
  showDragValue?: boolean;
  /** Additional class name */
  className?: string;
}

/**
 * TouchSlider Component
 *
 * A touch-optimized slider for selecting values on a scale.
 * Supports both mouse and touch interactions with drag functionality.
 */
export function TouchSlider({
  value,
  onChange,
  min = 1,
  max = 5,
  labels,
  disabled = false,
  thumbSize: rawThumbSize,
  showDragValue = true,
  className,
}: TouchSliderProps) {
  // Enforce minimum thumb size for accessibility
  const thumbSize = Math.max(rawThumbSize ?? 56, MIN_THUMB_SIZE);

  // Warn in development if thumbSize was below minimum
  if (process.env.NODE_ENV === 'development' && rawThumbSize && rawThumbSize < MIN_THUMB_SIZE) {
    console.warn(`TouchSlider: thumbSize (${rawThumbSize}px) is below the minimum accessible size (${MIN_THUMB_SIZE}px). Using ${MIN_THUMB_SIZE}px instead.`);
  }
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [tempValue, setTempValue] = useState<number | null>(null);

  const range = max - min;
  const options = Array.from({ length: range + 1 }, (_, i) => min + i);
  const midpoint = Math.ceil((min + max) / 2);

  const currentValue = tempValue ?? value ?? midpoint;

  const getValueFromPosition = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return midpoint;
      const rect = trackRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      const rawValue = min + percentage * range;
      return Math.round(rawValue);
    },
    [min, range, midpoint]
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
      onChange(tempValue);
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
    onChange?.(pointValue);
  };

  // Calculate thumb position
  const thumbPosition = ((currentValue - min) / range) * 100;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Value display */}
      <div className="flex justify-center">
        <div
          className={cn(
            "px-4 py-2 rounded-full text-lg font-bold transition-all",
            isDragging
              ? "bg-synmind-blue-500 text-white scale-110"
              : value !== undefined
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

          {/* Step points - minimum 44px touch area */}
          {options.map((option) => {
            const position = ((option - min) / range) * 100;
            const isActive = option <= currentValue;
            const isSelected = option === currentValue;

            return (
              <button
                key={option}
                type="button"
                onClick={() => handlePointClick(option)}
                disabled={disabled}
                aria-label={`Selecionar valor ${option}`}
                aria-pressed={isSelected}
                className={cn(
                  "absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all",
                  // Minimum 44px touch target for accessibility
                  "min-w-[44px] min-h-[44px] rounded-full border-2 flex items-center justify-center",
                  "focus:outline-none focus:ring-2 focus:ring-synmind-blue-500 focus:ring-offset-2",
                  isSelected
                    ? "w-11 h-11 border-synmind-blue-500 bg-synmind-blue-500 text-white text-sm font-bold"
                    : isActive
                      ? "w-8 h-8 border-synmind-blue-400 bg-synmind-blue-400"
                      : "w-8 h-8 border-border bg-background hover:border-synmind-blue-300"
                )}
                style={{ left: `${position}%` }}
              >
                {isSelected && option}
              </button>
            );
          })}

          {/* Draggable thumb - enforces minimum 44px size */}
          <div
            className={cn(
              "absolute top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform",
              "rounded-full",
              "bg-synmind-blue-500 shadow-lg",
              "flex items-center justify-center text-white font-bold text-xl",
              "ring-4 ring-synmind-blue-500/30",
              isDragging && "scale-110 ring-8"
            )}
            style={{
              left: `${thumbPosition}%`,
              width: `${thumbSize}px`,
              height: `${thumbSize}px`,
            }}
            aria-hidden="true"
          >
            {showDragValue && currentValue}
          </div>
        </div>
      </div>

      {/* Labels */}
      {labels && (labels.low || labels.mid || labels.high) && (
        <div className="flex justify-between text-xs text-muted-foreground px-4">
          <span className="max-w-[30%] text-left">{labels.low}</span>
          {labels.mid && <span className="max-w-[30%] text-center">{labels.mid}</span>}
          <span className="max-w-[30%] text-right">{labels.high}</span>
        </div>
      )}
    </div>
  );
}

export default TouchSlider;
