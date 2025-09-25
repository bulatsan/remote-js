import { describe, expect, expectTypeOf, it } from 'vitest';

import { join } from './join';
import { type Remote, pending, error as remoteError, success } from './remote';

describe('join', () => {
  it('returns error if any input is error (error wins over pending)', () => {
    const err = new Error('boom');
    const r = join(remoteError(err), pending(), success(1));

    expect(r.status).toBe('error');
    expect(r.isError).toBe(true);
    expect(r.error).toBe(err);
    expect(r.data).toBeNull();
  });

  it('returns pending if any input is pending and no errors', () => {
    const r = join(pending(), success(1), success(2));

    expect(r.status).toBe('pending');
    expect(r.isPending).toBe(true);
    expect(r.error).toBeUndefined();
    expect(r.data).toBeUndefined();
  });

  it('returns success with tuple of data when all are success', () => {
    const a = success(1);
    const b = success('x' as const);
    const c = success({ id: 3 } as const);

    const r = join(a, b, c);

    expect(r.status).toBe('success');
    expect(r.isSuccess).toBe(true);
    expect(r.error).toBeNull();
    expect(r.data).toEqual([1, 'x', { id: 3 }]);

    // typing
    expectTypeOf(r).toEqualTypeOf<Remote<[number, 'x', { readonly id: 3 }]>>();
  });

  it('preserves the order of inputs in resulting data tuple', () => {
    const r = join(success('first'), success('second'), success('third'));
    expect(r.status).toBe('success');
    expect(r.data).toEqual(['first', 'second', 'third']);
  });

  it('no inputs -> success of empty tuple', () => {
    const r = join();
    expect(r.status).toBe('success');
    expect(r.data).toEqual([]);
    expectTypeOf(r).toEqualTypeOf<Remote<[]>>();
  });
});
