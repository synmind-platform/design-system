import * as React from "react"
import { MoreHorizontal, Maximize2, RefreshCw } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu"

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Título do card */
  title: string
  /** Subtítulo/descrição */
  subtitle?: string
  /** Ações personalizadas no header */
  actions?: React.ReactNode
  /** Mostrar menu de opções padrão */
  showOptionsMenu?: boolean
  /** Callback para refresh */
  onRefresh?: () => void
  /** Callback para expandir */
  onExpand?: () => void
  /** Callback para exportar */
  onExport?: () => void
  /** Estado de loading */
  loading?: boolean
  /** Padding do conteúdo */
  contentPadding?: "none" | "sm" | "default" | "lg"
  /** Altura mínima */
  minHeight?: string
  /** Se o card é colapsável */
  collapsible?: boolean
  /** Estado inicial colapsado */
  defaultCollapsed?: boolean
}

/**
 * DashboardCard Component
 *
 * Container wrapper para widgets de dashboard B2B.
 * Fornece estrutura consistente com header, ações e área de conteúdo.
 */
export function DashboardCard({
  className,
  children,
  title,
  subtitle,
  actions,
  showOptionsMenu = true,
  onRefresh,
  onExpand,
  onExport,
  loading = false,
  contentPadding = "default",
  minHeight,
  collapsible = false,
  defaultCollapsed = false,
  ...props
}: DashboardCardProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)

  const paddingClasses = {
    none: "",
    sm: "p-3",
    default: "p-6",
    lg: "p-8",
  }

  return (
    <div
      data-slot="dashboard-card"
      className={cn(
        "rounded-xl border bg-card flex flex-col",
        className
      )}
      style={{ minHeight }}
      {...props}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {collapsible && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 hover:bg-muted rounded transition-colors"
              >
                <svg
                  className={cn(
                    "size-4 text-muted-foreground transition-transform",
                    isCollapsed && "-rotate-90"
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            )}
            <div>
              <h3 className="font-semibold text-foreground truncate">{title}</h3>
              {subtitle && (
                <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          {/* Loading indicator */}
          {loading && (
            <RefreshCw className="size-4 text-muted-foreground animate-spin" />
          )}

          {/* Custom actions */}
          {actions}

          {/* Options menu */}
          {showOptionsMenu && (onRefresh || onExpand || onExport) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onRefresh && (
                  <DropdownMenuItem onClick={onRefresh}>
                    <RefreshCw className="size-4 mr-2" />
                    Atualizar
                  </DropdownMenuItem>
                )}
                {onExpand && (
                  <DropdownMenuItem onClick={onExpand}>
                    <Maximize2 className="size-4 mr-2" />
                    Expandir
                  </DropdownMenuItem>
                )}
                {onExport && (
                  <DropdownMenuItem onClick={onExport}>
                    <svg
                      className="size-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Exportar
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className={cn("flex-1", paddingClasses[contentPadding])}>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <RefreshCw className="size-6 animate-spin" />
                <span className="text-sm">Carregando...</span>
              </div>
            </div>
          ) : (
            children
          )}
        </div>
      )}
    </div>
  )
}

export default DashboardCard
