import { useCallback, useRef } from 'react';

export const useButtonSound = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playButtonSound = useCallback(async () => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const audio = new Audio('https://shussher.net/static/sound/lottery-button.mp3');
      audio.volume = 0.5;
      audioRef.current = audio;

      return new Promise<void>((resolve) => {
        const onEnd = () => {
          audio.removeEventListener('ended', onEnd);
          audio.removeEventListener('error', onError);
          resolve();
        };

        const onError = () => {
          audio.removeEventListener('ended', onEnd);
          audio.removeEventListener('error', onError);
          resolve();
        };

        audio.addEventListener('ended', onEnd);
        audio.addEventListener('error', onError);

        audio.play().catch(() => {
          onError();
        });
      });
    } catch (error) {
      console.warn('Sound playback failed:', error);
      return Promise.resolve();
    }
  }, []);

  return { playButtonSound };
};