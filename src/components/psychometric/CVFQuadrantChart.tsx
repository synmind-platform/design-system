import { memo, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import type { CVFQuadrant, ChartSize } from "@/types/psychometric";
import { useChartSize } from "@/hooks/useChartSize";
import { CHART_COLORS, QUADRANT_LABELS } from "@/lib/chart-colors";
import { EmptyState } from "./EmptyState";

interface CVFQuadrantChartProps {
  perceived: CVFQuadrant;
  values?: CVFQuadrant;
  size?: ChartSize;
  showLabels?: boolean;
  showLegend?: boolean;
  className?: string;
}

const quadrantColors = {
  clan: CHART_COLORS.quadrants.clan,
  adhocracy: CHART_COLORS.quadrants.adhocracy,
  market: CHART_COLORS.quadrants.market,
  hierarchy: CHART_COLORS.quadrants.hierarchy,
};

// Abbreviated labels for small sizes
const QUADRANT_LABELS_SHORT: Record<keyof CVFQuadrant, string> = {
  clan: "Cola",
  adhocracy: "Inov",
  market: "Comp",
  hierarchy: "Estr",
};

// Threshold for showing vertex markers (extreme low values)
const EXTREME_VALUE_THRESHOLD = 15;

// Minimum visible radius to ensure polygon is visible
const MIN_VISIBLE_RADIUS = 8;

export const CVFQuadrantChart = memo(function CVFQuadrantChart({
  perceived,
  values,
  size = "md",
  showLabels = true,
  showLegend = true,
  className,
}: CVFQuadrantChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const resolvedSize = useChartSize(size, containerRef);

  // Validate perceived data has all required quadrants
  const requiredKeys: (keyof CVFQuadrant)[] = ['clan', 'adhocracy', 'market', 'hierarchy'];
  const hasValidData = requiredKeys.every(
    (key) => typeof perceived[key] === 'number' && !Number.isNaN(perceived[key])
  );

  const centerX = resolvedSize / 2;
  const centerY = resolvedSize / 2;
  const maxRadius = (resolvedSize / 2) * 0.75;

  // Quadrant positions for path calculation
  const quadrantPositions = useMemo(() => [
    { key: "clan" as const, angle: Math.PI * 1.25 }, // Top-left
    { key: "adhocracy" as const, angle: Math.PI * 1.75 }, // Top-right
    { key: "market" as const, angle: Math.PI * 0.25 }, // Bottom-right
    { key: "hierarchy" as const, angle: Math.PI * 0.75 }, // Bottom-left
  ], []);

  // Memoize path calculations, vertices, and descriptions
  const {
    perceivedPath,
    valuesPath,
    perceivedVertices,
    valuesVertices,
    hasExtremeValues,
    perceivedDescription,
    valuesDescription
  } = useMemo(() => {
    // CVF uses 4 quadrants, each value represents percentage in that quadrant
    // Position: top-left=clan, top-right=adhocracy, bottom-right=market, bottom-left=hierarchy
    const getQuadrantPathAndVertices = (data: CVFQuadrant) => {
      const vertices: Array<{ x: number; y: number; value: number; key: keyof CVFQuadrant }> = [];
      let hasExtreme = false;

      const path = quadrantPositions
        .map(({ key, angle }, i) => {
          const value = data[key] ?? 0;
          const normalizedValue = Math.max(0, Math.min(100, value)) / 100;
          // Ensure minimum radius for visibility at extreme low values
          const radius = Math.max(normalizedValue * maxRadius, MIN_VISIBLE_RADIUS);
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);

          vertices.push({ x, y, value, key });

          if (value <= EXTREME_VALUE_THRESHOLD) {
            hasExtreme = true;
          }

          return `${i === 0 ? "M" : "L"} ${x} ${y}`;
        })
        .join(" ") + " Z";

      return { path, vertices, hasExtreme };
    };

    const perceivedResult = getQuadrantPathAndVertices(perceived);
    const valuesResult = values ? getQuadrantPathAndVertices(values) : null;

    // Generate accessible description of the chart data
    const pDescription = requiredKeys
      .map((key) => `${QUADRANT_LABELS[key]}: ${Math.round(perceived[key])}%`)
      .join(", ");

    const vDescription = values
      ? requiredKeys
          .map((key) => `${QUADRANT_LABELS[key]}: ${Math.round(values[key])}%`)
          .join(", ")
      : null;

    return {
      perceivedPath: perceivedResult.path,
      valuesPath: valuesResult?.path ?? null,
      perceivedVertices: perceivedResult.vertices,
      valuesVertices: valuesResult?.vertices ?? null,
      hasExtremeValues: perceivedResult.hasExtreme || (valuesResult?.hasExtreme ?? false),
      perceivedDescription: pDescription,
      valuesDescription: vDescription,
    };
  }, [perceived, values, centerX, centerY, maxRadius, quadrantPositions]);

  // Determine if we should use abbreviated labels (for small sizes)
  const useAbbreviatedLabels = resolvedSize <= 220;

  if (!hasValidData) {
    return (
      <div
        ref={containerRef}
        className={cn("flex flex-col items-center gap-4", className)}
        style={{ width: size === "responsive" ? "100%" : resolvedSize }}
      >
        <EmptyState message="Dados inválidos ou incompletos" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("flex flex-col items-center gap-4", className)}
      style={{ width: size === "responsive" ? "100%" : resolvedSize }}
    >
      <div className="relative">
        <svg
          width={resolvedSize}
          height={resolvedSize}
          viewBox={`0 0 ${resolvedSize} ${resolvedSize}`}
          className="overflow-visible"
          role="img"
          aria-labelledby="cvf-chart-title cvf-chart-desc"
        >
          <title id="cvf-chart-title">Gráfico de Cultura Organizacional CVF</title>
          <desc id="cvf-chart-desc">
            Gráfico de quadrantes mostrando cultura organizacional.
            Cultura percebida: {perceivedDescription}.
            {valuesDescription ? ` Cultura desejada: ${valuesDescription}.` : ""}
          </desc>
          {/* Background quadrant colors */}
          <rect
            x={0}
            y={0}
            width={centerX}
            height={centerY}
            fill={quadrantColors.clan}
            fillOpacity={0.15}
          />
          <rect
            x={centerX}
            y={0}
            width={centerX}
            height={centerY}
            fill={quadrantColors.adhocracy}
            fillOpacity={0.15}
          />
          <rect
            x={centerX}
            y={centerY}
            width={centerX}
            height={centerY}
            fill={quadrantColors.market}
            fillOpacity={0.15}
          />
          <rect
            x={0}
            y={centerY}
            width={centerX}
            height={centerY}
            fill={quadrantColors.hierarchy}
            fillOpacity={0.15}
          />

          {/* Grid lines */}
          <line
            x1={0}
            y1={centerY}
            x2={resolvedSize}
            y2={centerY}
            stroke={CHART_COLORS.grid}
            strokeWidth={1}
          />
          <line
            x1={centerX}
            y1={0}
            x2={centerX}
            y2={resolvedSize}
            stroke={CHART_COLORS.grid}
            strokeWidth={1}
          />

          {/* Circular grid */}
          {[0.25, 0.5, 0.75, 1].map((level) => (
            <circle
              key={level}
              cx={centerX}
              cy={centerY}
              r={maxRadius * level}
              fill="none"
              stroke={CHART_COLORS.grid}
              strokeWidth={1}
              strokeDasharray="2 2"
            />
          ))}

          {/* Values polygon (if provided) - drawn first so it's behind perceived */}
          {valuesPath && (
            <path
              d={valuesPath}
              fill={CHART_COLORS.secondaryLight}
              fillOpacity={0.15}
              stroke={CHART_COLORS.secondary}
              strokeWidth={2}
              strokeDasharray="4 2"
              className="transition-all duration-500"
            />
          )}

          {/* Perceived polygon */}
          <path
            d={perceivedPath}
            fill={CHART_COLORS.primaryLight}
            fillOpacity={0.25}
            stroke={CHART_COLORS.primary}
            strokeWidth={2}
            className="transition-all duration-500"
          />

          {/* Vertex markers for visibility at extreme values */}
          {hasExtremeValues && perceivedVertices.map((vertex) => (
            vertex.value <= EXTREME_VALUE_THRESHOLD && (
              <circle
                key={`perceived-vertex-${vertex.key}`}
                cx={vertex.x}
                cy={vertex.y}
                r={4}
                fill={CHART_COLORS.primary}
                className="vertex-marker transition-all duration-500"
              />
            )
          ))}
          {hasExtremeValues && valuesVertices?.map((vertex) => (
            vertex.value <= EXTREME_VALUE_THRESHOLD && (
              <circle
                key={`values-vertex-${vertex.key}`}
                cx={vertex.x}
                cy={vertex.y}
                r={4}
                fill={CHART_COLORS.secondary}
                className="vertex-marker transition-all duration-500"
              />
            )
          ))}

          {/* Labels - responsive: abbreviated on small sizes */}
          {showLabels && (
            <>
              <text
                x={centerX / 2}
                y={useAbbreviatedLabels ? 14 : 20}
                textAnchor="middle"
                className={cn("font-medium", useAbbreviatedLabels ? "text-[10px]" : "text-xs")}
                fill={CHART_COLORS.axis}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {useAbbreviatedLabels ? QUADRANT_LABELS_SHORT.clan : QUADRANT_LABELS.clan}
              </text>
              <text
                x={centerX + centerX / 2}
                y={useAbbreviatedLabels ? 14 : 20}
                textAnchor="middle"
                className={cn("font-medium", useAbbreviatedLabels ? "text-[10px]" : "text-xs")}
                fill={CHART_COLORS.axis}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {useAbbreviatedLabels ? QUADRANT_LABELS_SHORT.adhocracy : QUADRANT_LABELS.adhocracy}
              </text>
              <text
                x={centerX + centerX / 2}
                y={resolvedSize - (useAbbreviatedLabels ? 4 : 8)}
                textAnchor="middle"
                className={cn("font-medium", useAbbreviatedLabels ? "text-[10px]" : "text-xs")}
                fill={CHART_COLORS.axis}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {useAbbreviatedLabels ? QUADRANT_LABELS_SHORT.market : QUADRANT_LABELS.market}
              </text>
              <text
                x={centerX / 2}
                y={resolvedSize - (useAbbreviatedLabels ? 4 : 8)}
                textAnchor="middle"
                className={cn("font-medium", useAbbreviatedLabels ? "text-[10px]" : "text-xs")}
                fill={CHART_COLORS.axis}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {useAbbreviatedLabels ? QUADRANT_LABELS_SHORT.hierarchy : QUADRANT_LABELS.hierarchy}
              </text>
            </>
          )}

          {/* Value labels on polygon points */}
          {[
            {
              key: "clan",
              x: centerX / 2 - 10,
              y: centerY / 2,
            },
            {
              key: "adhocracy",
              x: centerX + centerX / 2 + 10,
              y: centerY / 2,
            },
            {
              key: "market",
              x: centerX + centerX / 2 + 10,
              y: centerY + centerY / 2,
            },
            {
              key: "hierarchy",
              x: centerX / 2 - 10,
              y: centerY + centerY / 2,
            },
          ].map(({ key, x, y }) => (
            <text
              key={key}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-sm font-bold"
              fill="currentColor"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {Math.round(perceived[key as keyof CVFQuadrant])}
            </text>
          ))}
        </svg>
      </div>

      {showLegend && values && (
        <div className="flex items-center gap-6 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-0.5"
              style={{ backgroundColor: CHART_COLORS.primary }}
            />
            <span className="text-muted-foreground">Percebida</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-0.5 border-dashed border-b-2"
              style={{ borderColor: CHART_COLORS.secondary }}
            />
            <span className="text-muted-foreground">Desejada</span>
          </div>
        </div>
      )}
    </div>
  );
});
