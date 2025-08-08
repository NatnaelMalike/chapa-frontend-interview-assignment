import { useState, useCallback } from 'react';

// Type definition for an asynchronous function
type AsyncFunction<TArgs extends any[], TResult> = (...args: TArgs) => Promise<TResult>;

// Type definition for the hook's return value
interface ApiHookResult<TResult, TArgs extends any[]> {
  data: TResult | null;
  loading: boolean;
  error: string | null;
  execute: (...args: TArgs) => Promise<void>;
}

export const useAsyncApi = <TResult, TArgs extends any[]>(
  apiFunction: AsyncFunction<TArgs, TResult>
): ApiHookResult<TResult, TArgs> => {
  const [data, setData] = useState<TResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (...args: TArgs) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await apiFunction(...args);
      setData(result);
    } catch (err: any) {
      // Assuming your service functions might throw an error
      setError(err.response?.data?.message || err.message || 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  return { data, loading, error, execute };
};