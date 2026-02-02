/**
 * CHART_SIZE_VALUES - Valores de tamanho padrão para gráficos
 */
export const CHART_SIZE_VALUES = {
  sm: 200,  // Mobile, cards compactos
  md: 280,  // Default, tablet
  lg: 360,  // Desktop, full-width
} as const;

export type ChartSizePreset = keyof typeof CHART_SIZE_VALUES;

/**
 * Tamanho mínimo para gráficos em qualquer viewport
 */
export const CHART_MIN_SIZE = 200;

/**
 * Converte ChartSize para número de pixels
 */
export function resolveChartSize(
  size: ChartSizePreset | number,
  containerWidth?: number
): number {
  // Se for número, retornar diretamente (respeitando mínimo)
  if (typeof size === 'number') {
    return Math.max(size, CHART_MIN_SIZE);
  }

  // Se for preset, usar o valor mapeado
  if (size in CHART_SIZE_VALUES) {
    return CHART_SIZE_VALUES[size];
  }

  // Fallback para containerWidth ou md
  return containerWidth ?? CHART_SIZE_VALUES.md;
}
