import { RefObject } from 'react';
import { useContainerSize } from './useContainerSize';
import { CHART_SIZE_VALUES, CHART_MIN_SIZE, type ChartSizePreset } from '../lib/chart-sizes';
import type { ChartSize } from '../types/psychometric';

/**
 * Resolve ChartSize para número de pixels
 *
 * @param size - Preset ('sm' | 'md' | 'lg'), 'responsive', ou número
 * @param containerRef - Referência ao container (requerido se size='responsive')
 * @returns número de pixels para o tamanho do gráfico
 */
export function useChartSize(
  size: ChartSize,
  containerRef?: RefObject<HTMLElement | null>
): number {
  const containerSize = useContainerSize(containerRef ?? { current: null });

  // Se for número direto, retornar (respeitando mínimo)
  if (typeof size === 'number') {
    return Math.max(size, CHART_MIN_SIZE);
  }

  // Se for preset, usar o valor mapeado
  if (size !== 'responsive' && size in CHART_SIZE_VALUES) {
    return CHART_SIZE_VALUES[size as ChartSizePreset];
  }

  // Se for 'responsive', calcular baseado no container
  if (size === 'responsive') {
    const containerWidth = containerSize.width;

    if (containerWidth === 0) {
      // Ainda não temos o tamanho do container
      return CHART_SIZE_VALUES.md;
    }

    // Usar o menor valor entre width e height, limitando a lg
    const minDimension = Math.min(containerSize.width, containerSize.height || containerSize.width);
    return Math.max(Math.min(minDimension, CHART_SIZE_VALUES.lg), CHART_MIN_SIZE);
  }

  // Fallback para md
  return CHART_SIZE_VALUES.md;
}
