import { useCallback, useRef, useState } from 'react';
import { useLotteryStore } from '../../store/lotteryStore';
import { useAnimation } from './useAnimation';
import { useLotteryEvent } from './useLotteryEvent';

interface UseLotteryControllerProps {
  onResult: (tierId: string) => void;
}

export const useLotteryController = ({ onResult }: UseLotteryControllerProps) => {
  const { prizeTiers } = useLotteryStore();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { setupAnimations } = useAnimation(buttonRef, glowRef);
  const { executeLottery } = useLotteryEvent();

  const isAllPrizesDistributed = prizeTiers.every(tier => tier.wonCount >= tier.count);

  const cleanup = useCallback(() => {
    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current);
      processingTimeoutRef.current = null;
    }
    setIsProcessing(false);
  }, []);

  const handleLotteryClick = useCallback(async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (isAllPrizesDistributed || isProcessing) return;

    cleanup();
    setIsProcessing(true);

    try {
      const result = await executeLottery();
      if (result) {
        onResult(result);
      }
    } catch (error) {
      console.error('Lottery execution failed:', error);
    } finally {
      // Ensure minimum processing time for better UX
      processingTimeoutRef.current = setTimeout(() => {
        cleanup();
      }, 100);
    }
  }, [isAllPrizesDistributed, isProcessing, cleanup, executeLottery, onResult]);

  const buttonState = isAllPrizesDistributed 
    ? 'completed' 
    : isProcessing 
      ? 'processing' 
      : 'ready';

  const isDisabled = isAllPrizesDistributed || isProcessing;

  return {
    buttonRef,
    glowRef,
    isDisabled,
    buttonState,
    handleLotteryClick
  };
};