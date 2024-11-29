import { useCallback, useRef } from 'react';
import { gsap } from 'gsap';

export const useAnimation = (
  buttonRef: React.RefObject<HTMLButtonElement>,
  glowRef: React.RefObject<HTMLDivElement>
) => {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const setupAnimations = useCallback(() => {
    if (!buttonRef.current || !glowRef.current) return;

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const timeline = gsap.timeline();
    
    timeline
      .to(buttonRef.current, {
        scale: 1.05,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      })
      .to(glowRef.current, {
        rotate: 360,
        duration: 8,
        repeat: -1,
        ease: "none"
      }, 0);

    timelineRef.current = timeline;

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };
  }, []);

  return { setupAnimations };
};