import { useCallback } from 'react';
import { gsap } from 'gsap';

export const useButtonAnimation = (buttonRef: React.RefObject<HTMLButtonElement>) => {
  const playClickAnimation = useCallback(async () => {
    if (!buttonRef.current) return Promise.resolve();

    return new Promise<void>((resolve) => {
      gsap.timeline({
        onComplete: resolve
      })
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
    });
  }, []);

  return { playClickAnimation };
};