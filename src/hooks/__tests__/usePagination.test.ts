import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { usePagination } from "../usePagination";

describe("usePagination", () => {
  // Generate test data
  const createTestData = (count: number) =>
    Array.from({ length: count }, (_, i) => ({ id: i + 1 }));

  describe("initial state", () => {
    it("defaults to page 1 with pageSize 10", () => {
      const data = createTestData(25);
      const { result } = renderHook(() => usePagination(data));

      expect(result.current.currentPage).toBe(1);
      expect(result.current.pageSize).toBe(10);
    });

    it("respects initialPage option", () => {
      const data = createTestData(50);
      const { result } = renderHook(() =>
        usePagination(data, { initialPage: 3 })
      );

      expect(result.current.currentPage).toBe(3);
    });

    it("respects initialPageSize option", () => {
      const data = createTestData(50);
      const { result } = renderHook(() =>
        usePagination(data, { initialPageSize: 25 })
      );

      expect(result.current.pageSize).toBe(25);
    });

    it("calculates totalPages correctly", () => {
      const data = createTestData(25);
      const { result } = renderHook(() =>
        usePagination(data, { initialPageSize: 10 })
      );

      expect(result.current.totalPages).toBe(3); // 25 items / 10 per page = 3 pages
    });

    it("returns totalItems as data length", () => {
      const data = createTestData(42);
      const { result } = renderHook(() => usePagination(data));

      expect(result.current.totalItems).toBe(42);
    });
  });

  describe("paginatedData", () => {
    it("returns first page of data by default", () => {
      const data = createTestData(25);
      const { result } = renderHook(() =>
        usePagination(data, { initialPageSize: 10 })
      );

      expect(result.current.paginatedData).toHaveLength(10);
      expect(result.current.paginatedData[0].id).toBe(1);
      expect(result.current.paginatedData[9].id).toBe(10);
    });

    it("returns correct data for middle page", () => {
      const data = createTestData(30);
      const { result } = renderHook(() =>
        usePagination(data, { initialPage: 2, initialPageSize: 10 })
      );

      expect(result.current.paginatedData).toHaveLength(10);
      expect(result.current.paginatedData[0].id).toBe(11);
      expect(result.current.paginatedData[9].id).toBe(20);
    });

    it("returns partial page for last page", () => {
      const data = createTestData(25);
      const { result } = renderHook(() =>
        usePagination(data, { initialPage: 3, initialPageSize: 10 })
      );

      expect(result.current.paginatedData).toHaveLength(5);
      expect(result.current.paginatedData[0].id).toBe(21);
      expect(result.current.paginatedData[4].id).toBe(25);
    });

    it("returns empty array when data is empty", () => {
      const { result } = renderHook(() => usePagination([]));

      expect(result.current.paginatedData).toHaveLength(0);
    });
  });

  describe("navigation helpers", () => {
    it("hasNextPage is true when not on last page", () => {
      const data = createTestData(25);
      const { result } = renderHook(() =>
        usePagination(data, { initialPageSize: 10 })
      );

      expect(result.current.hasNextPage).toBe(true);
    });

    it("hasNextPage is false on last page", () => {
      const data = createTestData(25);
      const { result } = renderHook(() =>
        usePagination(data, { initialPage: 3, initialPageSize: 10 })
      );

      expect(result.current.hasNextPage).toBe(false);
    });

    it("hasPrevPage is false on first page", () => {
      const data = createTestData(25);
      const { result } = renderHook(() => usePagination(data));

      expect(result.current.hasPrevPage).toBe(false);
    });

    it("hasPrevPage is true when not on first page", () => {
      const data = createTestData(25);
      const { result } = renderHook(() =>
        usePagination(data, { initialPage: 2 })
      );

      expect(result.current.hasPrevPage).toBe(true);
    });
  });

  describe("startIndex and endIndex", () => {
    it("returns correct indices for first page", () => {
      const data = createTestData(25);
      const { result } = renderHook(() =>
        usePagination(data, { initialPageSize: 10 })
      );

      expect(result.current.startIndex).toBe(0);
      expect(result.current.endIndex).toBe(10);
    });

    it("returns correct indices for middle page", () => {
      const data = createTestData(30);
      const { result } = renderHook(() =>
        usePagination(data, { initialPage: 2, initialPageSize: 10 })
      );

      expect(result.current.startIndex).toBe(10);
      expect(result.current.endIndex).toBe(20);
    });

    it("returns correct indices for last page", () => {
      const data = createTestData(25);
      const { result } = renderHook(() =>
        usePagination(data, { initialPage: 3, initialPageSize: 10 })
      );

      expect(result.current.startIndex).toBe(20);
      expect(result.current.endIndex).toBe(25);
    });
  });

  describe("goToPage", () => {
    it("navigates to specified page", () => {
      const data = createTestData(50);
      const { result } = renderHook(() =>
        usePagination(data, { initialPageSize: 10 })
      );

      act(() => {
        result.current.goToPage(3);
      });

      expect(result.current.currentPage).toBe(3);
      expect(result.current.paginatedData[0].id).toBe(21);
    });

    it("clamps to first page when given page < 1", () => {
      const data = createTestData(50);
      const { result } = renderHook(() =>
        usePagination(data, { initialPage: 3 })
      );

      act(() => {
        result.current.goToPage(0);
      });

      expect(result.current.currentPage).toBe(1);
    });

    it("clamps to last page when given page > totalPages", () => {
      const data = createTestData(25);
      const { result } = renderHook(() =>
        usePagination(data, { initialPageSize: 10 })
      );

      act(() => {
        result.current.goToPage(100);
      });

      expect(result.current.currentPage).toBe(3);
    });
  });

  describe("nextPage", () => {
    it("advances to next page", () => {
      const data = createTestData(30);
      const { result } = renderHook(() =>
        usePagination(data, { initialPageSize: 10 })
      );

      act(() => {
        result.current.nextPage();
      });

      expect(result.current.currentPage).toBe(2);
    });

    it("does not advance past last page", () => {
      const data = createTestData(25);
      const { result } = renderHook(() =>
        usePagination(data, { initialPage: 3, initialPageSize: 10 })
      );

      act(() => {
        result.current.nextPage();
      });

      expect(result.current.currentPage).toBe(3);
    });
  });

  describe("prevPage", () => {
    it("goes to previous page", () => {
      const data = createTestData(30);
      const { result } = renderHook(() =>
        usePagination(data, { initialPage: 3, initialPageSize: 10 })
      );

      act(() => {
        result.current.prevPage();
      });

      expect(result.current.currentPage).toBe(2);
    });

    it("does not go before first page", () => {
      const data = createTestData(25);
      const { result } = renderHook(() => usePagination(data));

      act(() => {
        result.current.prevPage();
      });

      expect(result.current.currentPage).toBe(1);
    });
  });

  describe("setPageSize", () => {
    it("changes page size", () => {
      const data = createTestData(50);
      const { result } = renderHook(() =>
        usePagination(data, { initialPageSize: 10 })
      );

      act(() => {
        result.current.setPageSize(25);
      });

      expect(result.current.pageSize).toBe(25);
      expect(result.current.totalPages).toBe(2);
    });

    it("resets to page 1 when page size changes", () => {
      const data = createTestData(50);
      const { result } = renderHook(() =>
        usePagination(data, { initialPage: 3, initialPageSize: 10 })
      );

      act(() => {
        result.current.setPageSize(25);
      });

      expect(result.current.currentPage).toBe(1);
    });

    it("clamps page size to minimum of 1", () => {
      const data = createTestData(10);
      const { result } = renderHook(() => usePagination(data));

      act(() => {
        result.current.setPageSize(0);
      });

      expect(result.current.pageSize).toBe(1);
    });
  });

  describe("edge cases", () => {
    it("handles single item", () => {
      const data = createTestData(1);
      const { result } = renderHook(() => usePagination(data));

      expect(result.current.totalPages).toBe(1);
      expect(result.current.paginatedData).toHaveLength(1);
      expect(result.current.hasNextPage).toBe(false);
      expect(result.current.hasPrevPage).toBe(false);
    });

    it("handles empty data", () => {
      const { result } = renderHook(() => usePagination([]));

      expect(result.current.totalPages).toBe(1);
      expect(result.current.currentPage).toBe(1);
      expect(result.current.paginatedData).toHaveLength(0);
      expect(result.current.hasNextPage).toBe(false);
      expect(result.current.hasPrevPage).toBe(false);
    });

    it("handles data smaller than page size", () => {
      const data = createTestData(5);
      const { result } = renderHook(() =>
        usePagination(data, { initialPageSize: 10 })
      );

      expect(result.current.totalPages).toBe(1);
      expect(result.current.paginatedData).toHaveLength(5);
    });

    it("adjusts currentPage when data shrinks", () => {
      const data = createTestData(50);
      const { result, rerender } = renderHook(
        ({ items }) => usePagination(items, { initialPageSize: 10 }),
        { initialProps: { items: data } }
      );

      // Go to page 5
      act(() => {
        result.current.goToPage(5);
      });
      expect(result.current.currentPage).toBe(5);

      // Shrink data to only 20 items (2 pages)
      const smallerData = createTestData(20);
      rerender({ items: smallerData });

      // currentPage should be clamped to valid range
      expect(result.current.currentPage).toBe(2);
    });

    it("updates paginatedData when source data changes", () => {
      const data1 = createTestData(10);
      const { result, rerender } = renderHook(
        ({ items }) => usePagination(items, { initialPageSize: 5 }),
        { initialProps: { items: data1 } }
      );

      expect(result.current.paginatedData[0].id).toBe(1);

      // Change data
      const data2 = Array.from({ length: 10 }, (_, i) => ({ id: i + 100 }));
      rerender({ items: data2 });

      expect(result.current.paginatedData[0].id).toBe(100);
    });
  });

  describe("return value types", () => {
    it("preserves generic type in paginatedData", () => {
      interface TestItem {
        id: number;
        name: string;
      }

      const data: TestItem[] = [
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
      ];

      const { result } = renderHook(() => usePagination(data));

      // TypeScript should infer paginatedData as TestItem[]
      const firstItem = result.current.paginatedData[0];
      expect(firstItem.id).toBe(1);
      expect(firstItem.name).toBe("Item 1");
    });
  });
});
