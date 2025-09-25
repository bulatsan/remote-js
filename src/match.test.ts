import { describe, expect, expectTypeOf, it, vi } from 'vitest';

import { match } from './match';
import { pending, error as remoteError, success } from './remote';

describe('match', () => {
  it('calls pending case for pending and returns its result', () => {
    const onPending = vi.fn(() => 'P');
    const onError = vi.fn();
    const onSuccess = vi.fn();

    const res = match(pending(), {
      pending: onPending,
      error: onError,
      success: onSuccess,
    });

    expect(res).toBe('P');
    expect(onPending).toHaveBeenCalledTimes(1);
    expect(onError).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('calls error case for error and returns its result with error passed', () => {
    const err = new Error('boom');
    const onPending = vi.fn();
    const onError = vi.fn((e: Error) => e.message);
    const onSuccess = vi.fn();

    const res = match(remoteError(err), {
      pending: onPending,
      error: onError,
      success: onSuccess,
    });

    expect(res).toBe('boom');
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(err);
    expect(onPending).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('calls success case for success and returns its result with data passed', () => {
    const payload = { id: 1 } as const;
    const onPending = vi.fn();
    const onError = vi.fn();
    const onSuccess = vi.fn((d: typeof payload) => d.id);

    const res = match(success(payload), {
      pending: onPending,
      error: onError,
      success: onSuccess,
    });

    expect(res).toBe(1);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith(payload);
    expect(onPending).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it('typing: return type is inferred from handlers', () => {
    const value = match(success(123), {
      pending: () => 'p',
      error: () => 'e',
      success: (n) => n.toFixed(),
    });
    expectTypeOf(value).toEqualTypeOf<string>();
  });
});
