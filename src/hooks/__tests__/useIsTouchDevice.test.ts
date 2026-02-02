import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIsTouchDevice } from '../useIsTouchDevice';

describe('useIsTouchDevice', () => {
  let mockMatchMedia: ReturnType<typeof vi.fn>;
  let mockAddEventListener: ReturnType<typeof vi.fn>;
  let mockRemoveEventListener: ReturnType<typeof vi.fn>;
  let changeHandler: ((e: MediaQueryListEvent) => void) | null = null;

  beforeEach(() => {
    mockAddEventListener = vi.fn((event, handler) => {
      if (event === 'change') {
        changeHandler = handler;
      }
    });
    mockRemoveEventListener = vi.fn();

    mockMatchMedia = vi.fn((query: string) => ({
      matches: false,
      media: query,
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    window.matchMedia = mockMatchMedia;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    changeHandler = null;
  });

  it('should return false on desktop (hover: hover, pointer: fine)', () => {
    mockMatchMedia.mockReturnValue({
      matches: false,
      media: '(hover: none) and (pointer: coarse)',
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
    });

    const { result } = renderHook(() => useIsTouchDevice());
    expect(result.current).toBe(false);
  });

  it('should return true on touch device (hover: none, pointer: coarse)', () => {
    mockMatchMedia.mockReturnValue({
      matches: true,
      media: '(hover: none) and (pointer: coarse)',
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
    });

    const { result } = renderHook(() => useIsTouchDevice());
    expect(result.current).toBe(true);
  });

  it('should use correct media query', () => {
    renderHook(() => useIsTouchDevice());
    expect(mockMatchMedia).toHaveBeenCalledWith('(hover: none) and (pointer: coarse)');
  });

  it('should add event listener on mount', () => {
    renderHook(() => useIsTouchDevice());
    expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('should remove event listener on unmount', () => {
    const { unmount } = renderHook(() => useIsTouchDevice());
    unmount();
    expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('should update when media query changes', () => {
    mockMatchMedia.mockReturnValue({
      matches: false,
      media: '(hover: none) and (pointer: coarse)',
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
    });

    const { result } = renderHook(() => useIsTouchDevice());
    expect(result.current).toBe(false);

    // Simulate media query change
    act(() => {
      if (changeHandler) {
        changeHandler({ matches: true } as MediaQueryListEvent);
      }
    });

    expect(result.current).toBe(true);
  });
});
