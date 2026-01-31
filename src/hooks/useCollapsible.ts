import { useState, useCallback } from "react";

/**
 * Options for the useCollapsible hook.
 */
export interface UseCollapsibleOptions {
  /** Initial open state. Defaults to false. */
  defaultOpen?: boolean;
  /** Callback fired when the open state changes. */
  onOpenChange?: (open: boolean) => void;
}

/**
 * Return value of the useCollapsible hook.
 */
export interface UseCollapsibleReturn {
  /** Whether the collapsible is currently open. */
  isOpen: boolean;
  /** Toggle the open state. */
  toggle: () => void;
  /** Open the collapsible. */
  open: () => void;
  /** Close the collapsible. */
  close: () => void;
  /** Set the open state directly. */
  setOpen: (open: boolean) => void;
}

/**
 * Hook for managing collapsible/expandable UI state.
 *
 * Provides a consistent pattern for managing open/closed state
 * with optional callback for external state synchronization.
 *
 * @example
 * ```tsx
 * const details = useCollapsible({ defaultOpen: false });
 *
 * <button onClick={details.toggle}>
 *   {details.isOpen ? 'Fechar' : 'Abrir'}
 * </button>
 * {details.isOpen && <div>Content</div>}
 * ```
 */
export function useCollapsible(
  options: UseCollapsibleOptions = {}
): UseCollapsibleReturn {
  const { defaultOpen = false, onOpenChange } = options;
  const [isOpen, setIsOpenState] = useState(defaultOpen);

  const setOpen = useCallback(
    (open: boolean) => {
      setIsOpenState(open);
      onOpenChange?.(open);
    },
    [onOpenChange]
  );

  const toggle = useCallback(() => {
    setOpen(!isOpen);
  }, [isOpen, setOpen]);

  const open = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const close = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  return {
    isOpen,
    toggle,
    open,
    close,
    setOpen,
  };
}
