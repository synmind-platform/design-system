import { cn } from "@/lib/utils";
import { useState, useEffect, useMemo } from "react";
import { CHART_COLORS } from "@/lib/chart-colors";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

interface AllocationOption {
  id: string;
  label: string;
  description?: string;
  color?: string;
}

export interface AllocationSliderProps {
  questionId: string;
  question?: string;
  options: AllocationOption[];
  values?: Record<string, number>;
  total?: number; // Default 100
  step?: number; // Step increment for sliders, default 5
  onChange?: (questionId: string, values: Record<string, number>) => void;
  disabled?: boolean;
  readonly?: boolean;
  showPercentages?: boolean;
  variant?: "sliders" | "pie";
  pieSize?: number; // Min 200px, default 240px
  className?: string;
}

export type { AllocationOption };

// Cores distintas para cada quadrante CVF, usando CHART_COLORS
const QUADRANT_COLORS = [
  CHART_COLORS.quadrants.clan,     // Colaborativa - blue-100
  CHART_COLORS.quadrants.adhocracy, // Inovadora - orange-100
  CHART_COLORS.quadrants.market,    // Competitiva - orange-200
  CHART_COLORS.quadrants.hierarchy, // Estruturada - blue-200
];

// Cores mais saturadas para bordas e indicadores
const QUADRANT_COLORS_ACCENT = [
  CHART_COLORS.primary,        // blue-500
  CHART_COLORS.secondary,      // orange-500
  CHART_COLORS.secondaryDark,  // orange-600
  CHART_COLORS.primaryDark,    // blue-600
];

const MIN_PIE_SIZE = 200;
const DEFAULT_PIE_SIZE = 240;

const DEFAULT_STEP = 5;

