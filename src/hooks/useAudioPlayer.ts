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
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch (error) {
        console.warn('Error stopping sound:', error);
      }
      audioRef.current = null;
    }
  }, []);

  const playSound = useCallback(async (src: string, volume: number = 1) => {
    if (unmountedRef.current) return Promise.resolve();

    try {
      stopSound();
      
      const audio = new Audio();
      audio.src = src;
      audio.volume = volume;
      audioRef.current = audio;

      return new Promise<void>((resolve, reject) => {
        if (!audio || unmountedRef.current) {
          resolve();
          return;
        }

        const cleanup = () => {
          audio.removeEventListener('canplaythrough', onCanPlay);
          audio.removeEventListener('error', onError);
          clearTimeout(timeoutId);
        };

        const onCanPlay = () => {
          cleanup();
          if (unmountedRef.current) {
            resolve();
            return;
          }
          audio.play()
            .then(resolve)
            .catch(() => resolve());
        };

        const onError = () => {
          cleanup();
          resolve();
        };

        audio.addEventListener('canplaythrough', onCanPlay, { once: true });
        audio.addEventListener('error', onError, { once: true });

        const timeoutId = setTimeout(() => {
          cleanup();
          resolve();
        }, 2000);

        audio.load();
      });
    } catch (error) {
      console.warn('Sound playback failed:', error);
      return Promise.resolve();
    }
  }, [stopSound]);

  return { playSound, stopSound };
};