import { memo } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { ScoreBar } from "./ScoreBar";
import { EmptyState } from "./EmptyState";
import type { ClassificationLabel } from "@/types/psychometric";
import { DIMENSION_LABELS } from "@/types/psychometric";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
  Hash,
} from "lucide-react";

interface ScoreCardProps {
  /** Nome da dimensão - OBRIGATÓRIO */
  dimension: string;
  /** Score atual (0-100) ou null para estado vazio */
  score: number | null;
  /** Score anterior (para tendência) */
  previousScore?: number;
  /** Classificação semântica */
  classification?: ClassificationLabel;
  /** Descrição adicional */
  description?: string;
  /** Variante visual */
  variant?: "compact" | "detailed";
  /** Classes adicionais */
  className?: string;
}

const classificationLabels: Record<ClassificationLabel, string> = {
  VERY_LOW: "Muito Baixo",
  LOW: "Baixo",
  HIGH: "Alto",
  VERY_HIGH: "Muito Alto",
};

const classificationColors: Record<ClassificationLabel, string> = {
  VERY_LOW: "text-synmind-blue-400",
  LOW: "text-synmind-blue-500",
  HIGH: "text-synmind-orange-400",
  VERY_HIGH: "text-synmind-orange-500",
};

export const ScoreCard = memo(function ScoreCard({
  dimension,
  score,
  previousScore,
  classification,
  description,
  variant = "detailed",
  className,
}: ScoreCardProps) {
  const label = DIMENSION_LABELS[dimension] || dimension;
  const isEmptyState = score === null || score === undefined;
  const change =
    !isEmptyState && previousScore !== undefined
      ? score - previousScore
      : null;

  const TrendIcon =
    change === null
      ? null
      : change > 5
        ? TrendingUp
        : change < -5
          ? TrendingDown
          : Minus;

  const ChangeIcon =
    change === null
      ? null
      : change > 0
        ? ArrowUpRight
        : change < 0
          ? ArrowDownRight
          : null;

  // Compact variant with empty state support
  if (variant === "compact") {
    if (isEmptyState) {
      return (
        <div
          className={cn(
            "flex items-center gap-4 p-3 rounded-lg bg-muted/50",
            className
          )}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-sm font-medium truncate">{label}</span>
              <span className="text-lg font-bold tabular-nums text-muted-foreground">
                -
              </span>
            </div>
            <ScoreBar value={null} showValue={false} size="sm" />
          </div>
        </div>
      );
    }

    return (
      <div
        className={cn(
          "flex items-center gap-4 p-3 rounded-lg bg-muted/50",
          className
        )}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-sm font-medium truncate">{label}</span>
            <span className="text-lg font-bold tabular-nums">
              {Math.round(score)}
            </span>
          </div>
          <ScoreBar
            value={score}
            classification={classification}
            showValue={false}
            size="sm"
          />
        </div>
        {TrendIcon && change !== null && (
          <div
            className={cn(
              "shrink-0",
              change > 5
                ? "text-emerald-500"
                : change < -5
                  ? "text-red-500"
                  : "text-muted-foreground"
            )}
          >
            <TrendIcon className="size-5" />
          </div>
        )}
      </div>
    );
  }

  // Detailed variant with empty state
  if (isEmptyState) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardContent className="p-4">
          {/* Visual Hierarchy Level 1: Dimension (always visible) */}
          <h4 className="text-lg font-semibold text-foreground mb-4">
            {label}
          </h4>
          <EmptyState
            icon={Hash}
            message="Score indisponível"
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4 mb-4">
          {/* Left column: Dimension and Classification */}
          <div className="space-y-1">
            {/* Visual Hierarchy Level 1: Dimension (most prominent text element) */}
            <h4 className="text-lg font-semibold text-foreground">{label}</h4>
            {/* Visual Hierarchy Level 3: Classification (contextual) */}
            {classification && (
              <span
                className={cn(
                  "text-sm font-medium",
                  classificationColors[classification]
                )}
              >
                {classificationLabels[classification]}
              </span>
            )}
          </div>
          {/* Right column: Score and Trend */}
          <div className="text-right">
            {/* Visual Hierarchy Level 2: Score (visually dominant) */}
            <div className="text-3xl font-bold tabular-nums text-foreground">
              {Math.round(score)}
            </div>
            {/* Visual Hierarchy Level 4: Trend (least prominent) */}
            {change !== null && (
              <div
                className={cn(
                  "flex items-center justify-end gap-0.5 text-xs",
                  change > 0
                    ? "text-emerald-500"
                    : change < 0
                      ? "text-red-500"
                      : "text-muted-foreground"
                )}
              >
                {ChangeIcon && <ChangeIcon className="size-3.5" />}
                <span className="tabular-nums">
                  {change > 0 ? "+" : ""}
                  {Math.round(change)}
                </span>
              </div>
            )}
          </div>
        </div>

        <ScoreBar
          value={score}
          classification={classification}
          showValue={false}
        />

        {description && (
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
});
