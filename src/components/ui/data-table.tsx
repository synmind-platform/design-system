import * as React from "react"
import { ChevronUp, ChevronDown, ChevronsUpDown, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "./input"

interface Column<T> {
  /** Chave do campo no objeto de dados */
  key: keyof T | string
  /** Label do cabeçalho */
  header: string
  /** Largura da coluna */
  width?: string
  /** Se a coluna é ordenável */
  sortable?: boolean
  /** Alinhamento do conteúdo */
  align?: "left" | "center" | "right"
  /** Função de renderização customizada */
  render?: (value: any, row: T, index: number) => React.ReactNode
}

interface DataTableProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  /** Dados da tabela */
  data: T[]
  /** Configuração das colunas */
  columns: Column<T>[]
  /** Mostrar campo de busca */
  searchable?: boolean
  /** Placeholder do campo de busca */
  searchPlaceholder?: string
  /** Campos para buscar */
  searchFields?: (keyof T)[]
  /** Callback de busca */
  onSearch?: (query: string) => void
  /** Coluna ordenada atualmente */
  sortColumn?: string
  /** Direção da ordenação */
  sortDirection?: "asc" | "desc"
  /** Callback de ordenação */
  onSort?: (column: string, direction: "asc" | "desc") => void
  /** Mostrar loading */
  loading?: boolean
  /** Mensagem quando não há dados */
  emptyMessage?: string
  /** Título da tabela */
  title?: string
  /** Ações do header */
  headerActions?: React.ReactNode
  /** Callback quando uma linha é clicada */
  onRowClick?: (row: T, index: number) => void
  /** Linhas selecionadas */
  selectedRows?: number[]
  /** Sticky header */
  stickyHeader?: boolean
}

/**
 * DataTable Component
 *
 * Tabela de dados avançada para dashboards B2B.
 * Suporta ordenação, busca, seleção e customização de colunas.
 */
export function DataTable<T extends Record<string, any>>({
  className,
  data,
  columns,
  searchable = false,
  searchPlaceholder = "Buscar...",
  searchFields,
  onSearch,
  sortColumn,
  sortDirection,
  onSort,
  loading = false,
  emptyMessage = "Nenhum dado encontrado",
  title,
  headerActions,
  onRowClick,
  selectedRows = [],
  stickyHeader = false,
  ...props
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = React.useState("")

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    onSearch?.(value)
  }

  const handleSort = (column: Column<T>) => {
    if (!column.sortable || !onSort) return

    const key = String(column.key)
    const newDirection =
      sortColumn === key && sortDirection === "asc" ? "desc" : "asc"
    onSort(key, newDirection)
  }

  const getValue = (row: T, key: keyof T | string) => {
    const keys = String(key).split(".")
    let value: any = row
    for (const k of keys) {
      value = value?.[k]
    }
    return value
  }

  const filteredData = React.useMemo(() => {
    if (!searchQuery || !searchFields) return data

    const query = searchQuery.toLowerCase()
    return data.filter((row) =>
      searchFields.some((field) => {
        const value = getValue(row, field)
        return String(value).toLowerCase().includes(query)
      })
    )
  }, [data, searchQuery, searchFields])

  return (
    <div
      data-slot="data-table"
      className={cn("rounded-xl border bg-card overflow-hidden", className)}
      {...props}
    >
      {/* Header */}
      {(title || searchable || headerActions) && (
        <div className="flex items-center justify-between gap-4 p-4 border-b">
          {title && (
            <h3 className="font-semibold text-foreground">{title}</h3>
          )}

          <div className="flex items-center gap-3 ml-auto">
            {searchable && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
            )}
            {headerActions}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={cn(stickyHeader && "sticky top-0 z-10")}>
            <tr className="border-b bg-muted/50">
              {columns.map((column) => {
                const columnKey = String(column.key)
                const isSorted = sortColumn === columnKey
                const ariaSortValue = isSorted
                  ? sortDirection === "asc"
                    ? "ascending"
                    : "descending"
                  : undefined

                return (
                  <th
                    key={columnKey}
                    scope="col"
                    aria-sort={column.sortable ? (ariaSortValue ?? "none") : undefined}
                    className={cn(
                      "px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider",
                      column.align === "center" && "text-center",
                      column.align === "right" && "text-right",
                      column.sortable && "cursor-pointer select-none hover:bg-muted/80"
                    )}
                    style={{ width: column.width }}
                    onClick={() => handleSort(column)}
                  >
                    <div className={cn(
                      "flex items-center gap-1",
                      column.align === "center" && "justify-center",
                      column.align === "right" && "justify-end"
                    )}>
                      {column.sortable ? (
                        <button
                          type="button"
                          className="flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                          aria-label={`Ordenar por ${column.header}${isSorted ? `, atualmente ${sortDirection === "asc" ? "crescente" : "decrescente"}` : ""}`}
                          tabIndex={0}
                        >
                          {column.header}
                          <span className="text-muted-foreground/50" aria-hidden="true">
                            {isSorted ? (
                              sortDirection === "asc" ? (
                                <ChevronUp className="size-4" />
                              ) : (
                                <ChevronDown className="size-4" />
                              )
                            ) : (
                              <ChevronsUpDown className="size-3" />
                            )}
                          </span>
                        </button>
                      ) : (
                        column.header
                      )}
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b">
                  {columns.map((column) => (
                    <td key={String(column.key)} className="px-4 py-3">
                      <div className="h-4 bg-muted animate-pulse rounded" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filteredData.length === 0 ? (
              // Empty state
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              // Data rows
              filteredData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={cn(
                    "border-b transition-colors",
                    onRowClick && "cursor-pointer hover:bg-muted/50",
                    selectedRows.includes(rowIndex) && "bg-[#5B7B93]/5"
                  )}
                  onClick={() => onRowClick?.(row, rowIndex)}
                >
                  {columns.map((column) => {
                    const value = getValue(row, column.key)
                    return (
                      <td
                        key={String(column.key)}
                        className={cn(
                          "px-4 py-3 text-sm",
                          column.align === "center" && "text-center",
                          column.align === "right" && "text-right"
                        )}
                      >
                        {column.render
                          ? column.render(value, row, rowIndex)
                          : value ?? "-"}
                      </td>
                    )
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with count */}
      {!loading && filteredData.length > 0 && (
        <div className="px-4 py-3 border-t bg-muted/30 text-xs text-muted-foreground">
          {filteredData.length} {filteredData.length === 1 ? "registro" : "registros"}
          {searchQuery && ` (filtrado de ${data.length})`}
        </div>
      )}
    </div>
  )
}

export type { Column, DataTableProps }
export default DataTable
