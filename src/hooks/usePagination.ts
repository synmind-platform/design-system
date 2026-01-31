import { useState, useMemo, useCallback } from "react";

/**
 * Options for the usePagination hook.
 */
export interface UsePaginationOptions {
  /** Initial page number (1-indexed). Defaults to 1. */
  initialPage?: number;
  /** Initial number of items per page. Defaults to 10. */
  initialPageSize?: number;
}

/**
 * Return value of the usePagination hook.
 */
export interface UsePaginationReturn<T> {
  // State
  /** Current page number (1-indexed). */
  currentPage: number;
  /** Number of items per page. */
  pageSize: number;
  /** Total number of pages. */
  totalPages: number;
  /** Total number of items in the dataset. */
  totalItems: number;

  // Data
  /** Slice of data for the current page. */
  paginatedData: T[];

  // Navigation
  /** Go to a specific page (1-indexed). */
  goToPage: (page: number) => void;
  /** Go to the next page. */
  nextPage: () => void;
  /** Go to the previous page. */
  prevPage: () => void;
  /** Change the page size. Resets to page 1. */
  setPageSize: (size: number) => void;

  // Helpers
  /** Whether there is a next page available. */
  hasNextPage: boolean;
  /** Whether there is a previous page available. */
  hasPrevPage: boolean;
  /** Index of the first item on the current page (0-indexed). */
  startIndex: number;
  /** Index of the last item on the current page (0-indexed, exclusive). */
  endIndex: number;
}

/**
 * Hook for paginating arrays of data.
 *
 * Provides a complete pagination solution with navigation,
 * page sizing, and helper values for building pagination UI.
 *
 * @example
 * ```tsx
 * const items = [1, 2, 3, ..., 100];
 * const pagination = usePagination(items, { initialPageSize: 10 });
 *
 * <Table data={pagination.paginatedData} />
 * <PaginationControls
 *   page={pagination.currentPage}
 *   totalPages={pagination.totalPages}
 *   onNext={pagination.nextPage}
 *   onPrev={pagination.prevPage}
 *   hasNext={pagination.hasNextPage}
 *   hasPrev={pagination.hasPrevPage}
 * />
 * ```
 */
export function usePagination<T>(
  data: T[],
  options: UsePaginationOptions = {}
): UsePaginationReturn<T> {
  const { initialPage = 1, initialPageSize = 10 } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSizeState] = useState(initialPageSize);

  const totalItems = data.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Ensure current page is within valid bounds
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  // Calculate indices
  const startIndex = (validCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  // Get paginated data
  const paginatedData = useMemo(() => {
    return data.slice(startIndex, endIndex);
  }, [data, startIndex, endIndex]);

  // Navigation helpers
  const hasNextPage = validCurrentPage < totalPages;
  const hasPrevPage = validCurrentPage > 1;

  // Navigation functions
  const goToPage = useCallback(
    (page: number) => {
      const boundedPage = Math.min(Math.max(1, page), totalPages);
      setCurrentPage(boundedPage);
    },
    [totalPages]
  );

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [hasNextPage]);

  const prevPage = useCallback(() => {
    if (hasPrevPage) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [hasPrevPage]);

  const setPageSize = useCallback((size: number) => {
    const validSize = Math.max(1, size);
    setPageSizeState(validSize);
    setCurrentPage(1); // Reset to first page when page size changes
  }, []);

  return {
    // State
    currentPage: validCurrentPage,
    pageSize,
    totalPages,
    totalItems,

    // Data
    paginatedData,

    // Navigation
    goToPage,
    nextPage,
    prevPage,
    setPageSize,

    // Helpers
    hasNextPage,
    hasPrevPage,
    startIndex,
    endIndex,
  };
}
