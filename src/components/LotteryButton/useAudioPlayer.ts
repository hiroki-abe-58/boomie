import { useCallback, useRef, useEffect } from 'react';

export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const unmountedRef = useRef(false);

  useEffect(() => {
    return () => {
      unmountedRef.current = true;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  const stopSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  }, []);

  const playSound = useCallback(async (src: string, volume: number = 1) => {
    if (unmountedRef.current) return Promise.resolve();

    stopSound();
    
    const audio = new Audio();
    audio.src = src;
    audio.volume = volume;
    audioRef.current = audio;

    return new Promise<void>((resolve) => {
      if (!audio || unmountedRef.current) {
        resolve();
        return;
      }

      const onCanPlay = () => {
        audio.removeEventListener('canplaythrough', onCanPlay);
        if (unmountedRef.current) {
          resolve();
          return;
        }
        audio.play()
          .then(resolve)
          .catch(() => resolve());
      };

      audio.addEventListener('canplaythrough', onCanPlay, { once: true });
      audio.addEventListener('error', () => resolve(), { once: true });
      audio.load();

      // Fallback if audio loading takes too long
      setTimeout(resolve, 1000);
    });
  }, [stopSound]);

  return { playSound, stopSound };
};