import { type Remote, error, pending, success } from './remote';

type RemoteDataList<RemoteList extends readonly Remote<unknown>[]> = {
  [K in keyof RemoteList]: RemoteList[K] extends Remote<infer D> ? D : never;
};

export function combine<RemoteList extends readonly Remote<unknown>[]>(
  ...values: RemoteList
): Remote<RemoteDataList<RemoteList>> {
  let hasPending = false;

  for (const v of values) {
    if (v.isError) {
      return error(v.error);
    }
    if (v.isPending) {
      hasPending = true;
    }
  }

  if (hasPending) {
    return pending();
  }

  const data = values.map((v) => v.data);
  return success(data as RemoteDataList<RemoteList>);
}
