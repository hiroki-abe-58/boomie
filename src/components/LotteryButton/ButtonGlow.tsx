import React, { forwardRef } from 'react';

interface ButtonGlowProps {
  isDisabled: boolean;
}

export const ButtonGlow = forwardRef<HTMLDivElement, ButtonGlowProps>(
  ({ isDisabled }, ref) => (
    <div 
      ref={ref}
      className={`absolute inset-0 rounded-full opacity-75 blur-md ${
        isDisabled
          ? 'bg-gray-500'
          : 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 group-hover:opacity-100'
      }`}
    />
  )
);

ButtonGlow.displayName = 'ButtonGlow';