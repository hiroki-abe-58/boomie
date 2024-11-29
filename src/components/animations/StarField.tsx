import React, { useEffect, useRef, useState } from 'react';
import { Container, Sprite, useTick } from '@pixi/react';
import * as PIXI from 'pixi.js';

interface StarFieldProps {
  onError: (error: Error) => void;
}

export const StarField: React.FC<StarFieldProps> = ({ onError }) => {
  const containerRef = useRef<PIXI.Container>(null);
  const starsRef = useRef<{ x: number; y: number; scale: number; rotation: number; speed: number }[]>([]);
  const timeRef = useRef(0);
  const textureRef = useRef<PIXI.Texture | null>(null);
  const [isTextureLoaded, setIsTextureLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadTexture = async () => {
      try {
        if (!textureRef.current) {
          const baseTexture = await PIXI.BaseTexture.from('https://shussher.net/static/img/icon/star.png', {
            scaleMode: PIXI.SCALE_MODES.LINEAR,
          });
          
          if (!isMounted) {
            baseTexture.destroy();
            return;
          }

          const texture = new PIXI.Texture(baseTexture);
          textureRef.current = texture;
          setIsTextureLoaded(true);

          // Initialize stars after texture is loaded
          starsRef.current = Array.from({ length: 20 }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: 0.5 + Math.random() * 1.5,
            rotation: Math.random() * Math.PI * 2,
            speed: 0.02 + Math.random() * 0.08
          }));
        }
      } catch (error) {
        if (isMounted) {
          onError(error instanceof Error ? error : new Error('Failed to load star texture'));
        }
      }
    };

    loadTexture();

    return () => {
      isMounted = false;
      if (textureRef.current) {
        textureRef.current.destroy(true);
        textureRef.current = null;
      }
      setIsTextureLoaded(false);
    };
  }, [onError]);

  useTick((delta) => {
    if (!isTextureLoaded || !containerRef.current) return;

    try {
      timeRef.current += delta;
      containerRef.current.rotation += 0.01 * delta;

      starsRef.current.forEach((star, i) => {
        const sprite = containerRef.current?.children[i] as PIXI.Sprite;
        if (sprite) {
          sprite.rotation += star.speed * delta;
          sprite.scale.set(
            star.scale * (1 + Math.sin(timeRef.current * 0.1) * 0.2)
          );
        }
      });
    } catch (error) {
      onError(error instanceof Error ? error : new Error('Star animation failed'));
    }
  });

  if (!isTextureLoaded || !textureRef.current) return null;

  return (
    <Container ref={containerRef}>
      {starsRef.current.map((star, i) => (
        <Sprite
          key={i}
          texture={textureRef.current!}
          x={star.x}
          y={star.y}
          anchor={0.5}
          scale={star.scale}
          rotation={star.rotation}
          alpha={0.8}
        />
      ))}
    </Container>
  );
};