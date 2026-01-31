import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  ScoreBar,
  RadarChart,
  CVFQuadrantChart,
  ProfileChart,
  ScoreCard,
  QualityBadge,
  InstrumentResultCard,
  AssessmentProgress,
  LikertScale,
  ForcedChoice,
  AllocationSlider,
  INSTRUMENTS,
  type BigFiveResult,
  type CVFResult,
  type SYM4Result,
} from "@/components/psychometric";

// Mock data for demonstrations
const mockBigFiveResult: BigFiveResult = {
  instrument_id: "SM_BIG5_20",
  instrument_version: "SM_BIG5_20_PTBR_SYNMIND_v1",
  algorithm_version: "SM_BIG5_20_SCORING_v1",
  keying_version: "SM_BIG5_20_KEYING_v1",
  norm_version: null,
  scores_primary: {
    extraversion: 3.5,
    agreeableness: 4.2,
    conscientiousness: 3.8,
    neuroticism: 2.5,
    openness: 4.0,
  },
  scores_0_100: {
    extraversion: 62,
    agreeableness: 80,
    conscientiousness: 70,
    neuroticism: 38,
    openness: 75,
  },
  classification: {
    norm_version: null,
    percentiles: null,
    labels: {
      extraversion: "HIGH",
      agreeableness: "VERY_HIGH",
      conscientiousness: "HIGH",
      neuroticism: "LOW",
      openness: "HIGH",
    },
  },
  quality: {
    quality_passed: true,
    completion_time_seconds: 180,
    flags: [],
  },
};

const mockCVFResult: CVFResult = {
  instrument_id: "SM_CVF_24",
  instrument_version: "SM_CVF_24_PTBR_SYNMIND_v1",
  algorithm_version: "SM_CVF_24_SCORING_v1",
  keying_version: "SM_CVF_24_KEYING_v1",
  norm_version: null,
  scores_primary: {
    perceived: { clan: 30, adhocracy: 20, market: 35, hierarchy: 15 },
    values: { clan: 35, adhocracy: 30, market: 20, hierarchy: 15 },
    gap: { clan: 5, adhocracy: 10, market: -15, hierarchy: 0 },
  },
  scores_0_100: {
    perceived: { clan: 30, adhocracy: 20, market: 35, hierarchy: 15 },
    values: { clan: 35, adhocracy: 30, market: 20, hierarchy: 15 },
    gap: { clan: 5, adhocracy: 10, market: -15, hierarchy: 0 },
  },
  classification: { norm_version: null, percentiles: null, labels: null },
  quality: {
    quality_passed: true,
    completion_time_seconds: 420,
    flags: [
      {
        code: "TIME_OPTIMAL",
        severity: "info",
        message: "Tempo de resposta dentro do esperado",
      },
    ],
  },
};

const mockSYM4Result: SYM4Result = {
  instrument_id: "SM_SYM4_24",
  instrument_version: "SM_SYM4_24_PTBR_SYNMIND_v1",
  algorithm_version: "SM_SYM4_24_SCORING_v1",
  keying_version: "SM_SYM4_24_KEYING_v1",
  norm_version: null,
  scores_primary: {
    graph_i: { assertive: 65, influential: 78, stable: 45, analytical: 52 },
    graph_ii: { assertive: 70, influential: 72, stable: 50, analytical: 58 },
    tension: { assertive: 5, influential: -6, stable: 5, analytical: 6 },
  },
  scores_0_100: {
    graph_i: { assertive: 65, influential: 78, stable: 45, analytical: 52 },
    graph_ii: { assertive: 70, influential: 72, stable: 50, analytical: 58 },
    tension: { assertive: 5, influential: -6, stable: 5, analytical: 6 },
  },
  classification: { norm_version: null, percentiles: null, labels: null },
  quality: {
    quality_passed: false,
    completion_time_seconds: 85,
    flags: [
      {
        code: "TIME_TOO_FAST",
        severity: "warning",
        message: "Tempo de resposta abaixo do esperado (<90s)",
      },
    ],
  },
};

