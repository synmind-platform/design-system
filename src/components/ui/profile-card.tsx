import * as React from "react"
import type { LucideIcon } from "lucide-react"
import { User, Zap } from "lucide-react"

import { cn } from "@/lib/utils"

interface ProfileDimension {
  /** Nome da dimensão */
  name: string
  /** Valor (0-100) */
  value: number
  /** Cor customizada */
  color?: string
  /** Ícone */
  icon?: LucideIcon
}

interface ProfileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Nome do perfil/pessoa */
  name: string
  /** Tipo do perfil (ex: "Big Five", "Inteligência Emocional") */
  profileType: string
  /** Dimensões do perfil */
  dimensions: ProfileDimension[]
  /** Avatar URL */
  avatarUrl?: string
  /** Data da avaliação */
  assessmentDate?: string
  /** Versão do instrumento */
  instrumentVersion?: string
  /** Score global (se aplicável) */
  globalScore?: number
  /** Status de qualidade */
  qualityStatus?: "passed" | "warning" | "failed"
  /** Mostrar barra de progresso nas dimensões */
  showBars?: boolean
  /** Layout das dimensões */
  layout?: "vertical" | "horizontal"
}

const defaultColors = [
  "#5B7B93",
  "#D98D38",
  "#10b981",
  "#8b5cf6",
  "#f43f5e",
]

const qualityConfig = {
  passed: { label: "QC Aprovado", color: "text-emerald-600", bg: "bg-emerald-50" },
  warning: { label: "QC Alerta", color: "text-amber-600", bg: "bg-amber-50" },
  failed: { label: "QC Reprovado", color: "text-red-600", bg: "bg-red-50" },
}

/**
 * ProfileCard Component
 *
 * Card para exibição de perfis psicométricos completos.
 * Mostra dimensões, scores e metadados de avaliações.
 */
export function ProfileCard({
  className,
  name,
  profileType,
  dimensions,
  avatarUrl,
  assessmentDate,
  instrumentVersion,
  globalScore,
  qualityStatus,
  showBars = true,
  layout = "vertical",
  ...props
}: ProfileCardProps) {
  return (
    <div
      data-slot="profile-card"
      className={cn(
        "rounded-xl border bg-card overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b bg-muted/30">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#5B7B93]/10 flex items-center justify-center">
                <User className="w-6 h-6 text-[#5B7B93]" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{name}</h3>
            <p className="text-sm text-muted-foreground">{profileType}</p>
          </div>

          {/* Global Score */}
          {globalScore !== undefined && (
            <div className="text-right">
              <span className="text-3xl font-bold text-[#5B7B93]">
                {globalScore.toFixed(0)}
              </span>
              <span className="text-xs text-muted-foreground block">Global</span>
            </div>
          )}
        </div>

        {/* Metadata row */}
        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
          {assessmentDate && (
            <span>Avaliado em: {assessmentDate}</span>
          )}
          {instrumentVersion && (
            <span className="font-mono bg-muted px-1.5 py-0.5 rounded">
              {instrumentVersion}
            </span>
          )}
          {qualityStatus && (
            <span
              className={cn(
                "px-2 py-0.5 rounded font-medium",
                qualityConfig[qualityStatus].bg,
                qualityConfig[qualityStatus].color
              )}
            >
              {qualityConfig[qualityStatus].label}
            </span>
          )}
        </div>
      </div>

      {/* Dimensions */}
      <div className={cn(
        "p-6",
        layout === "horizontal" && "flex gap-4 overflow-x-auto"
      )}>
        {layout === "vertical" ? (
          <div className="space-y-4">
            {dimensions.map((dim, index) => {
              const color = dim.color || defaultColors[index % defaultColors.length]
              const Icon = dim.icon

              return (
                <div key={dim.name} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {Icon && (
                        <Icon className="w-4 h-4" style={{ color }} />
                      )}
                      <span className="text-sm font-medium text-foreground">
                        {dim.name}
                      </span>
                    </div>
                    <span className="text-sm font-bold" style={{ color }}>
                      {dim.value.toFixed(0)} pts
                    </span>
                  </div>

                  {showBars && (
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${dim.value}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          // Horizontal layout (cards)
          dimensions.map((dim, index) => {
            const color = dim.color || defaultColors[index % defaultColors.length]
            const Icon = dim.icon

            return (
              <div
                key={dim.name}
                className="flex-shrink-0 w-28 p-3 rounded-lg border text-center"
                style={{ borderColor: color + "30", backgroundColor: color + "08" }}
              >
                {Icon && (
                  <Icon className="w-5 h-5 mx-auto mb-2" style={{ color }} />
                )}
                <div className="text-2xl font-bold" style={{ color }}>
                  {dim.value.toFixed(0)}
                </div>
                <div className="text-xs text-muted-foreground mt-1 leading-tight">
                  {dim.name}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Highest dimension highlight */}
      {dimensions.length > 0 && (
        <div className="px-6 py-3 border-t bg-muted/20">
          <div className="flex items-center gap-2 text-sm">
            <Zap className="w-4 h-4 text-[#D98D38]" />
            <span className="text-muted-foreground">Dimensão dominante:</span>
            <span className="font-semibold text-foreground">
              {dimensions.reduce((a, b) => (a.value > b.value ? a : b)).name}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileCard
