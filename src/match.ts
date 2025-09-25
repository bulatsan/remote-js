import { type Remote } from './remote';

export type MatchCases<T, R> = {
  pending: () => R;
  error: (error: Error) => R;
  success: (data: T) => R;
};

export function match<T, R>(remote: Remote<T>, cases: MatchCases<T, R>): R {
  switch (remote.status) {
    case 'pending':
      return cases.pending();
    case 'error':
      return cases.error(remote.error);
    case 'success':
      return cases.success(remote.data);
  }
}
