import { useMemo } from 'react';
import { useSafeState } from '../../hooks/useSafeState';
import { useLotteryStore } from '../../store/lotteryStore';

export const useLotteryState = () => {
  const prizeTiers = useLotteryStore(state => state.prizeTiers);
  const [isProcessing, setIsProcessing] = useSafeState(false);

  const state = useMemo(() => {
    const isAllPrizesDistributed = prizeTiers.every(tier => tier.wonCount >= tier.count);
    const isDisabled = isAllPrizesDistributed || isProcessing;

    return {
      prizeTiers,
      isProcessing,
      setIsProcessing,
      isDisabled,
      isAllPrizesDistributed,
    };
  }, [prizeTiers, isProcessing, setIsProcessing]);

  return state;
};