import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce } from '../debounce';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('delays function execution', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 500);

    debouncedFn();

    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('cancels previous calls when invoked multiple times', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 500);

    debouncedFn();
    vi.advanceTimersByTime(200);

    debouncedFn();
    vi.advanceTimersByTime(200);

    debouncedFn();
    vi.advanceTimersByTime(200);

    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('executes only once after rapid calls', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 500);

    // Call 10 times rapidly
    for (let i = 0; i < 10; i++) {
      debouncedFn();
      vi.advanceTimersByTime(50);
    }

    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('passes arguments to the debounced function', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 500);

    debouncedFn('arg1', 'arg2', 123);

    vi.advanceTimersByTime(500);

    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 123);
  });

  it('uses latest arguments when called multiple times', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 500);

    debouncedFn('first');
    vi.advanceTimersByTime(200);

    debouncedFn('second');
    vi.advanceTimersByTime(200);

    debouncedFn('third');
    vi.advanceTimersByTime(500);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('third');
  });

  it('can be called multiple times after delay has passed', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 500);

    debouncedFn();
    vi.advanceTimersByTime(500);

    expect(mockFn).toHaveBeenCalledTimes(1);

    debouncedFn();
    vi.advanceTimersByTime(500);

    expect(mockFn).toHaveBeenCalledTimes(2);

    debouncedFn();
    vi.advanceTimersByTime(500);

    expect(mockFn).toHaveBeenCalledTimes(3);
  });

  it('handles zero delay', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 0);

    debouncedFn();

    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(0);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('respects custom delay values', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 1000);

    debouncedFn();

    vi.advanceTimersByTime(999);
    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('does not execute if time has not passed', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 500);

    debouncedFn();

    vi.advanceTimersByTime(499);

    expect(mockFn).not.toHaveBeenCalled();
  });

  it('works with functions that have no arguments', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 500);

    debouncedFn();

    vi.advanceTimersByTime(500);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith();
  });

  it('works with functions that have multiple arguments of different types', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 500);

    debouncedFn(42, 'test', true, { key: 'value' }, [1, 2, 3]);

    vi.advanceTimersByTime(500);

    expect(mockFn).toHaveBeenCalledWith(
      42,
      'test',
      true,
      { key: 'value' },
      [1, 2, 3]
    );
  });
});
