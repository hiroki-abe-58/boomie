import React, { useState, useCallback } from 'react';
import { useLotteryStore } from '../../store/lotteryStore';
import { calculateLotteryResult } from '../../utils/lotteryUtils';

interface LotteryButtonProps {
  onResult: (tierId: string) => void;
}

export const LotteryButton: React.FC<LotteryButtonProps> = ({ onResult }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const prizeTiers = useLotteryStore(state => state.prizeTiers);
  
  const isAllPrizesDistributed = prizeTiers.every(tier => tier.wonCount >= tier.count);
  const isDisabled = isAllPrizesDistributed || isProcessing;

  const handleClick = useCallback(async () => {
    if (isDisabled) return;

    try {
      setIsProcessing(true);
      console.log('Starting lottery...'); // デバッグログ

      const result = calculateLotteryResult(prizeTiers);
      console.log('Lottery result:', result); // デバッグログ

      if (result) {
        // 効果音を再生
        const audio = new Audio('https://shussher.net/static/sound/lottery-button.mp3');
        audio.volume = 0.5;
        await audio.play().catch(() => {});

        // 結果を通知
        onResult(result);
      }
    } catch (error) {
      console.error('Lottery failed:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [isDisabled, prizeTiers, onResult]);

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={`
        group relative h-48 w-48 rounded-full p-1
        transition-all duration-300
        ${isDisabled 
          ? 'bg-gray-600 cursor-not-allowed' 
          : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:shadow-2xl hover:shadow-purple-500/50'
        }
      `}
    >
      <div className={`
        absolute inset-0 rounded-full opacity-75 blur-md
        ${isDisabled
          ? 'bg-gray-500'
          : 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 group-hover:opacity-100'
        }
      `} />
      <div className={`
        relative flex h-full w-full items-center justify-center
        rounded-full font-bold text-2xl text-white
        ${isDisabled
          ? 'bg-gray-700'
          : 'bg-gray-900 transition-colors group-hover:bg-gray-800'
        }
      `}>
        {isAllPrizesDistributed ? '抽選終了' : isProcessing ? '抽選中...' : '抽選する'}
      </div>
    </button>
  );
};