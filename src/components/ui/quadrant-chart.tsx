import * as React from "react"

import { cn } from "@/lib/utils"

interface QuadrantData {
  /** Valor do quadrante Clã (0-100) */
  clan: number
  /** Valor do quadrante Adhocracia (0-100) */
  adhocracy: number
  /** Valor do quadrante Mercado (0-100) */
  market: number
  /** Valor do quadrante Hierarquia (0-100) */
  hierarchy: number
}

interface QuadrantChartProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Dados atuais (Empresa/Percebida) */
  currentData: QuadrantData
  /** Dados preferidos (Pessoa/Valores) */
  preferredData?: QuadrantData
  /** Título do gráfico */
  title?: string
  /** Tamanho do gráfico */
  size?: number
  /** Mostrar labels dos eixos */
  showAxisLabels?: boolean
  /** Mostrar valores */
  showValues?: boolean
}

const quadrantConfig = {
  clan: {
    label: "Clã",
    shortLabel: "CLÃ",
    color: "#5B7B93",
    bgColor: "rgba(91, 123, 147, 0.1)",
    description: "Colaboração & Pessoas",
    position: { x: 0, y: 0 },
  },
  adhocracy: {
    label: "Adhocracia",
    shortLabel: "ADHO",
    color: "#D98D38",
    bgColor: "rgba(217, 141, 56, 0.1)",
    description: "Inovação & Criatividade",
    position: { x: 1, y: 0 },
  },
  hierarchy: {
    label: "Hierarquia",
    shortLabel: "HIER",
    color: "#64748b",
    bgColor: "rgba(100, 116, 139, 0.1)",
    description: "Controle & Estabilidade",
    position: { x: 0, y: 1 },
  },
  market: {
    label: "Mercado",
    shortLabel: "MERC",
    color: "#10b981",
    bgColor: "rgba(16, 185, 129, 0.1)",
    description: "Competição & Resultados",
    position: { x: 1, y: 1 },
  },
}

/**
 * QuadrantChart Component
 *
 * Visualização do Competing Values Framework (CVF).
 * Mostra os 4 tipos culturais: Clã, Adhocracia, Mercado, Hierarquia.
 */
export function QuadrantChart({
  className,
  currentData,
  preferredData,
  title,
  size = 320,
  showAxisLabels = true,
  showValues = true,
  ...props
}: QuadrantChartProps) {
  const quadrantSize = size / 2 - 2

  const renderQuadrant = (
    key: keyof typeof quadrantConfig,
    row: number,
    col: number
  ) => {
    const config = quadrantConfig[key]
    const currentValue = currentData[key]
    const preferredValue = preferredData?.[key]

    return (
      <div
        key={key}
        className="relative flex flex-col items-center justify-center p-3 border border-border/50"
        style={{
          width: quadrantSize,
          height: quadrantSize,
          backgroundColor: config.bgColor,
          borderRadius:
            row === 0 && col === 0
              ? "12px 0 0 0"
              : row === 0 && col === 1
                ? "0 12px 0 0"
                : row === 1 && col === 0
                  ? "0 0 0 12px"
                  : "0 0 12px 0",
        }}
      >
        {/* Label do quadrante */}
        <span
          className="text-xs font-bold tracking-wider opacity-60"
          style={{ color: config.color }}
        >
          {config.shortLabel}
        </span>

        {/* Valores */}
        {showValues && (
          <div className="flex flex-col items-center mt-2">
            <span
              className="text-2xl font-bold"
              style={{ color: config.color }}
            >
              {currentValue.toFixed(0)}
            </span>
            {preferredValue !== undefined && (
              <span className="text-xs text-muted-foreground mt-1">
                Ideal: {preferredValue.toFixed(0)}
              </span>
            )}
          </div>
        )}

        {/* Barra de diferença (se houver dados preferidos) */}
        {preferredValue !== undefined && (
          <div className="absolute bottom-2 left-2 right-2">
            <div className="h-1.5 bg-black/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${currentValue}%`,
                  backgroundColor: config.color,
                }}
              />
            </div>
            <div
              className="absolute top-0 h-1.5 w-0.5 bg-white border border-black/20 rounded-full"
              style={{ left: `${preferredValue}%`, transform: "translateX(-50%)" }}
            />
          </div>
        )}

        {/* Descrição */}
        <span className="text-[10px] text-muted-foreground text-center mt-1 leading-tight">
          {config.description}
        </span>
      </div>
    )
  }

  return (
    <div
      data-slot="quadrant-chart"
      className={cn("inline-block", className)}
      {...props}
    >
      {title && (
        <h4 className="text-sm font-semibold text-foreground mb-3 text-center">
          {title}
        </h4>
      )}

      <div className="relative">
        {/* Eixo Y - Label superior */}
        {showAxisLabels && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground font-medium">
            Flexibilidade & Dinamismo
          </div>
        )}

        {/* Eixo Y - Label inferior */}
        {showAxisLabels && (
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground font-medium">
            Estabilidade & Controle
          </div>
        )}

        {/* Eixo X - Label esquerda */}
        {showAxisLabels && (
          <div
            className="absolute top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-medium"
            style={{ left: -60, writingMode: "vertical-rl", transform: "rotate(180deg) translateY(50%)" }}
          >
            Foco Interno
          </div>
        )}

        {/* Eixo X - Label direita */}
        {showAxisLabels && (
          <div
            className="absolute top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-medium"
            style={{ right: -60, writingMode: "vertical-rl" }}
          >
            Foco Externo
          </div>
        )}

        {/* Grid dos quadrantes */}
        <div
          className="grid grid-cols-2 rounded-xl overflow-hidden border border-border"
          style={{ width: size, height: size }}
        >
          {renderQuadrant("clan", 0, 0)}
          {renderQuadrant("adhocracy", 0, 1)}
          {renderQuadrant("hierarchy", 1, 0)}
          {renderQuadrant("market", 1, 1)}
        </div>
      </div>

      {/* Legenda */}
      {preferredData && (
        <div className="flex items-center justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-1.5 bg-[#5B7B93] rounded-full" />
            <span className="text-muted-foreground">Percebido</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-0.5 h-3 bg-white border border-black/30 rounded-full" />
            <span className="text-muted-foreground">Ideal</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuadrantChart
