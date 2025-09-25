import { describe, expect, expectTypeOf, it, vi } from 'vitest';

import { map } from './map';
import { type Remote, pending, error as remoteError, success } from './remote';

describe('map', () => {
  it('maps success value via provided function', () => {
    const fn = vi.fn((n: number) => n.toFixed(2));
    const r = map(success(1), fn);

    expect(r.status).toBe('success');
    expect(r.isSuccess).toBe(true);
    expect(r.error).toBeNull();
    expect(r.data).toBe('1.00');
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(1);
  });

  it('passes through pending unchanged and does not call fn', () => {
    const fn = vi.fn((x: number) => x);
    const r = map(pending() as Remote<number>, fn);

    expect(r.status).toBe('pending');
    expect(r.isPending).toBe(true);
    expect(r.error).toBeUndefined();
    expect(r.data).toBeUndefined();
    expect(fn).not.toHaveBeenCalled();
  });

  it('passes through error unchanged and does not call fn', () => {
    const err = new Error('boom');
    const fn = vi.fn((x: number) => x);
    const r = map(remoteError(err) as Remote<number>, fn);

    expect(r.status).toBe('error');
    expect(r.isError).toBe(true);
    expect(r.error).toBe(err);
    expect(r.data).toBeNull();
    expect(fn).not.toHaveBeenCalled();
  });

  it('typing: output Remote type is inferred from mapper', () => {
    const r = map(success({ id: 1 }), (v) => String(v.id));
    expectTypeOf(r).toEqualTypeOf<Remote<string>>();
  });
});