export function PsychometricShowcase() {
  const [likertValue, setLikertValue] = useState<number | undefined>();
  const [forcedChoice, setForcedChoice] = useState<{
    most: string | null;
    least: string | null;
  }>({ most: null, least: null });
  const [allocation, setAllocation] = useState<Record<string, number>>({
    clan: 25,
    adhocracy: 25,
    market: 25,
    hierarchy: 25,
  });

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Componentes Psicométricos</h1>
        <p className="text-muted-foreground">
          Biblioteca de componentes para visualização e interação com os
          instrumentos da plataforma SynMind.
        </p>
      </div>

      <Tabs defaultValue="visualization" className="space-y-6">
        <TabsList>
          <TabsTrigger value="visualization">Visualização</TabsTrigger>
          <TabsTrigger value="inputs">Questionários</TabsTrigger>
          <TabsTrigger value="results">Resultados</TabsTrigger>
          <TabsTrigger value="progress">Progresso</TabsTrigger>
        </TabsList>

        {/* Visualization Components */}
        <TabsContent value="visualization" className="space-y-8">
          {/* Score Bars */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">ScoreBar</h2>
            <p className="text-sm text-muted-foreground">
              Barra de progresso para exibir scores de 0-100.
            </p>
            <Card>
              <CardContent className="p-6 space-y-4">
                <ScoreBar value={75} label="Score Alto" />
                <ScoreBar
                  value={45}
                  label="Score Médio"
                  variant="gradient"
                />
                <ScoreBar
                  value={25}
                  label="Score Baixo"
                  variant="segmented"
                />
                <div className="flex gap-4">
                  <ScoreBar value={85} size="sm" showValue={false} />
                  <ScoreBar value={85} size="md" showValue={false} />
                  <ScoreBar value={85} size="lg" showValue={false} />
                </div>
              </CardContent>
            </Card>
          </section>

          <Separator />

          {/* Radar Chart */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">RadarChart</h2>
            <p className="text-sm text-muted-foreground">
              Gráfico radar para visualizar múltiplas dimensões (Big Five, TEI).
            </p>
            <Card>
              <CardContent className="p-6 flex justify-center">
                <RadarChart
                  scores={mockBigFiveResult.scores_0_100}
                  dimensions={INSTRUMENTS.SM_BIG5_20.dimensions}
                  showValues
                />
              </CardContent>
            </Card>
          </section>

          <Separator />

          {/* CVF Quadrant Chart */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">CVFQuadrantChart</h2>
            <p className="text-sm text-muted-foreground">
              Gráfico de quadrantes para cultura organizacional (CVF).
            </p>
            <Card>
              <CardContent className="p-6 flex justify-center">
                <CVFQuadrantChart
                  perceived={mockCVFResult.scores_0_100.perceived}
                  values={mockCVFResult.scores_0_100.values}
                />
              </CardContent>
            </Card>
          </section>

          <Separator />

          {/* Profile Chart */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">ProfileChart</h2>
            <p className="text-sm text-muted-foreground">
              Gráfico de perfil comportamental (SYM4/DISC).
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Variante Bar</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProfileChart
                    graphI={mockSYM4Result.scores_0_100.graph_i}
                    graphII={mockSYM4Result.scores_0_100.graph_ii}
                    variant="bar"
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Variante Diamond</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <ProfileChart
                    graphI={mockSYM4Result.scores_0_100.graph_i}
                    graphII={mockSYM4Result.scores_0_100.graph_ii}
                    variant="diamond"
                  />
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator />

          {/* Score Cards */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">ScoreCard</h2>
            <p className="text-sm text-muted-foreground">
              Cards individuais para exibir scores com classificação.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <ScoreCard
                dimension="extraversion"
                score={62}
                previousScore={55}
                classification="HIGH"
                description="Você tende a buscar interações sociais e se energiza com atividades em grupo."
              />
              <ScoreCard
                dimension="openness"
                score={75}
                classification="HIGH"
                variant="compact"
              />
              <ScoreCard
                dimension="neuroticism"
                score={38}
                previousScore={45}
                classification="LOW"
                variant="compact"
              />
            </div>
          </section>

          <Separator />

          {/* Quality Badge */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">QualityBadge</h2>
            <p className="text-sm text-muted-foreground">
              Indicadores de qualidade do questionário.
            </p>
            <Card>
              <CardContent className="p-6 flex flex-wrap gap-4">
                <QualityBadge passed={true} />
                <QualityBadge
                  passed={true}
                  flags={[
                    {
                      code: "INFO",
                      severity: "info",
                      message: "Tempo ideal",
                    },
                  ]}
                />
                <QualityBadge
                  passed={false}
                  flags={[
                    {
                      code: "WARN",
                      severity: "warning",
                      message: "Respostas rápidas",
                    },
                  ]}
                />
                <QualityBadge
                  passed={false}
                  flags={[
                    {
                      code: "CRITICAL",
                      severity: "critical",
                      message: "Padrão suspeito",
                    },
                  ]}
                  showDetails
                />
              </CardContent>
            </Card>
          </section>
        </TabsContent>

        {/* Input Components */}
        <TabsContent value="inputs" className="space-y-8">
          {/* Likert Scale */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">LikertScale</h2>
            <p className="text-sm text-muted-foreground">
              Escala Likert para questionários (Big Five, TEI, ESQ).
            </p>
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Variante Buttons</CardTitle>
                </CardHeader>
                <CardContent>
                  <LikertScale
                    questionId="q1"
                    question="Eu me considero uma pessoa sociável e extrovertida."
                    scale={5}
                    value={likertValue}
                    onChange={(_, v) => setLikertValue(v)}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Variante Slider</CardTitle>
                </CardHeader>
                <CardContent>
                  <LikertScale
                    questionId="q2"
                    question="Eu costumo planejar minhas atividades com antecedência."
                    scale={7}
                    variant="slider"
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Variante Touch</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Otimizada para mobile com thumb grande e snap points
                  </p>
                </CardHeader>
                <CardContent>
                  <LikertScale
                    questionId="q4"
                    question="Eu me adapto facilmente a novas situações."
                    scale={5}
                    variant="touch"
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Variante Radio</CardTitle>
                </CardHeader>
                <CardContent>
                  <LikertScale
                    questionId="q3"
                    question="Eu me sinto confortável em situações novas."
                    scale={5}
                    variant="radio"
                  />
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator />

          {/* Forced Choice */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">ForcedChoice</h2>
            <p className="text-sm text-muted-foreground">
              Escolha forçada para perfil comportamental (SYM4).
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Variante Combined</CardTitle>
                </CardHeader>
                <CardContent>
                  <ForcedChoice
                    questionId="t1"
                    options={[
                      { id: "a", text: "Assertivo e direto ao ponto" },
                      { id: "b", text: "Entusiasmado e comunicativo" },
                      { id: "c", text: "Paciente e bom ouvinte" },
                      { id: "d", text: "Preciso e detalhista" },
                    ]}
                    mostSelected={forcedChoice.most || undefined}
                    leastSelected={forcedChoice.least || undefined}
                    onChange={(_, most, least) =>
                      setForcedChoice({ most, least })
                    }
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Variante Separate</CardTitle>
                </CardHeader>
                <CardContent>
                  <ForcedChoice
                    questionId="t2"
                    variant="separate"
                    options={[
                      { id: "a", text: "Tomo decisões rapidamente" },
                      { id: "b", text: "Gosto de trabalhar em equipe" },
                      { id: "c", text: "Prefiro ambientes estáveis" },
                      { id: "d", text: "Sigo procedimentos rigorosos" },
                    ]}
                  />
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator />

          {/* Allocation Slider */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">AllocationSlider</h2>
            <p className="text-sm text-muted-foreground">
              Alocação ipsativa para cultura organizacional (CVF).
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Variante Sliders</CardTitle>
                </CardHeader>
                <CardContent>
                  <AllocationSlider
                    questionId="cvf1"
                    question="Distribua 100 pontos entre os tipos de cultura:"
                    options={[
                      {
                        id: "clan",
                        label: "Colaborativa",
                        description: "Foco em pessoas e trabalho em equipe",
                      },
                      {
                        id: "adhocracy",
                        label: "Inovadora",
                        description: "Foco em criatividade e mudança",
                      },
                      {
                        id: "market",
                        label: "Competitiva",
                        description: "Foco em resultados e metas",
                      },
                      {
                        id: "hierarchy",
                        label: "Estruturada",
                        description: "Foco em processos e estabilidade",
                      },
                    ]}
                    values={allocation}
                    onChange={(_, v) => setAllocation(v)}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Variante Pie</CardTitle>
                </CardHeader>
                <CardContent>
                  <AllocationSlider
                    questionId="cvf2"
                    options={[
                      { id: "clan", label: "Colaborativa" },
                      { id: "adhocracy", label: "Inovadora" },
                      { id: "market", label: "Competitiva" },
                      { id: "hierarchy", label: "Estruturada" },
                    ]}
                    values={allocation}
                    onChange={(_, v) => setAllocation(v)}
                    variant="pie"
                  />
                </CardContent>
              </Card>
            </div>
          </section>
        </TabsContent>

        {/* Results Components */}
        <TabsContent value="results" className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">InstrumentResultCard</h2>
            <p className="text-sm text-muted-foreground">
              Cards completos de resultado para cada instrumento.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <InstrumentResultCard result={mockBigFiveResult} />
              <InstrumentResultCard result={mockSYM4Result} />
            </div>
            <InstrumentResultCard result={mockCVFResult} expanded />
          </section>
        </TabsContent>

        {/* Progress Components */}
        <TabsContent value="progress" className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">AssessmentProgress</h2>
            <p className="text-sm text-muted-foreground">
              Indicadores de progresso do assessment.
            </p>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Variante Horizontal</CardTitle>
                </CardHeader>
                <CardContent>
                  <AssessmentProgress
                    instruments={[
                      "SM_BIG5_20",
                      "SM_TEI_20",
                      "SM_CVF_24",
                      "SM_SYM4_24",
                    ]}
                    completedInstruments={["SM_BIG5_20", "SM_TEI_20"]}
                    currentInstrument="SM_CVF_24"
                    showEstimatedTime
                  />
                </CardContent>
              </Card>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Variante Vertical</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AssessmentProgress
                      instruments={[
                        "SM_BIG5_20",
                        "SM_TEI_20",
                        "SM_CVF_24",
                        "SM_SYM4_24",
                      ]}
                      completedInstruments={["SM_BIG5_20"]}
                      currentInstrument="SM_TEI_20"
                      variant="vertical"
                      showEstimatedTime
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Variante Compact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AssessmentProgress
                      instruments={[
                        "SM_BIG5_20",
                        "SM_TEI_20",
                        "SM_ESQ_36",
                        "SM_CVF_24",
                        "SM_SYM4_24",
                      ]}
                      completedInstruments={[
                        "SM_BIG5_20",
                        "SM_TEI_20",
                        "SM_ESQ_36",
                      ]}
                      variant="compact"
                      showEstimatedTime
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
