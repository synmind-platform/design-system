import * as React from "react"
import type { LucideIcon } from "lucide-react"
import { Check, Clock, AlertCircle, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

type AssessmentStatus = "pending" | "in_progress" | "completed" | "error"

interface Assessment {
  /** ID único */
  id: string
  /** Nome do instrumento */
  name: string
  /** Descrição curta */
  description?: string
  /** Status atual */
  status: AssessmentStatus
  /** Número de questões */
  totalQuestions?: number
  /** Questões respondidas */
  answeredQuestions?: number
  /** Tempo estimado (minutos) */
  estimatedTime?: number
  /** Tempo gasto (minutos) */
  timeSpent?: number
  /** Ícone customizado */
  icon?: LucideIcon
}

interface AssessmentProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Lista de avaliações */
  assessments: Assessment[]
  /** Título do progresso */
  title?: string
  /** Callback quando uma avaliação é clicada */
  onAssessmentClick?: (assessment: Assessment) => void
  /** Mostrar tempo estimado */
  showTime?: boolean
  /** Layout compacto */
  compact?: boolean
}

const statusConfig: Record<
  AssessmentStatus,
  { icon: LucideIcon; color: string; bgColor: string; label: string }
> = {
  pending: {
    icon: Clock,
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    label: "Pendente",
  },
  in_progress: {
    icon: Loader2,
    color: "text-[#D98D38]",
    bgColor: "bg-[#D98D38]/10",
    label: "Em andamento",
  },
  completed: {
    icon: Check,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    label: "Concluído",
  },
  error: {
    icon: AlertCircle,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    label: "Erro",
  },
}

/**
 * AssessmentProgress Component
 *
 * Exibe o progresso através de múltiplas avaliações psicométricas.
 * Mostra status, questões e tempo de cada instrumento.
 */
export function AssessmentProgress({
  className,
  assessments,
  title = "Progresso das Avaliações",
  onAssessmentClick,
  showTime = true,
  compact = false,
  ...props
}: AssessmentProgressProps) {
  const completedCount = assessments.filter((a) => a.status === "completed").length
  const totalProgress = (completedCount / assessments.length) * 100

  return (
    <div
      data-slot="assessment-progress"
      className={cn("rounded-xl border bg-card", className)}
      {...props}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <span className="text-sm text-muted-foreground">
            {completedCount} de {assessments.length} concluídos
          </span>
        </div>

        {/* Overall progress bar */}
        <div className="mt-3">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-[#5B7B93] rounded-full transition-all duration-500"
              style={{ width: `${totalProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Assessments list */}
      <div className={cn("divide-y", compact ? "p-0" : "p-2")}>
        {assessments.map((assessment, index) => {
          const config = statusConfig[assessment.status]
          const CustomIcon = assessment.icon
          const progress =
            assessment.totalQuestions && assessment.answeredQuestions
              ? (assessment.answeredQuestions / assessment.totalQuestions) * 100
              : 0

          return (
            <div
              key={assessment.id}
              className={cn(
                "flex items-center gap-4 transition-colors",
                compact ? "px-6 py-3" : "p-4 rounded-lg",
                onAssessmentClick && assessment.status !== "completed" && "cursor-pointer hover:bg-muted/50",
                assessment.status === "in_progress" && "bg-[#D98D38]/5"
              )}
              onClick={() => {
                if (onAssessmentClick && assessment.status !== "completed") {
                  onAssessmentClick(assessment)
                }
              }}
            >
              {/* Step number or icon */}
              <div
                className={cn(
                  "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                  config.bgColor
                )}
              >
                {assessment.status === "completed" ? (
                  <Check className={cn("w-5 h-5", config.color)} />
                ) : assessment.status === "in_progress" ? (
                  <Loader2 className={cn("w-5 h-5 animate-spin", config.color)} />
                ) : CustomIcon ? (
                  <CustomIcon className={cn("w-5 h-5", config.color)} />
                ) : (
                  <span className={cn("text-sm font-semibold", config.color)}>
                    {index + 1}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground truncate">
                    {assessment.name}
                  </span>
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      config.bgColor,
                      config.color
                    )}
                  >
                    {config.label}
                  </span>
                </div>

                {assessment.description && !compact && (
                  <p className="text-sm text-muted-foreground mt-0.5 truncate">
                    {assessment.description}
                  </p>
                )}

                {/* Progress for in_progress */}
                {assessment.status === "in_progress" && assessment.totalQuestions && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>
                        {assessment.answeredQuestions} de {assessment.totalQuestions} questões
                      </span>
                      <span>{progress.toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#D98D38] rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Time */}
              {showTime && (
                <div className="flex-shrink-0 text-right">
                  {assessment.status === "completed" && assessment.timeSpent ? (
                    <span className="text-sm text-muted-foreground">
                      {assessment.timeSpent} min
                    </span>
                  ) : assessment.estimatedTime ? (
                    <span className="text-sm text-muted-foreground">
                      ~{assessment.estimatedTime} min
                    </span>
                  ) : null}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer summary */}
      {showTime && (
        <div className="px-6 py-3 border-t bg-muted/20 text-sm text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Tempo total estimado:</span>
            <span className="font-medium text-foreground">
              {assessments.reduce((acc, a) => acc + (a.estimatedTime || 0), 0)} min
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default AssessmentProgress
