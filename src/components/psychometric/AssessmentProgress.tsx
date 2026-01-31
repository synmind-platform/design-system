import { cn } from "@/lib/utils";
import { INSTRUMENTS } from "@/types/psychometric";
import { Check, Circle, Loader2 } from "lucide-react";

interface AssessmentProgressProps {
  instruments: string[];
  completedInstruments: string[];
  currentInstrument?: string;
  variant?: "horizontal" | "vertical" | "compact";
  showEstimatedTime?: boolean;
  className?: string;
}

export function AssessmentProgress({
  instruments,
  completedInstruments,
  currentInstrument,
  variant = "horizontal",
  showEstimatedTime = false,
  className,
}: AssessmentProgressProps) {
  const totalEstimatedTime = instruments.reduce((sum, id) => {
    const instrument = INSTRUMENTS[id];
    return sum + (instrument?.estimated_time_minutes || 5);
  }, 0);

  const completedTime = completedInstruments.reduce((sum, id) => {
    const instrument = INSTRUMENTS[id];
    return sum + (instrument?.estimated_time_minutes || 5);
  }, 0);

  const progress = (completedInstruments.length / instruments.length) * 100;

  if (variant === "compact") {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">
            {completedInstruments.length} de {instruments.length} concluídos
          </span>
          {showEstimatedTime && (
            <span className="text-muted-foreground">
              ~{totalEstimatedTime - completedTime}min restantes
            </span>
          )}
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-synmind-blue-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  }

  if (variant === "vertical") {
    return (
      <div className={cn("space-y-1", className)}>
        {instruments.map((id, index) => {
          const instrument = INSTRUMENTS[id];
          const isCompleted = completedInstruments.includes(id);
          const isCurrent = currentInstrument === id;
          const isLast = index === instruments.length - 1;

          return (
            <div key={id} className="flex gap-3">
              {/* Timeline */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors",
                    isCompleted
                      ? "border-emerald-500 bg-emerald-500"
                      : isCurrent
                        ? "border-synmind-blue-500 bg-synmind-blue-50 dark:bg-synmind-blue-900/30"
                        : "border-border bg-background"
                  )}
                >
                  {isCompleted ? (
                    <Check className="size-4 text-white" />
                  ) : isCurrent ? (
                    <Loader2 className="size-4 text-synmind-blue-500 animate-spin" />
                  ) : (
                    <Circle className="size-3 text-muted-foreground" />
                  )}
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      "w-0.5 flex-1 min-h-8 transition-colors",
                      isCompleted ? "bg-emerald-500" : "bg-border"
                    )}
                  />
                )}
              </div>

              {/* Content */}
              <div className={cn("pb-6", isLast && "pb-0")}>
                <h4
                  className={cn(
                    "font-medium",
                    isCurrent && "text-synmind-blue-500"
                  )}
                >
                  {instrument?.short_name || id}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {instrument?.item_count} itens
                  {showEstimatedTime && ` • ~${instrument?.estimated_time_minutes}min`}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal variant
  return (
    <div className={cn("space-y-4", className)}>
      {/* Steps */}
      <div className="flex items-center">
        {instruments.map((id, index) => {
          const instrument = INSTRUMENTS[id];
          const isCompleted = completedInstruments.includes(id);
          const isCurrent = currentInstrument === id;
          const isLast = index === instruments.length - 1;

          return (
            <div
              key={id}
              className={cn("flex items-center", !isLast && "flex-1")}
            >
              {/* Step circle */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                    isCompleted
                      ? "border-emerald-500 bg-emerald-500"
                      : isCurrent
                        ? "border-synmind-blue-500 bg-synmind-blue-50 dark:bg-synmind-blue-900/30 scale-110"
                        : "border-border bg-background"
                  )}
                >
                  {isCompleted ? (
                    <Check className="size-5 text-white" />
                  ) : isCurrent ? (
                    <Loader2 className="size-5 text-synmind-blue-500 animate-spin" />
                  ) : (
                    <span className="text-sm font-semibold text-muted-foreground">
                      {index + 1}
                    </span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium text-center max-w-[80px]",
                    isCurrent
                      ? "text-synmind-blue-500"
                      : isCompleted
                        ? "text-emerald-600"
                        : "text-muted-foreground"
                  )}
                >
                  {instrument?.short_name || id}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2 transition-colors",
                    isCompleted ? "bg-emerald-500" : "bg-border"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Time estimate */}
      {showEstimatedTime && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>Tempo estimado restante:</span>
          <span className="font-medium">
            ~{totalEstimatedTime - completedTime} minutos
          </span>
        </div>
      )}
    </div>
  );
}
