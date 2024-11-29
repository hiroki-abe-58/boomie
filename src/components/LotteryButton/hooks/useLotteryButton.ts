import { useCallback, useRef } from 'react';
import { useLotteryStore } from '../../../store/lotteryStore';
import { useButtonAnimation } from './useButtonAnimation';
import { useButtonSound } from './useButtonSound';
import { calculateLotteryResult } from '../../../utils/lotteryUtils';

interface UseLotteryButtonProps {
  onResult: (tierId: string) => void;
}

export const useLotteryButton = ({ onResult }: UseLotteryButtonProps) => {
  const prizeTiers = useLotteryStore(state => state.prizeTiers);
  const [isProcessing, setIsProcessing] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const { playClickAnimation } = useButtonAnimation(buttonRef);
  const { playButtonSound } = useButtonSound();

  const isAllPrizesDistributed = prizeTiers.every(tier => tier.wonCount >= tier.count);
  const isDisabled = isAllPrizesDistributed || isProcessing;

  const handleClick = useCallback(async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (isDisabled) {
      console.log('Button is disabled, ignoring click'); // デバッグログ
      return;
    }

    try {
      setIsProcessing(true);
      console.log('Starting lottery process...'); // デバッグログ

      // 抽選結果の計算
      const result = calculateLotteryResult(prizeTiers);
      console.log('Calculated result:', result); // デバッグログ

      if (!result) {
        console.warn('No valid lottery result');
        return;
      }

      // アニメーションとサウンドを実行
      await playClickAnimation();
      await playButtonSound();

      // 結果を通知
      console.log('Notifying result:', result); // デバッグログ
      onResult(result);
    } catch (error) {
      console.error('Lottery execution failed:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [prizeTiers, isDisabled, playClickAnimation, playButtonSound, onResult]);

  return {
    buttonRef,
    glowRef,
    isDisabled,
    isProcessing,
    handleClick
  };
};