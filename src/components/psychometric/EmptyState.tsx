import { BarChart3, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  /** Ícone a exibir (default: BarChart3) */
  icon?: LucideIcon;
  /** Mensagem a exibir (default: "Dados indisponíveis") */
  message?: string;
  /** Classes adicionais */
  className?: string;
}

/**
 * Componente de estado vazio para quando dados não estão disponíveis
 * Usado por gráficos e cards quando recebem valores null/undefined
 */
export function EmptyState({
  icon: Icon = BarChart3,
  message = 'Dados indisponíveis',
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 p-4',
        'text-muted-foreground',
        className
      )}
      role="status"
      aria-label={message}
    >
      <Icon className="h-8 w-8 opacity-40" aria-hidden="true" />
      <span className="text-sm">{message}</span>
    </div>
  );
}
