import { useState, useCallback, useRef, useEffect } from 'react';

export function useSafeState<T>(initialState: T): [T, (value: T) => void] {
  const [state, setState] = useState<T>(initialState);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const safeSetState = useCallback((value: T) => {
    if (mountedRef.current) {
      setState(value);
    }
  }, []);

  return [state, safeSetState];
}