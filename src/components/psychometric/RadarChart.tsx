import { memo, useMemo } from "react";
import { cn } from "@/lib/utils";
import { DIMENSION_LABELS } from "@/types/psychometric";

interface RadarChartProps {
  scores: Record<string, number>; // 0-100 scale
  dimensions: string[];
  size?: number;
  showLabels?: boolean;
  showValues?: boolean;
  variant?: "filled" | "line";
  className?: string;
}

export const RadarChart = memo(function RadarChart({
  scores,
  dimensions,
  size = 280,
  showLabels = true,
  showValues = false,
  variant = "filled",
  className,
}: RadarChartProps) {
  // Guard against empty or invalid dimensions array
  if (!dimensions || dimensions.length === 0) {
    return (
      <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
        <span className="text-sm text-muted-foreground">Sem dados para exibir</span>
      </div>
    );
  }

  const centerX = size / 2;
  const centerY = size / 2;
  const maxRadius = (size / 2) * 0.7;

  // Safe division - dimensions.length is guaranteed > 0 by guard above
  const angleStep = (2 * Math.PI) / dimensions.length;
  const startAngle = -Math.PI / 2; // Start from top

  // Memoize SVG calculations
  const { points, polygonPath, chartDescription } = useMemo(() => {
    // Calculate points for each dimension
    const getPoint = (dimension: string, index: number) => {
      const value = scores[dimension] ?? 0;
      const normalizedValue = Math.max(0, Math.min(100, value)) / 100;
      const angle = startAngle + index * angleStep;
      const radius = normalizedValue * maxRadius;
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        labelX: centerX + (maxRadius + 24) * Math.cos(angle),
        labelY: centerY + (maxRadius + 24) * Math.sin(angle),
        value,
        angle,
      };
    };

    const calculatedPoints = dimensions.map((dim, i) => ({
      dimension: dim,
      ...getPoint(dim, i),
    }));

    // Create polygon path
    const path = calculatedPoints
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ") + " Z";

    // Generate accessible description of the chart data
    const description = dimensions
      .map((dim) => {
        const label = DIMENSION_LABELS[dim] || dim;
        const value = Math.round(scores[dim] ?? 0);
        return `${label}: ${value}%`;
      })
      .join(", ");

    return { points: calculatedPoints, polygonPath: path, chartDescription: description };
  }, [scores, dimensions, size, centerX, centerY, maxRadius, angleStep, startAngle]);

  // Grid circles (25%, 50%, 75%, 100%)
  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <div className={cn("relative", className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
        role="img"
        aria-labelledby="radar-chart-title radar-chart-desc"
      >
        <title id="radar-chart-title">Gráfico Radar de Dimensões</title>
        <desc id="radar-chart-desc">
          Gráfico radar mostrando {dimensions.length} dimensões. {chartDescription}
        </desc>
        {/* Grid circles */}
        {gridLevels.map((level) => (
          <circle
            key={level}
            cx={centerX}
            cy={centerY}
            r={maxRadius * level}
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            className="text-border"
            strokeDasharray={level < 1 ? "2 2" : "none"}
          />
        ))}

        {/* Axis lines */}
        {points.map((point, i) => (
          <line
            key={`axis-${i}`}
            x1={centerX}
            y1={centerY}
            x2={centerX + maxRadius * Math.cos(point.angle)}
            y2={centerY + maxRadius * Math.sin(point.angle)}
            stroke="currentColor"
            strokeWidth={1}
            className="text-border"
          />
        ))}

        {/* Data polygon */}
        <path
          d={polygonPath}
          fill={
            variant === "filled"
              ? "var(--color-synmind-blue-500)"
              : "transparent"
          }
          fillOpacity={variant === "filled" ? 0.2 : 0}
          stroke="var(--color-synmind-blue-500)"
          strokeWidth={2}
          className="transition-all duration-500"
        />

        {/* Data points */}
        {points.map((point, i) => (
          <circle
            key={`point-${i}`}
            cx={point.x}
            cy={point.y}
            r={5}
            fill="var(--color-synmind-blue-500)"
            stroke="white"
            strokeWidth={2}
            className="transition-all duration-300"
          />
        ))}

        {/* Labels */}
        {showLabels &&
          points.map((point, i) => {
            const label = DIMENSION_LABELS[point.dimension] || point.dimension;
            const isLeft = point.angle > Math.PI / 2 && point.angle < (3 * Math.PI) / 2;

            return (
              <text
                key={`label-${i}`}
                x={point.labelX}
                y={point.labelY}
                textAnchor={
                  Math.abs(point.angle - startAngle) < 0.1 ||
                  Math.abs(point.angle - startAngle - Math.PI) < 0.1
                    ? "middle"
                    : isLeft
                      ? "end"
                      : "start"
                }
                dominantBaseline={
                  Math.abs(point.angle - startAngle) < 0.1
                    ? "auto"
                    : Math.abs(point.angle - startAngle - Math.PI) < 0.1
                      ? "hanging"
                      : "middle"
                }
                className="text-xs fill-muted-foreground font-medium"
              >
                {label}
                {showValues && (
                  <tspan className="fill-foreground font-semibold">
                    {" "}
                    {Math.round(point.value)}
                  </tspan>
                )}
              </text>
            );
          })}
      </svg>
    </div>
  );
});
