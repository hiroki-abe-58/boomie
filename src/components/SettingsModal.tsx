import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { gsap } from 'gsap';
import { useLotteryStore } from '../store/lotteryStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useLotteryStore();
  const [formData, setFormData] = useState(settings);
  const [showSuccess, setShowSuccess] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setShowSuccess(true);

    if (successRef.current) {
      gsap.fromTo(successRef.current,
        {
          scale: 0.5,
          opacity: 0,
          rotate: -10
        },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.5)"
        }
      );
    }

    setTimeout(() => {
      if (successRef.current) {
        gsap.to(successRef.current, {
          scale: 0.5,
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            setShowSuccess(false);
            handleClose();
          }
        });
      }
    }, 1500);
  };

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'range') {
      const numValue = parseFloat(value);
      setFormData(prev => ({
        ...prev,
        [name]: name === 'anticipationDuration' ? numValue : Math.min(Math.max(numValue || 0, 0), 100)
      }));
      return;
    }

    const numValue = parseInt(value, 10);
    setFormData(prev => ({
      ...prev,
      [name]: Math.min(Math.max(numValue || 0, 0), 999)
    }));
  };

  if (!isOpen) return null;

  return (
    <div ref={modalRef} className="fixed inset-0 z-50">
      <div className="absolute inset-0 backdrop-blur-sm bg-black/50" onClick={handleClose} />
      <div className="flex items-center justify-center min-h-full p-4">
        <div 
          ref={contentRef}
          className="relative w-full max-w-[500px] max-h-[90vh] overflow-y-auto rounded-[36px] bg-gray-800 p-6 shadow-xl border border-purple-500/20"
        >
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 text-gray-400 transition-all hover:rotate-90 hover:scale-110 hover:text-pink-400"
          >
            <X className="h-6 w-6" />
          </button>
          
          <h2 className="mb-6 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">設定</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                抽選時間: {formData.anticipationDuration.toFixed(1)}秒
                <input
                  type="range"
                  name="anticipationDuration"
                  min="0"
                  max="3"
                  step="0.1"
                  value={formData.anticipationDuration}
                  onChange={handleChange}
                  className="mt-2 w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700"
                  style={{
                    background: `linear-gradient(to right, rgb(236, 72, 153) 0%, rgb(236, 72, 153) ${(formData.anticipationDuration / 3) * 100}%, rgb(75, 85, 99) ${(formData.anticipationDuration / 3) * 100}%, rgb(75, 85, 99) 100%)`
                  }}
                />
              </label>
            </div>
            
            <button
              type="submit"
              className="w-full rounded-md bg-gradient-to-r from-pink-600 to-purple-600 py-2.5 text-white transition-all hover:from-pink-500 hover:to-purple-500 hover:shadow-lg hover:shadow-purple-500/50"
            >
              保存
            </button>
          </form>

          {showSuccess && (
            <div 
              ref={successRef}
              className="absolute inset-0 flex items-center justify-center rounded-[36px] bg-gray-800 bg-opacity-90"
            >
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                SUCCESS
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};