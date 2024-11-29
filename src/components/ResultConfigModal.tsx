import React, { useState, useRef, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { gsap } from 'gsap';
import { useLotteryStore } from '../store/lotteryStore';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface ResultConfigModalProps {
  tierId: string | null;
  onClose: () => void;
}

export const ResultConfigModal: React.FC<ResultConfigModalProps> = ({ tierId, onClose }) => {
  const { prizeTiers, updatePrizeTier, removePrizeTier } = useLotteryStore();
  const [formData, setFormData] = useState<(typeof prizeTiers)[0] | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tier = prizeTiers.find(t => t.id === tierId);
    setFormData(tier || null);
  }, [tierId, prizeTiers]);

  useEffect(() => {
    if (tierId && modalRef.current && contentRef.current) {
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
  }, [tierId]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tierId || !formData) return;

    updatePrizeTier(tierId, formData);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;

    const { name, value } = e.target;

    if (name === 'title' || name === 'modalText' || name === 'sound1' || name === 'sound2') {
      setFormData({
        ...formData,
        config: {
          ...formData.config,
          [name]: value,
        },
      });
      return;
    }

    if (name === 'sound1Volume' || name === 'sound2Volume') {
      setFormData({
        ...formData,
        config: {
          ...formData.config,
          [name]: parseInt(value, 10),
        },
      });
      return;
    }

    if (name === 'probability') {
      setFormData({
        ...formData,
        probability: Math.min(Math.max(parseInt(value, 10) || 0, 0), 100),
      });
      return;
    }

    if (name === 'count' || name === 'wonCount') {
      const numValue = parseInt(value.replace(/^0+/, '') || '0', 10);
      setFormData({
        ...formData,
        [name]: Math.min(Math.max(numValue, 0), 999),
      });
      return;
    }
  };

  const formatNumberValue = (value: number) => {
    return value.toString();
  };

  if (!tierId || !formData) return null;

  const configColors = {
    first: 'from-pink-500 to-purple-500',
    second: 'from-purple-500 to-indigo-500',
    consolation: 'from-indigo-500 to-blue-500',
  }[tierId] || 'from-purple-500 to-indigo-500';

  const canDelete = tierId !== 'first' && tierId !== 'consolation';

  return (
    <>
      <div ref={modalRef} className="fixed inset-0 z-50">
        <div className="absolute inset-0 backdrop-blur-sm bg-black/50" onClick={handleClose} />
        <div className="flex items-center justify-center min-h-full p-4">
          <div 
            ref={contentRef}
            className="relative w-full max-w-[500px] max-h-[90vh] overflow-y-auto rounded-[36px] bg-gray-800 p-6 shadow-xl border border-purple-500/20"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${configColors}`}>
                {formData.config.title}の設定
              </h2>
              <div className="flex items-center gap-2">
                {canDelete && (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="p-2 rounded-full text-gray-400 transition-all hover:rotate-12 hover:scale-110 hover:text-pink-400"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="p-2 rounded-full text-gray-400 transition-all hover:rotate-90 hover:scale-110 hover:text-pink-400"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  タイトル
                  <input
                    type="text"
                    name="title"
                    value={formData.config.title}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 p-2.5 text-white shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  モーダル内文言
                  <input
                    type="text"
                    name="modalText"
                    value={formData.config.modalText}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 p-2.5 text-white shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  />
                </label>
              </div>

              {tierId !== 'consolation' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    当選確率: {formData.probability}%
                    <input
                      type="range"
                      name="probability"
                      min="0"
                      max="100"
                      value={formData.probability}
                      onChange={handleChange}
                      className="mt-2 w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700"
                      style={{
                        background: `linear-gradient(to right, rgb(236, 72, 153) 0%, rgb(236, 72, 153) ${formData.probability}%, rgb(75, 85, 99) ${formData.probability}%, rgb(75, 85, 99) 100%)`
                      }}
                    />
                  </label>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    当選数
                    <input
                      type="number"
                      name="wonCount"
                      value={formatNumberValue(formData.wonCount)}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 p-2.5 text-white shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    />
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    景品総数
                    <input
                      type="number"
                      name="count"
                      value={formatNumberValue(formData.count)}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 p-2.5 text-white shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  効果音URL
                  <input
                    type="text"
                    name="sound1"
                    value={formData.config.sound1}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 p-2.5 text-white shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  効果音音量: {formData.config.sound1Volume}%
                  <input
                    type="range"
                    name="sound1Volume"
                    min="0"
                    max="100"
                    value={formData.config.sound1Volume}
                    onChange={handleChange}
                    className="mt-2 w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700"
                    style={{
                      background: `linear-gradient(to right, rgb(236, 72, 153) 0%, rgb(236, 72, 153) ${formData.config.sound1Volume}%, rgb(75, 85, 99) ${formData.config.sound1Volume}%, rgb(75, 85, 99) 100%)`
                    }}
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  ボイスURL
                  <input
                    type="text"
                    name="sound2"
                    value={formData.config.sound2}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 p-2.5 text-white shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  ボイス音量: {formData.config.sound2Volume}%
                  <input
                    type="range"
                    name="sound2Volume"
                    min="0"
                    max="100"
                    value={formData.config.sound2Volume}
                    onChange={handleChange}
                    className="mt-2 w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700"
                    style={{
                      background: `linear-gradient(to right, rgb(236, 72, 153) 0%, rgb(236, 72, 153) ${formData.config.sound2Volume}%, rgb(75, 85, 99) ${formData.config.sound2Volume}%, rgb(75, 85, 99) 100%)`
                    }}
                  />
                </label>
              </div>

              <button
                type="submit"
                className={`w-full rounded-md bg-gradient-to-r ${configColors} py-2.5 text-white transition-all hover:shadow-lg hover:shadow-purple-500/50`}
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

      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          if (tierId) {
            removePrizeTier(tierId);
            handleClose();
          }
        }}
        title={formData.config.title}
      />
    </>
  );
};