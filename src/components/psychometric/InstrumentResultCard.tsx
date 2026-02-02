import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreBar } from "./ScoreBar";
import { RadarChart } from "./RadarChart";
import { QualityBadge } from "./QualityBadge";
import { CVFQuadrantChart } from "./CVFQuadrantChart";
import { ProfileChart } from "./ProfileChart";
import type {
  PsychometricResult,
  BigFiveResult,
  TEIResult,
  CVFResult,
  SYM4Result,
} from "@/types/psychometric";
import { INSTRUMENTS, DIMENSION_LABELS } from "@/types/psychometric";
import {
  Brain,
  Heart,
  Building2,
  Users,
  BarChart3,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState, useMemo } from "react";

interface InstrumentResultCardProps {
  result: PsychometricResult | null;
  expanded?: boolean;
  showChart?: boolean;
  showDetails?: boolean;
  className?: string;
}

const instrumentIcons: Record<string, typeof Brain> = {
  SM_BIG5_20: Brain,
  SM_TEI_20: Heart,
  SM_ESQ_36: BarChart3,
  SM_CVF_24: Building2,
  SM_SYM4_24: Users,
};

export function InstrumentResultCard({
  result,
  expanded: initialExpanded = false,
  showChart = true,
  showDetails = true,
  className,
}: InstrumentResultCardProps) {
  const [expanded, setExpanded] = useState(initialExpanded);

  // Handle null result - show empty state
  if (result === null) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <BarChart3 className="size-12 mb-4 opacity-40" />
          <p className="text-sm font-medium">Resultado não disponível</p>
          <p className="text-xs mt-1">Aguardando conclusão do instrumento</p>
        </CardContent>
      </Card>
    );
  }

  const instrument = INSTRUMENTS[result.instrument_id];
  const Icon = instrumentIcons[result.instrument_id] || BarChart3;

  // Memoize chart rendering to avoid recalculating on unrelated state changes
  const chart = useMemo(() => {
    if (!showChart) return null;

    switch (result.instrument_id) {
      case "SM_BIG5_20": {
        const bigFiveResult = result as BigFiveResult;
        return (
          <RadarChart
            scores={bigFiveResult.scores_0_100}
            dimensions={instrument.dimensions}
            size={240}
            showValues
          />
        );
      }
      case "SM_TEI_20": {
        const teiResult = result as TEIResult;
        const dimensionsWithoutGlobal = instrument.dimensions.filter(
          (d) => d !== "global"
        );
        return (
          <RadarChart
            scores={teiResult.scores_0_100}
            dimensions={dimensionsWithoutGlobal}
            size={240}
            showValues
          />
        );
      }
      case "SM_CVF_24": {
        const cvfResult = result as CVFResult;
        return (
          <CVFQuadrantChart
            perceived={cvfResult.scores_0_100.perceived}
            values={cvfResult.scores_0_100.values}
            size={260}
          />
        );
      }
      case "SM_SYM4_24": {
        const sym4Result = result as SYM4Result;
        return (
          <ProfileChart
            graphI={sym4Result.scores_0_100.graph_i}
            graphII={sym4Result.scores_0_100.graph_ii}
            variant="diamond"
            size={260}
          />
        );
      }
      default:
        return null;
    }
  }, [result, instrument, showChart]);

  const renderScoreBars = () => {
    if (!showDetails || !expanded) return null;

    const scores = result.scores_0_100;
    let dimensions: string[] = [];

    switch (result.instrument_id) {
      case "SM_BIG5_20":
      case "SM_TEI_20":
      case "SM_ESQ_36":
        dimensions = instrument.dimensions;
        break;
      case "SM_CVF_24": {
        const cvfResult = result as CVFResult;
        return (
          <div className="space-y-4">
            <div>
              <h5 className="text-sm font-medium mb-2">Cultura Percebida</h5>
              <div className="space-y-2">
                {Object.entries(cvfResult.scores_0_100.perceived).map(
                  ([key, value]) => (
                    <ScoreBar
                      key={key}
                      label={DIMENSION_LABELS[key] || key}
                      value={value}
                      size="sm"
                    />
                  )
                )}
              </div>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-2">Valores Pessoais</h5>
              <div className="space-y-2">
                {Object.entries(cvfResult.scores_0_100.values).map(
                  ([key, value]) => (
                    <ScoreBar
                      key={key}
                      label={DIMENSION_LABELS[key] || key}
                      value={value}
                      size="sm"
                    />
                  )
                )}
              </div>
            </div>
          </div>
        );
      }
      case "SM_SYM4_24": {
        const sym4Result = result as SYM4Result;
        return (
          <div className="space-y-4">
            <div>
              <h5 className="text-sm font-medium mb-2">Perfil Natural (I)</h5>
              <div className="space-y-2">
                {Object.entries(sym4Result.scores_0_100.graph_i).map(
                  ([key, value]) => (
                    <ScoreBar
                      key={key}
                      label={DIMENSION_LABELS[key] || key}
                      value={value}
                      size="sm"
                    />
                  )
                )}
              </div>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-2">Perfil Adaptado (II)</h5>
              <div className="space-y-2">
                {Object.entries(sym4Result.scores_0_100.graph_ii).map(
                  ([key, value]) => (
                    <ScoreBar
                      key={key}
                      label={DIMENSION_LABELS[key] || key}
                      value={value}
                      size="sm"
                    />
                  )
                )}
              </div>
            </div>
          </div>
        );
      }
    }

    if (dimensions.length === 0) return null;

    return (
      <div className="space-y-2">
        {dimensions.map((dim) => {
          const value =
            typeof scores === "object" && dim in scores
              ? (scores as Record<string, number>)[dim]
              : 0;
          return (
            <ScoreBar
              key={dim}
              label={DIMENSION_LABELS[dim] || dim}
              value={value}
              size="sm"
            />
          );
        })}
      </div>
    );
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-synmind-blue-50 dark:bg-synmind-blue-900/30">
              <Icon className="size-5 text-synmind-blue-500" />
            </div>
            <div>
              <CardTitle className="text-lg">{instrument?.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {instrument?.description}
              </p>
            </div>
          </div>
          <QualityBadge
            passed={result.quality.quality_passed}
            flags={result.quality.flags}
            size="sm"
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Chart */}
        {showChart && (
          <div className="flex justify-center py-4">{chart}</div>
        )}

        {/* Version info */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            v{result.algorithm_version.split("_v")[1] || "1"}
          </Badge>
          {result.quality.completion_time_seconds && (
            <Badge variant="outline" className="text-xs">
              {Math.round(result.quality.completion_time_seconds / 60)}min
            </Badge>
          )}
        </div>

        {/* Expandable details */}
        {showDetails && (
          <>
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-full"
            >
              {expanded ? (
                <ChevronUp className="size-4" />
              ) : (
                <ChevronDown className="size-4" />
              )}
              {expanded ? "Ocultar detalhes" : "Ver detalhes"}
            </button>

            {expanded && (
              <div className="pt-2 animate-fade-in">{renderScoreBars()}</div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
