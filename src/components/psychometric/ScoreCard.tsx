import { memo } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { ScoreBar } from "./ScoreBar";
import type { ClassificationLabel } from "@/types/psychometric";
import { DIMENSION_LABELS } from "@/types/psychometric";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface ScoreCardProps {
  dimension: string;
  score: number; // 0-100
  previousScore?: number;
  classification?: ClassificationLabel;
  description?: string;
  variant?: "compact" | "detailed";
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
  const change = previousScore !== undefined ? score - previousScore : null;

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

  if (variant === "compact") {
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

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h4 className="font-semibold text-lg">{label}</h4>
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
          <div className="text-right">
            <div className="text-3xl font-bold tabular-nums">
              {Math.round(score)}
            </div>
            {change !== null && (
              <div
                className={cn(
                  "flex items-center justify-end gap-0.5 text-sm",
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

        <ScoreBar value={score} classification={classification} showValue={false} />

        {description && (
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
});
