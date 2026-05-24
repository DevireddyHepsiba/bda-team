/**
 * useApi Hook
 * Custom React hook for making API calls with loading and error states
 */

import { useState, useCallback } from "react";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useApi<T>(
  apiFunction: () => Promise<T>,
  immediate = true
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await apiFunction();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error: any) {
      const err = new Error(error?.message || "An error occurred");
      setState({ data: null, loading: false, error: err });
      throw err;
    }
  }, [apiFunction]);

  // Auto-execute if immediate is true
  useState(() => {
    if (immediate) {
      execute();
    }
  });

  return { ...state, execute };
}
