/**
 * SynMind Design System
 *
 * Component library for the SynMind platform.
 * Includes UI components, psychometric visualizations, and brand elements.
 */

// Import CSS for library build
import "./index.css"

// ============================================================================
// UI Components - Base (shadcn/ui)
// ============================================================================
export { Button, buttonVariants } from "./components/ui/button";
export { Badge, badgeVariants } from "./components/ui/badge";
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from "./components/ui/card";
export { Input } from "./components/ui/input";
export { Textarea } from "./components/ui/textarea";
export { Checkbox } from "./components/ui/checkbox";
export type { CheckboxProps } from "./components/ui/checkbox";
export { Label } from "./components/ui/label";
export { Separator } from "./components/ui/separator";
export { Skeleton } from "./components/ui/skeleton";
export { Avatar, AvatarImage, AvatarFallback } from "./components/ui/avatar";
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./components/ui/dialog";
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from "./components/ui/dropdown-menu";
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "./components/ui/table";
export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "./components/ui/sheet";
export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "./components/ui/collapsible";
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "./components/ui/select";
export {
  Toast,
  ToastProvider,
  ToastViewport,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  toastVariants,
} from "./components/ui/toast";
export type { ToastProps, ToastActionElement, ToastVariant } from "./components/ui/toast";
export { Toaster } from "./components/ui/toaster";

// ============================================================================
// UI Components - SynMind Custom
// ============================================================================
export { Alert, AlertTitle, AlertDescription, alertVariants } from "./components/ui/alert";
export { FeatureCard, featureCardVariants } from "./components/ui/feature-card";
export { StatCard, statCardVariants } from "./components/ui/stat-card";
export { TestimonialCard, testimonialCardVariants } from "./components/ui/testimonial-card";
export { ProductCard, productCardVariants } from "./components/ui/product-card";
export { Navbar } from "./components/ui/navbar";
export type { NavItem, NavbarProps } from "./components/ui/navbar";
export { Footer } from "./components/ui/footer";
export type { FooterProps, FooterSection, FooterLink } from "./components/ui/footer";

// ============================================================================
// UI Components - Dashboard
// ============================================================================
export { KPICard, kpiCardVariants } from "./components/ui/kpi-card";
export { MetricComparison } from "./components/ui/metric-comparison";
export { ProgressRing } from "./components/ui/progress-ring";
export { ActivityFeed } from "./components/ui/activity-feed";
export type { ActivityItem, ActivityType } from "./components/ui/activity-feed";
export { DataTable } from "./components/ui/data-table";
export type { Column, DataTableProps } from "./components/ui/data-table";
export { DashboardCard } from "./components/ui/dashboard-card";

// ============================================================================
// UI Components - Assessment (from ui folder)
// ============================================================================
export { ScoreGauge } from "./components/ui/score-gauge";
export { RadarChart as RadarChartUI } from "./components/ui/radar-chart";
export { QuadrantChart } from "./components/ui/quadrant-chart";
export { ProfileCard } from "./components/ui/profile-card";
export { AssessmentProgress as AssessmentProgressUI } from "./components/ui/assessment-progress";
export { FitIndicator } from "./components/ui/fit-indicator";
export { DimensionComparison } from "./components/ui/dimension-comparison";

// ============================================================================
// Psychometric Components
// ============================================================================
export { ScoreBar } from "./components/psychometric/ScoreBar";
export { RadarChart } from "./components/psychometric/RadarChart";
export { CVFQuadrantChart } from "./components/psychometric/CVFQuadrantChart";
export { ProfileChart } from "./components/psychometric/ProfileChart";
export { ScoreCard } from "./components/psychometric/ScoreCard";
export { QualityBadge } from "./components/psychometric/QualityBadge";
export { InstrumentResultCard } from "./components/psychometric/InstrumentResultCard";
export { AssessmentProgress } from "./components/psychometric/AssessmentProgress";
export { LikertScale } from "./components/psychometric/LikertScale";
export { TouchSlider } from "./components/psychometric/TouchSlider";
export type { TouchSliderProps } from "./components/psychometric/TouchSlider";
export { ForcedChoice } from "./components/psychometric/ForcedChoice";
export { AllocationSlider } from "./components/psychometric/AllocationSlider";
export { EmptyState } from "./components/psychometric/EmptyState";
export type { EmptyStateProps } from "./components/psychometric/EmptyState";

// ============================================================================
// Brand Components
// ============================================================================
export { SynMindLogo, SynMindIcon } from "./components/brand/SynMindLogo";
export { MindScanBadge, MindScanIcon } from "./components/brand/MindScanBadge";
export { BrandDot, BrandDotsGroup } from "./components/brand/BrandDot";

// ============================================================================
// Layout Components
// ============================================================================
export { AppLayout } from "./components/AppLayout";

// ============================================================================
// Hooks
// ============================================================================
export {
  useCollapsible,
  usePagination,
  useToast,
  toast,
  useIsTouchDevice,
  useContainerSize,
  useChartSize,
} from "./hooks";
export type {
  UseCollapsibleOptions,
  UseCollapsibleReturn,
  UsePaginationOptions,
  UsePaginationReturn,
} from "./hooks";

// ============================================================================
// Utilities
// ============================================================================
export { cn } from "./lib/utils";

// Chart constants
export { CHART_COLORS, CLASSIFICATION_COLORS, QUADRANT_LABELS } from "./lib/chart-colors";
export type { QuadrantKey } from "./lib/chart-colors";
export { CHART_SIZE_VALUES, CHART_MIN_SIZE, resolveChartSize } from "./lib/chart-sizes";
export type { ChartSizePreset } from "./lib/chart-sizes";

// ============================================================================
// Types (from psychometric)
// ============================================================================
export type {
  QualitySeverity,
  QualityFlag,
  QualityControl,
  ClassificationLabel,
  Classification,
  InstrumentResult,
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
  AssessmentStatus,
  Assessment,
  InstrumentMeta,
} from "./types/psychometric";

export { INSTRUMENTS, DIMENSION_LABELS } from "./types/psychometric";
export type { ChartSize } from "./types/psychometric";
