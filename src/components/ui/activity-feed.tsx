import * as React from "react"
import type { LucideIcon } from "lucide-react"
import {
  User,
  CheckCircle2,
  AlertCircle,
  Info,
  FileText,
  Calendar,
} from "lucide-react"

import { cn } from "@/lib/utils"

type ActivityType = "success" | "warning" | "info" | "error" | "default"

interface ActivityItem {
  id: string
  type?: ActivityType
  icon?: LucideIcon
  title: string
  description?: string
  timestamp: string | Date
  user?: {
    name: string
    avatarUrl?: string
  }
  metadata?: Record<string, string>
}

interface ActivityFeedProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Lista de atividades */
  items: ActivityItem[]
  /** Título do feed */
  title?: string
  /** Mostrar linha de conexão entre itens */
  showTimeline?: boolean
  /** Número máximo de itens visíveis */
  maxItems?: number
  /** Callback quando "ver mais" é clicado */
  onViewMore?: () => void
}

const typeConfig: Record<ActivityType, { icon: LucideIcon; color: string; bgColor: string }> = {
  success: {
    icon: CheckCircle2,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/30",
  },
  warning: {
    icon: AlertCircle,
    color: "text-[#D98D38]",
    bgColor: "bg-[#FDF6EE] dark:bg-[#321E0C]/50",
  },
  info: {
    icon: Info,
    color: "text-[#5B7B93]",
    bgColor: "bg-[#F0F4F7] dark:bg-[#28363D]/50",
  },
  error: {
    icon: AlertCircle,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-100 dark:bg-red-900/30",
  },
  default: {
    icon: FileText,
    color: "text-muted-foreground",
    bgColor: "bg-muted",
  },
}

/**
 * ActivityFeed Component
 *
 * Feed de atividades/eventos recentes para dashboards B2B.
 * Mostra histórico de ações, notificações, logs de sistema.
 */
export function ActivityFeed({
  className,
  items,
  title = "Atividade Recente",
  showTimeline = true,
  maxItems,
  onViewMore,
  ...props
}: ActivityFeedProps) {
  const displayItems = maxItems ? items.slice(0, maxItems) : items
  const hasMore = maxItems ? items.length > maxItems : false

  const formatTimestamp = (timestamp: string | Date) => {
    const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Agora mesmo"
    if (diffMins < 60) return `${diffMins}min atrás`
    if (diffHours < 24) return `${diffHours}h atrás`
    if (diffDays < 7) return `${diffDays}d atrás`

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    })
  }

  return (
    <div
      data-slot="activity-feed"
      className={cn("rounded-xl border bg-card p-6", className)}
      {...props}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-foreground">{title}</h3>
        {hasMore && onViewMore && (
          <button
            onClick={onViewMore}
            className="text-sm text-[#5B7B93] hover:underline"
          >
            Ver todos
          </button>
        )}
      </div>

      {/* Feed */}
      <div className="space-y-0">
        {displayItems.map((item, index) => {
          const config = typeConfig[item.type || "default"]
          const IconComponent = item.icon || config.icon
          const isLast = index === displayItems.length - 1

          return (
            <div key={item.id} className="flex gap-3">
              {/* Timeline */}
              <div className="flex flex-col items-center">
                <div className={cn("p-2 rounded-full", config.bgColor)}>
                  <IconComponent className={cn("size-4", config.color)} />
                </div>
                {showTimeline && !isLast && (
                  <div className="w-px flex-1 bg-border my-2" />
                )}
              </div>

              {/* Content */}
              <div className={cn("flex-1 pb-6", isLast && "pb-0")}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {item.title}
                    </p>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatTimestamp(item.timestamp)}
                  </span>
                </div>

                {/* User */}
                {item.user && (
                  <div className="flex items-center gap-2 mt-2">
                    {item.user.avatarUrl ? (
                      <img
                        src={item.user.avatarUrl}
                        alt={item.user.name}
                        className="size-5 rounded-full"
                      />
                    ) : (
                      <div className="size-5 rounded-full bg-[#5B7B93]/10 flex items-center justify-center">
                        <User className="size-3 text-[#5B7B93]" />
                      </div>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {item.user.name}
                    </span>
                  </div>
                )}

                {/* Metadata */}
                {item.metadata && Object.keys(item.metadata).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Object.entries(item.metadata).map(([key, value]) => (
                      <span
                        key={key}
                        className="inline-flex items-center px-2 py-0.5 text-xs rounded-md bg-muted text-muted-foreground"
                      >
                        {key}: {value}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Calendar className="size-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Nenhuma atividade recente</p>
        </div>
      )}
    </div>
  )
}

export type { ActivityItem, ActivityType }
export default ActivityFeed
