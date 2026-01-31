import * as React from "react"

import { cn } from "@/lib/utils"

interface RadarDataPoint {
  /** Label do eixo */
  label: string
  /** Valor (0-100) */
  value: number
  /** Label abreviado para o gráfico */
  shortLabel?: string
}

interface RadarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Dados do radar */
  data: RadarDataPoint[]
  /** Título do gráfico */
  title?: string
  /** Tamanho do gráfico */
  size?: number
  /** Cor do preenchimento */
  fillColor?: string
  /** Cor da linha */
  strokeColor?: string
  /** Mostrar valores nos pontos */
  showValues?: boolean
  /** Mostrar grade de referência */
  showGrid?: boolean
  /** Número de níveis da grade */
  levels?: number
  /** Dados de comparação (perfil ideal, por exemplo) */
  compareData?: RadarDataPoint[]
  /** Cor do preenchimento de comparação */
  compareFillColor?: string
  /** Cor da linha de comparação */
  compareStrokeColor?: string
}

/**
 * RadarChart Component
 *
 * Gráfico radar para visualização de perfis multidimensionais.
 * Ideal para Big5, TEI, CVF e outros instrumentos psicométricos.
 */
export function RadarChart({
  className,
  data,
  title,
  size = 280,
  fillColor = "rgba(91, 123, 147, 0.2)",
  strokeColor = "#5B7B93",
  showValues = true,
  showGrid = true,
  levels = 4,
  compareData,
  compareFillColor = "rgba(217, 141, 56, 0.15)",
  compareStrokeColor = "#D98D38",
  ...props
}: RadarChartProps) {
  const centerX = size / 2
  const centerY = size / 2
  const radius = (size / 2) * 0.7
  const angleStep = (2 * Math.PI) / data.length

  // Calcula pontos do polígono
  const getPoint = (value: number, index: number) => {
    const angle = angleStep * index - Math.PI / 2
    const r = (value / 100) * radius
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle),
    }
  }

  // Gera path do polígono
  const getPolygonPath = (values: RadarDataPoint[]) => {
    return values
      .map((d, i) => {
        const point = getPoint(d.value, i)
        return `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`
      })
      .join(" ") + " Z"
  }

  // Gera linhas da grade
  const gridLevels = Array.from({ length: levels }, (_, i) => ((i + 1) / levels) * 100)

  return (
    <div
      data-slot="radar-chart"
      className={cn("inline-block", className)}
      {...props}
    >
      {title && (
        <h4 className="text-sm font-semibold text-foreground mb-3 text-center">
          {title}
        </h4>
      )}

      <svg width={size} height={size} className="overflow-visible">
        {/* Grade de referência */}
        {showGrid && (
          <g className="grid">
            {gridLevels.map((level) => {
              const gridPath = data
                .map((_, i) => {
                  const point = getPoint(level, i)
                  return `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`
                })
                .join(" ") + " Z"
              return (
                <path
                  key={level}
                  d={gridPath}
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity={0.1}
                  strokeWidth={1}
                />
              )
            })}

            {/* Linhas dos eixos */}
            {data.map((_, i) => {
              const point = getPoint(100, i)
              return (
                <line
                  key={i}
                  x1={centerX}
                  y1={centerY}
                  x2={point.x}
                  y2={point.y}
                  stroke="currentColor"
                  strokeOpacity={0.1}
                  strokeWidth={1}
                />
              )
            })}
          </g>
        )}

        {/* Polígono de comparação (se houver) */}
        {compareData && (
          <g className="compare-polygon">
            <path
              d={getPolygonPath(compareData)}
              fill={compareFillColor}
              stroke={compareStrokeColor}
              strokeWidth={2}
              strokeDasharray="4 2"
            />
          </g>
        )}

        {/* Polígono principal */}
        <g className="main-polygon">
          <path
            d={getPolygonPath(data)}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={2}
          />

          {/* Pontos */}
          {data.map((d, i) => {
            const point = getPoint(d.value, i)
            return (
              <circle
                key={i}
                cx={point.x}
                cy={point.y}
                r={4}
                fill={strokeColor}
                className="cursor-pointer hover:r-6 transition-all"
              />
            )
          })}
        </g>

        {/* Labels */}
        {data.map((d, i) => {
          const labelRadius = radius + 24
          const angle = angleStep * i - Math.PI / 2
          const x = centerX + labelRadius * Math.cos(angle)
          const y = centerY + labelRadius * Math.sin(angle)

          // Ajuste de alinhamento baseado na posição
          let textAnchor: "start" | "middle" | "end" = "middle"
          let dy = 0
          if (Math.abs(Math.cos(angle)) > 0.5) {
            textAnchor = Math.cos(angle) > 0 ? "start" : "end"
          }
          if (Math.abs(Math.sin(angle)) > 0.7) {
            dy = Math.sin(angle) > 0 ? 12 : -4
          }

          return (
            <g key={i}>
              <text
                x={x}
                y={y + dy}
                textAnchor={textAnchor}
                className="text-xs fill-muted-foreground font-medium"
              >
                {d.shortLabel || d.label}
              </text>
              {showValues && (
                <text
                  x={x}
                  y={y + dy + 12}
                  textAnchor={textAnchor}
                  className="text-[10px] fill-foreground font-semibold"
                >
                  {d.value.toFixed(0)}
                </text>
              )}
            </g>
          )
        })}
      </svg>

      {/* Legenda */}
      {compareData && (
        <div className="flex items-center justify-center gap-4 mt-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: strokeColor }} />
            <span className="text-muted-foreground">Perfil Atual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-sm border-2 border-dashed"
              style={{ borderColor: compareStrokeColor }}
            />
            <span className="text-muted-foreground">Perfil Ideal</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default RadarChart
