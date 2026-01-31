import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useCollapsible } from "../useCollapsible";

describe("useCollapsible", () => {
  describe("initial state", () => {
    it("defaults to closed", () => {
      const { result } = renderHook(() => useCollapsible());
      expect(result.current.isOpen).toBe(false);
    });

    it("respects defaultOpen: true", () => {
      const { result } = renderHook(() =>
        useCollapsible({ defaultOpen: true })
      );
      expect(result.current.isOpen).toBe(true);
    });

    it("respects defaultOpen: false", () => {
      const { result } = renderHook(() =>
        useCollapsible({ defaultOpen: false })
      );
      expect(result.current.isOpen).toBe(false);
    });
  });

  describe("toggle", () => {
    it("toggles from closed to open", () => {
      const { result } = renderHook(() => useCollapsible());

      act(() => {
        result.current.toggle();
      });

      expect(result.current.isOpen).toBe(true);
    });

    it("toggles from open to closed", () => {
      const { result } = renderHook(() =>
        useCollapsible({ defaultOpen: true })
      );

      act(() => {
        result.current.toggle();
      });

      expect(result.current.isOpen).toBe(false);
    });

    it("toggles multiple times", () => {
      const { result } = renderHook(() => useCollapsible());

      act(() => {
        result.current.toggle();
      });
      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.toggle();
      });
      expect(result.current.isOpen).toBe(false);

      act(() => {
        result.current.toggle();
      });
      expect(result.current.isOpen).toBe(true);
    });
  });

  describe("open", () => {
    it("opens when closed", () => {
      const { result } = renderHook(() => useCollapsible());

      act(() => {
        result.current.open();
      });

      expect(result.current.isOpen).toBe(true);
    });

    it("stays open when already open", () => {
      const { result } = renderHook(() =>
        useCollapsible({ defaultOpen: true })
      );

      act(() => {
        result.current.open();
      });

      expect(result.current.isOpen).toBe(true);
    });
  });

  describe("close", () => {
    it("closes when open", () => {
      const { result } = renderHook(() =>
        useCollapsible({ defaultOpen: true })
      );

      act(() => {
        result.current.close();
      });

      expect(result.current.isOpen).toBe(false);
    });

    it("stays closed when already closed", () => {
      const { result } = renderHook(() => useCollapsible());

      act(() => {
        result.current.close();
      });

      expect(result.current.isOpen).toBe(false);
    });
  });

  describe("setOpen", () => {
    it("sets to open", () => {
      const { result } = renderHook(() => useCollapsible());

      act(() => {
        result.current.setOpen(true);
      });

      expect(result.current.isOpen).toBe(true);
    });

    it("sets to closed", () => {
      const { result } = renderHook(() =>
        useCollapsible({ defaultOpen: true })
      );

      act(() => {
        result.current.setOpen(false);
      });

      expect(result.current.isOpen).toBe(false);
    });
  });

  describe("onOpenChange callback", () => {
    it("calls onOpenChange on toggle", () => {
      const onOpenChange = vi.fn();
      const { result } = renderHook(() => useCollapsible({ onOpenChange }));

      act(() => {
        result.current.toggle();
      });

      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it("calls onOpenChange on open", () => {
      const onOpenChange = vi.fn();
      const { result } = renderHook(() => useCollapsible({ onOpenChange }));

      act(() => {
        result.current.open();
      });

      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it("calls onOpenChange on close", () => {
      const onOpenChange = vi.fn();
      const { result } = renderHook(() =>
        useCollapsible({ defaultOpen: true, onOpenChange })
      );

      act(() => {
        result.current.close();
      });

      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("calls onOpenChange on setOpen", () => {
      const onOpenChange = vi.fn();
      const { result } = renderHook(() => useCollapsible({ onOpenChange }));

      act(() => {
        result.current.setOpen(true);
      });

      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);

      act(() => {
        result.current.setOpen(false);
      });

      expect(onOpenChange).toHaveBeenCalledTimes(2);
      expect(onOpenChange).toHaveBeenLastCalledWith(false);
    });

    it("does not fail when onOpenChange is not provided", () => {
      const { result } = renderHook(() => useCollapsible());

      expect(() => {
        act(() => {
          result.current.toggle();
        });
      }).not.toThrow();
    });
  });

  describe("return value stability", () => {
    it("returns stable function references", () => {
      const { result, rerender } = renderHook(() => useCollapsible());

      const firstOpen = result.current.open;
      const firstClose = result.current.close;
      const firstSetOpen = result.current.setOpen;

      rerender();

      // Functions should be stable across rerenders when state doesn't change
      expect(result.current.open).toBe(firstOpen);
      expect(result.current.close).toBe(firstClose);
      expect(result.current.setOpen).toBe(firstSetOpen);
      // toggle depends on isOpen, so it may change
      expect(typeof result.current.toggle).toBe("function");
    });
  });
});
