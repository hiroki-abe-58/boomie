import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { gsap } from 'gsap';
import { useLotteryStore } from '../store/lotteryStore';

interface ResultModalProps {
  tierId: string | null;
  onClose: () => void;
  onMount: (tierId: string | null) => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ tierId, onClose, onMount }) => {
  const { prizeTiers } = useLotteryStore();
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const voiceRef = useRef<HTMLAudioElement | null>(null);
  const resultAddedRef = useRef(false);
  const confettiIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!tierId || resultAddedRef.current) return;

    resultAddedRef.current = true;
    onMount(tierId);

    const tier = prizeTiers.find(t => t.id === tierId);
    if (!tier) return;

    const playSequentialAudio = async () => {
      try {
        // 効果音の再生
        const effectAudio = new Audio();
        audioRef.current = effectAudio;
        effectAudio.src = tier.config.sound1;
        effectAudio.volume = tier.config.sound1Volume / 100;

        await new Promise<void>((resolve) => {
          effectAudio.oncanplaythrough = () => {
            effectAudio.play()
              .then(() => {
                effectAudio.onended = () => resolve();
              })
              .catch(async (error) => {
                console.warn('Effect audio playback failed, retrying...', error);
                await new Promise(resolve => setTimeout(resolve, 100));
                effectAudio.play()
                  .then(() => {
                    effectAudio.onended = () => resolve();
                  })
                  .catch(console.error);
              });
          };
          effectAudio.load();
        });

        // ボイスの再生
        const voiceAudio = new Audio();
        voiceRef.current = voiceAudio;
        voiceAudio.src = tier.config.sound2;
        voiceAudio.volume = tier.config.sound2Volume / 100;

        await new Promise<void>((resolve) => {
          voiceAudio.oncanplaythrough = () => {
            voiceAudio.play()
              .then(() => {
                voiceAudio.onended = () => resolve();
              })
              .catch(async (error) => {
                console.warn('Voice audio playback failed, retrying...', error);
                await new Promise(resolve => setTimeout(resolve, 100));
                voiceAudio.play()
                  .then(() => {
                    voiceAudio.onended = () => resolve();
                  })
                  .catch(console.error);
              });
          };
          voiceAudio.load();
        });
      } catch (error) {
        console.error('Audio playback failed:', error);
      }
    };

    playSequentialAudio();

    if (modalRef.current && contentRef.current && titleRef.current) {
      gsap.fromTo(modalRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );

      gsap.fromTo(contentRef.current,
        { 
          scale: 0.5,
          rotate: -15,
          opacity: 0 
        },
        { 
          scale: 1,
          rotate: 0,
          opacity: 1,
          duration: 0.6,
          ease: "elastic.out(1, 0.5)"
        }
      );

      gsap.fromTo(titleRef.current,
        { 
          scale: 0.2,
          opacity: 0,
          y: 50
        },
        { 
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.3,
          ease: "bounce.out"
        }
      );

      if (tierId === 'first') {
        gsap.to(titleRef.current, {
          y: '10px',
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut"
        });

        const randomInRange = (min: number, max: number) => {
          return Math.random() * (max - min) + min;
        };

        const count = 200;
        const defaults = {
          origin: { y: 0.7 },
          shapes: ['star', 'circle'],
          ticks: 300,
          particleCount: 50,
          spread: 80,
          startVelocity: 30,
          gravity: 0.8,
          scalar: 1.2,
          drift: 0,
          zIndex: 2000,
        };

        function fire(particleRatio: number, opts: confetti.Options) {
          confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio)
          });
        }

        fire(0.25, {
          spread: 26,
          startVelocity: 55,
          colors: ['#FFD700', '#FFA500']
        });
        fire(0.2, {
          spread: 60,
          colors: ['#FF8C00', '#FFD700']
        });
        fire(0.35, {
          spread: 100,
          decay: 0.91,
          scalar: 0.8,
          colors: ['#FFA500', '#FFD700']
        });
        fire(0.1, {
          spread: 120,
          startVelocity: 25,
          decay: 0.92,
          scalar: 1.2,
          colors: ['#FFD700', '#FF8C00']
        });
        fire(0.1, {
          spread: 120,
          startVelocity: 45,
          colors: ['#FFA500', '#FFD700']
        });

        confettiIntervalRef.current = window.setInterval(() => {
          confetti({
            particleCount: 2,
            angle: randomInRange(55, 125),
            spread: randomInRange(50, 70),
            origin: { y: 0.7 },
            colors: ['#FFD700', '#FFA500', '#FF8C00'],
            ticks: 200,
            gravity: 0.8,
            scalar: 2,
            drift: 0,
            shapes: ['circle', 'square'],
            zIndex: 2000,
          });
        }, 50);
      }

      if (tierId === 'second') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#ec4899', '#8b5cf6', '#6366f1'],
          zIndex: 2000,
        });
      }
    }

    return () => {
       if (confettiIntervalRef.current) {
        clearInterval(confettiIntervalRef.current);
        confettiIntervalRef.current = null;
      }
    };
  }, [tierId, onMount, prizeTiers]);

  const handleClose = () => {
    if (modalRef.current && contentRef.current) {
      if (confettiIntervalRef.current) {
        clearInterval(confettiIntervalRef.current);
        confettiIntervalRef.current = null;
      }

      gsap.to(contentRef.current, {
        scale: 0.5,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in"
      });
      
      gsap.to(modalRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
          }
          if (voiceRef.current) {
            voiceRef.current.pause();
            voiceRef.current = null;
          }
          resultAddedRef.current = false;
          onClose();
        }
      });
    } else {
      onClose();
    }
  };

  if (!tierId) return null;

  const tier = prizeTiers.find(t => t.id === tierId);
  if (!tier) return null;

  const configColors = {
    first: 'bg-gradient-to-r from-pink-600 to-purple-600',
    second: 'bg-gradient-to-r from-purple-600 to-indigo-600',
  }[tierId] || 'bg-gradient-to-r from-indigo-600 to-blue-600';

  return (
    <div ref={modalRef} className="fixed inset-0 z-50">
      <div className="absolute inset-0 backdrop-blur-sm bg-black/50" onClick={handleClose} />
      <div className="flex items-center justify-center h-full">
        <div 
          ref={contentRef}
          className={`relative aspect-square w-[90vw] max-w-[500px] rounded-[36px] ${configColors} p-8 shadow-2xl shadow-purple-500/20`}
        >
          <button
            onClick={handleClose}
            className="absolute right-6 top-6 text-white transition-all hover:rotate-90 hover:scale-110"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="flex h-full items-center justify-center">
            <h2 
              ref={titleRef}
              className="text-4xl md:text-6xl font-bold text-white"
            >
              {tier.config.modalText}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};