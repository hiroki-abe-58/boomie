import { useCallback, useRef } from 'react';
import { useLotteryStore } from '../../store/lotteryStore';
import { calculateLotteryResult } from '../../utils/lotteryUtils';
import { useSound } from './useSound';

export const useLotteryEvent = () => {
  const { prizeTiers } = useLotteryStore();
  const { playButtonSound } = useSound();
  const executionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const executeLottery = useCallback(async () => {
    try {
      // Clear any existing timeout
      if (executionTimeoutRef.current) {
        clearTimeout(executionTimeoutRef.current);
      }

      return new Promise<string | null>((resolve) => {
        // Ensure consistent timing for lottery execution
        executionTimeoutRef.current = setTimeout(async () => {
          const winningTierId = calculateLotteryResult(prizeTiers);
          if (!winningTierId) {
            resolve(null);
            return;
          }

          try {
            await playButtonSound();
          } catch (error) {
            console.warn('Sound playback failed:', error);
          }

          resolve(winningTierId);
        }, 50);
      });
    } catch (error) {
      console.error('Lottery execution failed:', error);
      return null;
    }
  }, [prizeTiers, playButtonSound]);

  return { executeLottery };
};