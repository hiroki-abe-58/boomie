import { useCallback } from 'react';

export const useButtonSound = () => {
  const playButtonSound = useCallback(async () => {
    try {
      const audio = new Audio('https://shussher.net/static/sound/lottery-button.mp3');
      audio.volume = 0.5;

      return new Promise<void>((resolve) => {
        const onEnd = () => {
          audio.removeEventListener('ended', onEnd);
          resolve();
        };

        audio.addEventListener('ended', onEnd);
        audio.play().catch(() => resolve());
      });
    } catch (error) {
      console.warn('Sound playback failed:', error);
      return Promise.resolve();
    }
  }, []);

  return { playButtonSound };
};