export function AllocationSlider({
  questionId,
  question,
  options,
  values: externalValues,
  total = 100,
  step = DEFAULT_STEP,
  onChange,
  disabled = false,
  readonly = false,
  showPercentages = true,
  variant = "sliders",
  pieSize: rawPieSize,
  className,
}: AllocationSliderProps) {
  // Enforce minimum pieSize of 200px
  const pieSize = Math.max(rawPieSize ?? DEFAULT_PIE_SIZE, MIN_PIE_SIZE);
  if (rawPieSize !== undefined && rawPieSize < MIN_PIE_SIZE) {
    console.warn(
      `AllocationSlider: pieSize must be >= ${MIN_PIE_SIZE}px for accessibility. Using ${MIN_PIE_SIZE}px.`
    );
  }

  // Readonly behaves like disabled but may have different visual treatment
  const isInteractive = !disabled && !readonly;
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
      // Validate initial values sum
      const externalTotal = Object.values(externalValues).reduce((sum, v) => sum + v, 0);
      if (externalTotal !== total) {
        console.warn(
          `AllocationSlider: Initial values sum (${externalTotal}) does not equal total (${total}). ` +
          `Redistribution will not maintain the expected total until values are adjusted.`
        );
      }
    }
  }, [externalValues, total]);

  const currentTotal = Object.values(values).reduce((sum, v) => sum + v, 0);
  const isValid = currentTotal === total;

  const handleChange = (optionId: string, newValue: number) => {
    if (!isInteractive) return;

    const clampedValue = Math.max(0, Math.min(total, newValue));
    const oldValue = values[optionId] || 0;
    let diff = clampedValue - oldValue;

    if (diff === 0) return;

    const newValues = { ...values, [optionId]: clampedValue };

    // Find the index of the changed option
    const changedIndex = options.findIndex((o) => o.id === optionId);

    // Redistribute the difference to subsequent options in order
    // When slider N changes, the difference goes to N+1, then N+2, etc. (wrapping around)
    let remaining = -diff;
    for (let i = 1; i < options.length && remaining !== 0; i++) {
      const targetIndex = (changedIndex + i) % options.length;
      const targetOpt = options[targetIndex];
      const currentVal = newValues[targetOpt.id] || 0;

      // Calculate how much we can adjust this slider
      let adjustment = remaining;

      // Can't go below 0
      if (currentVal + adjustment < 0) {
        adjustment = -currentVal;
      }
      // Can't go above total
      if (currentVal + adjustment > total) {
        adjustment = total - currentVal;
      }

      newValues[targetOpt.id] = currentVal + adjustment;
      remaining -= adjustment;
    }

    setValues(newValues);
    onChange?.(questionId, newValues);
  };

  // Calculate total difference for display
  const totalDifference = currentTotal - total;

  // Memoize pie chart slice paths with proper scaling
  const pieSlices = useMemo(() => {
    const center = pieSize / 2;
    const radius = (pieSize / 2) * 0.85; // 85% of half-size for radius

    let currentAngle = -90;
    return options.map((opt, i) => {
      const value = values[opt.id] || 0;
      const percentage = value / total;
      const angle = percentage * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;

      // Use quadrant-specific colors for CVF, or custom color if provided
      const color = opt.color || QUADRANT_COLORS_ACCENT[i % QUADRANT_COLORS_ACCENT.length];

      // Special case: 100% should draw a full circle, not an arc
      // (arc with same start/end point is invisible)
      if (percentage >= 0.9999) {
        return {
          id: opt.id,
          path: `M ${center} ${center - radius} A ${radius} ${radius} 0 1 1 ${center} ${center + radius} A ${radius} ${radius} 0 1 1 ${center} ${center - radius} Z`,
          color,
          percentage,
          label: opt.label,
        };
      }

      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      // Outer arc points
      const x1 = center + radius * Math.cos(startRad);
      const y1 = center + radius * Math.sin(startRad);
      const x2 = center + radius * Math.cos(endRad);
      const y2 = center + radius * Math.sin(endRad);

      const largeArc = angle > 180 ? 1 : 0;

      return {
        id: opt.id,
        path: `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`,
        color,
        percentage,
        label: opt.label,
      };
    });
  }, [options, values, total, pieSize]);

  if (variant === "pie") {
    const center = pieSize / 2;
    const innerRadius = (pieSize / 2) * 0.85 * 0.45;

    return (
      <div className={cn("space-y-4", className)}>
        {question && (
          <p className="text-base font-medium leading-relaxed">{question}</p>
        )}

        <div className="flex gap-8 items-center justify-center flex-wrap">
          {/* Pie chart */}
          <div className="relative flex-shrink-0">
            <svg
              width={pieSize}
              height={pieSize}
              viewBox={`0 0 ${pieSize} ${pieSize}`}
              role="img"
              aria-label={`Gráfico de alocação: ${options.map(o => `${o.label} ${values[o.id] || 0}%`).join(', ')}`}
            >
              {pieSlices.map((slice) =>
                slice.percentage === 0 ? null : (
                  <path
                    key={slice.id}
                    d={slice.path}
                    fill={slice.color}
                    className="transition-all duration-300"
                    stroke="var(--background)"
                    strokeWidth={2}
                  />
                )
              )}
              {/* Inner circle (donut hole) */}
              <circle
                cx={center}
                cy={center}
                r={innerRadius}
                fill="var(--background)"
              />
              {/* Total display in center */}
              <text
                x={center}
                y={center - 8}
                textAnchor="middle"
                dominantBaseline="middle"
                className={cn(
                  "text-2xl font-bold",
                  isValid ? "fill-emerald-600" : "fill-destructive"
                )}
              >
                {currentTotal}%
              </text>
              {!isValid && (
                <text
                  x={center}
                  y={center + 14}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs fill-muted-foreground"
                >
                  {totalDifference > 0 ? `+${totalDifference}` : totalDifference}
                </text>
              )}
            </svg>
          </div>

          {/* Legend with sliders */}
          <div className="space-y-3 flex-1 min-w-[200px] max-w-xs">
            {options.map((opt, i) => (
              <div key={opt.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor:
                          opt.color || QUADRANT_COLORS_ACCENT[i % QUADRANT_COLORS_ACCENT.length],
                      }}
                    />
                    <span className="text-sm font-medium">{opt.label}</span>
                    {opt.description && (
                      <span
                        title={opt.description}
                        className="cursor-help text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Info className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </div>
                  <span className="text-sm tabular-nums font-semibold">
                    {values[opt.id] || 0}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={total}
                  step={step}
                  value={values[opt.id] || 0}
                  onChange={(e) => handleChange(opt.id, parseInt(e.target.value))}
                  disabled={!isInteractive}
                  aria-label={`${opt.label}: ${values[opt.id] || 0}%`}
                  className={cn(
                    "w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer",
                    !isInteractive && "opacity-50 cursor-not-allowed"
                  )}
                  style={{
                    accentColor:
                      opt.color || QUADRANT_COLORS_ACCENT[i % QUADRANT_COLORS_ACCENT.length],
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Total validation message below */}
        {!isValid && (
          <div className="flex items-center justify-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>Total deve ser {total}% (atual: {currentTotal}%)</span>
          </div>
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
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      opt.color || QUADRANT_COLORS_ACCENT[i % QUADRANT_COLORS_ACCENT.length],
                  }}
                />
                <span className="text-sm font-medium">{opt.label}</span>
                {opt.description && (
                  <span
                    title={opt.description}
                    className="cursor-help text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Info className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
              {showPercentages && (
                <span className="text-sm tabular-nums font-semibold">
                  {values[opt.id] || 0}%
                </span>
              )}
            </div>
            <input
              type="range"
              min={0}
              max={total}
              step={step}
              value={values[opt.id] || 0}
              onChange={(e) => handleChange(opt.id, parseInt(e.target.value))}
              disabled={!isInteractive}
              aria-label={`${opt.label}: ${values[opt.id] || 0}%`}
              className={cn(
                "w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer",
                !isInteractive && "opacity-50 cursor-not-allowed"
              )}
              style={{
                accentColor:
                  opt.color || QUADRANT_COLORS_ACCENT[i % QUADRANT_COLORS_ACCENT.length],
              }}
            />
          </div>
        ))}
      </div>

      {/* Total indicator with enhanced feedback */}
      <div
        className={cn(
          "flex items-center justify-between p-3 rounded-lg transition-colors",
          isValid ? "bg-emerald-50 dark:bg-emerald-950/20" : "bg-destructive/10"
        )}
      >
        <div className="flex items-center gap-2">
          {isValid ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-destructive" />
          )}
          <span className="text-sm font-medium">Total</span>
        </div>
        <span
          className={cn(
            "text-sm tabular-nums font-bold",
            isValid ? "text-emerald-600" : "text-destructive"
          )}
        >
          {currentTotal}%
          {!isValid && (
            <span className="ml-2 font-normal text-muted-foreground">
              ({totalDifference > 0 ? "+" : ""}{totalDifference})
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
