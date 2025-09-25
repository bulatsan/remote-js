import { match } from './match';
import { type Remote, pending, error as remoteError, success } from './remote';

export function map<T, R>(remote: Remote<T>, fn: (data: T) => R): Remote<R> {
  return match(remote, {
    pending: () => pending(),
    error: (error) => remoteError(error),
    success: (data) => success(fn(data)),
  });
}
