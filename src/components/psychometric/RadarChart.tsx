import { memo, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import { DIMENSION_LABELS } from "@/types/psychometric";
import type { ChartSize } from "@/types/psychometric";
import { useChartSize } from "@/hooks/useChartSize";
import { CHART_COLORS } from "@/lib/chart-colors";
import { EmptyState } from "./EmptyState";

interface RadarChartProps {
  scores: Record<string, number>; // 0-100 scale
  dimensions: string[];
  size?: ChartSize;
  showLabels?: boolean;
  showValues?: boolean;
  variant?: "filled" | "line";
  className?: string;
}

export const RadarChart = memo(function RadarChart({
  scores,
  dimensions,
  size = "md",
  showLabels = true,
  showValues = false,
  variant = "filled",
  className,
}: RadarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const resolvedSize = useChartSize(size, containerRef);

  // Guard against empty or invalid dimensions array
  if (!dimensions || dimensions.length === 0) {
    return (
      <div
        ref={containerRef}
        className={cn("relative", className)}
        style={{ width: size === "responsive" ? "100%" : resolvedSize, height: resolvedSize }}
      >
        <EmptyState message="Sem dados para exibir" />
      </div>
    );
  }

  // Limit to max 10 dimensions with truncation warning
  const displayDimensions = dimensions.slice(0, 10);
  const isTruncated = dimensions.length > 10;

  const centerX = resolvedSize / 2;
  const centerY = resolvedSize / 2;
  const maxRadius = (resolvedSize / 2) * 0.7;

  // Safe division - dimensions.length is guaranteed > 0 by guard above
  const angleStep = (2 * Math.PI) / displayDimensions.length;
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

    const calculatedPoints = displayDimensions.map((dim, i) => ({
      dimension: dim,
      ...getPoint(dim, i),
    }));

    // Create polygon path
    const path = calculatedPoints
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ") + " Z";

    // Generate accessible description of the chart data
    const description = displayDimensions
      .map((dim) => {
        const label = DIMENSION_LABELS[dim] || dim;
        const value = Math.round(scores[dim] ?? 0);
        return `${label}: ${value}%`;
      })
      .join(", ");

    return { points: calculatedPoints, polygonPath: path, chartDescription: description };
  }, [scores, displayDimensions, centerX, centerY, maxRadius, angleStep, startAngle]);

  // Grid circles (25%, 50%, 75%, 100%)
  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      style={{ width: size === "responsive" ? "100%" : resolvedSize }}
    >
      <svg
        width={resolvedSize}
        height={resolvedSize}
        viewBox={`0 0 ${resolvedSize} ${resolvedSize}`}
        className="overflow-visible"
        role="img"
        aria-labelledby="radar-chart-title radar-chart-desc"
      >
        <title id="radar-chart-title">Gráfico Radar de Dimensões</title>
        <desc id="radar-chart-desc">
          Gráfico radar mostrando {displayDimensions.length} dimensões. {chartDescription}
          {isTruncated ? ` (Mostrando 10 de ${dimensions.length} dimensões)` : ""}
        </desc>
        {/* Grid circles */}
        {gridLevels.map((level) => (
          <circle
            key={level}
            cx={centerX}
            cy={centerY}
            r={maxRadius * level}
            fill="none"
            stroke={CHART_COLORS.grid}
            strokeWidth={1}
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
            stroke={CHART_COLORS.grid}
            strokeWidth={1}
          />
        ))}

        {/* Data polygon */}
        <path
          d={polygonPath}
          fill={variant === "filled" ? CHART_COLORS.primary : "transparent"}
          fillOpacity={variant === "filled" ? 0.2 : 0}
          stroke={CHART_COLORS.primary}
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
            fill={CHART_COLORS.primary}
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
                className="text-xs font-medium"
                fill={CHART_COLORS.axis}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {label}
                {showValues && (
                  <tspan className="font-semibold" fill="currentColor">
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
