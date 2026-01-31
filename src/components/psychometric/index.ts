/**
 * SynMind Psychometric Components
 *
 * Componentes especializados para visualização e interação
 * com instrumentos psicométricos da plataforma SynMind.
 */

// Visualization components
export { ScoreBar } from "./ScoreBar";
export { RadarChart } from "./RadarChart";
export { CVFQuadrantChart } from "./CVFQuadrantChart";
export { ProfileChart } from "./ProfileChart";
export { ScoreCard } from "./ScoreCard";
export { QualityBadge } from "./QualityBadge";

// Result components
export { InstrumentResultCard } from "./InstrumentResultCard";
export { AssessmentProgress } from "./AssessmentProgress";

// Input components (questionnaires)
export { LikertScale } from "./LikertScale";
export { TouchSlider } from "./TouchSlider";
export type { TouchSliderProps } from "./TouchSlider";
export { ForcedChoice } from "./ForcedChoice";
export { AllocationSlider } from "./AllocationSlider";

// Re-export types
export type {
  // Core types
  QualitySeverity,
  QualityFlag,
  QualityControl,
  ClassificationLabel,
  Classification,
  InstrumentResult,
  // Instrument-specific types
  BigFiveScores,
  BigFiveResult,
  TEIScores,
  TEIResult,
  SchemasDomains,
  SchemasScores,
  SchemasResult,
  CVFQuadrant,
  CVFScores,
  CVFResult,
  SYM4Dimension,
  SYM4Scores,
  SYM4Result,
  PsychometricResult,
  // Assessment types
  AssessmentStatus,
  Assessment,
  InstrumentMeta,
} from "@/types/psychometric";

export { INSTRUMENTS, DIMENSION_LABELS } from "@/types/psychometric";
