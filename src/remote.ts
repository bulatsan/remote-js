export type Remote<T> =
  | {
      status: 'pending';
      isPending: true;
      isError: false;
      isSuccess: false;

      error: undefined;
      data: undefined;
    }
  | {
      status: 'error';
      isPending: false;
      isError: true;
      isSuccess: false;

      error: Error;
      data: null;
    }
  | {
      status: 'success';
      isPending: false;
      isError: false;
      isSuccess: true;

      error: null;
      data: T;
    };

export function pending(): Remote<never> {
  return {
    status: 'pending',
    isPending: true,
    isError: false,
    isSuccess: false,
    error: undefined,
    data: undefined,
  };
}

export function error(error: Error): Remote<never> {
  return {
    status: 'error',
    isPending: false,
    isError: true,
    isSuccess: false,
    error,
    data: null,
  };
}

export function success<T>(data: T): Remote<T> {
  return {
    status: 'success',
    isPending: false,
    isError: false,
    isSuccess: true,
    error: null,
    data,
  };
}
