import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useContainerSize } from '../useContainerSize';

describe('useContainerSize', () => {
  let mockObserve: ReturnType<typeof vi.fn>;
  let mockDisconnect: ReturnType<typeof vi.fn>;
  let observerCallback: ResizeObserverCallback | null = null;

  beforeEach(() => {
    mockObserve = vi.fn();
    mockDisconnect = vi.fn();

    // Mock ResizeObserver as a class
    class MockResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        observerCallback = callback;
      }
      observe = mockObserve;
      disconnect = mockDisconnect;
      unobserve = vi.fn();
    }

    vi.stubGlobal('ResizeObserver', MockResizeObserver);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    observerCallback = null;
  });

  it('should return { width: 0, height: 0 } when ref is null', () => {
    const ref = { current: null };
    const { result } = renderHook(() => useContainerSize(ref));
    expect(result.current).toEqual({ width: 0, height: 0 });
  });

  it('should return initial element size', () => {
    const element = document.createElement('div');
    vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
      width: 300,
      height: 200,
      x: 0,
      y: 0,
      top: 0,
      right: 300,
      bottom: 200,
      left: 0,
      toJSON: () => ({}),
    });

    const ref = { current: element };
    const { result } = renderHook(() => useContainerSize(ref));

    expect(result.current).toEqual({ width: 300, height: 200 });
  });

  it('should observe the element', () => {
    const element = document.createElement('div');
    vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      top: 0,
      right: 100,
      bottom: 100,
      left: 0,
      toJSON: () => ({}),
    });

    const ref = { current: element };
    renderHook(() => useContainerSize(ref));

    expect(mockObserve).toHaveBeenCalledWith(element);
  });

  it('should disconnect on unmount', () => {
    const element = document.createElement('div');
    vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      top: 0,
      right: 100,
      bottom: 100,
      left: 0,
      toJSON: () => ({}),
    });

    const ref = { current: element };
    const { unmount } = renderHook(() => useContainerSize(ref));

    unmount();
    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('should update size when ResizeObserver fires', () => {
    const element = document.createElement('div');
    vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      top: 0,
      right: 100,
      bottom: 100,
      left: 0,
      toJSON: () => ({}),
    });

    const ref = { current: element };
    const { result } = renderHook(() => useContainerSize(ref));

    expect(result.current).toEqual({ width: 100, height: 100 });

    // Simulate resize
    act(() => {
      if (observerCallback) {
        observerCallback(
          [
            {
              contentRect: { width: 400, height: 300 } as DOMRectReadOnly,
              target: element,
              borderBoxSize: [],
              contentBoxSize: [],
              devicePixelContentBoxSize: [],
            },
          ],
          {} as ResizeObserver
        );
      }
    });

    expect(result.current).toEqual({ width: 400, height: 300 });
  });
});
