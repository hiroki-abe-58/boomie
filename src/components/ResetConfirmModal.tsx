import React, { useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { gsap } from 'gsap';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalRef.current && contentRef.current) {
      gsap.fromTo(modalRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );

      gsap.fromTo(contentRef.current,
        { 
          scale: 0.8,
          rotate: -5,
          opacity: 0,
          y: 30
        },
        { 
          scale: 1,
          rotate: 0,
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "back.out(1.7)"
        }
      );

      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    if (modalRef.current && contentRef.current) {
      gsap.to(contentRef.current, {
        scale: 0.8,
        opacity: 0,
        y: 30,
        duration: 0.3,
        ease: "power2.in"
      });
      
      gsap.to(modalRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: onClose
      });
    } else {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div ref={modalRef} className="fixed inset-0 z-50">
      <div className="absolute inset-0 backdrop-blur-sm bg-black/50" onClick={handleClose} />
      <div className="flex items-center justify-center min-h-full p-4">
        <div 
          ref={contentRef}
          className="relative w-full max-w-[400px] rounded-[36px] bg-gray-800 p-6 shadow-xl border border-purple-500/20"
        >
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 text-gray-400 transition-all hover:rotate-90 hover:scale-110 hover:text-pink-400"
          >
            <X className="h-6 w-6" />
          </button>
          
          <h2 className="mb-6 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            リセット確認
          </h2>
          
          <p className="mb-6 text-gray-300">
            すべての設定と結果をリセットしますか？
          </p>

          <div className="flex gap-4">
            <button
              onClick={handleClose}
              className="flex-1 rounded-md bg-gray-700 py-2.5 text-white transition-all hover:bg-gray-600"
            >
              キャンセル
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 rounded-md bg-gradient-to-r from-pink-600 to-purple-600 py-2.5 text-white transition-all hover:from-pink-500 hover:to-purple-500 hover:shadow-lg hover:shadow-purple-500/50"
            >
              リセット
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};