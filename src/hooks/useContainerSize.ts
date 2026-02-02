import { useState, useEffect, RefObject } from 'react';

interface ContainerSize {
  width: number;
  height: number;
}

/**
 * Observa o tamanho do container via ResizeObserver
 *
 * @param ref - Referência ao elemento HTML
 * @returns { width, height } - Dimensões atuais do container
 */
export function useContainerSize(
  ref: RefObject<HTMLElement | null>
): ContainerSize {
  const [size, setSize] = useState<ContainerSize>({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    // Set initial size
    const { width, height } = element.getBoundingClientRect();
    setSize({ width, height });

    // Observe changes
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref]);

  return size;
}
