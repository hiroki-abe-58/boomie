import React from 'react';

interface ButtonContentProps {
  buttonState: 'ready' | 'processing' | 'completed';
  isDisabled: boolean;
}

export const ButtonContent: React.FC<ButtonContentProps> = ({ buttonState, isDisabled }) => (
  <div className={`relative flex h-full w-full items-center justify-center rounded-full font-bold text-2xl text-white ${
    isDisabled
      ? 'bg-gray-700'
      : 'bg-gray-900 transition-colors group-hover:bg-gray-800'
  }`}>
    {buttonState === 'completed' ? '抽選終了' : buttonState === 'processing' ? '抽選中...' : '抽選する'}
  </div>
);