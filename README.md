## @bulatlib/remote

Typed helpers for remote data state: discriminated `Remote<T>` union with `pending`, `error`, `success`, plus `match`, `combine` and `map` utilities.

### Install

```bash
npm i @bulatlib/remote
# or
pnpm add @bulatlib/remote
# or
bun add @bulatlib/remote
```

### Remote type

`Remote<T>` is a discriminated union with `status` ∈ `"pending" | "error" | "success"` and convenient flags `isPending/isError/isSuccess`.

```ts
import { type Remote, error, pending, success } from '@bulatlib/remote';

const a: Remote<number> = pending();
const b: Remote<number> = error(new Error('boom'));
const c: Remote<number> = success(42);
```

### match(remote, cases)

Pattern-match on `Remote<T>` in a type-safe way.

```ts
import { error, match, pending, success } from '@bulatlib/remote';

const out = match(success({ id: 1 }), {
  pending: () => 'loading',
  error: (e) => `error: ${e.message}`,
  success: (data) => `ok: ${data.id}`,
});
// => 'ok: 1'
```

### combine(...remotes)

Combine multiple `Remote`s into one. Precedence: any `error` → `error`; else if any `pending` → `pending`; otherwise `success` with a tuple of data.

```ts
import { combine, error, pending, success } from '@bulatlib/remote';

combine(error(new Error('x')), pending(), success(1));
// => { status: 'error', ... }

combine(pending(), success(1));
// => { status: 'pending', ... }

const r = combine(success(1), success('x' as const));
// r.data has type [number, 'x']
```

### map(remote, fn)

Map data of a successful `Remote<T>` to `Remote<R>`; passes through `pending` and `error` unchanged.

```ts
import { type Remote, error, map, pending, success } from '@bulatlib/remote';

map(success(2), (n) => n * 10);
// => { status: 'success', data: 20, ... }

map(pending() as Remote<number>, (n) => n * 10);
// => { status: 'pending', ... }

map(error(new Error('x')) as Remote<number>, (n) => n * 10);
// => { status: 'error', ... }
```

### License

MIT
