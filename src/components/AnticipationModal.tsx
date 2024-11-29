import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useLotteryStore } from '../store/lotteryStore';

interface AnticipationModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const AnticipationModal: React.FC<AnticipationModalProps> = ({ isOpen, onComplete }) => {
  const { settings } = useLotteryStore();
  const modalRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const hexagonGridRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;

    const cleanup = () => {
      if (audioRef.current) {
        const audio = audioRef.current;
        audio.onended = null;
        audio.oncanplaythrough = null;
        audio.onerror = null;
        audio.pause();
        audio.src = '';
        audioRef.current = null;
      }

      gsap.killTweensOf([
        modalRef.current,
        containerRef.current,
        textRef.current,
        hexagonGridRef.current,
        particlesRef.current,
        '.hexagon',
        '.particle'
      ]);
    };

    if (!isOpen) {
      cleanup();
      return;
    }

    const startAnimation = async () => {
      if (!mounted) return;

      // If anticipationDuration is 0, skip the animation
      if (settings.anticipationDuration === 0) {
        onComplete();
        return;
      }

      try {
        // Create and play roll sound
        const audio = new Audio('https://shussher.net/static/sound/lottery-roll.mp3');
        audio.volume = 0.5;
        audioRef.current = audio;
        await audio.play();

        // Create main timeline
        const tl = gsap.timeline();

        // Fade in modal with blur effect
        tl.fromTo(modalRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.5 }
        );

        // Animate hexagon grid
        tl.fromTo('.hexagon',
          {
            opacity: 0,
            scale: 0,
            rotation: -180
          },
          {
            opacity: 0.3,
            scale: 1,
            rotation: 0,
            duration: 1,
            stagger: {
              grid: [8, 8],
              from: "center",
              amount: 1
            },
            ease: "power2.out"
          },
          "<"
        );

        // Rotate container
        tl.fromTo(containerRef.current,
          { rotation: 0 },
          { rotation: 360, duration: 20, repeat: -1, ease: "none" },
          "<"
        );

        // Animate particles
        gsap.to('.particle', {
          y: 'random(-300, 300)',
          x: 'random(-300, 300)',
          rotation: 'random(-720, 720)',
          duration: 'random(2, 4)',
          repeat: -1,
          repeatRefresh: true,
          ease: "power1.inOut"
        });

        // Pulse text with glow effect
        tl.fromTo(textRef.current,
          {
            scale: 0.8,
            textShadow: '0 0 0 rgba(255,255,255,0)'
          },
          {
            scale: 1.1,
            textShadow: '0 0 30px rgba(255,255,255,0.8)',
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut"
          },
          "<"
        );

        // Wait for specified duration
        setTimeout(() => {
          if (!mounted) return;
          
          // Exit animation
          const exitTl = gsap.timeline({
            onComplete: () => {
              if (!mounted) return;
              cleanup();
              onComplete();
            }
          });

          exitTl
            .to('.hexagon', {
              opacity: 0,
              scale: 2,
              rotation: 180,
              duration: 0.5,
              stagger: {
                grid: [8, 8],
                from: "center",
                amount: 0.5
              },
              ease: "power2.in"
            })
            .to(modalRef.current, {
              opacity: 0,
              duration: 0.3
            }, "-=0.3");
        }, settings.anticipationDuration * 1000);

      } catch (error) {
        console.warn('Animation setup failed:', error);
        cleanup();
        onComplete();
      }
    };

    startAnimation();

    return () => {
      mounted = false;
      cleanup();
    };
  }, [isOpen, onComplete, settings.anticipationDuration]);

  if (!isOpen || settings.anticipationDuration === 0) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        background: 'radial-gradient(circle at center, rgba(88,28,135,1) 0%, rgba(30,27,75,1) 100%)',
        perspective: '1000px'
      }}
    >
      {/* Rotating container */}
      <div
        ref={containerRef}
        className="absolute inset-0 pointer-events-none"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Hexagon grid */}
        <div ref={hexagonGridRef} className="absolute inset-0">
          {Array.from({ length: 64 }).map((_, i) => (
            <div
              key={i}
              className="hexagon absolute"
              style={{
                left: `${(i % 8) * 12.5}%`,
                top: `${Math.floor(i / 8) * 12.5}%`,
                width: '10%',
                height: '10%',
                background: 'linear-gradient(45deg, rgba(236,72,153,0.3), rgba(147,51,234,0.3))',
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                border: '1px solid rgba(236,72,153,0.2)',
                backdropFilter: 'blur(2px)',
              }}
            />
          ))}
        </div>

        {/* Floating particles */}
        <div ref={particlesRef} className="absolute inset-0">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="particle absolute"
              style={{
                left: '50%',
                top: '50%',
                width: '4px',
                height: '4px',
                background: 'white',
                borderRadius: '50%',
                opacity: 0.6,
                boxShadow: '0 0 10px rgba(255,255,255,0.8)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Text */}
      <div
        ref={textRef}
        className="relative text-4xl md:text-6xl font-bold text-white text-center"
        style={{
          textShadow: '0 0 20px rgba(255,255,255,0.5)',
          letterSpacing: '0.1em'
        }}
      >
        抽選中...
      </div>

      {/* Add animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }

          @keyframes pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }

          .hexagon {
            transition: all 0.3s ease;
          }

          .hexagon:hover {
            opacity: 0.8;
            transform: scale(1.1);
          }
        `}
      </style>
    </div>
  );
};