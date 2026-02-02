import { memo, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import type { SYM4Dimension, ChartSize } from "@/types/psychometric";
import { useChartSize } from "@/hooks/useChartSize";
import { CHART_COLORS } from "@/lib/chart-colors";

interface ProfileChartProps {
  graphI: SYM4Dimension; // Perfil natural
  graphII?: SYM4Dimension; // Perfil adaptado
  size?: ChartSize;
  variant?: "bar" | "diamond";
  showLabels?: boolean;
  showLegend?: boolean;
  className?: string;
}

const dimensionConfig = {
  assertive: {
    label: "Assertivo",
    short: "D",
    color: CHART_COLORS.secondaryDark, // Orange for D/I
  },
  influential: {
    label: "Influenciador",
    short: "I",
    color: CHART_COLORS.secondary,
  },
  stable: {
    label: "Estável",
    short: "S",
    color: CHART_COLORS.primaryLight, // Blue for S/C
  },
  analytical: {
    label: "Analítico",
    short: "C",
    color: CHART_COLORS.primaryDark,
  },
};

const dimensions: (keyof SYM4Dimension)[] = [
  "assertive",
  "influential",
  "stable",
  "analytical",
];

export const ProfileChart = memo(function ProfileChart({
  graphI,
  graphII,
  size = "md",
  variant = "bar",
  showLabels = true,
  showLegend = true,
  className,
}: ProfileChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const resolvedSize = useChartSize(size, containerRef);

  if (variant === "diamond") {
    return (
      <DiamondChart
        graphI={graphI}
        graphII={graphII}
        size={resolvedSize}
        showLabels={showLabels}
        showLegend={showLegend}
        className={className}
        containerRef={containerRef}
        isResponsive={size === "responsive"}
      />
    );
  }

  const barHeight = 32;
  const gap = 12;
  const labelWidth = showLabels ? 100 : 0;
  const valueWidth = 40;
  const barWidth = resolvedSize - labelWidth - valueWidth - 24;
  const totalHeight = dimensions.length * (barHeight + gap) - gap;

  // Memoize accessible description
  const chartDescription = useMemo(() =>
    dimensions
      .map((dim) => `${dimensionConfig[dim].label}: ${Math.round(graphI[dim] ?? 0)}%`)
      .join(", "),
    [graphI]
  );

  return (
    <div
      ref={containerRef}
      className={cn("flex flex-col gap-4", className)}
      style={{ width: size === "responsive" ? "100%" : resolvedSize }}
    >
      <svg
        width={resolvedSize}
        height={totalHeight}
        viewBox={`0 0 ${resolvedSize} ${totalHeight}`}
        className="overflow-visible"
        role="img"
        aria-labelledby="profile-bar-chart-title profile-bar-chart-desc"
      >
        <title id="profile-bar-chart-title">Gráfico de Perfil Comportamental SYM4</title>
        <desc id="profile-bar-chart-desc">
          Gráfico de barras mostrando perfil natural. {chartDescription}
          {graphII ? ". Perfil adaptado também disponível." : ""}
        </desc>
        {dimensions.map((dim, i) => {
          const config = dimensionConfig[dim];
          const valueI = graphI[dim] ?? 0;
          const valueII = graphII?.[dim];
          const y = i * (barHeight + gap);
          const normalizedI = Math.max(0, Math.min(100, valueI)) / 100;
          const normalizedII =
            valueII !== undefined
              ? Math.max(0, Math.min(100, valueII)) / 100
              : null;

          return (
            <g key={dim}>
              {/* Label */}
              {showLabels && (
                <text
                  x={0}
                  y={y + barHeight / 2}
                  dominantBaseline="middle"
                  className="text-sm font-medium"
                  fill="currentColor"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {config.label}
                </text>
              )}

              {/* Background bar */}
              <rect
                x={labelWidth}
                y={y + 4}
                width={barWidth}
                height={barHeight - 8}
                rx={4}
                fill={CHART_COLORS.grid}
                fillOpacity={0.3}
              />

              {/* Graph I bar */}
              <rect
                x={labelWidth}
                y={y + 4}
                width={barWidth * normalizedI}
                height={barHeight - 8}
                rx={4}
                fill={config.color}
                className="transition-all duration-500"
              />

              {/* Graph II marker (if provided) */}
              {normalizedII !== null && (
                <line
                  x1={labelWidth + barWidth * normalizedII}
                  y1={y}
                  x2={labelWidth + barWidth * normalizedII}
                  y2={y + barHeight}
                  stroke={CHART_COLORS.secondary}
                  strokeWidth={3}
                  strokeDasharray="4 2"
                  className="transition-all duration-500"
                />
              )}

              {/* Value */}
              <text
                x={labelWidth + barWidth + 12}
                y={y + barHeight / 2}
                dominantBaseline="middle"
                className="text-sm font-bold tabular-nums"
                fill="currentColor"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {Math.round(valueI)}
              </text>
            </g>
          );
        })}
      </svg>

      {showLegend && graphII && (
        <div className="flex items-center gap-6 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-3 rounded-sm"
              style={{ backgroundColor: CHART_COLORS.primary }}
            />
            <span className="text-muted-foreground">Natural (I)</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-0.5 border-t-2 border-dashed"
              style={{ borderColor: CHART_COLORS.secondary }}
            />
            <span className="text-muted-foreground">Adaptado (II)</span>
          </div>
        </div>
      )}
    </div>
  );
});

interface DiamondChartProps extends Omit<ProfileChartProps, "variant" | "size"> {
  size: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  isResponsive: boolean;
}

const DiamondChart = memo(function DiamondChart({
  graphI,
  graphII,
  size,
  showLabels,
  showLegend,
  className,
  containerRef,
  isResponsive,
}: DiamondChartProps) {
  const centerX = size / 2;
  const centerY = size / 2;
  const maxRadius = (size / 2) * 0.7;

  // Memoize path calculations
  const { graphIPath, graphIIPath, points, chartDescription } = useMemo(() => {
    const getPoint = (_dimension: keyof SYM4Dimension, value: number, index: number) => {
      const normalizedValue = Math.max(0, Math.min(100, value)) / 100;
      const angle = (index * Math.PI) / 2 - Math.PI / 2; // Start from top
      const radius = normalizedValue * maxRadius;
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        labelX: centerX + (maxRadius + 30) * Math.cos(angle),
        labelY: centerY + (maxRadius + 30) * Math.sin(angle),
      };
    };

    const createPath = (data: SYM4Dimension) => {
      return dimensions
        .map((dim, i) => {
          const point = getPoint(dim, data[dim] ?? 0, i);
          return `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`;
        })
        .join(" ") + " Z";
    };

    // Calculate points for labels
    const calculatedPoints = dimensions.map((dim, i) => ({
      dim,
      config: dimensionConfig[dim],
      value: graphI[dim] ?? 0,
      ...getPoint(dim, graphI[dim] ?? 0, i),
    }));

    // Generate accessible description
    const description = dimensions
      .map((dim) => `${dimensionConfig[dim].label}: ${Math.round(graphI[dim] ?? 0)}%`)
      .join(", ");

    return {
      graphIPath: createPath(graphI),
      graphIIPath: graphII ? createPath(graphII) : null,
      points: calculatedPoints,
      chartDescription: description,
    };
  }, [graphI, graphII, centerX, centerY, maxRadius]);

  return (
    <div
      ref={containerRef}
      className={cn("flex flex-col items-center gap-4", className)}
      style={{ width: isResponsive ? "100%" : size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
        role="img"
        aria-labelledby="profile-diamond-chart-title profile-diamond-chart-desc"
      >
        <title id="profile-diamond-chart-title">Gráfico Diamante de Perfil SYM4</title>
        <desc id="profile-diamond-chart-desc">
          Gráfico diamante mostrando perfil natural. {chartDescription}
          {graphII ? ". Perfil adaptado também disponível." : ""}
        </desc>
        {/* Grid */}
        {[0.25, 0.5, 0.75, 1].map((level) => (
          <polygon
            key={level}
            points={dimensions
              .map((_, i) => {
                const angle = (i * Math.PI) / 2 - Math.PI / 2;
                const r = maxRadius * level;
                return `${centerX + r * Math.cos(angle)},${centerY + r * Math.sin(angle)}`;
              })
              .join(" ")}
            fill="none"
            stroke={CHART_COLORS.grid}
            strokeWidth={1}
            strokeDasharray={level < 1 ? "2 2" : "none"}
          />
        ))}

        {/* Axis lines */}
        {dimensions.map((_, i) => {
          const angle = (i * Math.PI) / 2 - Math.PI / 2;
          return (
            <line
              key={i}
              x1={centerX}
              y1={centerY}
              x2={centerX + maxRadius * Math.cos(angle)}
              y2={centerY + maxRadius * Math.sin(angle)}
              stroke={CHART_COLORS.grid}
              strokeWidth={1}
            />
          );
        })}

        {/* Graph II (if provided) - drawn first so it's behind Graph I */}
        {graphIIPath && (
          <path
            d={graphIIPath}
            fill={CHART_COLORS.secondaryLight}
            fillOpacity={0.15}
            stroke={CHART_COLORS.secondary}
            strokeWidth={2}
            strokeDasharray="4 2"
            className="transition-all duration-500"
          />
        )}

        {/* Graph I */}
        <path
          d={graphIPath}
          fill={CHART_COLORS.primaryLight}
          fillOpacity={0.25}
          stroke={CHART_COLORS.primary}
          strokeWidth={2}
          className="transition-all duration-500"
        />

        {/* Points and labels */}
        {points.map((point) => (
          <g key={point.dim}>
            <circle
              cx={point.x}
              cy={point.y}
              r={5}
              fill={CHART_COLORS.primary}
              stroke="white"
              strokeWidth={2}
            />
            {showLabels && (
              <text
                x={point.labelX}
                y={point.labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-medium"
                fill={CHART_COLORS.axis}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                <tspan className="font-bold" fill="currentColor">
                  {point.config.short}
                </tspan>{" "}
                {Math.round(point.value)}
              </text>
            )}
          </g>
        ))}
      </svg>

      {showLegend && graphII && (
        <div className="flex items-center gap-6 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-0.5"
              style={{ backgroundColor: CHART_COLORS.primary }}
            />
            <span className="text-muted-foreground">Natural (I)</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-0.5 border-dashed border-b-2"
              style={{ borderColor: CHART_COLORS.secondary }}
            />
            <span className="text-muted-foreground">Adaptado (II)</span>
          </div>
        </div>
      )}
    </div>
  );
});
