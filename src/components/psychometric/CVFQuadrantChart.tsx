import { cn } from "@/lib/utils";
import type { CVFQuadrant } from "@/types/psychometric";

interface CVFQuadrantChartProps {
  perceived: CVFQuadrant;
  values?: CVFQuadrant;
  size?: number;
  showLabels?: boolean;
  showLegend?: boolean;
  className?: string;
}

const quadrantLabels = {
  clan: { name: "Colaborativa", short: "Clan" },
  adhocracy: { name: "Inovadora", short: "Adhocracia" },
  market: { name: "Competitiva", short: "Mercado" },
  hierarchy: { name: "Estruturada", short: "Hierarquia" },
};

const quadrantColors = {
  clan: "var(--color-synmind-blue-400)",
  adhocracy: "var(--color-synmind-orange-400)",
  market: "var(--color-synmind-orange-600)",
  hierarchy: "var(--color-synmind-blue-600)",
};

export function CVFQuadrantChart({
  perceived,
  values,
  size = 300,
  showLabels = true,
  showLegend = true,
  className,
}: CVFQuadrantChartProps) {
  const centerX = size / 2;
  const centerY = size / 2;
  const maxRadius = (size / 2) * 0.75;

  // CVF uses 4 quadrants, each value represents percentage in that quadrant
  // Position: top-left=clan, top-right=adhocracy, bottom-right=market, bottom-left=hierarchy
  const getQuadrantPath = (data: CVFQuadrant, _offset = 0) => {
    const positions = [
      { key: "clan", angle: Math.PI * 1.25 }, // Top-left
      { key: "adhocracy", angle: Math.PI * 1.75 }, // Top-right
      { key: "market", angle: Math.PI * 0.25 }, // Bottom-right
      { key: "hierarchy", angle: Math.PI * 0.75 }, // Bottom-left
    ];

    return positions
      .map(({ key, angle }, i) => {
        const value = data[key as keyof CVFQuadrant] ?? 0;
        const normalizedValue = Math.max(0, Math.min(100, value)) / 100;
        const radius = normalizedValue * maxRadius;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ") + " Z";
  };

  // Generate accessible description of the chart data
  const perceivedDescription = Object.entries(perceived)
    .map(([key, value]) => `${quadrantLabels[key as keyof typeof quadrantLabels]?.name || key}: ${Math.round(value)}%`)
    .join(", ");

  const valuesDescription = values
    ? Object.entries(values)
        .map(([key, value]) => `${quadrantLabels[key as keyof typeof quadrantLabels]?.name || key}: ${Math.round(value)}%`)
        .join(", ")
    : null;

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
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
            fillOpacity={0.1}
          />
          <rect
            x={centerX}
            y={0}
            width={centerX}
            height={centerY}
            fill={quadrantColors.adhocracy}
            fillOpacity={0.1}
          />
          <rect
            x={centerX}
            y={centerY}
            width={centerX}
            height={centerY}
            fill={quadrantColors.market}
            fillOpacity={0.1}
          />
          <rect
            x={0}
            y={centerY}
            width={centerX}
            height={centerY}
            fill={quadrantColors.hierarchy}
            fillOpacity={0.1}
          />

          {/* Grid lines */}
          <line
            x1={0}
            y1={centerY}
            x2={size}
            y2={centerY}
            stroke="currentColor"
            strokeWidth={1}
            className="text-border"
          />
          <line
            x1={centerX}
            y1={0}
            x2={centerX}
            y2={size}
            stroke="currentColor"
            strokeWidth={1}
            className="text-border"
          />

          {/* Circular grid */}
          {[0.25, 0.5, 0.75, 1].map((level) => (
            <circle
              key={level}
              cx={centerX}
              cy={centerY}
              r={maxRadius * level}
              fill="none"
              stroke="currentColor"
              strokeWidth={1}
              className="text-border"
              strokeDasharray="2 2"
            />
          ))}

          {/* Values polygon (if provided) */}
          {values && (
            <path
              d={getQuadrantPath(values)}
              fill="var(--color-synmind-orange-400)"
              fillOpacity={0.15}
              stroke="var(--color-synmind-orange-500)"
              strokeWidth={2}
              strokeDasharray="4 2"
              className="transition-all duration-500"
            />
          )}

          {/* Perceived polygon */}
          <path
            d={getQuadrantPath(perceived)}
            fill="var(--color-synmind-blue-400)"
            fillOpacity={0.25}
            stroke="var(--color-synmind-blue-500)"
            strokeWidth={2}
            className="transition-all duration-500"
          />

          {/* Labels */}
          {showLabels && (
            <>
              <text
                x={centerX / 2}
                y={20}
                textAnchor="middle"
                className="text-xs fill-muted-foreground font-medium"
              >
                {quadrantLabels.clan.name}
              </text>
              <text
                x={centerX + centerX / 2}
                y={20}
                textAnchor="middle"
                className="text-xs fill-muted-foreground font-medium"
              >
                {quadrantLabels.adhocracy.name}
              </text>
              <text
                x={centerX + centerX / 2}
                y={size - 8}
                textAnchor="middle"
                className="text-xs fill-muted-foreground font-medium"
              >
                {quadrantLabels.market.name}
              </text>
              <text
                x={centerX / 2}
                y={size - 8}
                textAnchor="middle"
                className="text-xs fill-muted-foreground font-medium"
              >
                {quadrantLabels.hierarchy.name}
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
              className="text-sm fill-foreground font-bold"
            >
              {Math.round(perceived[key as keyof CVFQuadrant])}
            </text>
          ))}
        </svg>
      </div>

      {showLegend && values && (
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-synmind-blue-500" />
            <span className="text-muted-foreground">Percebida</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-synmind-orange-500 border-dashed border-b" />
            <span className="text-muted-foreground">Desejada</span>
          </div>
        </div>
      )}
    </div>
  );
}
