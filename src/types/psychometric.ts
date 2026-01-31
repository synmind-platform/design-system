/**
 * SynMind Psychometric Types
 * Tipos para os 5 instrumentos psicométricos da plataforma
 */

// Quality control flags
export type QualitySeverity = "info" | "warning" | "critical" | "invalid";

export interface QualityFlag {
  code: string;
  severity: QualitySeverity;
  message: string;
}

export interface QualityControl {
  quality_passed: boolean;
  completion_time_seconds: number;
  flags: QualityFlag[];
}

// Classification
export type ClassificationLabel = "VERY_LOW" | "LOW" | "HIGH" | "VERY_HIGH";

export interface Classification {
  norm_version: string | null;
  percentiles: Record<string, number> | null;
  labels: Record<string, ClassificationLabel> | null;
}

// Base instrument result
export interface InstrumentResult {
  instrument_id: string;
  instrument_version: string;
  algorithm_version: string;
  keying_version: string;
  norm_version: string | null;
  scores_primary: Record<string, number>;
  scores_0_100: Record<string, number>;
  classification: Classification;
  quality: QualityControl;
}

// Big Five (SM_BIG5_20)
export interface BigFiveScores {
  extraversion: number;
  agreeableness: number;
  conscientiousness: number;
  neuroticism: number;
  openness: number;
}

export interface BigFiveResult extends InstrumentResult {
  instrument_id: "SM_BIG5_20";
  scores_primary: BigFiveScores;
  scores_0_100: BigFiveScores;
}

// Trait Emotional Intelligence (SM_TEI_20)
export interface TEIScores {
  well_being: number;
  emotionality: number;
  self_control: number;
  sociability: number;
  global: number;
}

export interface TEIResult extends InstrumentResult {
  instrument_id: "SM_TEI_20";
  scores_primary: TEIScores;
  scores_0_100: TEIScores;
}

// Maladaptive Schemas (SM_ESQ_36)
export interface SchemasDomains {
  disconnection_rejection: number;
  impaired_autonomy: number;
  impaired_limits: number;
  other_directedness: number;
  overvigilance_inhibition: number;
}

export interface SchemasScores extends SchemasDomains {
  // 18 individual schemas
  abandonment: number;
  mistrust_abuse: number;
  emotional_deprivation: number;
  defectiveness_shame: number;
  social_isolation: number;
  dependence_incompetence: number;
  vulnerability_harm: number;
  enmeshment: number;
  failure: number;
  entitlement_grandiosity: number;
  insufficient_self_control: number;
  subjugation: number;
  self_sacrifice: number;
  approval_seeking: number;
  negativity_pessimism: number;
  emotional_inhibition: number;
  unrelenting_standards: number;
  punitiveness: number;
}

export interface SchemasResult extends InstrumentResult {
  instrument_id: "SM_ESQ_36";
  scores_primary: SchemasScores;
  scores_0_100: SchemasScores;
}

// Competing Values Framework (SM_CVF_24)
export interface CVFQuadrant {
  clan: number;
  adhocracy: number;
  market: number;
  hierarchy: number;
}

export interface CVFScores {
  perceived: CVFQuadrant; // Cultura percebida
  values: CVFQuadrant; // Valores pessoais
  gap: CVFQuadrant; // Diferença (gap analysis)
}

export interface CVFResult extends InstrumentResult {
  instrument_id: "SM_CVF_24";
  scores_primary: CVFScores;
  scores_0_100: CVFScores;
}

// SynMind Behavioral Profile (SM_SYM4_24)
export interface SYM4Dimension {
  assertive: number; // D - Dominância
  influential: number; // I - Influência
  stable: number; // S - Estabilidade
  analytical: number; // C - Conformidade
}

export interface SYM4Scores {
  graph_i: SYM4Dimension; // Perfil natural
  graph_ii: SYM4Dimension; // Perfil adaptado
  tension: SYM4Dimension; // Tensão (diferença)
}

export interface SYM4Result extends InstrumentResult {
  instrument_id: "SM_SYM4_24";
  scores_primary: SYM4Scores;
  scores_0_100: SYM4Scores;
}

// Union type for all instrument results
export type PsychometricResult =
  | BigFiveResult
  | TEIResult
  | SchemasResult
  | CVFResult
  | SYM4Result;

// Assessment session
export type AssessmentStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "expired";

export interface Assessment {
  id: string;
  user_id: string;
  product_id: string;
  status: AssessmentStatus;
  instruments: string[];
  completed_instruments: string[];
  results: PsychometricResult[];
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

// Instrument metadata
export interface InstrumentMeta {
  id: string;
  name: string;
  short_name: string;
  description: string;
  item_count: number;
  estimated_time_minutes: number;
  dimensions: string[];
}

export const INSTRUMENTS: Record<string, InstrumentMeta> = {
  SM_BIG5_20: {
    id: "SM_BIG5_20",
    name: "Traços de Personalidade",
    short_name: "Personalidade",
    description: "Avaliação dos 5 grandes fatores de personalidade",
    item_count: 20,
    estimated_time_minutes: 5,
    dimensions: [
      "extraversion",
      "agreeableness",
      "conscientiousness",
      "neuroticism",
      "openness",
    ],
  },
  SM_TEI_20: {
    id: "SM_TEI_20",
    name: "Inteligência Emocional",
    short_name: "Emocional",
    description: "Avaliação de competências emocionais",
    item_count: 20,
    estimated_time_minutes: 5,
    dimensions: ["well_being", "emotionality", "self_control", "sociability"],
  },
  SM_ESQ_36: {
    id: "SM_ESQ_36",
    name: "Padrões de Pensamento",
    short_name: "Esquemas",
    description: "Identificação de padrões cognitivos e emocionais",
    item_count: 36,
    estimated_time_minutes: 8,
    dimensions: [
      "disconnection_rejection",
      "impaired_autonomy",
      "impaired_limits",
      "other_directedness",
      "overvigilance_inhibition",
    ],
  },
  SM_CVF_24: {
    id: "SM_CVF_24",
    name: "Cultura Organizacional",
    short_name: "Cultura",
    description: "Análise de valores e cultura organizacional",
    item_count: 48,
    estimated_time_minutes: 10,
    dimensions: ["clan", "adhocracy", "market", "hierarchy"],
  },
  SM_SYM4_24: {
    id: "SM_SYM4_24",
    name: "Perfil Comportamental",
    short_name: "Comportamental",
    description: "Mapeamento do estilo comportamental",
    item_count: 24,
    estimated_time_minutes: 7,
    dimensions: ["assertive", "influential", "stable", "analytical"],
  },
};

// Friendly dimension labels (não expor nomes técnicos ao usuário)
export const DIMENSION_LABELS: Record<string, string> = {
  // Big Five
  extraversion: "Sociabilidade",
  agreeableness: "Colaboração",
  conscientiousness: "Organização",
  neuroticism: "Sensibilidade",
  openness: "Abertura",
  // TEI
  well_being: "Bem-estar",
  emotionality: "Expressividade",
  self_control: "Autocontrole",
  sociability: "Sociabilidade",
  global: "Geral",
  // CVF
  clan: "Colaborativa",
  adhocracy: "Inovadora",
  market: "Competitiva",
  hierarchy: "Estruturada",
  // SYM4
  assertive: "Assertivo",
  influential: "Influenciador",
  stable: "Estável",
  analytical: "Analítico",
};
