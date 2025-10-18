import { useState, useCallback } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: () => Promise<void>;
  reset: () => void;
}

const useApi = <T>(
  apiCall: () => Promise<T>,
  options?: { initialLoading?: boolean }
): UseApiReturn<T> => {
  const initialLoading = options?.initialLoading ?? true;
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: initialLoading,
    error: null,
  });

  const execute = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const result = await apiCall();
      setState({ data: result, loading: false, error: null });
    } catch (err: any) {
      console.error('API Error:', err);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: err?.response?.data?.message || err?.message || 'Greška pri učitavanju podataka. Molimo pokušajte ponovo.' 
      }));
    }
  }, [apiCall]);

  const reset = useCallback(() => {
    setState({ data: null, loading: initialLoading, error: null });
  }, [initialLoading]);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    execute,
    reset,
  };
};

export default useApi;
