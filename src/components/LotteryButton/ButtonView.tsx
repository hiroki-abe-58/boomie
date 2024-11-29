import React from 'react';

interface ButtonViewProps {
  buttonRef: React.RefObject<HTMLButtonElement>;
  glowRef: React.RefObject<HTMLDivElement>;
  isDisabled: boolean;
  isProcessing: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ButtonView: React.FC<ButtonViewProps> = ({
  buttonRef,
  glowRef,
  isDisabled,
  isProcessing,
  onClick
}) => (
  <button
    ref={buttonRef}
    onClick={onClick}
    disabled={isDisabled}
    className={`group relative h-48 w-48 transform rounded-full p-1 transition-all duration-300 ${
      isDisabled
        ? 'bg-gray-600 cursor-not-allowed'
        : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:shadow-2xl hover:shadow-purple-500/50'
    }`}
    style={{ touchAction: 'manipulation' }}
  >
    <div 
      ref={glowRef}
      className={`absolute inset-0 rounded-full opacity-75 blur-md ${
        isDisabled
          ? 'bg-gray-500'
          : 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 group-hover:opacity-100'
      }`}
    />
    <div 
      className={`relative flex h-full w-full items-center justify-center rounded-full font-bold text-2xl text-white ${
        isDisabled
          ? 'bg-gray-700'
          : 'bg-gray-900 transition-colors group-hover:bg-gray-800'
      }`}
    >
      {isDisabled ? (isProcessing ? '抽選中...' : '抽選終了') : '抽選する'}
    </div>
  </button>
);