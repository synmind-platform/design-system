import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface AllocationOption {
  id: string;
  label: string;
  description?: string;
  color?: string;
}

interface AllocationSliderProps {
  questionId: string;
  question?: string;
  options: AllocationOption[];
  values?: Record<string, number>;
  total?: number; // Default 100
  onChange?: (questionId: string, values: Record<string, number>) => void;
  disabled?: boolean;
  showPercentages?: boolean;
  variant?: "sliders" | "pie";
  className?: string;
}

const defaultColors = [
  "var(--color-synmind-blue-400)",
  "var(--color-synmind-orange-400)",
  "var(--color-synmind-blue-600)",
  "var(--color-synmind-orange-600)",
];

export function AllocationSlider({
  questionId,
  question,
  options,
  values: externalValues,
  total = 100,
  onChange,
  disabled = false,
  showPercentages = true,
  variant = "sliders",
  className,
}: AllocationSliderProps) {
  // Initialize with equal distribution
  const getInitialValues = () => {
    const equal = Math.floor(total / options.length);
    const remainder = total - equal * options.length;
    return options.reduce(
      (acc, opt, i) => {
        acc[opt.id] = equal + (i < remainder ? 1 : 0);
        return acc;
      },
      {} as Record<string, number>
    );
  };

  const [values, setValues] = useState<Record<string, number>>(
    externalValues || getInitialValues()
  );

  useEffect(() => {
    if (externalValues) {
      setValues(externalValues);
    }
  }, [externalValues]);

  const currentTotal = Object.values(values).reduce((sum, v) => sum + v, 0);
  const isValid = currentTotal === total;

  const handleChange = (optionId: string, newValue: number) => {
    if (disabled) return;

    const clampedValue = Math.max(0, Math.min(total, newValue));
    const oldValue = values[optionId] || 0;
    const diff = clampedValue - oldValue;

    // Distribute the difference among other options proportionally
    const otherOptions = options.filter((o) => o.id !== optionId);
    const otherTotal = otherOptions.reduce(
      (sum, o) => sum + (values[o.id] || 0),
      0
    );

    const newValues = { ...values, [optionId]: clampedValue };

    if (otherTotal > 0 && diff !== 0) {
      let remaining = -diff;
      otherOptions.forEach((opt) => {
        const currentVal = values[opt.id] || 0;
        const proportion = currentVal / otherTotal;
        let adjustment = Math.round(remaining * proportion);

        // Ensure we don't go below 0
        if (currentVal + adjustment < 0) {
          adjustment = -currentVal;
        }

        newValues[opt.id] = currentVal + adjustment;
        remaining -= adjustment;
      });

      // Handle any rounding errors
      if (remaining !== 0 && otherOptions.length > 0) {
        const lastOpt = otherOptions[otherOptions.length - 1];
        newValues[lastOpt.id] = Math.max(
          0,
          (newValues[lastOpt.id] || 0) + remaining
        );
      }
    }

    setValues(newValues);
    onChange?.(questionId, newValues);
  };

  if (variant === "pie") {
    return (
      <div className={cn("space-y-4", className)}>
        {question && (
          <p className="text-base font-medium leading-relaxed">{question}</p>
        )}

        <div className="flex gap-8 items-center justify-center">
          {/* Pie chart */}
          <div className="relative">
            <svg width={160} height={160} viewBox="0 0 160 160">
              {(() => {
                let currentAngle = -90;
                return options.map((opt, i) => {
                  const value = values[opt.id] || 0;
                  const percentage = value / total;
                  const angle = percentage * 360;
                  const startAngle = currentAngle;
                  const endAngle = currentAngle + angle;
                  currentAngle = endAngle;

                  const startRad = (startAngle * Math.PI) / 180;
                  const endRad = (endAngle * Math.PI) / 180;
                  const x1 = 80 + 70 * Math.cos(startRad);
                  const y1 = 80 + 70 * Math.sin(startRad);
                  const x2 = 80 + 70 * Math.cos(endRad);
                  const y2 = 80 + 70 * Math.sin(endRad);
                  const largeArc = angle > 180 ? 1 : 0;

                  if (percentage === 0) return null;

                  return (
                    <path
                      key={opt.id}
                      d={`M 80 80 L ${x1} ${y1} A 70 70 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      fill={opt.color || defaultColors[i % defaultColors.length]}
                      className="transition-all duration-300"
                    />
                  );
                });
              })()}
              <circle cx={80} cy={80} r={35} fill="var(--background)" />
              <text
                x={80}
                y={80}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-lg font-bold fill-foreground"
              >
                {currentTotal}%
              </text>
            </svg>
          </div>

          {/* Legend with sliders */}
          <div className="space-y-3 flex-1 max-w-xs">
            {options.map((opt, i) => (
              <div key={opt.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          opt.color || defaultColors[i % defaultColors.length],
                      }}
                    />
                    <span className="text-sm font-medium">{opt.label}</span>
                  </div>
                  <span className="text-sm tabular-nums font-semibold">
                    {values[opt.id] || 0}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={total}
                  step={5}
                  value={values[opt.id] || 0}
                  onChange={(e) => handleChange(opt.id, parseInt(e.target.value))}
                  disabled={disabled}
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-synmind-blue-500"
                />
              </div>
            ))}
          </div>
        </div>

        {!isValid && (
          <p className="text-sm text-destructive text-center">
            Total deve ser {total}% (atual: {currentTotal}%)
          </p>
        )}
      </div>
    );
  }

  // Sliders variant
  return (
    <div className={cn("space-y-4", className)}>
      {question && (
        <p className="text-base font-medium leading-relaxed">{question}</p>
      )}

      <div className="space-y-4">
        {options.map((opt, i) => (
          <div key={opt.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor:
                      opt.color || defaultColors[i % defaultColors.length],
                  }}
                />
                <span className="text-sm font-medium">{opt.label}</span>
              </div>
              {showPercentages && (
                <span className="text-sm tabular-nums font-semibold">
                  {values[opt.id] || 0}%
                </span>
              )}
            </div>
            {opt.description && (
              <p className="text-xs text-muted-foreground pl-5">
                {opt.description}
              </p>
            )}
            <input
              type="range"
              min={0}
              max={total}
              step={5}
              value={values[opt.id] || 0}
              onChange={(e) => handleChange(opt.id, parseInt(e.target.value))}
              disabled={disabled}
              className={cn(
                "w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              style={{
                accentColor:
                  opt.color || defaultColors[i % defaultColors.length],
              }}
            />
          </div>
        ))}
      </div>

      {/* Total indicator */}
      <div
        className={cn(
          "flex items-center justify-between p-3 rounded-lg",
          isValid ? "bg-muted/50" : "bg-destructive/10"
        )}
      >
        <span className="text-sm font-medium">Total</span>
        <span
          className={cn(
            "text-sm tabular-nums font-bold",
            isValid ? "text-emerald-600" : "text-destructive"
          )}
        >
          {currentTotal}%{" "}
          {!isValid && (
            <span className="font-normal text-muted-foreground">
              (deve ser {total}%)
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
