import { useCallback, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export const useAnimation = (
  buttonRef: React.RefObject<HTMLButtonElement>,
  glowRef: React.RefObject<HTMLDivElement>
) => {
  const animationsRef = useRef<gsap.core.Tween[]>([]);
  const unmountedRef = useRef(false);

  const pauseAnimations = useCallback(() => {
    animationsRef.current.forEach(anim => {
      try {
        if (anim.isActive()) {
          anim.kill();
        }
      } catch (error) {
        console.warn('Animation cleanup failed:', error);
      }
    });
    animationsRef.current = [];
  }, []);

  const setupAnimations = useCallback(() => {
    if (!buttonRef.current || !glowRef.current || unmountedRef.current) return;

    try {
      pauseAnimations();

      const pulseAnim = gsap.to(buttonRef.current, {
        scale: 1.05,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });

      const rotateAnim = gsap.to(glowRef.current, {
        rotate: 360,
        duration: 8,
        repeat: -1,
        ease: "none"
      });

      animationsRef.current = [pulseAnim, rotateAnim];
    } catch (error) {
      console.warn('Animation setup failed:', error);
    }
  }, []);

  const playClickAnimation = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      if (!buttonRef.current || !glowRef.current || unmountedRef.current) {
        resolve();
        return;
      }

      try {
        pauseAnimations();

        const timeline = gsap.timeline({
          onComplete: resolve,
          onError: reject
        });

        timeline
          .to(buttonRef.current, {
            scale: 0.95,
            duration: 0.1,
            ease: "power2.inOut"
          })
          .to(buttonRef.current, {
            scale: 1,
            duration: 0.1,
            ease: "power2.inOut"
          })
          .to(glowRef.current, {
            rotate: '+=360',
            duration: 0.3,
            ease: "power2.inOut"
          }, "-=0.1");
      } catch (error) {
        console.warn('Click animation failed:', error);
        resolve();
      }
    });
  }, [pauseAnimations]);

  useEffect(() => {
    return () => {
      unmountedRef.current = true;
      pauseAnimations();
    };
  }, [pauseAnimations]);

  return { setupAnimations, pauseAnimations, playClickAnimation };
};