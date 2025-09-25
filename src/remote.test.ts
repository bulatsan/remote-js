import { describe, expect, expectTypeOf, it } from 'vitest';

import { type Remote, pending, error as remoteError, success } from './remote';

describe('remote', () => {
  it('pending() returns a correct object', () => {
    const r = pending();

    expect(r.status).toBe('pending');
    expect(r.isPending).toBe(true);
    expect(r.isError).toBe(false);
    expect(r.isSuccess).toBe(false);
    expect(r.error).toBeUndefined();
    expect(r.data).toBeUndefined();

    // Mutually exclusive flags
    expect([r.isPending, r.isError, r.isSuccess].filter(Boolean)).toHaveLength(
      1,
    );
  });

  it('error(err) returns a correct object', () => {
    const err = new Error('boom');
    const r = remoteError(err);

    expect(r.status).toBe('error');
    expect(r.isPending).toBe(false);
    expect(r.isError).toBe(true);
    expect(r.isSuccess).toBe(false);
    expect(r.error).toBe(err);
    expect(r.data).toBeNull();

    expect([r.isPending, r.isError, r.isSuccess].filter(Boolean)).toHaveLength(
      1,
    );
  });

  it('success(data) returns a correct object', () => {
    const payload = { id: 1 };
    const r = success(payload);

    expect(r.status).toBe('success');
    expect(r.isPending).toBe(false);
    expect(r.isError).toBe(false);
    expect(r.isSuccess).toBe(true);
    expect(r.error).toBeNull();
    expect(r.data).toBe(payload);

    expect([r.isPending, r.isError, r.isSuccess].filter(Boolean)).toHaveLength(
      1,
    );
  });

  it('typing: pending() -> Remote<never>', () => {
    expectTypeOf(pending()).toEqualTypeOf<Remote<never>>();
  });

  it('typing: error(err) -> Remote<never>', () => {
    expectTypeOf(remoteError(new Error('x'))).toEqualTypeOf<Remote<never>>();
  });

  it('typing: success(data) infers data type', () => {
    const r1 = success(123);
    expectTypeOf(r1).toEqualTypeOf<Remote<number>>();

    const r2 = success({ a: 'b' as const });
    expectTypeOf(r2).toEqualTypeOf<Remote<{ a: 'b' }>>();
  });

  it('discriminated union correctly narrows by status', () => {
    const cases: [Remote<unknown>, 'pending' | 'error' | 'success'][] = [
      [pending(), 'pending'],
      [remoteError(new Error('e')), 'error'],
      [success('ok'), 'success'],
    ];

    for (const [r, expected] of cases) {
      switch (r.status) {
        case 'pending':
          expect(expected).toBe('pending');
          expect(r.isPending).toBe(true);
          expect(r.error).toBeUndefined();
          expect(r.data).toBeUndefined();
          break;
        case 'error':
          expect(expected).toBe('error');
          expect(r.isError).toBe(true);
          expect(r.error).toBeInstanceOf(Error);
          expect(r.data).toBeNull();
          break;
        case 'success':
          expect(expected).toBe('success');
          expect(r.isSuccess).toBe(true);
          expect(r.error).toBeNull();
          expect(r.data).not.toBeNull();
          break;
      }
    }
  });
});
