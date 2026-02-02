import { useState, useEffect } from 'react';

/**
 * Detecta se o dispositivo é touch-primary
 * Usa media query (hover: none) and (pointer: coarse)
 *
 * @returns boolean - true se o dispositivo é primariamente touch
 */
export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Verifica se estamos no browser
    if (typeof window === 'undefined') return;

    const mq = window.matchMedia('(hover: none) and (pointer: coarse)');
    setIsTouch(mq.matches);

    const handler = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mq.addEventListener('change', handler);

    return () => mq.removeEventListener('change', handler);
  }, []);

  return isTouch;
}
