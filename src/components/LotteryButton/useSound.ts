import { useCallback, useRef } from 'react';

export const useSound = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playButtonSound = useCallback(async () => {
    try {
      // Cleanup previous audio instance
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const audio = new Audio('https://shussher.net/static/sound/lottery-button.mp3');
      audioRef.current = audio;
      audio.volume = 0.5;

      return new Promise<void>((resolve, reject) => {
        const onEnded = () => {
          audio.removeEventListener('ended', onEnded);
          audio.removeEventListener('error', onError);
          resolve();
        };

        const onError = (error: Event) => {
          audio.removeEventListener('ended', onEnded);
          audio.removeEventListener('error', onError);
          reject(error);
        };

        audio.addEventListener('ended', onEnded);
        audio.addEventListener('error', onError);

        audio.play().catch(reject);
      });
    } catch (error) {
      console.warn('Sound playback failed:', error);
    }
  }, []);

  return { playButtonSound };
};