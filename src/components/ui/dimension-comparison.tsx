import * as React from "react"
import { ArrowRight, ArrowUp, ArrowDown, Minus } from "lucide-react"

import { cn } from "@/lib/utils"

interface ComparisonItem {
  /** Nome da dimensão */
  name: string
  /** Valor da fonte A (ex: Empresa) */
  valueA: number
  /** Valor da fonte B (ex: Pessoa) */
  valueB: number
  /** Descrição da dimensão */
  description?: string
}

interface DimensionComparisonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Lista de dimensões para comparar */
  items: ComparisonItem[]
  /** Label da fonte A */
  labelA?: string
  /** Label da fonte B */
  labelB?: string
  /** Título do componente */
  title?: string
  /** Mostrar diferença numérica */
  showDiff?: boolean
  /** Cor da fonte A */
  colorA?: string
  /** Cor da fonte B */
  colorB?: string
  /** Layout do componente */
  layout?: "bars" | "table" | "cards"
}

/**
 * DimensionComparison Component
 *
 * Comparação lado a lado de dimensões entre duas fontes.
 * Ex: Cultura Percebida vs Valores Pessoais (CVF)
 */
export function DimensionComparison({
  className,
  items,
  labelA = "Atual",
  labelB = "Ideal",
  title,
  showDiff = true,
  colorA = "#5B7B93",
  colorB = "#D98D38",
  layout = "bars",
  ...props
}: DimensionComparisonProps) {
  const getDiffIcon = (valueA: number, valueB: number) => {
    const diff = valueB - valueA
    if (Math.abs(diff) < 5) return <Minus className="w-3 h-3 text-muted-foreground" />
    if (diff > 0) return <ArrowUp className="w-3 h-3 text-emerald-600" />
    return <ArrowDown className="w-3 h-3 text-red-500" />
  }

  const getDiffColor = (valueA: number, valueB: number) => {
    const diff = Math.abs(valueB - valueA)
    if (diff < 10) return "text-emerald-600"
    if (diff < 25) return "text-[#D98D38]"
    return "text-red-500"
  }

  if (layout === "table") {
    return (
      <div
        data-slot="dimension-comparison"
        className={cn("rounded-xl border bg-card overflow-hidden", className)}
        {...props}
      >
        {title && (
          <div className="px-4 py-3 border-b bg-muted/30">
            <h3 className="font-semibold text-foreground">{title}</h3>
          </div>
        )}
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/20">
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">
                Dimensão
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium uppercase" style={{ color: colorA }}>
                {labelA}
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium uppercase" style={{ color: colorB }}>
                {labelB}
              </th>
              {showDiff && (
                <th className="px-4 py-2 text-center text-xs font-medium text-muted-foreground uppercase">
                  Diff
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((item) => (
              <tr key={item.name} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <span className="font-medium text-foreground">{item.name}</span>
                  {item.description && (
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-lg font-bold" style={{ color: colorA }}>
                    {item.valueA.toFixed(0)}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-lg font-bold" style={{ color: colorB }}>
                    {item.valueB.toFixed(0)}
                  </span>
                </td>
                {showDiff && (
                  <td className="px-4 py-3 text-center">
                    <span className={cn("text-sm font-medium", getDiffColor(item.valueA, item.valueB))}>
                      {getDiffIcon(item.valueA, item.valueB)}
                      {Math.abs(item.valueB - item.valueA).toFixed(0)}
                    </span>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (layout === "cards") {
    return (
      <div
        data-slot="dimension-comparison"
        className={cn("space-y-4", className)}
        {...props}
      >
        {title && (
          <h3 className="font-semibold text-foreground">{title}</h3>
        )}

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: colorA }} />
            <span className="text-muted-foreground">{labelA}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: colorB }} />
            <span className="text-muted-foreground">{labelB}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {items.map((item) => {
            const diff = item.valueB - item.valueA
            return (
              <div
                key={item.name}
                className="p-4 rounded-xl border bg-card"
              >
                <span className="text-xs font-medium text-muted-foreground block mb-2">
                  {item.name}
                </span>
                <div className="flex items-end justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold" style={{ color: colorA }}>
                      {item.valueA.toFixed(0)}
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <span className="text-2xl font-bold" style={{ color: colorB }}>
                      {item.valueB.toFixed(0)}
                    </span>
                  </div>
                  {showDiff && (
                    <span className={cn(
                      "text-xs font-medium",
                      getDiffColor(item.valueA, item.valueB)
                    )}>
                      {diff > 0 ? "+" : ""}{diff.toFixed(0)}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Default: bars layout
  return (
    <div
      data-slot="dimension-comparison"
      className={cn("rounded-xl border bg-card p-6", className)}
      {...props}
    >
      {title && (
        <h3 className="font-semibold text-foreground mb-4">{title}</h3>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: colorA }} />
          <span className="text-muted-foreground">{labelA}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: colorB }} />
          <span className="text-muted-foreground">{labelB}</span>
        </div>
      </div>

      {/* Comparison bars */}
      <div className="space-y-4">
        {items.map((item) => {
          const diff = item.valueB - item.valueA
          return (
            <div key={item.name} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{item.name}</span>
                {showDiff && (
                  <span className={cn(
                    "text-xs font-medium flex items-center gap-1",
                    getDiffColor(item.valueA, item.valueB)
                  )}>
                    {getDiffIcon(item.valueA, item.valueB)}
                    {Math.abs(diff).toFixed(0)} pts
                  </span>
                )}
              </div>

              {/* Dual bar */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs w-8 text-right" style={{ color: colorA }}>
                    {item.valueA.toFixed(0)}
                  </span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${item.valueA}%`, backgroundColor: colorA }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs w-8 text-right" style={{ color: colorB }}>
                    {item.valueB.toFixed(0)}
                  </span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${item.valueB}%`, backgroundColor: colorB }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DimensionComparison
