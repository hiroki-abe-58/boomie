import { useCallback, useRef, useEffect } from 'react';
import { calculateLotteryResult } from '../../utils/lotteryUtils';
import { useButtonSound } from './useButtonSound';
import { useLotteryState } from './useLotteryState';
import { gsap } from 'gsap';

interface UseLotteryButtonProps {
  onResult: (tierId: string) => void;
}

export const useLotteryButton = ({ onResult }: UseLotteryButtonProps) => {
  const {
    prizeTiers,
    isProcessing,
    setIsProcessing,
    isDisabled,
    isAllPrizesDistributed
  } = useLotteryState();

  const buttonRef = useRef<HTMLButtonElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const isClickingRef = useRef(false);
  const { playButtonSound } = useButtonSound();

  useEffect(() => {
    return () => {
      isClickingRef.current = false;
    };
  }, []);

  const handleClick = useCallback(async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    console.log('Button clicked - isDisabled:', isDisabled, 'isClicking:', isClickingRef.current); // デバッグログ

    if (isDisabled || isClickingRef.current) {
      return;
    }

    try {
      isClickingRef.current = true;
      setIsProcessing(true);

      const result = calculateLotteryResult(prizeTiers);
      console.log('Calculated result:', result); // デバッグログ

      if (!result) {
        console.warn('No valid lottery result');
        return;
      }

      // Play click animation
      if (buttonRef.current) {
        const clickAnimation = gsap.timeline();
        await clickAnimation
          .to(buttonRef.current, {
            scale: 0.95,
            duration: 0.1,
            ease: "power2.inOut"
          })
          .to(buttonRef.current, {
            scale: 1,
            duration: 0.1,
            ease: "power2.inOut"
          });
      }

      // Play sound
      await playButtonSound();

      // Notify parent with result
      console.log('Calling onResult with:', result); // デバッグログ
      onResult(result);
    } catch (error) {
      console.error('Lottery execution failed:', error);
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        isClickingRef.current = false;
      }, 100);
    }
  }, [isDisabled, prizeTiers, onResult, setIsProcessing, playButtonSound]);

  return {
    buttonRef,
    glowRef,
    isDisabled,
    isProcessing,
    handleClick
  };
};