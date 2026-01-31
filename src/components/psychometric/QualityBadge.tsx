import { cn } from "@/lib/utils";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  ShieldAlert,
} from "lucide-react";
import type { QualitySeverity, QualityFlag } from "@/types/psychometric";

interface QualityBadgeProps {
  passed: boolean;
  flags?: QualityFlag[];
  showDetails?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const severityConfig: Record<
  QualitySeverity,
  {
    icon: typeof CheckCircle;
    color: string;
    bg: string;
    label: string;
  }
> = {
  info: {
    icon: Info,
    color: "text-synmind-blue-500",
    bg: "bg-synmind-blue-50",
    label: "Info",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-amber-600",
    bg: "bg-amber-50",
    label: "Atenção",
  },
  critical: {
    icon: ShieldAlert,
    color: "text-orange-600",
    bg: "bg-orange-50",
    label: "Crítico",
  },
  invalid: {
    icon: XCircle,
    color: "text-destructive",
    bg: "bg-red-50",
    label: "Inválido",
  },
};

const sizeClasses = {
  sm: "text-xs px-2 py-0.5 gap-1",
  md: "text-sm px-2.5 py-1 gap-1.5",
  lg: "text-base px-3 py-1.5 gap-2",
};

const iconSizes = {
  sm: "size-3",
  md: "size-4",
  lg: "size-5",
};

export function QualityBadge({
  passed,
  flags = [],
  showDetails = false,
  size = "md",
  className,
}: QualityBadgeProps) {
  // Determine the most severe flag
  const severityOrder: QualitySeverity[] = [
    "invalid",
    "critical",
    "warning",
    "info",
  ];
  const worstSeverity =
    flags.length > 0
      ? severityOrder.find((s) => flags.some((f) => f.severity === s)) || "info"
      : null;

  if (passed && flags.length === 0) {
    return (
      <div
        className={cn(
          "inline-flex items-center rounded-full font-medium",
          "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
          sizeClasses[size],
          className
        )}
      >
        <CheckCircle className={iconSizes[size]} />
        <span>Validado</span>
      </div>
    );
  }

  const config = worstSeverity ? severityConfig[worstSeverity] : null;

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "inline-flex items-center rounded-full font-medium",
          passed
            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
            : config
              ? `${config.bg} ${config.color}`
              : "bg-muted text-muted-foreground",
          sizeClasses[size]
        )}
      >
        {passed ? (
          <CheckCircle className={iconSizes[size]} />
        ) : config ? (
          <config.icon className={iconSizes[size]} />
        ) : null}
        <span>{passed ? "Validado" : config?.label || "Verificar"}</span>
        {flags.length > 0 && (
          <span className="opacity-60">({flags.length})</span>
        )}
      </div>

      {showDetails && flags.length > 0 && (
        <ul className="space-y-1 text-sm">
          {flags.map((flag, index) => {
            const flagConfig = severityConfig[flag.severity];
            return (
              <li
                key={`${flag.code}-${index}`}
                className={cn("flex items-start gap-2", flagConfig.color)}
              >
                <flagConfig.icon className="size-4 shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{flag.message}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
