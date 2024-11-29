import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className, style }) => {
  const textRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (textRef.current) {
      animationRef.current = gsap.to(textRef.current, {
        scale: 1.2,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, []);

  return (
    <div
      ref={textRef}
      className={className}
      style={{
        ...style,
        textShadow: '0 0 20px rgba(255,255,255,0.5)',
      }}
    >
      {text}
    </div>
  );
};