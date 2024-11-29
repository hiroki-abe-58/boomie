import { useRef, useCallback } from 'react';
import { useSafeState } from './useSafeState';

export const useLotteryAction = () => {
  const [isActionInProgress, setIsActionInProgress] = useSafeState(false);
  const actionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const unmountedRef = useRef(false);

  const cleanup = useCallback(() => {
    if (actionTimeoutRef.current) {
      clearTimeout(actionTimeoutRef.current);
      actionTimeoutRef.current = null;
    }
    if (!unmountedRef.current) {
      setIsActionInProgress(false);
    }
  }, [setIsActionInProgress]);

  const handleLotteryAction = useCallback(async <T>(
    action: () => Promise<T>
  ): Promise<T | null> => {
    if (isActionInProgress || unmountedRef.current) {
      return null;
    }

    try {
      setIsActionInProgress(true);

      // Debounce the action
      await new Promise(resolve => {
        actionTimeoutRef.current = setTimeout(resolve, 50);
      });

      if (unmountedRef.current) {
        return null;
      }

      const result = await action();

      // Ensure minimum processing time for better UX
      await new Promise(resolve => {
        actionTimeoutRef.current = setTimeout(resolve, 100);
      });

      return result;
    } catch (error) {
      console.error('Lottery action failed:', error);
      return null;
    } finally {
      cleanup();
    }
  }, [isActionInProgress, setIsActionInProgress, cleanup]);

  return {
    isActionInProgress,
    handleLotteryAction
  };
};