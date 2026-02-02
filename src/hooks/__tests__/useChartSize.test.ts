import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useChartSize } from '../useChartSize';
import { CHART_SIZE_VALUES, CHART_MIN_SIZE } from '../../lib/chart-sizes';

describe('useChartSize', () => {
  let mockObserve: ReturnType<typeof vi.fn>;
  let mockDisconnect: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockObserve = vi.fn();
    mockDisconnect = vi.fn();

    // Mock ResizeObserver as a class
    class MockResizeObserver {
      observe = mockObserve;
      disconnect = mockDisconnect;
      unobserve = vi.fn();
    }

    vi.stubGlobal('ResizeObserver', MockResizeObserver);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('preset sizes', () => {
    it('should return sm size (200)', () => {
      const { result } = renderHook(() => useChartSize('sm'));
      expect(result.current).toBe(CHART_SIZE_VALUES.sm);
      expect(result.current).toBe(200);
    });

    it('should return md size (280)', () => {
      const { result } = renderHook(() => useChartSize('md'));
      expect(result.current).toBe(CHART_SIZE_VALUES.md);
      expect(result.current).toBe(280);
    });

    it('should return lg size (360)', () => {
      const { result } = renderHook(() => useChartSize('lg'));
      expect(result.current).toBe(CHART_SIZE_VALUES.lg);
      expect(result.current).toBe(360);
    });
  });

  describe('numeric sizes', () => {
    it('should return the numeric value directly', () => {
      const { result } = renderHook(() => useChartSize(320));
      expect(result.current).toBe(320);
    });

    it('should enforce minimum size', () => {
      const { result } = renderHook(() => useChartSize(100));
      expect(result.current).toBe(CHART_MIN_SIZE);
    });

    it('should allow sizes above minimum', () => {
      const { result } = renderHook(() => useChartSize(500));
      expect(result.current).toBe(500);
    });
  });

  describe('responsive size', () => {
    it('should return md when no container ref provided', () => {
      const { result } = renderHook(() => useChartSize('responsive'));
      expect(result.current).toBe(CHART_SIZE_VALUES.md);
    });

    it('should return md when container has zero dimensions', () => {
      const element = document.createElement('div');
      vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        toJSON: () => ({}),
      });

      const ref = { current: element };
      const { result } = renderHook(() => useChartSize('responsive', ref));

      expect(result.current).toBe(CHART_SIZE_VALUES.md);
    });

    it('should use container width when available', () => {
      const element = document.createElement('div');
      vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
        width: 250,
        height: 400,
        x: 0,
        y: 0,
        top: 0,
        right: 250,
        bottom: 400,
        left: 0,
        toJSON: () => ({}),
      });

      const ref = { current: element };
      const { result } = renderHook(() => useChartSize('responsive', ref));

      // Should use the smaller dimension (width = 250)
      expect(result.current).toBe(250);
    });

    it('should cap at lg size', () => {
      const element = document.createElement('div');
      vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
        width: 1000,
        height: 800,
        x: 0,
        y: 0,
        top: 0,
        right: 1000,
        bottom: 800,
        left: 0,
        toJSON: () => ({}),
      });

      const ref = { current: element };
      const { result } = renderHook(() => useChartSize('responsive', ref));

      expect(result.current).toBe(CHART_SIZE_VALUES.lg);
    });

    it('should enforce minimum size', () => {
      const element = document.createElement('div');
      vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
        width: 150,
        height: 100,
        x: 0,
        y: 0,
        top: 0,
        right: 150,
        bottom: 100,
        left: 0,
        toJSON: () => ({}),
      });

      const ref = { current: element };
      const { result } = renderHook(() => useChartSize('responsive', ref));

      expect(result.current).toBe(CHART_MIN_SIZE);
    });
  });
});
