import * as React from "react"
import {
  Users,
  Brain,
  Target,
  TrendingUp,
  BarChart3,
  Sparkles,
  Zap,
  Heart,
  Shield,
  MessageSquare,
  DollarSign,
} from "lucide-react"

// Brand components
import {
  SynMindLogo,
  MindScanBadge,
  BrandDot,
  BrandDotsGroup,
} from "@/components/brand"

// UI components
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Label,
  Alert,
  AlertTitle,
  AlertDescription,
  FeatureCard,
  StatCard,
  TestimonialCard,
  ProductCard,
  Separator,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  // B2B Dashboard components
  KPICard,
  MetricComparison,
  ProgressRing,
  ActivityFeed,
  DashboardCard,
  DataTable,
  // Assessment/Psychometric components
  ScoreGauge,
  RadarChart,
  QuadrantChart,
  ProfileCard,
  AssessmentProgress,
  FitIndicator,
  DimensionComparison,
} from "@/components/ui"

export function Showcase() {
  const [activeTab, setActiveTab] = React.useState("brand")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <SynMindLogo variant="full" size="sm" />
          <div className="flex items-center gap-4">
            <Badge variant="outline">Design System v1.0</Badge>
            <MindScanBadge variant="compact" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">SynMind Design System</h1>
          <p className="text-lg text-muted-foreground">
            Componentes e tokens de design para o ecossistema SynMind, I_DEAL e MindScan.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-6 mb-8">
            <TabsTrigger value="brand">Marca</TabsTrigger>
            <TabsTrigger value="components">Componentes</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="assessments">Avaliações</TabsTrigger>
            <TabsTrigger value="b2b">B2B</TabsTrigger>
            <TabsTrigger value="b2c">B2C</TabsTrigger>
          </TabsList>

          {/* Brand Tab */}
          <TabsContent value="brand" className="space-y-12">
            {/* Logos */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Logos</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Logo Completo</CardTitle>
                    <CardDescription>Uso principal em headers e materiais</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center py-8 bg-muted/30 rounded-lg">
                    <SynMindLogo variant="full" size="lg" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Símbolo</CardTitle>
                    <CardDescription>Favicon, ícones de app</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center py-8 bg-muted/30 rounded-lg">
                    <SynMindLogo variant="symbol" size="lg" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Variações de Cor</CardTitle>
                    <CardDescription>Para diferentes contextos</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 py-4">
                    <div className="flex justify-center p-4 bg-white rounded">
                      <SynMindLogo variant="symbol" size="md" colorScheme="default" />
                    </div>
                    <div className="flex justify-center p-4 bg-stone-800 rounded">
                      <SynMindLogo variant="symbol" size="md" colorScheme="white" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* MindScan Badge */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">MindScan Badge</h2>
              <div className="flex flex-wrap gap-4 items-center">
                <MindScanBadge variant="default" />
                <MindScanBadge variant="compact" />
                <MindScanBadge variant="inline" />
                <MindScanBadge variant="compact" colorScheme="blue" />
              </div>
            </section>

            {/* Brand Dots */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Brand Dots</h2>
              <div className="flex flex-wrap gap-8 items-center">
                <div className="flex items-center gap-4">
                  <BrandDot variant={1} size="lg" />
                  <BrandDot variant={2} size="lg" />
                  <BrandDot variant={3} size="lg" />
                </div>
                <Separator orientation="vertical" className="h-8" />
                <BrandDotsGroup size="lg" />
                <BrandDotsGroup size="md" animated />
              </div>
            </section>

            {/* Colors */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Cores da Marca</h2>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="font-medium mb-4">SynMind Blue</h3>
                  <div className="flex gap-1">
                    {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                      <div
                        key={shade}
                        className="w-8 h-16 rounded first:rounded-l-lg last:rounded-r-lg"
                        style={{ backgroundColor: `var(--color-synmind-blue-${shade})` }}
                        title={`blue-${shade}`}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-4">SynMind Orange</h3>
                  <div className="flex gap-1">
                    {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                      <div
                        key={shade}
                        className="w-8 h-16 rounded first:rounded-l-lg last:rounded-r-lg"
                        style={{ backgroundColor: `var(--color-synmind-orange-${shade})` }}
                        title={`orange-${shade}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </TabsContent>

          {/* Components Tab */}
          <TabsContent value="components" className="space-y-12">
            {/* Buttons */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Buttons</h2>
              <div className="flex flex-wrap gap-4">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
              <div className="flex flex-wrap gap-4 mt-4">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon"><Zap className="size-4" /></Button>
              </div>
            </section>

            {/* Badges */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Badges</h2>
              <div className="flex flex-wrap gap-4">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </section>

            {/* Alerts */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Alerts</h2>
              <div className="space-y-4 max-w-2xl">
                <Alert variant="info">
                  <AlertTitle>Informação</AlertTitle>
                  <AlertDescription>
                    Esta é uma mensagem informativa com detalhes adicionais.
                  </AlertDescription>
                </Alert>
                <Alert variant="success">
                  <AlertTitle>Sucesso</AlertTitle>
                  <AlertDescription>
                    Operação concluída com sucesso!
                  </AlertDescription>
                </Alert>
                <Alert variant="warning">
                  <AlertTitle>Atenção</AlertTitle>
                  <AlertDescription>
                    Verifique os dados antes de prosseguir.
                  </AlertDescription>
                </Alert>
                <Alert variant="destructive">
                  <AlertTitle>Erro</AlertTitle>
                  <AlertDescription>
                    Ocorreu um erro ao processar sua solicitação.
                  </AlertDescription>
                </Alert>
              </div>
            </section>

            {/* Inputs */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Inputs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="seu@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="disabled">Desabilitado</Label>
                  <Input id="disabled" disabled placeholder="Campo desabilitado" />
                </div>
              </div>
            </section>

            {/* Cards */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Cards</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Card Padrão</CardTitle>
                    <CardDescription>Uma descrição do conteúdo do card</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Conteúdo do card com informações relevantes.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm">Ação</Button>
                  </CardFooter>
                </Card>

                <FeatureCard
                  icon={Sparkles}
                  title="Feature Card"
                  description="Card para destacar funcionalidades e benefícios do produto."
                  variant="highlight"
                  badge="Novo"
                />
              </div>
            </section>
          </TabsContent>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-12">
            <section>
              <h2 className="text-2xl font-semibold mb-6">Componentes de Dashboard</h2>
              <p className="text-muted-foreground mb-8">
                Widgets e componentes para dashboards corporativos B2B.
              </p>

              {/* KPI Cards */}
              <h3 className="text-xl font-semibold mb-4">KPI Cards</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <KPICard
                  label="Receita Mensal"
                  value="R$ 847.500"
                  change={12.5}
                  changePeriod="vs. mês anterior"
                  target="R$ 1.000.000"
                  targetProgress={84.75}
                  icon={DollarSign}
                  variant="highlight"
                  sparkline={[30, 45, 35, 50, 49, 60, 70, 91, 85]}
                />
                <KPICard
                  label="Taxa de Conversão"
                  value="24.8%"
                  change={-2.3}
                  changePeriod="vs. semana anterior"
                  icon={Target}
                  variant="warning"
                />
                <KPICard
                  label="Usuários Ativos"
                  value="12.847"
                  change={8.1}
                  changePeriod="vs. mês anterior"
                  icon={Users}
                  variant="success"
                  sparkline={[100, 120, 115, 134, 168, 132, 200, 180, 220]}
                />
              </div>

              {/* Progress Rings */}
              <h3 className="text-xl font-semibold mb-4">Progress Rings</h3>
              <div className="flex flex-wrap gap-8 mb-8">
                <ProgressRing value={92} label="Meta Trimestral" size="lg" />
                <ProgressRing value={67} label="Satisfação" size="lg" />
                <ProgressRing value={45} label="Onboarding" size="lg" color="warning" />
                <ProgressRing value={28} label="Churn Risk" size="lg" color="danger" />
              </div>

              {/* Metric Comparison */}
              <h3 className="text-xl font-semibold mb-4">Comparação de Métricas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <MetricComparison
                  title="Turnover Rate"
                  beforeValue="18.5%"
                  beforeLabel="Q3 2025"
                  afterValue="12.3%"
                  afterLabel="Q4 2025"
                  changePercent={-33.5}
                  isPositiveChange={true}
                />
                <MetricComparison
                  title="Tempo Médio de Contratação"
                  beforeValue="45 dias"
                  beforeLabel="Antes"
                  afterValue="28 dias"
                  afterLabel="Com MindFit"
                  changePercent={-37.8}
                  isPositiveChange={true}
                />
              </div>

              {/* Activity Feed */}
              <h3 className="text-xl font-semibold mb-4">Feed de Atividades</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <ActivityFeed
                  title="Atividade Recente"
                  maxItems={4}
                  items={[
                    {
                      id: "1",
                      type: "success",
                      title: "Avaliação concluída",
                      description: "João Silva completou a avaliação MindScan",
                      timestamp: new Date(Date.now() - 1000 * 60 * 5),
                      user: { name: "Sistema" },
                    },
                    {
                      id: "2",
                      type: "info",
                      title: "Novo colaborador adicionado",
                      description: "Maria Santos foi adicionada ao time de Vendas",
                      timestamp: new Date(Date.now() - 1000 * 60 * 30),
                      user: { name: "Ana Costa" },
                    },
                    {
                      id: "3",
                      type: "warning",
                      title: "Atenção: fit cultural baixo",
                      description: "3 candidatos com score abaixo do threshold",
                      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
                    },
                    {
                      id: "4",
                      type: "default",
                      title: "Relatório gerado",
                      description: "Dashboard mensal exportado",
                      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
                      metadata: { formato: "PDF", páginas: "12" },
                    },
                  ]}
                />

                {/* Dashboard Card */}
                <DashboardCard
                  title="Análise de Performance"
                  subtitle="Últimos 30 dias"
                  onRefresh={() => {}}
                  onExport={() => {}}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Avaliações realizadas</span>
                      <span className="font-medium">1.247</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Precisão preditiva</span>
                      <span className="font-medium text-green-600">94.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Tempo médio</span>
                      <span className="font-medium">12min</span>
                    </div>
                  </div>
                </DashboardCard>
              </div>

              {/* Data Table */}
              <h3 className="text-xl font-semibold mb-4">Tabela de Dados</h3>
              <DataTable
                title="Top Performers"
                searchable
                searchPlaceholder="Buscar colaborador..."
                searchFields={["name", "department"]}
                data={[
                  { name: "Ana Silva", department: "Vendas", score: 94, status: "Ativo" },
                  { name: "Carlos Santos", department: "Marketing", score: 91, status: "Ativo" },
                  { name: "Maria Costa", department: "Produto", score: 89, status: "Ativo" },
                  { name: "João Oliveira", department: "Engenharia", score: 87, status: "Em avaliação" },
                  { name: "Fernanda Lima", department: "RH", score: 85, status: "Ativo" },
                ]}
                columns={[
                  { key: "name", header: "Nome", sortable: true },
                  { key: "department", header: "Departamento", sortable: true },
                  {
                    key: "score",
                    header: "Score",
                    sortable: true,
                    align: "center",
                    render: (value) => (
                      <span className={(value as number) >= 90 ? "text-green-600 font-medium" : ""}>
                        {value as number}
                      </span>
                    ),
                  },
                  {
                    key: "status",
                    header: "Status",
                    render: (value) => (
                      <Badge variant={(value as string) === "Ativo" ? "default" : "secondary"}>
                        {value as string}
                      </Badge>
                    ),
                  },
                ]}
              />
            </section>
          </TabsContent>

          {/* Assessments Tab */}
          <TabsContent value="assessments" className="space-y-12">
            <section>
              <h2 className="text-2xl font-semibold mb-6">Componentes de Avaliação Psicométrica</h2>
              <p className="text-muted-foreground mb-8">
                Visualizações e componentes para os instrumentos SynMind: Big5, TEI, CVF, Esquemas e SYM4.
              </p>

              {/* Score Gauges */}
              <h3 className="text-xl font-semibold mb-4">Score Gauges (SM_BIG5_20)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <ScoreGauge
                  label="Extroversão"
                  value={72}
                  description="Energia social e iniciativa"
                />
                <ScoreGauge
                  label="Amabilidade"
                  value={85}
                  description="Cooperação e empatia"
                />
                <ScoreGauge
                  label="Conscienciosidade"
                  value={58}
                  description="Responsabilidade e organização"
                />
                <ScoreGauge
                  label="Neuroticismo"
                  value={32}
                  description="Estabilidade emocional (invertido)"
                />
                <ScoreGauge
                  label="Abertura"
                  value={91}
                  description="Curiosidade intelectual"
                />
              </div>

              {/* Radar Charts */}
              <h3 className="text-xl font-semibold mb-4">Radar Charts (Perfis Multidimensionais)</h3>
              <div className="flex flex-wrap gap-8 mb-8 justify-center">
                <RadarChart
                  title="Perfil Big Five"
                  data={[
                    { label: "Extroversão", shortLabel: "E", value: 72 },
                    { label: "Amabilidade", shortLabel: "A", value: 85 },
                    { label: "Conscienciosidade", shortLabel: "C", value: 58 },
                    { label: "Neuroticismo", shortLabel: "N", value: 32 },
                    { label: "Abertura", shortLabel: "O", value: 91 },
                  ]}
                />
                <RadarChart
                  title="Inteligência Emocional (TEI)"
                  data={[
                    { label: "Bem-estar", shortLabel: "BE", value: 78 },
                    { label: "Autocontrole", shortLabel: "AC", value: 65 },
                    { label: "Emotividade", shortLabel: "EM", value: 82 },
                    { label: "Sociabilidade", shortLabel: "SO", value: 70 },
                  ]}
                  fillColor="rgba(217, 141, 56, 0.2)"
                  strokeColor="#D98D38"
                  compareData={[
                    { label: "Bem-estar", shortLabel: "BE", value: 85 },
                    { label: "Autocontrole", shortLabel: "AC", value: 80 },
                    { label: "Emotividade", shortLabel: "EM", value: 75 },
                    { label: "Sociabilidade", shortLabel: "SO", value: 85 },
                  ]}
                />
              </div>

              {/* Quadrant Chart (CVF) */}
              <h3 className="text-xl font-semibold mb-4">Quadrante Cultural (SM_CVF_24)</h3>
              <div className="flex flex-wrap gap-8 mb-8 justify-center">
                <QuadrantChart
                  title="Cultura Organizacional"
                  currentData={{
                    clan: 35,
                    adhocracy: 20,
                    market: 30,
                    hierarchy: 15,
                  }}
                  preferredData={{
                    clan: 40,
                    adhocracy: 30,
                    market: 20,
                    hierarchy: 10,
                  }}
                />
              </div>

              {/* Fit Indicator */}
              <h3 className="text-xl font-semibold mb-4">Indicador de Fit</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <FitIndicator
                  title="Cultural Fit Score"
                  fitScore={78}
                  dimensions={[
                    { name: "Colaboração", actual: 72, ideal: 80 },
                    { name: "Inovação", actual: 85, ideal: 75 },
                    { name: "Resultados", actual: 68, ideal: 70 },
                    { name: "Estabilidade", actual: 55, ideal: 60 },
                  ]}
                />
                <FitIndicator
                  title="Match Score - Vaga"
                  fitScore={45}
                  dimensions={[
                    { name: "Competências Técnicas", actual: 60, ideal: 85 },
                    { name: "Soft Skills", actual: 75, ideal: 80 },
                    { name: "Experiência", actual: 40, ideal: 70 },
                  ]}
                  size="md"
                />
              </div>

              {/* Dimension Comparison */}
              <h3 className="text-xl font-semibold mb-4">Comparação de Dimensões</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <DimensionComparison
                  title="Cultura: Percebida vs Preferida"
                  labelA="Empresa"
                  labelB="Pessoa"
                  items={[
                    { name: "Ambiente", valueA: 65, valueB: 80 },
                    { name: "Liderança", valueA: 55, valueB: 70 },
                    { name: "Gestão", valueA: 70, valueB: 65 },
                    { name: "Coesão", valueA: 45, valueB: 75 },
                    { name: "Estratégia", valueA: 60, valueB: 55 },
                    { name: "Sucesso", valueA: 80, valueB: 85 },
                  ]}
                />
                <DimensionComparison
                  title="Tipos Culturais"
                  labelA="Atual"
                  labelB="Ideal"
                  layout="table"
                  items={[
                    { name: "Clã", valueA: 35, valueB: 40, description: "Colaboração" },
                    { name: "Adhocracia", valueA: 20, valueB: 30, description: "Inovação" },
                    { name: "Mercado", valueA: 30, valueB: 20, description: "Resultados" },
                    { name: "Hierarquia", valueA: 15, valueB: 10, description: "Controle" },
                  ]}
                />
              </div>

              {/* Profile Card */}
              <h3 className="text-xl font-semibold mb-4">Profile Cards</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <ProfileCard
                  name="Ana Silva"
                  profileType="SM_BIG5_20 - Cinco Grandes Fatores"
                  dimensions={[
                    { name: "Extroversão", value: 72, icon: Users },
                    { name: "Amabilidade", value: 85, icon: Heart },
                    { name: "Conscienciosidade", value: 58, icon: Target },
                    { name: "Neuroticismo", value: 32, icon: Shield },
                    { name: "Abertura", value: 91, icon: Brain },
                  ]}
                  globalScore={68}
                  assessmentDate="28/01/2026"
                  instrumentVersion="SM_BIG5_20_v1"
                  qualityStatus="passed"
                />
                <ProfileCard
                  name="João Mendes"
                  profileType="SM_TEI_20 - Inteligência Emocional"
                  dimensions={[
                    { name: "Bem-estar", value: 78 },
                    { name: "Autocontrole", value: 65 },
                    { name: "Emotividade", value: 82 },
                    { name: "Sociabilidade", value: 70 },
                  ]}
                  globalScore={74}
                  assessmentDate="29/01/2026"
                  instrumentVersion="SM_TEI_20_v1"
                  qualityStatus="passed"
                  layout="horizontal"
                />
              </div>

              {/* Assessment Progress */}
              <h3 className="text-xl font-semibold mb-4">Progresso de Avaliações</h3>
              <div className="max-w-2xl mb-8">
                <AssessmentProgress
                  title="Bateria de Avaliação SynMind"
                  assessments={[
                    {
                      id: "big5",
                      name: "SM_BIG5_20",
                      description: "Cinco Grandes Fatores de Personalidade",
                      status: "completed",
                      totalQuestions: 20,
                      answeredQuestions: 20,
                      estimatedTime: 5,
                      timeSpent: 4,
                    },
                    {
                      id: "tei",
                      name: "SM_TEI_20",
                      description: "Inteligência Emocional de Traço",
                      status: "completed",
                      totalQuestions: 20,
                      answeredQuestions: 20,
                      estimatedTime: 5,
                      timeSpent: 6,
                    },
                    {
                      id: "esq",
                      name: "SM_ESQ_36",
                      description: "Inventário de Esquemas Desadaptativos",
                      status: "in_progress",
                      totalQuestions: 36,
                      answeredQuestions: 18,
                      estimatedTime: 10,
                    },
                    {
                      id: "cvf",
                      name: "SM_CVF_24",
                      description: "Cultura Organizacional (CVF)",
                      status: "pending",
                      totalQuestions: 48,
                      estimatedTime: 12,
                    },
                    {
                      id: "sym4",
                      name: "SM_SYM4_24",
                      description: "Perfil Comportamental SynMind",
                      status: "pending",
                      totalQuestions: 24,
                      estimatedTime: 8,
                    },
                  ]}
                />
              </div>
            </section>
          </TabsContent>

          {/* B2B Tab */}
          <TabsContent value="b2b" className="space-y-12">
            <div className="variant-b2b">
              <section>
                <h2 className="text-2xl font-semibold mb-6">Contexto B2B (SynMind)</h2>
                <p className="text-muted-foreground mb-8">
                  Componentes otimizados para comunicação corporativa: consultivo, pragmático, baseado em dados.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <StatCard
                    variant="b2b"
                    label="Profissionais Avaliados"
                    value="12.5K+"
                    change={23}
                    changeLabel="vs. mês anterior"
                    icon={Users}
                  />
                  <StatCard
                    variant="b2b"
                    label="Taxa de Precisão"
                    value="94.7%"
                    change={2.1}
                    changeLabel="vs. benchmark"
                    icon={Target}
                  />
                  <StatCard
                    variant="b2b"
                    label="Empresas Ativas"
                    value="287"
                    change={15}
                    changeLabel="este trimestre"
                    icon={BarChart3}
                  />
                  <StatCard
                    variant="b2b"
                    label="NPS Score"
                    value="72"
                    change={8}
                    changeLabel="vs. ano anterior"
                    icon={TrendingUp}
                  />
                </div>

                {/* Products B2B */}
                <h3 className="text-xl font-semibold mb-4">Produtos B2B</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProductCard
                    variant="b2b"
                    name="StrategiMind"
                    description="Gestão estratégica de rede com análise de perfis e cultura organizacional."
                    icon={Brain}
                    features={[
                      "Mapeamento de competências",
                      "Análise de fit cultural",
                      "Dashboard executivo",
                    ]}
                    ctaLabel="Conhecer solução"
                  />
                  <ProductCard
                    variant="b2b"
                    name="MindFit"
                    description="Identificação precisa de talentos com base em psicometria validada."
                    icon={Target}
                    features={[
                      "Matching de candidatos",
                      "Predição de performance",
                      "Redução de turnover",
                    ]}
                    ctaLabel="Ver demonstração"
                  />
                </div>
              </section>
            </div>
          </TabsContent>

          {/* B2C Tab */}
          <TabsContent value="b2c" className="space-y-12">
            <div className="variant-b2c">
              <section>
                <h2 className="text-2xl font-semibold mb-6">Contexto B2C (I_DEAL)</h2>
                <p className="text-muted-foreground mb-8">
                  Componentes otimizados para comunicação pessoal: empático, acolhedor, orientado a ação.
                </p>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <FeatureCard
                    variant="b2c"
                    icon={Heart}
                    title="Autoconhecimento"
                    description="Descubra seus padrões de comportamento e motivações profundas."
                  />
                  <FeatureCard
                    variant="b2c"
                    icon={MessageSquare}
                    title="Clareza"
                    description="Receba insights personalizados sobre seus próximos passos."
                  />
                  <FeatureCard
                    variant="b2c"
                    icon={Shield}
                    title="Evolução"
                    description="Acompanhamento contínuo do seu desenvolvimento pessoal."
                  />
                </div>

                {/* Products B2C */}
                <h3 className="text-xl font-semibold mb-4">Produtos I_DEAL</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <ProductCard
                    variant="b2c"
                    name="Leitura Essencial"
                    description="Seu raio-X de personalidade baseado em ciência. Descubra quem você realmente é."
                    icon={Brain}
                    features={[
                      "Análise MindScan completa",
                      "Relatório personalizado",
                      "Recomendações de ação",
                    ]}
                    price="R$ 497"
                    badge="Mais vendido"
                  />
                  <ProductCard
                    variant="featured"
                    name="Trilha de Evolução"
                    description="Programa completo de desenvolvimento com acompanhamento humanizado."
                    icon={Sparkles}
                    features={[
                      "12 sessões de mentoria",
                      "Acesso ao app exclusivo",
                      "Comunidade de apoio",
                    ]}
                    price="R$ 1.497"
                    priceNote="/3 meses"
                    badge="Premium"
                  />
                </div>

                {/* Testimonials */}
                <h3 className="text-xl font-semibold mb-4">Depoimentos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TestimonialCard
                    variant="b2c"
                    quote="O I_DEAL me ajudou a entender padrões que eu nunca tinha percebido. Finalmente tenho clareza sobre minha carreira."
                    author="Marina Costa"
                    role="Product Manager"
                    company="Tech Startup"
                    rating={5}
                    showMindScanBadge
                  />
                  <TestimonialCard
                    variant="featured"
                    quote="Não é mais um teste de personalidade genérico. É ciência de verdade aplicada ao meu desenvolvimento."
                    author="Rafael Santos"
                    role="Empreendedor"
                    rating={5}
                    showMindScanBadge
                  />
                </div>
              </section>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center">
          <BrandDotsGroup size="sm" className="mb-4" />
          <p className="text-sm text-muted-foreground">
            SynMind Design System · Construído com Design OS
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Showcase
